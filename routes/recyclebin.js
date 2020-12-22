const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const {
    NOT_FOUND,
    MISSING_PARAM
} = require('../status');

const Recyclebin = require('../models/Recyclebin');
const User = require('../models/User');
const Notebook = require('../models/Notebook');
const Notedir = require('../models/Notedir');
const Note = require('../models/Note');
const getDeletedChild = require('../general/getDeletedChild');
const crypto = require('../utils/crypto');
const auth = require('../middleware/auth');

// route            Get /api/recyclebin
// desc             取得所有刪除的項目
// access           Private
router.get('/', auth, async(req, res) => {
    try {
        const userId = req.user.id;

        if(!userId) return res.status(400).json({msg: '缺少參數', status: MISSING_PARAM});

        // 確認是否存在此user
        const user = await User.findById(userId);

        if(!user) return res.status(400).json({status: NOT_FOUND});
        
        // 取得刪除的項目
        const deletedGroup = await Recyclebin.findOne({userId});

        if(!deletedGroup) 
            res.status(200).send();
        else {
            const getDeletedParent = (type, data, id) => {
                switch(type) {
                    case 'notebook':
                        const deletedNotebookInRecyclebin = data.find(deletedNotebook => deletedNotebook._id.toString() === id.toString());
                        const deletedNotebookParentTitle = deletedNotebookInRecyclebin ? deletedNotebookInRecyclebin.title : null;
                        return {
                            type: 'notebook',
                            id,
                            title: deletedNotebookParentTitle
                        }
                    case 'notedir':
                        const deletedNotedirInRecyclebin = data.find(deletedNotedir => deletedNotedir._id.toString() === id.toString());
                        const deletedNotedirParentTitle = deletedNotedirInRecyclebin ? deletedNotedirInRecyclebin.title : null;
                        return {
                            type: 'notedir',
                            id,
                            title: deletedNotedirParentTitle
                        }
                }
            }

            const deletedNotebooks = deletedGroup.items.filter(item => item.type === 'notebook').map(deleteItem => deleteItem.notebook);
            const deletedNotedirs = deletedGroup.items.filter(item => item.type === 'notedir').map(deleteItem => deleteItem.notedirs);
            const deletedNotedirsMap = new Map();
            const deletedNotebookOfNotesMap = new Map();
            const deletedNotesMap = new Map();
            deletedGroup.items.filter(item => item.type === 'notedir')
                .forEach(deletedItem => {
                    deletedNotedirsMap.set(deletedItem.id, deletedItem.notedirs);
                });
            deletedGroup.items.filter(item => item.type === 'note')
                .forEach(deletedItem => {
                    deletedNotebookOfNotesMap.set(deletedItem.id, deletedItem.parent.notebook);
                    deletedNotesMap.set(deletedItem.id, deletedItem.notes);
                });
            
            // 判斷每個項目是否可以還原
            for(let idx = 0; idx < deletedGroup.items.length; idx++) {
                let deletedItem = deletedGroup.items[idx];
                switch(deletedItem.type) {
                    case 'notebook':
                        deletedItem.isRestoreable = true;
                        break;
                    case 'notedir':
                        const notebook = await Notebook.findById(deletedItem.notedirs.notebook);
                        if(!notebook) {
                            deletedItem.isRestoreable = false;
                            deletedItem.parent_info = getDeletedParent('notebook', deletedNotebooks, deletedItem.notedirs.notebook);
                        } else {
                            deletedItem.isRestoreable = true;
                        }
                        break;
                    case 'note':
                        const notedir = await Notedir.findById(deletedItem.notes.notedir);
                        if(notedir) {
                            deletedItem.isRestoreable = true;
                        } else {
                            deletedItem.isRestoreable = false;

                            // 確認筆記目錄是否為某個被刪除筆記本的預設目錄，若是則表示整個筆記本已經被刪除，其上層資訊設定為筆記本資訊
                            let isDefaultNotedir = false;
                            for(let notebookIdx = 0; notebookIdx < deletedNotebooks.length; notebookIdx++) {
                                const deletedNotebook = deletedNotebooks[notebookIdx];
                                for(let notedirIdx = 0; notedirIdx < deletedNotebook.notedirs.length; notedirIdx++) {
                                    const deletedNotedir = deletedNotebook.notedirs[notedirIdx];
                                    if(deletedNotedir._id.toString() === deletedItem.notes.notedir.toString() && deletedNotedir.default === true) {
                                        isDefaultNotedir = true;
                                        break;
                                    }
                                }
                            }
                            if(isDefaultNotedir) {
                                deletedItem.parent_info = getDeletedParent('notebook', deletedNotebooks, deletedItem.parent.notebook);
                            } else {
                                deletedItem.parent_info = getDeletedParent('notedir', deletedNotedirs, deletedItem.notes.notedir);
                            }
                        }
                        break;
                }
            }

            // 判斷是否有已被刪除的子層級(目錄/筆記)
            for(let idx = 0; idx < deletedGroup.items.length; idx++) {
                let deletedItem = deletedGroup.items[idx];
                switch(deletedItem.type) {
                    case 'notebook':
                        deletedItem.child_count = getDeletedChild('notebook', deletedNotebookOfNotesMap, deletedNotedirsMap, null, deletedItem.notebook._id).size;
                        break;
                    case 'notedir':
                        deletedItem.child_count = getDeletedChild('notedir', null, null, deletedNotesMap, deletedItem.notedirs._id).size;
                        break;
                }
            }

            const deletedItemsClone = JSON.parse(JSON.stringify(deletedGroup.items));
            deletedItemsClone.map(deletedItem => delete deletedItem.parent);

            const encryptedDeletedItems = crypto(process.env.SECRET_KEY).encrypt(deletedItemsClone);
    
            res.json(encryptedDeletedItems);
        }
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
        const deletedGroup = await Recyclebin.findOne({userId});
        const deletedItem = deletedGroup.items.find(item => item.id === id);
        
        if(!deletedItem) return res.status(400).json({status: NOT_FOUND});

        // 復原筆記資料，並補上關聯collection的欄位
        switch(deletedItem.type) {
            case 'notebook':
                notebook = new Notebook(deletedItem.notebook);
                await notebook.save();
                await Notedir.insertMany(deletedItem.notedirs);
                await Note.insertMany(deletedItem.notes);
                break;
            case 'notedir':
                notedirs = new Notedir(deletedItem.notedirs);
                await notedirs.save();
                await Note.insertMany(deletedItem.notes);

                //
                // 加回去筆記本中的notedirs裡
                //

                // 取得此筆記目錄的筆記本
                notebook = await Notebook.findById(deletedItem.notedirs.notebook);

                const newNotebookDir = {
                    _id: deletedItem.notedirs._id,
                    title: deletedItem.notedirs.title,
                    date: deletedItem.notedirs.date,
                    default: false
                };
                notebook.notedirs.push(newNotebookDir);
                await notebook.save();
                break;
            case 'note':
                notes = new Note(deletedItem.notes);
                
                await notes.save();

                //
                // 加回去筆記目錄中的notes裡
                //

                // 取得此筆記的筆記目錄
                notedirs = await Notedir.findById(deletedItem.notes.notedir);

                const newCrypto = crypto(process.env.SECRET_KEY);
                const decryptedContent = newCrypto.decrypt(deletedItem.notes.content, false);
                const encryptedSummary = newCrypto.encrypt(require('../general/summary')(decryptedContent), false);

                const newNotedirNote = {
                    _id: deletedItem.notes._id,
                    title: deletedItem.notes.title,
                    summary: encryptedSummary,
                    date: deletedItem.notes.date
                };

                // 新增筆記的標題、摘要到Notedir裡
                notedirs.notes.push(newNotedirNote);

                await notedirs.save();
                break;
        }

        // 刪除此項目
        const deleteIdx = deletedGroup.items.findIndex((el) => el.id == id);
        deletedGroup.items.splice(deleteIdx,1);
        await deletedGroup.save();

        //追加刪除：如果此使用者已經沒有刪除的項目，則把使用者整個Group刪掉
        if(deletedGroup.items.length === 0) await Recyclebin.findByIdAndRemove(deletedGroup._id);

        res.status(200).send();
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
        const newCrypto = crypto(process.env.SECRET_KEY);

        if(!(id && userId)) return res.status(400).json({msg: '缺少參數', status: MISSING_PARAM});

        // 確認是否存在此user
        const user = await User.findById(userId);

        if(!user) return res.status(400).json({status: NOT_FOUND});

        // 取得刪除的項目
        const deletedGroup = await Recyclebin.findOne({userId});
        let deletedNotedirsMap = new Map();
        let deletedNotebookOfNotesMap = new Map();
        let deletedNotesMap = new Map();
        deletedGroup.items.filter(item => item.type === 'notedir')
            .forEach(deletedItem => {
                deletedNotedirsMap.set(deletedItem.id, deletedItem.notedirs);
            });
        deletedGroup.items.filter(item => item.type === 'note')
            .forEach(deletedItem => {
                deletedNotebookOfNotesMap.set(deletedItem.id, deletedItem.parent.notebook);
                deletedNotesMap.set(deletedItem.id, deletedItem.notes);
            });
        const deletedItem = deletedGroup.items.find(item => item.id === id);
        // const deletedNotedirs = deletedGroup.items.filter(item => item.type === 'notedir').map(deleteItem => deleteItem.notedirs);
        // const deletedNotebookOfNotes = deletedGroup.items.filter(item => item.type === 'note').map(deleteItem => deleteItem.parent.notebook);
        let deletedNotes = deletedGroup.items.filter(item => item.type === 'note').map(deleteItem => deleteItem.notes);
            
        if(!deletedItem) return res.status(400).json({status: NOT_FOUND});

        // 執行刪除
        let deleteIdx = deletedGroup.items.findIndex((el) => el.id == id);
        deletedGroup.items.splice(deleteIdx,1);
        await deletedGroup.save();

        // 連帶刪除子層級(目錄/筆記)
        let deletedChildMap = new Map();
        switch(deletedItem.type) {
            case 'notebook':
                deletedChildMap = getDeletedChild('notebook', deletedNotebookOfNotesMap, deletedNotedirsMap, null, deletedItem.notebook._id);
                break;
            case 'notedir':
                deletedChildMap = getDeletedChild('notedir', null, null, deletedNotesMap, deletedItem.notedirs._id);
                break;
        }

        for(let deletedItemId of deletedChildMap.keys()) {
            deleteIdx = deletedGroup.items.findIndex((el) => el.id == deletedItemId);
            deletedGroup.items.splice(deleteIdx,1);
            await deletedGroup.save();
        }

        //
        // server上的照片也一併刪除
        //
        let deleteImgs = [];

        if(deletedItem.type === 'note') {
            deletedNotes = [].concat(deletedItem.notes);
        } else {
            deletedNotes = deletedItem.notes;
        }
        deletedNotes.forEach(deletedNote => {
            let decryptedContent = newCrypto.decrypt(deletedNote.content, false); 
            let deleteImgItems = require('../general/filterDeleteImgs')(decryptedContent);
            deleteImgs = [].concat(deleteImgs, deleteImgItems);
        });
        
        // 刪除在Server上的所有檔案 
        if(deleteImgs.length > 0) {
            deleteImgs.forEach((imgName) => {
                let deletedImgPath = path.join(__dirname, '..', process.env.IMAGE_DIRECTORY, imgName);
                
                fs.unlink(deletedImgPath, (err) => {
                    return;
                });
            })
        }

        // 追加刪除：如果此使用者已經沒有刪除的項目，則把使用者整個Group刪掉
        if(deletedGroup.items.length === 0) await Recyclebin.findByIdAndRemove(deletedGroup._id);

        res.status(200).send();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;