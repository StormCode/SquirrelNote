const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const app = express();
const fs = require('fs');
// 遍歷所有可能被「留下來」的地方
const possibleLocations = [
  path.join(__dirname, 'public_html'),
  path.join(__dirname, 'client', 'build'),
  path.join(__dirname, 'public'),
  path.join(__dirname, 'dist')
];

const buildPath = possibleLocations.find(p => {
  const hasIndex = fs.existsSync(path.join(p, 'index.html'));
  console.log(`[Scanning] ${p} : ${hasIndex ? 'FOUND' : 'NOT FOUND'}`);
  return hasIndex;
}) || possibleLocations[0];

// Set static folder
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
            const diagnostic = possibleLocations.reduce((acc, p) => {
              acc[p] = fs.existsSync(p) ? fs.readdirSync(p) : "does not exist";
              return acc;
            }, {});
            
            res.status(404).json({
              error: "找不到前端產物",
              diagnostic,
              root: fs.readdirSync(__dirname)
            });
        }
    });
}

app.listen(PORT, "0.0.0.0", () => {
    
    console.log(`server started on port: ${PORT}`)
    
    // Connect DataBase
    connectDB();
});
