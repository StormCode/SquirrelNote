const mongoose = require('mongoose');
require('dotenv').config();
const db = process.env.MONGOURI;

const connectDB = async () => {
    try{
        await mongoose.connect(db, 
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 10000 // 10秒連不上就報錯
            });

        console.log('MongoDB connected');
    }
    catch(err){
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
