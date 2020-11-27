const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { check, validationResult } = require('express-validator');
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

// route            Get /api/notedirs
// desc             取得所有筆記目錄
// access           Private
router.get('/', auth, async(req, res) => {
    try {
        //從header取得notebook
        const notebookId = req.header('x-notebook');

        if(!notebookId) return res.status(400).json({msg: '缺少參數', status: MISSING_PARAM});

        // 取得筆記本資料
        let notebook = await Notebook.findById(notebookId);

        if(!notebook) return res.status(404).json({msg: '找不到此筆記目錄的筆記本', status: NOT_FOUND});
        
        // 確認使用者是否真的擁有這個筆記本
        if(notebook.author.toString() !== req.user.id) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});

        // 取得筆記目錄資料
        const notedirs = notebook.notedirs;

        res.json(notedirs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Post /api/notedirs
// desc             新增筆記目錄
// access           Private
router.post('/', [auth, [
    check('title', '請輸入筆記目錄名稱')
        .not()
        .isEmpty()
]], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { title } = req.body;
    
    try {
        let notebook = await Notebook.findById(req.body.notebook);
        
        if(!notebook) return res.status(404).json({msg: '找不到此筆記目錄的筆記本', status: NOT_FOUND});

        // 確認使用者是否真的擁有這個筆記本
        if(notebook.author.toString() !== req.user.id) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});

        // 新增筆記目錄
        const newNotedir = new Notedir({
            title,
            notebook
        });

        const notedir = await newNotedir.save();

        const newNotebookDir = {
            _id: notedir._id,
            title,
            date: notedir.date,
            default: false
        };

        // 新增筆記目錄到Notebook裡
        notebook.notedirs.push(newNotebookDir);

        notebook.save();

        res.json(newNotebookDir);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Put /api/notedirs
// desc             修改筆記目錄
// access           Private
router.put('/:id', [auth, [
    check('title', '請輸入筆記目錄名稱')
        .not()
        .isEmpty()
]], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { title } = req.body;

    //建立筆記目錄物件
    const notedirField = {
        title
    };

    try {
        const id = req.params.id;

        let notedir = await Notedir.findById(id);

        if(!notedir) return res.status(404).json({msg: '找不到此筆記目錄', status: NOT_FOUND});

        //取得此筆記目錄的筆記本
        let notebook = await Notebook.findById(req.body.notebook);

        if(!notebook) return res.status(404).json({msg: '找不到此筆記目錄的筆記本', status: NOT_FOUND});

        // 確認使用者是否真的擁有這個筆記本
        if(notebook.author.toString() !== req.user.id) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});

        // 修改筆記目錄
        notedir = await Notedir.findByIdAndUpdate(id,
            { $set: notedirField },
            { new: true });

        // 連帶修改筆記本的筆記目錄資訊
        await Notebook.findOneAndUpdate({_id: req.body.notebook, 'notedirs._id': id},
            { $set: {'notedirs.$.title': title}}
        );

        const updateNotebookDir = notebook.notedirs.find(notebookDir => 
            notebookDir._id.toString() === notedir._id.toString());

        res.json(updateNotebookDir);
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
        const userId = userId;
        const notedir = await Notedir.findById(id);
        let deleteItems = {
            id: uuidv4(),
            type: 'notedir',
            date: new Date()
        };

        if(!notedir) return res.status(404).json({msg: '找不到此筆記目錄', status: NOT_FOUND});

        //從header取得notebook
        const notebookId = req.header('x-notebook');

        if(!notebookId) return res.status(400).json({msg: '缺少參數', status: MISSING_PARAM});

        //取得此筆記目錄的筆記本
        let notebook = await Notebook.findById(notebookId);

        if(!notebook) return res.status(404).json({msg: '找不到此筆記目錄的筆記本', status: NOT_FOUND});

        // 確認使用者是否真的擁有這個筆記本
        if(notebook.author.toString() !== userId) return res.status(401).json({msg: '未授權', status: NOT_AUTHORIZED});

        //
        // 移動至回收站
        //
        deleteItems.title = notedir.title;
        deleteItems.notedirs = await Notedir.find({ notebook: notebook._id });
        deleteItems.notes = await require('../common/getNotes')(deleteItems.notedirs);

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

        // 刪除筆記目錄裡的筆記
        await Note.deleteMany({ notedir: id });

        // 刪除筆記目錄
        await Notedir.findByIdAndRemove(id);

        // 連帶刪除筆記本裡的筆記目錄資訊
        let deleteNoteIdx = notebook.notedirs.findIndex((el) => el._id == id);
        notebook.notedirs.splice(deleteNoteIdx,1);
        notebook.save();

        res.json({msg: '筆記目錄已刪除'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;