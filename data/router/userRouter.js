const express = require('express')
const router = express.Router()
const User = require('../db/model/userModels.js') // 引入
const mailSend = require('../utils/mail')
const jwt = require('jsonwebtoken')
const url = require('url');
let codes = {} // 我们这个例子 验证码就放着内存中了。正常开发也可以放redis 或者 数据库内
/**
 * @api {post} /user/reg 用户注册
 * @apiName 用户注册
 * @apiGroup User
 *
 * @apiParam {String} us 用户名
 * @apiParam {String} ps 用户密码
 * @apiParam {String} code 邮箱验证码
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
// router.post('/lll',(req,res)=>{
//   res.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
//   res.send('hello');
// })
// router.post('/Login', (req, res) => {
//   // 获取数据
  
//   let { email} = req.body // server.js中没有解析传参工具的话 会报错
//   console.log(email);
    // 在客户端判断验证码是否正确
    // 判断验证码是否ok
    // if (!(codes[us] === Number(code))) { // 邮箱作为用户名
    //   return res.send({err: -4, msg: '验证码错误'})
    // }
    // User.find({email}).then((data) => {
    //   console.log(data.length);
    //   if (!data.length) {
    //     // 用户名不存在 可以注册
    //     console.log("1");
    //     // return User.insertMany({email:email}) // 注册成功 将数据写入数据库
    //     return User.insertMany({email:email})
    //   } else {
    //     res.send({err: -3, msg: '用户名已存在'})
    //   }
    // }).then(() => {
    //   res.send({ err: 0, msg: '注册成功'})
    // }).catch(err => {
    //   console.log(err);
    //   res.send({ err: -2, msg: '注册失败'})
    // })
  
//  else {
//     return res.send({err: -1, msg: '参数错误'})
//   }
  // 数据处理
  // 返回数据
  // res.send('test ok')
// })
/**
 * @api {post} /user/login 登录
 * @apiName 登录
 * @apiGroup User
 *
 * @apiParam {String} us 用户名
 * @apiParam {String} ps 用户密码
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
// 发送邮件验证码
/**
 * @api {post} /user/login 邮箱验证码发送
 * @apiName 邮箱验证码发送
 * @apiGroup User
 *
 * @apiParam {String} mail 邮箱
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
// 邮箱发送验证码验证
router.post('/getMailCode', (req, res) => {
  let { mail } = req.body;
  // mail肯定是能获取到值的，所有我们不需要else语句,从 原则上我们连if都用不到，
  // 但我为了结构看起来好一点，还是加上了
  if (mail) {
    let code = parseInt( (Math.random()+1)*1000 ); // 随机验证码
    codes[mail] = code;
    User.find({email:mail},(err,data)=>{//在数据库中查询email
      if(err){//查询时出现错误
        res.send({err:-2,msg:err});
      }
      if(data.length===0){
         User.insertMany({email:mail,testcode:code});
      }
      else{
        User.updateOne({email:mail},{$set:{testcode:code}},(err,res)=>{
        });
      }
      mailSend.send(mail, code)
        .then((data) => {
            //将成功之后的数据返回到请求处
            let token = jwt.sign({mail:mail}, "321456", {
              expiresIn: 60  // 过期时间
            });
            res.send({err:0,msg:"验证码发送成功",token:token});})
        .catch((err) => {
            res.send({err: -1, msg: '验证码发送失败'}) } )
    });
  }
})
router.post('/login', (req, res) => { 
  let sendcode = req.headers.sendcode;
  let {email,testcode} = req.body;
  if(sendcode !== 'undefined'){//判断cookie是否过期
    jwt.verify(sendcode,"321456",(err,data)=>{//这里的对比比较简单"321456"
      if(err){
        res.send({err:-1,msg:"身份验证失败"});
      }
      // 当发送其他请求时所要做的一个token认证
      // 生成token信息
      let content ={email:email}; // 要生成token的主题信息
      let token = jwt.sign(content, "12345", {
                            expiresIn: 60  });// 过期时间    
      User.find({ email:email },(err,data)=>{ 
                if(err){ res.send({err:2,msg:"服务器错误，请再试一次"});
                } 
                if(data[0].testcode == testcode){
                    if (data[0].name) {res.send({err: 0, msg: '非新用户',token:''+token})} 
                    else {res.send({err: 0, msg: '用户首次登陆',token:token})}}
                else{
                    res.send({err:-3,msg:"验证码错误"})
                }
      })                
    })
  }
  else{
    res.send({err:-2,msg:"验证码已过期，请重新获取"});
  }
})
// 存储数据库进行验证
router.post('/inDatabase',(req,res)=>{
  let reqcookie = req.headers.mycookie;
  if(( reqcookie) !== 'undefined'){
      jwt.verify(reqcookie,"12345",(error,data)=>{
        if(error)  res.send({status:-1,msg:"身份验证失败"});
        else{
            let{email,name,major,school_num,tel_num,direact,process} = req.body;
              User.findOne({email:email},(err,docs)=>{//避免重复报名
                console.log(docs);
                 if(docs.name){//如果进去了那么就说明没有将用户的信息存储进数据库
                  res.send({status:0,msg:"该邮箱已经绑定了一位用户,请使用未绑定用户的邮箱!!!"});
                }
              else{
                // $set在找到数据库中的某条信息后，在该信息的基础上修改信息，不是删掉原信息创建新信息
                User.updateOne({email:email},{$set:{
                                  major:major,
                                  name:name,
                                  school_num:school_num,
                                  tel_num:tel_num,
                                  direact:direact,
                                  disabled:"disabled",
                                  process:process
                            }},(err,res)=>{
                            });
                  res.send({status:1,msg:"报名成功!!!"}); 
                }
            })
          } 
      })
    }
    else{
        res.send({status:-1,msg:"登录已过期，请重新登录"});
      }
})
// 是否已经完成报名
router.post('/Attend',(req,res)=>{
  let reqcookie = req.headers.mycookie;
  if(( reqcookie) != 'undefined'){
      jwt.verify(reqcookie,"12345",(error,data)=>{
        if(error)console.log(error);
        else{
          User.find({email:data.email},(err,data)=>{
            if((data[0].name)){ //如果为undefined，说明用户为新用户，还未进行报名
              return res.send({msg:1,students:data}); 
            }
           return res.send({msg:0});
          })
        }}
  );
  }
  else{
     res.send({status:-1,msg:"登录已过期，请重新登录"});
  }
})
// 管理员页面验证
router.get('/admin',(req,res)=>{
  User.find((err,data)=>{
    if(err){return false;}
    res.setHeader("Content-Type","text/html");//如果没有这一句话，那么将不会渲染成html页面
    res.render('adminPage.html',{
     data:data
   });//模板渲染引擎
  })
})
// 管理员修改信息页面
router.get('/modify',(req,res)=>{
  let urlObj = url.parse(req.url,true);
  let param = urlObj.query;
  let email = param.email;
  User.findOne({email:email},(err,data)=>{
    if(err){
      return false;
    }
    res.setHeader("Content-Type","text/html");//如果没有这一句话，那么将不会渲染成html页面
    res.render('modifyPage.html',{
      data:data
    });//模板渲染引擎
  })
})
router.post('/modifymsg',(req,res)=>{
  console.log(req.body);
  let{email,name,major,school_num,tel_num,direact,process} = req.body;
  User.updateOne({email:email},{name:name,major:major,school_num:school_num,tel_num:tel_num,direact:direact,process:process},(err,red)=>{
    if(err){ return false;}
    res.redirect('/admin');//重定向跳转
  });
})
module.exports = router;