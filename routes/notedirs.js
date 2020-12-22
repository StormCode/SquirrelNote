const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
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

// route            Get /api/notedirs
// desc             取得所有筆記目錄
// access           Private
router.get('/', auth, async(req, res) => {
    try {
        const newCrypto = crypto(process.env.SECRET_KEY);

        //從header取得notebook
        const notebookId = newCrypto.decrypt(req.header('x-notebook'), false);

        if(!notebookId) return res.status(400).json({msg: '缺少參數', status: MISSING_PARAM});

        // 取得筆記本資料
        const notebook = await Notebook.findById(notebookId);

        if(!notebook) return res.status(404).json({msg: '找不到此筆記目錄的筆記本', status: NOT_FOUND});
        
        // 確認使用者是否真的擁有這個筆記本
        if(notebook.author.toString() !== req.user.id) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});

        // 取得筆記目錄資料
        const notedirs = JSON.parse(JSON.stringify(notebook.notedirs));

        // 計算每個目錄裡的筆記個數
        for(let idx = 0; idx < notedirs.length; idx++) {
            const notedir = await Notedir.findById(notedirs[idx]._id);
            notedirs[idx].note_count = notedir.notes.length;
        }

        // 加密notedir資料
        const encryptedNotedir = newCrypto.encrypt(notedirs);
        res.json(encryptedNotedir);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Post /api/notedirs
// desc             新增筆記目錄
// access           Private
router.post('/', auth, async(req, res) => {
    try {
        const newCrypto = crypto(process.env.SECRET_KEY);
        // 解密notedir資料
        const data = newCrypto.decrypt(req.body.data);
        
        const notebook = await Notebook.findById(data.notebook);
        
        if(!notebook) return res.status(404).json({msg: '找不到此筆記目錄的筆記本', status: NOT_FOUND});

        // 確認使用者是否真的擁有這個筆記本
        if(notebook.author.toString() !== req.user.id) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});

        const encryptedTitle = newCrypto.encrypt(data.title, false);
        // 新增筆記目錄
        const newNotedir = new Notedir({
            title: encryptedTitle,
            notebook
        });

        const notedir = await newNotedir.save();

        const newNotebookDir = {
            _id: notedir._id,
            title: encryptedTitle,
            date: notedir.date,
            default: false
        };

        // 新增筆記目錄到Notebook裡
        notebook.notedirs.push(newNotebookDir);

        notebook.save();

        // 加上數量欄位
        newNotebookDir.note_count = 0;

        // 加密新增的notedir資料
        const encryptedNotebookDir = newCrypto.encrypt(newNotebookDir);

        res.json(encryptedNotebookDir);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Put /api/notedirs
// desc             修改筆記目錄
// access           Private
router.put('/:id', auth, async(req, res) => {
    try {
        const newCrypto = crypto(process.env.SECRET_KEY);
        // 解密notedir資料
        const data = newCrypto.decrypt(req.body.data);
        const encryptedTitle = newCrypto.encrypt(data.title, false);
    
        //建立筆記目錄物件
        const notedirField = {
            title: encryptedTitle
        };
    
        const id = req.params.id;

        let notedir = await Notedir.findById(id);

        if(!notedir) return res.status(404).json({msg: '找不到此筆記目錄', status: NOT_FOUND});

        //取得此筆記目錄的筆記本
        let notebook = await Notebook.findById(data.notebook);

        if(!notebook) return res.status(404).json({msg: '找不到此筆記目錄的筆記本', status: NOT_FOUND});

        // 確認使用者是否真的擁有這個筆記本
        if(notebook.author.toString() !== req.user.id) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});

        // 修改筆記目錄
        notedir = await Notedir.findByIdAndUpdate(id,
            { $set: notedirField },
            { new: true });

        // 連帶修改筆記本的筆記目錄資訊
        await Notebook.findOneAndUpdate({_id: data.notebook, 'notedirs._id': id},
            { $set: {'notedirs.$.title': encryptedTitle}}
        );

        // 取得更新後的notebook
        notebook = await Notebook.findById(data.notebook);

        const updateNotebookDir = notebook.notedirs.find(notebookDir => 
            notebookDir._id.toString() === notedir._id.toString());
            
        // 加密修改的notedir資料
        const encryptedNotebookDir = newCrypto.encrypt(updateNotebookDir);

        res.json(encryptedNotebookDir);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Delete /api/notedirs
// desc             刪除筆記目錄
// access           Private
router.delete('/:id', auth, async(req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const notedir = await Notedir.findById(id);
        const deleteItems = {
            id: uuidv4(),
            type: 'notedir',
            date: new Date()
        };

        if(!notedir) return res.status(404).json({msg: '找不到此筆記目錄', status: NOT_FOUND});

        //從header取得notebook
        const notebookId = crypto(process.env.SECRET_KEY).decrypt(req.header('x-notebook'), false);

        if(!notebookId) return res.status(400).json({msg: '缺少參數', status: MISSING_PARAM});

        //取得此筆記目錄的筆記本
        const notebook = await Notebook.findById(notebookId);

        if(!notebook) return res.status(404).json({msg: '找不到此筆記目錄的筆記本', status: NOT_FOUND});

        // 確認使用者是否真的擁有這個筆記本
        if(notebook.author.toString() !== userId) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});

        //
        // 移動至回收站
        //
        deleteItems.title = notedir.title;
        deleteItems.notedirs = await Notedir.findById(id);
        deleteItems.notes = await require('../general/getNotes')(deleteItems.notedirs);

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

        // 刪除筆記目錄裡的筆記
        await Note.deleteMany({ notedir: id });

        // 刪除筆記目錄
        await Notedir.findByIdAndRemove(id);

        // 連帶刪除筆記本裡的筆記目錄資訊
        const deleteNoteIdx = notebook.notedirs.findIndex((el) => el._id == id);
        notebook.notedirs.splice(deleteNoteIdx,1);
        notebook.save();

        res.json({msg: '筆記目錄已刪除'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;