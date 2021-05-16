import React, { Component } from 'react';
import axios from 'axios'//axios是一种请求形式
import {  Button } from 'antd';//一个组件库
import '../../../../../node_modules/antd/dist/antd.css'
import './Login01.css'
import {throttle} from '../../throttleComponent/throotle'//做节流引用的组件
import cookie from 'react-cookies'//cookie保存数据引用的模块
// import  './logoin.css'
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email:"",//最终要登录邮箱号
            firstEmail:"",//获取验证码的邮箱号
            testcode:"",//验证码
            rescode:"1",//返回的验证码
            net :"http://localhost:",//局域网下的网址
            port:"3001",//后台的端口号
         }
         this.checkLogin  = this.checkLogin.bind(this);//判断用户所有信息已经填满
         this.checkEmail  = throttle(this.checkEmail);//验证邮箱是否是合法的
         this.changeValue = this.changeValue.bind(this);//改变input中的值
         this.eamilThrottle = this.eamilThrottle.bind(this);
        }
    changeValue(e){//改变每个input中的value
        let name = e.target.name;
         this.setState({     [name]:e.target.value});
    }
    eamilThrottle(e){
        e.preventDefault();
        this.checkEmail();
    }
    checkEmail = ()=>{
            // 1.判断邮箱是否是有效邮箱,对qq邮箱的验证
            let rg = new RegExp("^[1-9][0-9]{4,10}@qq.com");
            let judge = rg.test(this.state.email);
                if(judge){
                    this.setState({firstEmail:this.state.email});
                    let data = { 'mail'  :this.state.email};
                    axios.post(this.state.net+''+this.state.port+'/getMailCode',data)
                            .then( (response)=> {      //  这里如果使用普通函数，那么这个里边的this指向将不会是原先的this     
                                //1.这是将验证码发送到前台然后进行验证    
                                // resText = response.data.rescode;// 所以会出现问题：TypeError: Cannot read property 'setState' of undefined                       
                               // this.setState({ rescode:resText+"" }) 
                                //2.将验证码存储进数据库然后进行验证   
                                let err = response.data.err;
                                let resmsg = response.data.msg;
                                if(err === 0){//"验证码发送成功"
                                   let deleteTime = new Date(new Date().getTime()+60000); 
                                    cookie.save("sendCode",response.data.token,{expires:deleteTime},{path:"/"}) 
                                }
                                else if(err === -2){
                                    alert(resmsg);//err
                                }
                                else if(err === -1){//'验证码发送失败'
                                    alert(resmsg);
                                }  
                            })            
                            .catch(function (error) {
                                console.log(error);});
                }else{
                    alert("请检查邮箱格式是否正确");
                    return false;
                }
    }
    checkLogin(e){
        e.preventDefault(); //阻止默认值
        let state = this.state;
        let data ={ email:this.state.email,
                    testcode:this.state.testcode};
        // 1.验证邮箱是否与获取验证码之前的相同
        // 2.比较输入的验证码与发送的验证码是否相同
        // 从后台把验证码拿到前台然后和输入的验证码进行判断
        if((state.email === state.firstEmail)){//邮箱和验证码都正确且邮箱和获取验证码的邮箱一致
            let sendcode = cookie.load("sendCode")
            axios.post(this.state.net+''+this.state.port+ '/login',data, {headers: {"content-type":'application/json;charset=UTF-8',sendcode:sendcode}})
                .then( (response)=> {
                    let res = response.data.err;
                    let resmsg = response.data.msg;
                    if(res === -2){alert(resmsg);}//"验证码已过期，请重新获取"
                    else if(res === 2){alert(resmsg);}//"服务器错误，请再试一次"
                    else if(res === 0){//msg: '非新用户''用户首次登陆'
                        let deleteTime = new Date(new Date().getTime()+600000);//单位为毫秒
                        cookie.save("email",response.data.token,{expires:deleteTime},{path:"/"})
                        this.props.history.push({ pathname: '/Attend', state:this.state.email});
                    }
                    else if(res === -1){//"身份验证失败"
                        alert(resmsg);
                    }
                    else if(res === -3){//"验证码错误"
                        alert(resmsg);
                    }
                })
                .catch(function (error) {
                   alert(error);
                }); 
        }
        else{
            alert("请检查邮箱是否正确!!!");
            return false;
        }
    }
    render() { 
        return ( 
        <div className="rootSon">
            <div className="logo"></div>
            <div className="Positon">
            <h2>登录</h2>  
            <form onSubmit={this.checkLogin.bind(this)} >
                        <div>
                            <label htmlFor="account">邮箱号:</label>
                            <input  type="text" id="account"name="email" placeholder="请输入您的qq邮箱"  value={this.state.email} onChange = {this.changeValue}></input>
                        </div>
                        <div>
                            <label htmlFor="Password">验证码:</label>
                            <input type="text" id="Password" name="testcode" value = {this.state.testcode} onChange = {this.changeValue}></input>
                            <Button   onClick = {this.eamilThrottle}>获取验证码</Button>{/* 使用的antd中的组件 */}
                            
                        </div>
                        <div className="denglu">
                             <Button   htmlType="submit" type="primary" >登录</Button>
                        </div>
                    </form>
            </div>
        </div>);  }
}
export default Login;


