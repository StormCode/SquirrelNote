const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express();
const fs = require('fs');

// Setting CORS
// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With,X-Auth-Token,Content-Type");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     next();
// });

// Init Middleware
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5000;

app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notebooks', require('./routes/notebooks'));
app.use('/api/notedirs', require('./routes/notedirs'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/images', require('./routes/images'));
app.use('/api/recyclebin', require('./routes/recyclebin'));

// 在 server.js 裡加入這段，直接在網頁上看答案
app.get('/debug-path', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const checkPath = path.join(__dirname, 'public_html'); // 或是你設定的路徑
    
    res.json({
        __dirname: __dirname,
        exists: fs.existsSync(checkPath),
        contents: fs.existsSync(checkPath) ? fs.readdirSync(checkPath) : 'Folder not found',
        processCwd: process.cwd()
    });
});

// Serve static assets in production
if(process.env.NODE_ENV === 'production'){
    // 優先找根目錄下的 public
    const cloudPath = path.join(__dirname, 'public_html');
    const localPath = path.join(__dirname, 'client', 'build');
    
    // 自動切換
    const buildPath = fs.existsSync(cloudPath) ? cloudPath : localPath;
    
    // Set static folder
    app.use(express.static(buildPath));

    app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));
}

app.listen(PORT, "0.0.0.0", () => {
    
    console.log(`server started on port: ${PORT}`)
    
    // Connect DataBase
    connectDB();
});
