const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Notebook = require('../models/Notebook');
const auth = require('../middleware/auth');

// route            Get /api/notebooks
// desc             取得所有筆記本
// access           Private
router.get('/', auth, async(req, res) => {
    try {
        // 取得筆記本資料
        const notebook = await Notebook.find({ user: req.user.id });
        res.json(notebook);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Post /api/notebooks
// desc             新增筆記本
// access           Private
router.post('/', [auth, [
    check('title', '請輸入筆記本名稱')
        .not()
        .isEmpty()
]], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, desc } = req.body;

    try {
        // 新增筆記本
        const newNotebook = new Notebook({
            title,
            desc,
            user: req.user.id
        });

        const notebook = await newNotebook.save();

        res.json(notebook);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Put /api/notebooks
// desc             修改筆記本
// access           Private
router.put('/:id', [auth, [
    check('title', '請輸入筆記本名稱')
        .not()
        .isEmpty()
]], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, desc } = req.body;

    //建立筆記本物件
    const notebookField = {
        title,
        desc
    };

    try {
        // 修改筆記本
        let notebook = await Notebook.findById(req.params.id);

        if(!notebook) return res.status(404).json({msg: '找不到此筆記本'});

        // 確認使用者是否真的擁有這個筆記本
        if(notebook.user.toString() !== req.user.id) return res.status(401).json({msg: '未授權'});

        notebook = await Notebook.findByIdAndUpdate(req.params.id,
            { $set: notebookField },
            { new: true });

        res.json(notebook);
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
        // 刪除筆記本
        const notebook = await Notebook.findById(req.params.id);

        if(!notebook) return res.status(404).json({msg: '找不到此筆記本'});

        // 確認使用者是否真的擁有這個筆記本
        if(notebook.user.toString() !== req.user.id) return res.status(401).json({msg: '未授權'});

        await Notebook.findByIdAndRemove(req.params.id);

        res.json({msg: '筆記本已刪除'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;