const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express();
const fs = require('fs');

// 偵測兩個可能的位置：
// 1. 原本的位置
// 2. 被 Firebase 提拔到根目錄後的位置
const paths = [
    path.join(__dirname, 'client', 'build'),
    path.join(__dirname, 'build')
];

const buildPath = paths.find(p => fs.existsSync(path.join(p, 'index.html'))) || paths[0];

console.log(`[System] 最終鎖定靜態路徑: ${buildPath}`);

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

// Serve static assets in production
if(process.env.NODE_ENV === 'production'){
    // Set static folder
    app.use(express.static(buildPath));

    app.get('*', (req, res) => {
        const indexPath = path.join(buildPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            const currentFiles = fs.readdirSync(__dirname);
            res.status(404).send(`
                <h3>環境診斷中...</h3>
                <p>嘗試路徑: ${indexPath}</p>
                <p>根目錄內容: ${JSON.stringify(currentFiles)}</p>
                <p>請檢查 Build Logs 是否有成功產出檔案。</p>
            `);
        }
    });
}

app.listen(PORT, "0.0.0.0", () => {
    
    console.log(`server started on port: ${PORT}`)
    
    // Connect DataBase
    connectDB();
});
