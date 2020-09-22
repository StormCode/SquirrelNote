const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Notebook = require('../models/Notebook');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// route            Get /api/notes
// desc             取得所有筆記
// access           Private
router.get('/', auth, async(req, res) => {
    try {
        //從header取得notebook
        const notebookId = req.header('x-notebook');

        // 取得所有筆記
        const note = await Note.find({ notebook: notebookId });

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
    const { title, context } = req.body;

    try {
        //取得此筆記的筆記本
        let notebook = await Notebook.findById(req.body.notebook);

        // 確認使用者是否真的擁有這個筆記本
        if(notebook.user.toString() !== req.user.id) return res.status(401).json({msg: '未授權'});

        // 新增筆記
        const newNote = new Note({
            title,
            context,
            notebook
        });

        const note = await newNote.save();

        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Put /api/notes
// desc             修改筆記
// access           Private
router.put('/:id', auth, async(req, res) => {
    const { title, context } = req.body;

    //建立筆記物件
    const noteField = {
        title,
        context,
        notebook: req.body.notebook
    };

    try {
        // 修改筆記
        let note = await Note.findById(req.params.id);
        
        if(!note) return res.status(404).json({msg: '找不到筆記'});

        //取得此筆記的筆記本
        let notebook = await Notebook.findById(req.body.notebook);

        // 確認使用者是否真的擁有這個筆記本
        if(notebook.user.toString() !== req.user.id) return res.status(401).json({msg: '未授權'});

        note = await Note.findByIdAndUpdate(req.params.id,
            { $set: noteField },
            { new: true });

        res.json(note);
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
        // 刪除筆記
        let note = await Note.findById(req.params.id);

        if(!note) return res.status(404).json({msg: '找不到此筆記'});

        //取得此筆記的筆記本
        let notebook = await Notebook.findById(note.notebook);

        // 確認使用者是否真的擁有這個筆記本
        if(notebook.user.toString() !== req.user.id) return res.status(401).json({msg: '未授權'});

        await Note.findByIdAndRemove(req.params.id);

        res.json({msg: '筆記已刪除'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;