const express = require('express')
const app = express()

app.all('*', function(req, res, next) {
  　　　     res.header("Access-Control-Allow-Origin", "*");
             res.header("Access-Control-Allow-Headers", "X-Requested-With");
             res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
             res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild,mycookie,sendcode');
             res.header("X-Powered-By",' 3.2.1');
             res.header("Content-Type", "application/json;charset=utf-8");
             next();
             });
app.get("/lizhi",(req,res)=>{
	res.send("你好啊")}
);
app.listen(3040, ()=> {
  console.log('server start')
})