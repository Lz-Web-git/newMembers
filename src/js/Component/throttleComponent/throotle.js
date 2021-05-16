export const throttle = (fn)=>{
    let canrun = true;
    return function(){
        if(!canrun){
            return ;} 
        canrun = false;
        setTimeout(() => { 
            canrun = true;
        }, 60000);
        fn.apply(this);  
    }
}
// bug:验证码有效期该如何设置。
// 停一会才能进行登录