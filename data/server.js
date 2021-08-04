const express = require('express')
const app = express()
const db = require('./db/connect.js') // 链接数据库
var bodyParser = require('body-parser')
app.engine('html',require('express-art-template'))//解析html
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) // 这三行为解析接口传参
// 引入路由
const userRouter = require('./router/userRouter.js')

app.all('*', function(req, res, next) {
  　　　     res.header("Access-Control-Allow-Origin", "*");
             res.header("Access-Control-Allow-Headers", "X-Requested-With");
             res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
             res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild,mycookie,sendcode');
             res.header("X-Powered-By",' 3.2.1');
             res.header("Content-Type", "application/json;charset=utf-8");
             next();
             });
app.use('/', userRouter)

app.listen(3040, ()=> {
  console.log('server start')
})