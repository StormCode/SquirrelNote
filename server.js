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
    // 根據 outputDirectory 的行為，路徑可能是這兩個其中之一
    const path1 = path.join(__dirname, 'client', 'build');
    const path2 = path.join(__dirname, 'build'); // Firebase 有時會提拔到根目錄
    
    const buildPath = fs.existsSync(path1) ? path1 : path2;
    
    // Set static folder
    app.use(express.static(buildPath));
    

    // 在 server.js 裡加入這段，直接在網頁上看答案
    app.get('/debug-path', (req, res) => {
        res.json({
            __dirname,
            buildPath, // 看看路徑對不對
            exists: fs.existsSync(buildPath),
            contents: fs.existsSync(buildPath) ? fs.readdirSync(buildPath) : 'Still not found',
            clientFolder: fs.readdirSync(path.join(__dirname, 'client')) // 看看 client 裡面到底有什麼
        });
    });

    app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));
}

app.listen(PORT, "0.0.0.0", () => {
    
    console.log(`server started on port: ${PORT}`)
    
    // Connect DataBase
    connectDB();
});
