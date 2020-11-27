const express = require('express');
const path = require('path');
const config = require('config')
const { v4: uuidv4 } = require('uuid');
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
const auth = require('../middleware/auth');

// route            Get /api/notes
// desc             取得所有筆記
// access           Private
router.get('/', auth, async(req, res) => {
    try {
        //從header取得notedir
        const notedirId = req.header('x-notedir');

        if(!notedirId) return res.status(400).json({msg: '缺少參數', status: MISSING_PARAM});
        
        // 取得此筆記的筆記目錄
        const notedir = await Notedir.findById(notedirId);

        if(!notedir) return res.status(404).json({msg: '找不到此筆記的存放目錄', status: NOT_FOUND});

        // 取得筆記本資料
        let notebook = await Notebook.findById(notedir.notebook);

        if(!notebook) return res.status(404).json({msg: '找不到此筆記的筆記本', status: NOT_FOUND});
                
        // 確認使用者是否真的擁有這個筆記本
        if(notebook.author.toString() !== req.user.id) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});

        // 取得所有筆記
        const notes = notedir.notes;

        res.json(notes);
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
        let note = await Note.findById(req.params.id);
        
        if(!note) return res.status(404).json({msg: '找不到筆記', status: NOT_FOUND});
        
        // 取得此筆記的筆記目錄
        let notedir = await Notedir.findById(note.notedir);

        if(!notedir) return res.status(404).json({msg: '找不到此筆記的存放目錄', status: NOT_FOUND});

        // 取得筆記本資料
        let notebook = await Notebook.findById(notedir.notebook);

        if(!notebook) return res.status(404).json({msg: '找不到此筆記的筆記本', status: NOT_FOUND});
        
        // 確認使用者是否真的擁有這個筆記本
        if(notebook.author.toString() !== req.user.id) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});

        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Post /api/notes
// desc             新增筆記
// access           Private
router.post('/', auth, async(req, res) => {
    const { title, content } = req.body;

    try {
        // 取得此筆記的筆記目錄
        let notedir = await Notedir.findById(req.body.notedir);

        if(!notedir) return res.status(404).json({msg: '找不到此筆記的存放目錄', status: NOT_FOUND});

        // 取得筆記本資料
        let notebook = await Notebook.findById(notedir.notebook);

        if(!notebook) return res.status(404).json({msg: '找不到此筆記的筆記本', status: NOT_FOUND});
        
        // 確認使用者是否真的擁有這個筆記本
        if(notebook.author.toString() !== req.user.id) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});

        // 新增筆記到notes
        const newNote = new Note({
            title,
            content,
            notedir
        });

        const note = await newNote.save();

        const newNotedirNote = {
            _id: note._id,
            title,
            summary: require('../common/summary')(content),
            date: note.date
        };

        // 新增筆記的標題、摘要到Notedir裡
        notedir.notes.push(newNotedirNote);

        await notedir.save();
        
        res.json(newNotedirNote);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Put /api/notes
// desc             修改筆記
// access           Private
router.put('/:id', auth, async(req, res) => {
    const { title, content } = req.body;
    const updateDateTime = new Date();

    //建立筆記物件
    const noteField = {
        title,
        content,
        notedir: req.body.notedir,
        date: updateDateTime
    };

    try {
        const id = req.params.id;
        
        let note = await Note.findById(id);
        
        if(!note) return res.status(404).json({msg: '找不到筆記', status: NOT_FOUND});

        // 取得此筆記的筆記目錄
        let notedir = await Notedir.findById(req.body.notedir);

        if(!notedir) return res.status(404).json({msg: '找不到此筆記的存放目錄', status: NOT_FOUND});

        // 取得筆記本資料
        let notebook = await Notebook.findById(notedir.notebook);

        if(!notebook) return res.status(404).json({msg: '找不到此筆記的筆記本', status: NOT_FOUND});
        
        // 確認使用者是否真的擁有這個筆記本
        if(notebook.author.toString() !== req.user.id) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});

        let deleteImgs = require('../common/filterDeleteImgs')(note.content, content);

        //確認新的筆記內容是否有刪掉圖片，有則刪除Server上的檔案
        if(deleteImgs.length > 0) {
            deleteImgs.forEach((imgName) => {
                let deletedImgPath = path.join(__dirname, '..', config.get('imageDirectory'), imgName);
                
                fs.unlink(deletedImgPath, (err) => {
                      return
                    });
            })
        }

        // 修改筆記
        note = await Note.findByIdAndUpdate(id,
            { $set: noteField },
            { new: true });

        // 連帶修改筆記目錄的筆記資訊
        let summary = require('../common/summary')(content);
        await Notedir.findOneAndUpdate({_id: req.body.notedir, 'notes._id': id},
            { $set: {'notes.$.title': title, 'notes.$.summary': summary, 'notes.$.date': updateDateTime}}
        );
        
        //取得新的筆記目錄
        notedir = await Notedir.findById(req.body.notedir);
        const updateNotedirNote = notedir.notes.find(note => note._id == id);
        
        res.json(updateNotedirNote);
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
        let deleteItems = {
            id: uuidv4(),
            type: 'note',
            date: new Date()
        };

        //從header取得notebook
        const notedirId = req.header('x-notedir');

        let note = await Note.findById(id);

        if(!note) return res.status(404).json({msg: '找不到此筆記', status: NOT_FOUND});

        // 取得此筆記的筆記目錄
        let notedir = await Notedir.findById(notedirId);

        if(!notedir) return res.status(404).json({msg: '找不到此筆記的存放目錄', status: NOT_FOUND});

        // 取得筆記本資料
        let notebook = await Notebook.findById(notedir.notebook);

        if(!notebook) return res.status(404).json({msg: '找不到此筆記的筆記本', status: NOT_FOUND});

        // 確認使用者是否真的擁有這個筆記本
        if(notebook.author.toString() !== req.user.id) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});

        //
        // 移動至回收站
        //
        deleteItems.title = note.title;
        deleteItems.notes = note;

        // 取得刪除的項目
        const deletedGroup = await Recyclebin.findById(userId);

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
        let deleteNoteIdx = notedir.notes.findIndex((el) => el._id == id);
        notedir.notes.splice(deleteNoteIdx,1);
        notedir.save();
        //todo: implement with better way
        // await Notedir.findOneAndUpdate({_id: req.body.notedir, 'notes._id': id},
        //     { $set: { $pullAll: {"notes.$._id": [id] }}}
        // );


        res.json({msg: '筆記已刪除'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;