import React from 'react';
import axios from 'axios';
import "./Attend01.css"
import cookie from 'react-cookies'
import ParticlesBg from "particles-bg"//背景组件库
import {  Button,Modal } from 'antd';
class Attend extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            "process":"等待一面",
            "major":"",//所选专业
            "name":"",//报名人名字
            "school_num":"",//学号
            "tel_num":"",//电话
            "direact":"web",//选择的方向，默认是前端方向
            "net" :" http://localhost:",//局域网的网址
            "port":"3001",//端口号
            "disabled":"",//用来锁定输入框，即报名成功之后将不能够修改信息
            "apply":""//用来判断是否已报名，若已经报名那么将不允许继续发送报名请求
         }
         this.changeValue = this.changeValue.bind(this);//绑定this
         this.subMit = this.subMit.bind(this);
    }
    changeValue(e){
        let name = e.target.name;
        this.setState({[name]:e.target.value});
    }
    componentDidMount(){
        let data = {
            email:this.props.location.state};
        let token = cookie.load("email");//获取cookie
        // 每个页面请求返回只能返回一次res.send()，不然会报错
        // 这个请求的作用:向数据库中搜索用户信息，若搜索到，那么渲染到页面上
            axios.post(this.state.net+''+this.state.port+ '/Attend',data,{headers:{"content-type":'application/json;charset=UTF-8',mycookie:token}})
                .then((response)=>{
                    let status = response.data.msg;
                    if(status === 1){//token未过期，且数据库有数据
                        let data = response.data.students[0];
                        this.setState({
                            "major":data.major,
                            "name":data.name,
                            "school_num":data.school_num,
                            "tel_num":data.tel_num,
                            "direact":data.direact,
                            "disabled":data.disabled,
                            "process":data.process,
                            "apply":1});
                    }
                    else if(status === -1){//token过期
                        alert('登录已过期，请重新登录');
                        this.props.history.push('/Login');
                    }
                    else if(status === 0){}//不进行任何操作3
            })
            .catch((err)=>{
                console.log(err);
            })
    }
    subMit(e){
        e.preventDefault();//阻止默认事件
        let token = cookie.load("email");//获取cookie
        let name,schoolnum,telnum; 
        let data ={
            "major":this.state.major,
            "name":this.state.name,
            "school_num":this.state.school_num,
            "tel_num":this.state.tel_num,
            "direact":this.state.direact,
            "email":this.props.location.state,
            "process":this.state.process};
        function ischina(str) {/* 姓名：校验是否中文名称组成 */
            var reg =  /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/; /*定义验证表达式*/
            return reg.test(str); /*进行验证*/
        }
        function isStudentNo(idStr) {/*学号：校验是否全由8位数字组成 */
            var reg = /^[0-9]{8}$/; /*定义验证表达式*/
            return reg.test(idStr); /*进行验证*/
        }  
        function isTelCode(str) { /*校验手机号格式 */
            var reg = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
            return reg.test(str);
        }
        name = ischina(this.state.name);
        schoolnum = isStudentNo(this.state.school_num);
        telnum = isTelCode(this.state.tel_num);
        if(!(name&&schoolnum&&telnum)){
            alert("请检查填写的信息是否正确！！！");
            return false;
        }
        else{
            if(this.state.apply !== 1){
                const confirm = Modal.confirm;
                    confirm({
                            title: "确认提交报名信息吗?确认后不可以修改呦",
                            onOk :()=>{
                                axios.post(this.state.net+''+this.state.port+ '/inDatabase',data,{headers:{"content-type":'application/json;charset=UTF-8',mycookie:token}})
                                .then((response)=>{
                                    console.log(response);
                                    let status = response.data.status;
                                    let resmsg = response.data.msg;
                                    if(status === "1"){
                                        alert(resmsg);
                                        this.props.history.push("/");
                                    }
                                    else if(status === 0){
                                        alert(resmsg);
                                    }
                                    else if(status === -1){
                                        alert(resmsg);
                                    }
                                    else{
                                        alert(resmsg);
                                        this.props.history.push('/Login');
                                    }})
                                .catch((error)=>{
                                            console.log(error);})
                                },
                                onCancel:() =>{                  
                                    // 取消就是没有发送请求，用户可以继续填写报名信息
                                }});  
            }
            else{
                alert("该邮箱已经绑定了一位用户,请使用未绑定用户的邮箱!!!");return false;}
        }   
    }
    render() { 
        return (  
            <div className = "Page"> 
                <div className = "process">
                    <span>当前面试进度</span>
                    <span><input type="text" value={this.state.process} disabled="true"></input></span>
                </div>
                <ParticlesBg type="circle" bg={true} />
                <div className = "stu_inform">
                    <h2>报名信息</h2>
                    <form onSubmit={this.subMit} className="attendForm">
                        <div><span><label htmlFor="major" className="align">专业班级：</label></span><span></span><input type="text" id="major" name="major" value={this.state.major} onChange={this.changeValue} disabled={this.state.disabled}></input></div>
                        <div><span><label htmlFor="name" className="align">姓名：</label></span><span><input type="text" id="name" name="name" value={this.state.name} onChange={this.changeValue}  disabled={this.state.disabled}></input></span></div>
                        <div><span><label htmlFor="school_num" className="align">学号：</label></span><span><input type="text" id="school_num" name="school_num" value={this.state.school_num} onChange={this.changeValue} disabled={this.state.disabled}></input></span></div>
                        <div><span><label htmlFor="tel_num" className="align">电话号码：</label></span><span><input type="text" id="tel_num" name="tel_num" value={this.state.tel_num} onChange={this.changeValue} disabled={this.state.disabled}></input ></span></div>
                        <div><span className="align">选择的方向：</span><span><select id="direaction" name="direact" value={this.state.direact} onChange={this.changeValue} disabled={this.state.disabled}>
                                <option  value="web">前端组</option>
                                <option  value="behind">后台组</option>
                                <option  value="security">安全运维组</option>
                                <option  value="product">产品组</option>
                            </select></span>
                        </div>
                        <div className="baoming"><Button htmlType="submit" type="primary" >立即报名</Button></div>
                    </form>
                </div>
            </div>
        );
    }
}
export default Attend;