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

// Serve static assets in production
if(process.env.NODE_ENV === 'production'){
    // 定義三個可能的位置：搬移後的、原本的、還有根目錄
    const paths = [
      path.join(__dirname, 'dist_final'),
      path.join(__dirname, 'client', 'build'),
      path.join(__dirname, 'build')
    ];

    // 找到第一個存在的路徑
    const buildPath = paths.find(p => fs.existsSync(p)) || paths[0];

    console.log(`[Deployment] 選用的前端路徑: ${buildPath}`);
    if (!fs.existsSync(buildPath)) {
      console.error("❌ 致命錯誤：所有預期路徑都找不到前端檔案！");
    }
    
    // Set static folder
    app.use(express.static(buildPath));

    app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));
}

app.listen(PORT, "0.0.0.0", () => {
    
    console.log(`server started on port: ${PORT}`)
    
    // Connect DataBase
    connectDB();
});
