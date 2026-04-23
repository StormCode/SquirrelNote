const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express();
const fs = require('fs');

const buildPath = path.join(__dirname, 'client', 'build');

app.use(express.static(buildPath));

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

    app.get('*', (req, res) => {
        const indexPath = path.join(buildPath, 'index.html');
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            const files = fs.existsSync(buildPath) ? fs.readdirSync(buildPath) : "Directory Missing";
    
            res.status(200).send(`
                <h1>診斷模式</h1>
                <p>目前鎖定路徑: ${buildPath}</p>
                <p>該資料夾內容: ${JSON.stringify(files)}</p>
                <p>根目錄內容: ${JSON.stringify(fs.readdirSync(__dirname))}</p>
                <p><b>如果上面沒有 index.html，代表 React Build 沒跑完就斷了。</b></p>
            `);
        }
    });
}

app.listen(PORT, "0.0.0.0", () => {
    
    console.log(`server started on port: ${PORT}`)
    
    // Connect DataBase
    connectDB();
});
