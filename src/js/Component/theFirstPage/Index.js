import React, {Component } from 'react'
import {Link} from 'react-router-dom'//路由跳转需要使用的组件
import  Slider from 'react-slick' // 页面中的滑动图
import ParticlesBg from "particles-bg"//页面背景所调用的动画库
import '../../../../node_modules/slick-carousel/slick/slick.css'// 页面中的滑动图的css样式
import "../../../../node_modules/slick-carousel/slick/slick-theme.css"// 页面中的滑动图的css样式
import '../theFirstPage/Index01.css'//该组件的样式
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            // 空
         }; 
    }
    render() { 
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
          }
        return (
            <div className="Index">
                <div className="Header"> {/* 头部信息 */}
                    <div className="container">
                        <div className="Left">智邮普创</div>
                        <div className="Right" > <Link to = "/Login"  >登录</Link></div>
                    </div>
                 </div>
                <ParticlesBg type="circle" bg={true} />{/* 设置背景 */}
                <div className="Content"> {/* 滑动图 */}
                    <div className="container">
                        <Slider {...settings}>
                            <div className="front"><h2>前端组</h2>前端开发是创建WEB页面或APP等前端界面呈现给用户的过程，通过HTML，CSS及JavaScript以及衍生出来的各种技术、框架、解决方案，来实现互联网产品的用户界面交互</div>
                            <div className="behind"><h2>后台组</h2>软件应用程序就像冰山一样。用户看到的只是应用程序的一部分——在大多数情况下——应用程序的最大部分是看不到的。这就是令人难以捉摸又神秘的“后端”。</div>
                            <div className="safety"><h2>安全运维组</h2>对学校机房环境涉及的网络、应用系统、终端、内容信息的安全进行管理，包括安全评估、安全保护、安全监控、安全响应及安全预警等。对IT基础设施进行监视、日常维护和维修保障。</div>
                            <div className="product"> <h2>产品组</h2>产品开发(Product Development)就是企业改进老产品或开发新产品，使其具有新的特征或用途,以满足顾客的需要。由于人们的需求经常变化和提高，企业只有不断改进产品,增加特色和功能,提高产品质量,改进外观包装装潢，才能适应消费者不断变化的需求。</div>
                        </Slider>
                    </div>
                </div>
                <div className="btn"> {/* 报名跳转按钮 */}
                    <div className="logo_btn" >
                        <Link to="/Login">欢迎加入我们&gt;&gt;&gt;</Link> 
                    </div>
                </div>           
                <div id="Footer"> {/* 底部信息 */}
                    <div className="container">
                        <div className="footer_inform">
                            <span>Copyright 2020 西安邮电大学信息中心 </span>
                            <span>All Rights Reserved</span>
                            <span>办公地点：长安校区图书馆5层</span>
                            <span>电话：029-88166125</span>
                            <span> E-mail：nic@xupt.edu.cn</span>
                        </div>
                    </div>
                </div>
            </div>
         );
    }                                                                                                                                                                                                                                                                       
} 
export default Index;