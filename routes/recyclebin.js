const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const {
    NOT_FOUND,
    MISSING_PARAM
} = require('../status');

const Recyclebin = require('../models/Recyclebin');
const User = require('../models/User');
const Notebook = require('../models/Notebook');
const Notedir = require('../models/Notedir');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// route            Get /api/recyclebin
// desc             取得所有刪除的項目
// access           Private
router.get('/', auth, async(req, res) => {
    try {
        const userId = req.user.id;

        if(!userId) return res.status(400).json({msg: '缺少參數', status: MISSING_PARAM});

        // 確認是否存在此user
        let user = await User.findById(userId);

        if(!user) return res.status(400).json({status: NOT_FOUND});
        
        // 取得刪除的項目
        const deletedGroup = await Recyclebin.findOne({userId});

        if(!deletedGroup) 
            res.status(200).send();
        else
            res.json(deletedGroup.items);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Post /api/recyclebin
// desc             新增刪除項目
// access           Private
router.post('/', auth, async(req, res) => {
    const { type, id } = req.body;
    const userId = req.user.id;
    let notebook, notedirs, notes;
    
    try {
        let deleteItems = {
            id: uuidv4(),
            type,
            date: new Date()
        };

        switch(type){
            case 'notebook':
                notebook = await Notebook.findById(id);
                notedirs = await Notedir.find({ notebook: notebook._id });
                notes = await require('../common/getNotes')(notedirs);
                deleteItems.title = notebook.title;
                deleteItems.notebook = notebook;
                deleteItems.notedirs = notedirs;
                deleteItems.notes = notes;
                break;
            case 'notedir':
                notedirs = await Notedir.findById(id);
                notes = await require('../common/getNotes')(notedirs);
                deleteItems.title = notedirs.title;
                deleteItems.notedirs = notedirs;
                deleteItems.notes = notes;
                break;
            case 'note':
                notes = await Note.findById(id);
                deleteItems.title = notes.title;
                deleteItems.notes = notes;
                break;
        }

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

        res.json({msg: deletedItems.title + ' 已刪除'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Put /api/recyclebin
// desc             復原刪除的項目
// access           Private
router.put('/:id', auth, async(req, res) => {
    let notebook, notedirs, notes;

    try {
        const id = req.params.id;
        const userId = req.user.id;

        if(!(id && userId)) return res.status(400).json({msg: '缺少參數', status: MISSING_PARAM});

        // 取得刪除的項目
        const deletedGroup = await Recyclebin.findById(userId);
        const deletedItem = deletedGroup.items.find(item => item.id === id);
        
        if(!deletedItem) return res.status(400).json({status: NOT_FOUND});

        // 復原筆記資料，並補上關聯collection的欄位
        switch(deletedItem.type) {
            case 'notebook':
                notebook = await Notebook.findById(deletedItem.notebook._id);
                await notebook.save();
                await Notedir.insertMany(deletedItem.notedirs);
                await Note.insertMany(deletedItem.notes);
                break;
            case 'notedir':
                let notedirItem = await Notedir.findById(deletedItem.notedirs._id);
                await notedirItem.save();
                await Note.insertMany(deletedItem.notes);

                //
                // 加回去筆記本中的notedirs裡
                //

                // 取得此筆記目錄的筆記本
                notebook = await Notebook.findById(deletedItem.notedirs.notebook);
                const defaultNoteDir = notebook.notedirs.find(notedir => notedir.default === true);

                const newNotebookDir = {
                    _id: deletedItem.notedirs._id,
                    title: deletedItem.notedirs.title,
                    date: deletedItem.notedirs.date,
                    default: defaultNoteDir._id === deletedItem.notedirs._id
                };
                notebook.notedirs.push(newNotebookDir);
                await notebook.save();
                break;
            case 'note':
                notes = await Note.findById(deletedItem.notes._id);
                await notes.save();

                //
                // 加回去筆記目錄中的notes裡
                //

                // 取得此筆記的筆記目錄
                notedir = await Notedir.findById(deletedItem.notes.notedir);

                const newNotedirNote = {
                    _id: deletedItem.notes._id,
                    title: deletedItem.notes.title,
                    summary: require('../common/summary')(content),
                    date: deletedItem.notes.date
                };

                // 新增筆記的標題、摘要到Notedir裡
                notedir.notes.push(newNotedirNote);
                await notedir.save();
                break;
        }

        // 刪除此項目
        let deleteIdx = deletedGroup.items.findIndex((el) => el.id == id);
        deletedGroup.items.splice(deleteIdx,1);
        await deletedGroup.save();

        //追加刪除：如果此使用者已經沒有刪除的項目，則把使用者整個Group刪掉
        if(deletedGroup.items.length === 0) await Recyclebin.findByIdAndRemove(deletedGroup._id);

        res.json({msg: deletedItem.title + '已復原'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// route            Delete /api/recyclebin
// desc             永久刪除
// access           Private
router.delete('/:id', auth, async(req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        if(!(id && userId)) return res.status(400).json({msg: '缺少參數', status: MISSING_PARAM});

        // 確認是否存在此user
        const user = await User.findById(userId);

        if(!user) return res.status(400).json({status: NOT_FOUND});

        // 取得刪除的項目
        const deletedGroup = await Recyclebin.findById(userId);
        const deletedItem = deletedGroup.items.find(item => item.id === id);
        
        if(!deletedItem) return res.status(400).json({status: NOT_FOUND});

        // 執行刪除
        let deleteIdx = deletedGroup.items.findIndex((el) => el.id == id);
        deletedGroup.items.splice(deleteIdx,1);
        await deletedGroup.save();

        //
        // server上的照片也一併刪除
        //
        let deleteImgs;
        if(deletedGroup.type === 'note') {
            deleteImgs = require('../common/filterDeleteImgs')(deletedItem.notes.content);
        } else {
            deletedItem.notes.forEach(deletedNotes => {
                let deleteImgItems = require('../common/filterDeleteImgs')(deletedNotes.content);
                deleteImgs = [].concat(deleteImgs, deleteImgItems);
            })
        }

        // 刪除在Server上的所有檔案
        if(deleteImgs.length > 0) {
            deleteImgs.forEach((imgName) => {
                let deletedImgPath = path.join(__dirname, '..', config.get('imageDirectory'), imgName);
                
                fs.unlink(deletedImgPath, (err) => {
                      return;
                    });
            })
        }

        // 追加刪除：如果此使用者已經沒有刪除的項目，則把使用者整個Group刪掉
        if(deletedGroup.items.length === 0) await Recyclebin.findByIdAndRemove(deletedGroup._id);

        res.json({msg: deletedItem.title + '已刪除'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;