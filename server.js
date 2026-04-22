const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express();
const fs = require('fs');

// 這是目前最有可能的三個路徑
const buildPaths = [
    path.join(__dirname, 'build'),           // Firebase 提拔後的位置
    path.join(__dirname, 'client', 'build'),  // 原本的位置
    path.join(__dirname, 'public_html')       // 備用位置
];

// 找出第一個包含 index.html 的路徑
const buildPath = buildPaths.find(p => {
    const exists = fs.existsSync(path.join(p, 'index.html'));
    console.log(`[Check] 測試路徑: ${p} -> ${exists ? '找到 index.html' : '沒找到'}`);
    return exists;
}) || buildPaths[0];

console.log(`[Deployment] 最終決定使用的靜態路徑: ${buildPath}`);

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

    app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));
}

app.listen(PORT, "0.0.0.0", () => {
    
    console.log(`server started on port: ${PORT}`)
    
    // Connect DataBase
    connectDB();
});
