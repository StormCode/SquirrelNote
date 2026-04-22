const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express();
const fs = require('fs');

const buildPath = path.join(__dirname, 'client', 'build');

console.log(`[Final Check] 正在檢查路徑: ${buildPath}`);
if (fs.existsSync(buildPath)) {
    console.log(`[Final Check] 內容有: ${fs.readdirSync(buildPath)}`);
} else {
    console.log(`[Final Check] 還是找不到！試試看列出 client 內容: ${fs.readdirSync(path.join(__dirname, 'client'))}`);
}

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
            // 最終 Debug：如果到這裡還失敗，直接列出 client/build 的內容
            let detail = "路徑不存在";
            try {
                const clientBuildContent = fs.readdirSync(path.join(__dirname, 'client', 'build'));
                detail = `資料夾存在，內容有: ${JSON.stringify(clientBuildContent)}`;
            } catch(e) {
                detail = `資料夾真的不存在，錯誤: ${e.message}`;
            }
            
            res.status(404).send(`
                <h3>最後的診斷</h3>
                <p>目標路徑: ${indexPath}</p>
                <p>狀態: ${detail}</p>
                <p>建議：檢查 client/.gitignore 是否忽略了 build 資料夾</p>
            `);
        }
    });
}

app.listen(PORT, "0.0.0.0", () => {
    
    console.log(`server started on port: ${PORT}`)
    
    // Connect DataBase
    connectDB();
});
