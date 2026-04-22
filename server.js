const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express();
const fs = require('fs');

// 鎖定我們強行建立的資料夾
const buildPath = path.join(__dirname, 'web_dist');

console.log(`[Deployment] 最終鎖定路徑: ${buildPath}`);

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
            // 萬一還是失敗，直接列出 web_dist 裡面到底有什麼
            let folderStatus = "資料夾不存在";
            try {
                if (fs.existsSync(buildPath)) {
                    folderStatus = `內容: ${JSON.stringify(fs.readdirSync(buildPath))}`;
                }
            } catch (e) {
                folderStatus = `錯誤: ${e.message}`;
            }
    
            res.status(404).send(`
                <h3>最後的防線失敗</h3>
                <p>嘗試路徑: ${indexPath}</p>
                <p>web_dist 狀態: ${folderStatus}</p>
                <p>根目錄內容: ${JSON.stringify(fs.readdirSync(__dirname))}</p>
            `);
        }
    });
}

app.listen(PORT, "0.0.0.0", () => {
    
    console.log(`server started on port: ${PORT}`)
    
    // Connect DataBase
    connectDB();
});
