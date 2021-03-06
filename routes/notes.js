const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const fs = require('fs');
const router = express.Router();
const {
    NOT_AUTHORIZED,
    NOT_FOUND,
    MISSING_PARAM
} = require('../status');

const Notebook = require('../models/Notebook');
const Notedir = require('../models/Notedir');
const Note = require('../models/Note');
const Recyclebin = require('../models/Recyclebin');
const crypto = require('../utils/crypto');
const auth = require('../middleware/auth');

// route            Get /api/notes
// desc             取得所有筆記
// access           Private
router.get('/', auth, async(req, res) => {
    let notebook, notedir, notes = [];

    try {
        const newCrypto = crypto(process.env.SECRET_KEY);

        if(!(req.header('x-notedir') || req.header('x-notebook'))) 
            return res.status(400).json({msg: '缺少參數', status: MISSING_PARAM});
            
        //判斷取得單一目錄的筆記/筆記本裡全部的筆記
        if(req.header('x-notedir')) {
            // 從header取得notedir
            const notedirId = newCrypto.decrypt(req.header('x-notedir'), false);

            // 取得此筆記的筆記目錄
            notedir = await Notedir.findById(notedirId);
    
            if(!notedir) return res.status(404).json({msg: '找不到此筆記的存放目錄', status: NOT_FOUND});
    
            // 取得筆記本資料
            notebook = await Notebook.findById(notedir.notebook);
    
            if(!notebook) return res.status(404).json({msg: '找不到此筆記的筆記本', status: NOT_FOUND});
    
            // 確認使用者是否真的擁有這個筆記本
            if(notebook.author.toString() !== req.user.id) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});
    
            // 取得所有筆記
            notes = notedir.notes;
        } else {
            // 從header取得notebook
            const notebookId = newCrypto.decrypt(req.header('x-notebook'), false);

            // 取得此筆記的筆記本
            notebook = await Notebook.findById(notebookId);

            if(!notebook) return res.status(404).json({msg: '找不到筆記本', status: NOT_FOUND});

            // 確認使用者是否真的擁有這個筆記本
            if(notebook.author.toString() !== req.user.id) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});
    
            // 筆記本中的所有目錄
            const allNotedirs = notebook.notedirs;

            // 取得所有筆記
            for(let idx = 0; idx < allNotedirs.length; idx++) {
                notedir = await Notedir.findById(allNotedirs[idx]._id);
                notes = notes.concat(notedir.notes);
            }
        }
        // 加密note資料
        const encryptedNote = newCrypto.encrypt(notes);
        res.json(encryptedNote);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Get /api/notes
