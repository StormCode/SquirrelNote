const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const {
    NOT_AUTHORIZED,
    NOT_FOUND
} = require('../status');

const Notebook = require('../models/Notebook');
const Notedir = require('../models/Notedir');
const Note = require('../models/Note');
const Recyclebin = require('../models/Recyclebin');
const crypto = require('../utils/crypto');
const auth = require('../middleware/auth');

// route            Get /api/notebooks
// desc             取得所有筆記本
// access           Private
router.get('/', auth, async(req, res) => {
    try {
        // 取得筆記本資料
        const notebook = await Notebook.find({ author: req.user.id });
        // 加密notebook資料
        const encryptedNotebook = crypto(process.env.SECRET_KEY).encrypt(notebook);
        res.json(encryptedNotebook);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Post /api/notebooks
// desc             新增筆記本
// access           Private
router.post('/', auth, async(req, res) => {
    try {
        const newCrypto = crypto(process.env.SECRET_KEY);
        // 解密notebook資料
        const data = newCrypto.decrypt(req.body.data);
        const { title, desc } = data;
        
        // 新增筆記本
        const newNotebook = new Notebook({
            title: newCrypto.encrypt(title, false),
            desc: newCrypto.encrypt(desc, false),
            author: req.user.id
        });

        const notebook = await newNotebook.save();

        // 新增預設筆記目錄
        const newNotedir = new Notedir({
            title: newCrypto.encrypt('_default', false),
            notebook: notebook._id
        });

        const defaultNotedir = await newNotedir.save();

        notebook.notedirs.push({
            _id: defaultNotedir._id,
            default: true
        });

        await newNotebook.save();

        // 加密新增的notebook資料
        const encryptedNotebook = newCrypto.encrypt(notebook);

        res.json(encryptedNotebook);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Put /api/notebooks
// desc             修改筆記本
// access           Private
router.put('/:id', auth, async(req, res) => {
    try {
        const newCrypto = crypto(process.env.SECRET_KEY);
        // 解密notebook資料
        const data = newCrypto.decrypt(req.body.data);
        const { title, desc } = data;
    
        //建立筆記本物件
        const notebookField = {
            title: newCrypto.encrypt(title, false),
            desc: newCrypto.encrypt(desc, false)
        };
    
        const id = req.params.id;

        let notebook = await Notebook.findById(id);

        if(!notebook) return res.status(404).json({msg: '找不到此筆記本', status: NOT_FOUND});

        // 確認使用者是否真的擁有這個筆記本
        if(notebook.author.toString() !== req.user.id) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});

        // 修改筆記本
        notebook = await Notebook.findByIdAndUpdate(id,
            { $set: notebookField },
            { new: true });

        // 加密修改的notebook資料
        const encryptedNotebook = crypto(process.env.SECRET_KEY).encrypt(notebook);

        res.json(encryptedNotebook);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Delete /api/notebooks
// desc             刪除筆記本
// access           Private
router.delete('/:id', auth, async(req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        let deleteItems = {
            id: uuidv4(),
            type: 'notebook',
            date: new Date()
        };
        const notebook = await Notebook.findById(id);
        const notedirs = await Notedir.find({ notebook: notebook._id });

        if(!notebook) return res.status(404).json({msg: '找不到此筆記本', status: NOT_FOUND});

        // 確認使用者是否真的擁有這個筆記本
        if(notebook.author.toString() !== userId) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});

        //
        // 移動至回收站
        //
        deleteItems.title = notebook.title;
        deleteItems.notebook = notebook;
        deleteItems.notedirs = notedirs;
        deleteItems.notes = await require('../common/getNotes')(notedirs);

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

        // 刪除筆記本裡的筆記目錄
        await Notedir.deleteMany({ notebook: id });

        // 刪除筆記目錄裡的筆記
        await Note.deleteMany({ notedir: notedirs._id });

        // 刪除筆記本
        await Notebook.findByIdAndRemove(id);

        res.json({msg: '筆記本已刪除'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;