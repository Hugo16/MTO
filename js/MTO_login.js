"use strict";
DOMready(function(){
    /************* 样式设置 *************/

    function changeLoginLi(li,mode){
            if(!mode){
                li.className = "";
            }
            else
            {
                li.className = "login-list-li-focus";
            }
    }

    $(".login-name").onfocus = function(){
        changeLoginLi($(".login-list").getElementsByTagName("li")[0],1);
    };
    $(".login-name").onblur = function(){
        changeLoginLi($(".login-list").getElementsByTagName("li")[0],0)
    };
    $(".login-password").onfocus = function(){
        changeLoginLi($(".login-list").getElementsByTagName("li")[1],1);
    };
    $(".login-password").onblur = function(){
        changeLoginLi($(".login-list").getElementsByTagName("li")[1],0)
    };
    $(".register-password").onfocus = function(){
        changeLoginLi($(".register-list").getElementsByTagName("li")[0],1);
    };
    $(".register-password").onblur = function(){
        changeLoginLi($(".register-list").getElementsByTagName("li")[0],0)
    };
    $(".verify-code-input").onfocus = function(){
        $(".verify-code-input").className = "verify-code-input login-list-li-focus";
    };
    $(".verify-code-input").onblur = function(){
        $(".verify-code-input").className = "verify-code-input";
    };

    /************* 按钮事件 *************/


    // 打开登录界面
    $("#headerLoginBtn").onclick=function(){
        $(".login-content").style.display = "block";
        $(".register-list").style.display = "none";
        $(".auto-login-wrap").style.display = "flex";
        $(".login-wrap p").innerHTML = "账号密码登录";
        $(".login-btn").value = "登 录";
    };

    // 打开注册界面
    $("#headerRegisterBtn").onclick=function(){
        $(".login-content").style.display = "block";
        $(".register-list").style.display = "block";
        $(".auto-login-wrap").style.display = "none";
        $(".login-wrap p").innerHTML = "账号注册";
        $(".login-btn").value = "注 册";
    };

    // 关闭登录注册
    // 关闭按钮
    $(".login-box-close-btn").onclick = function(){
        $(".login-content").style.display = "none";
    };
    // 阻止登录盒子点击事件冒泡
    $(".login-box").onclick = function(event){
        let e = event || window.event;
        window.event? window.event.cancelBubble = true : e.stopPropagation();
    };
    // 点击蒙版关闭登录界面
    $(".login-content").onclick=function(){
        this.style.display = "none";
    };
});