// desc             取得單一筆記
// access           Private
router.get('/:id', auth, async(req, res) => {
    try {
        // 取得單一筆記
        const note = await Note.findById(req.params.id);

        if(!note) return res.status(404).json({msg: '找不到筆記', status: NOT_FOUND});

        // 取得此筆記的筆記目錄
        const notedir = await Notedir.findById(note.notedir);

        if(!notedir) return res.status(404).json({msg: '找不到此筆記的存放目錄', status: NOT_FOUND});

        // 取得筆記本資料
        const notebook = await Notebook.findById(notedir.notebook);

        if(!notebook) return res.status(404).json({msg: '找不到此筆記的筆記本', status: NOT_FOUND});

        // 確認使用者是否真的擁有這個筆記本
        if(notebook.author.toString() !== req.user.id) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});

        // 加密note資料
        const encryptedNote = crypto(process.env.SECRET_KEY).encrypt(note);
        res.json(encryptedNote);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Post /api/notes
// desc             新增筆記
// access           Private
router.post('/', auth, async(req, res) => {
    try {
        const newCrypto = crypto(process.env.SECRET_KEY);
        // 解密note資料
        const data = newCrypto.decrypt(req.body.data);
        const { title, content } = data;

        // 取得此筆記的筆記目錄
        const notedir = await Notedir.findById(data.notedir);

        if(!notedir) return res.status(404).json({msg: '找不到此筆記的存放目錄', status: NOT_FOUND});

        // 取得筆記本資料
        const notebook = await Notebook.findById(notedir.notebook);

        if(!notebook) return res.status(404).json({msg: '找不到此筆記的筆記本', status: NOT_FOUND});

        // 確認使用者是否真的擁有這個筆記本
        if(notebook.author.toString() !== req.user.id) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});

        const encryptedTitle = newCrypto.encrypt(title, false);
        const encryptedSummary = newCrypto.encrypt(require('../general/summary')(content), false);
        const encryptedContent = newCrypto.encrypt(content, false);

        // 新增筆記到notes
        const newNote = new Note({
            title: encryptedTitle,
            content: encryptedContent,
            notedir
        });

        const note = await newNote.save();

        const newNotedirNote = {
            _id: note._id,
            title: encryptedTitle,
            summary: encryptedSummary,
            date: note.date
        };

        // 新增筆記的標題、摘要到Notedir裡
        notedir.notes.push(newNotedirNote);

        await notedir.save();

        // 加密新增的note資料
        const encryptedNewNotedirNote = newCrypto.encrypt(newNotedirNote);

        res.json(encryptedNewNotedirNote);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Put /api/notes
// desc             修改/移動筆記
// access           Private
router.put('/:id', auth, async(req, res) => {
    const error = {
        notedir: 'notedir',
        notebook: 'notebook',
        notAuthorized: 'not_authorized'
    };

    try {
        const id = req.params.id;

        let note = await Note.findById(id);

        if(!note) return res.status(404).json({msg: '找不到筆記', status: NOT_FOUND});

        const newCrypto = crypto(process.env.SECRET_KEY);
        // 解密note資料
        const data = newCrypto.decrypt(req.body.data);

        // 判斷要做修改還是移動
        if(note.notedir.toString() !== data.notedir.toString()) {
            //
            // 移動筆記
            //

            const sourceNotedirId = note.notedir;
            const destNotedirId = data.notedir;

            let checkRes = await checkNoteDir(sourceNotedirId);

            if(checkRes !== true) {
                switch(checkRes) {
                    case error.notedir:
                        return res.status(404).json({msg: '找不到來源筆記目錄', status: NOT_FOUND});
                    case error.notebook:
                        return res.status(404).json({msg: '找不到來源筆記本', status: NOT_FOUND});
                    case error.notAuthorized:
                        return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});
                }
            }

            checkRes = await checkNoteDir(destNotedirId);

            if(checkRes !== true) {
                switch(checkRes) {
                    case error.notedir:
                        return res.status(404).json({msg: '找不到目的筆記目錄', status: NOT_FOUND});
                    case error.notebook:
                        return res.status(404).json({msg: '找不到目的筆記本', status: NOT_FOUND});
                    case error.notAuthorized:
                        return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});
                }
            }

            let noteField = {
                title: note.title,
                content: note.content,
                notedir: destNotedirId,
                date: note.date
            };

            // 修改筆記中的目錄ID
            note = await Note.findByIdAndUpdate(id,
                { $set: noteField },
                { new: true });

            const sourceNotedir = await Notedir.findById(sourceNotedirId);
            const destNotedir = await Notedir.findById(destNotedirId);

            const sourceNotedirNoteIdx = sourceNotedir.notes.findIndex((el) => el._id == id);
            const sourceNotedirNote = sourceNotedir.notes[sourceNotedirNoteIdx];

            // 新增筆記到目的Notedir裡
            destNotedir.notes.push(sourceNotedirNote);

            await destNotedir.save();

            // 從來源筆記目錄刪除此筆記
            sourceNotedir.notes.splice(sourceNotedirNoteIdx,1);
            sourceNotedir.save();

            res.status(200).send();
        } else {
            //
            // 修改筆記
            //

            const { title, content } = data;
            const updateDateTime = new Date();

            const encryptedTitle = newCrypto.encrypt(title, false);
            const encryptedSummary = newCrypto.encrypt(require('../general/summary')(content), false);
            const encryptedContent = newCrypto.encrypt(content, false);

            let checkRes = await checkNoteDir(data.notedir);

            if(checkRes !== true) {
                switch(checkRes) {
                    case error.notedir:
                        return res.status(404).json({msg: '找不到此筆記的存放目錄', status: NOT_FOUND});
                    case error.notebook:
                        return res.status(404).json({msg: '找不到此筆記的筆記本', status: NOT_FOUND});
                    case error.notAuthorized:
                        return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});
                }
            }

            const decryptedNote = newCrypto.decrypt(note.content, false);
            const deleteImgs = require('../general/filterDeleteImgs')(decryptedNote, content);

            //確認新的筆記內容是否有刪掉圖片，有則刪除Server上的檔案
            if(deleteImgs.length > 0) {
                deleteImgs.forEach((imgName) => {
                    let deletedImgPath = path.join(__dirname, '..', process.env.IMAGE_DIRECTORY, imgName);

                    fs.unlink(deletedImgPath, (err) => {
                          return;
                        });
                })
            }

            //建立筆記物件
            let noteField = {
                title: encryptedTitle,
                content: encryptedContent,
                notedir: data.notedir,
                date: updateDateTime
            };

            // 修改筆記
            await Note.findByIdAndUpdate(id,
                { $set: noteField },
                { new: true });

            // 連帶修改筆記目錄的筆記資訊
            await Notedir.findOneAndUpdate({_id: data.notedir, 'notes._id': id},
                { $set: {'notes.$.title': encryptedTitle, 'notes.$.summary': encryptedSummary, 'notes.$.date': updateDateTime}}
            );

            //取得新的筆記目錄
            const notedir = await Notedir.findById(data.notedir);
            const updateNotedirNote = notedir.notes.find(note => note._id == id);

            // 加密修改的note資料
            const encryptedNotedirNote = newCrypto.encrypt(updateNotedirNote);

            res.json(encryptedNotedirNote);
        }

        async function checkNoteDir(id) {
            let notedir = await Notedir.findById(id);

            if(!notedir) return {error: error.notedir};

            // 取得來源筆記本資料
            const notebook = await Notebook.findById(notedir.notebook);

            if(!notebook) return {error: error.notebook};

            // 確認使用者是否真的擁有這個筆記本
            if(notebook.author.toString() !== req.user.id) return {error: error.notAuthorized};

            return true;
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Delete /api/note
// desc             刪除筆記
// access           Private
router.delete('/:id', auth, async(req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const deleteItems = {
            id: uuidv4(),
            type: 'note',
            date: new Date()
        };

        //從header取得notedir
        const notedirId = crypto(process.env.SECRET_KEY).decrypt(req.header('x-notedir'), false);

        const note = await Note.findById(id);

        if(!note) return res.status(404).json({msg: '找不到此筆記', status: NOT_FOUND});

        // 取得此筆記的筆記目錄
        const notedir = await Notedir.findById(notedirId);

        if(!notedir) return res.status(404).json({msg: '找不到此筆記的存放目錄', status: NOT_FOUND});

        // 取得筆記本資料
        const notebook = await Notebook.findById(notedir.notebook);

        if(!notebook) return res.status(404).json({msg: '找不到此筆記的筆記本', status: NOT_FOUND});

        // 確認使用者是否真的擁有這個筆記本
        if(notebook.author.toString() !== req.user.id) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});

        //
        // 移動至回收站
        //
        deleteItems.title = note.title;
        deleteItems.parent = {
            notebook: notedir.notebook
        };
        deleteItems.notes = note;

        // 取得刪除的項目
        const deletedGroup = await Recyclebin.findOne({userId});

        if(!deletedGroup) {
            const newDeletedGroup = new Recyclebin({
                userId: userId,
                items: [deleteItems]
            });
            await newDeletedGroup.save();
        } else {
            deletedGroup.items.push(deleteItems);
            await deletedGroup.save();
        }

        // 刪除筆記
        await Note.findByIdAndRemove(id);

        // 連帶刪除筆記目錄裡的筆記資訊
        const deleteNoteIdx = notedir.notes.findIndex((el) => el._id == id);
        notedir.notes.splice(deleteNoteIdx,1);
        notedir.save();

        res.json({msg: '筆記已刪除'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;