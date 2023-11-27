const express = require('express');
const dbConnect = require('./src/config/dbConnect');
const dotenv = require('dotenv');

dotenv.config();
const pORT = process.env.PORT || 5001

const app = express();
app.use(express.json()) // data client gửi lên đọc theo kiểu json
app.use(express.urlencoded({extended : true})) // data client gửi lên đọc theo kiểu urlencoded (array...)
dbConnect();

app.listen(pORT, () => {
    console.log("Server is listenning on http://localhost:" + pORT);
})


