const express = require('express');
const config = require('config');
const multer = require('multer');
const path = require('path');
const upload = multer({dest: path.join(__dirname, '..', config.get('imageDirectory'))});
const router = express.Router();

const auth = require('../middleware/auth');

// @route           GET /api/images/:filename
// @desc            接收Client傳過來的檔名並回傳圖檔
// @access          Private
router.get('/:filename', async (req, res) => {
    try {
        let filename = req.params.filename;
        let imageUrl = path.resolve('uploads/images/', filename);
        res.download(imageUrl);
    }
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route           POST /api/images/upload
// @desc            上傳圖片
// @access          Private
router.post('/upload', auth, upload.single('image'), async (req, res) => {
    try {
        if(req.file) {
            res.json(req.file);
        }
    }
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;