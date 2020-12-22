module.exports = function getDeletedChild(type, notebooksMap, notedirsMap, notesMap, id) {
        
    switch(type) {
        case 'notebook':
            // 查詢此筆記本裡面是否有已被刪除的目錄
            const deletedNotebookChildMap = new Map();
            for(let deletedItemId of notedirsMap.keys()) {
                if(notedirsMap.get(deletedItemId).notebook.toString() === id.toString()) {
                    deletedNotebookChildMap.set(deletedItemId, notedirsMap.get(deletedItemId));
                }
            }
            
            // 查詢此筆記本裡面是否有已被刪除的筆記
            for(let deletedItemId of notebooksMap.keys()) {
                if(notebooksMap.get(deletedItemId).toString() === id.toString()) {
                    deletedNotebookChildMap.set(deletedItemId, notebooksMap.get(deletedItemId));
                }
            }
            return deletedNotebookChildMap;
        case 'notedir':
            // 查詢此目錄裡面是否有已被刪除的筆記
            const deletedNotedirChildMap = new Map();
            for(let deletedItemId of notesMap.keys()) {
                if(notesMap.get(deletedItemId).notedir.toString() === id.toString()) {
                    deletedNotedirChildMap.set(deletedItemId, notesMap.get(deletedItemId));
                }
            }
            return deletedNotedirChildMap;
    }
}