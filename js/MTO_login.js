"use strict";
new domReady(function () {
    /************* 基本变量 *************/

    let nameReg = /^[0-9A-z]{6,10}$/;
    let pwReg = /^([\w\S]){6,14}$/;
    let regResult = [true];

    /************* 样式设置 *************/

    function changeLoginLi(li, mode) {
        if (!mode) {
            li.className = "li-input";
            li.nextElementSibling.style.display = "none";
        }
        else {
            li.className = "li-input login-list-li-focus";
            li.nextElementSibling.style.display = "block";
        }
    }

    $(".login-name").onfocus = function () {
        changeLoginLi($(".login-list").getElementsByTagName("li")[0], 1);
    };
    $(".login-name").onblur = function () {
        changeLoginLi($(".login-list").getElementsByTagName("li")[0], 0);
        nameRegTest(nameReg, $("#login_name").value);
    };
    $(".login-password").onfocus = function () {
        changeLoginLi($(".login-list").getElementsByTagName("li")[2], 1);
    };
    $(".login-password").onblur = function () {
        changeLoginLi($(".login-list").getElementsByTagName("li")[2], 0);
        pwRegTest(pwReg, $("#login_password").value);
        rePwRegTest($("#register_password").value, $("#login_password").value);
    };
    $(".register-password").onfocus = function () {
        changeLoginLi($(".register-list").getElementsByTagName("li")[0], 1);
    };
    $(".register-password").onblur = function () {
        changeLoginLi($(".register-list").getElementsByTagName("li")[0], 0);
        rePwRegTest($("#register_password").value, $("#login_password").value);
    };
    $(".verify-code-input").onfocus = function () {
        $(".verify-code-input").className = "verify-code-input login-list-li-focus";
    };
    $(".verify-code-input").onblur = function () {
        $(".verify-code-input").className = "verify-code-input";
    };

    /************* 打开关闭事件 *************/


    // 打开登录界面
    $("#headerLoginBtn").onclick = function () {
        $(".login-content").style.display = "block";
        $(".register-list").style.display = "none";
        $(".auto-login-wrap").style.display = "flex";
        $(".login-wrap p").innerHTML = "账号密码登录";
        $(".login-btn").value = "登 录";
    };

    // 打开注册界面
    $("#headerRegisterBtn").onclick = function () {
        $(".login-content").style.display = "block";
        $(".register-list").style.display = "block";
        $(".auto-login-wrap").style.display = "none";
        $(".login-wrap p").innerHTML = "账号注册";
        $(".login-btn").value = "注 册";
    };

    // 关闭登录注册
    // 阻止登录盒子点击事件冒泡
    $(".login-box").onclick = function (event) {
        let e = event || window.event;
        window.event ? window.event.cancelBubble = true : e.stopPropagation();
    };
    // 关闭按钮
    $(".login-box-close-btn").onclick = function () {
        loginPanelClose();
    };
    // 点击蒙版关闭登录界面
    $(".login-content").onclick = function () {
        loginPanelClose();
    };

    // 关闭注册登录蒙版时清除数据
    function loginPanelClose() {
        $(".login-content").style.display = "none";
        $(".verify-result-name").className = "verify-result-name";
        $(".verify-result-pw").className = "verify-result-pw";
        $(".verify-result-rePw").className = "verify-result-rePw";
        $("#login_name").value = null;
        $("#login_password").value = null;
        $("#login_password").value = null;
        $("#register_password").value = null;
        $("#verify_code_input").value = null;
    }

    /************* 登录事件 *************/

    $("#login_btn").onclick = function () {
        RegisterAndLogin("注 册");
    };

    function RegisterAndLogin(type) {
        let userName = $("#login_name").value;
        let passWord = $("#login_password").value;
        let rePassWord = $("#register_password").value;

        if (type == "注 册") {
            nameRegTest(nameReg, userName, regResult);
            pwRegTest(pwReg, passWord, regResult);
            rePwRegTest(rePassWord, passWord, regResult);
            if (regResult[0]) {
                console.log(md5(passWord));

                POST({
                    url: "http://wucx.me/mto/signup.do",
                    obj: {
                        phone:"12412312311",
                        email:"1@1.com",
                        password:"!11111111",
                        captcha:"1111"
                    },
                    successCallBack: function (xhr) {
                        console.log(xhr.response);
                    }
                });
            }

        }
    }

    /**
     * @description 验证用户名
     * @param nameReg
     * @param userName
     * @param result
     */
    function nameRegTest(nameReg, userName, result) {
        if (!nameReg.test(userName)) {
            $(".verify-result-name").className = "verify-result-name verify-result-false";
            result ? (result[0] = false) : (result);
        }
        else {
            $(".verify-result-name").className = "verify-result-name verify-result-true";
        }
    }

    /**
     * @description 验证密码
     * @param pwReg
     * @param passWord
     * @param result
     */
    function pwRegTest(pwReg, passWord, result) {
        if (!(pwReg.test(passWord))) {
            $(".verify-result-pw").className = "verify-result-pw verify-result-false";
            result ? (result[0] = false) : (result);
        }
        else {
            $(".verify-result-pw").className = "verify-result-pw verify-result-true";
        }
    }

    /**
     * @description 验证重复密码
     * @param rePassWord
     * @param passWord
     * @param result
     */
    function rePwRegTest(rePassWord, passWord, result) {
        if (rePassWord != passWord) {
            $(".verify-result-rePw").className = "verify-result-rePw verify-result-false";
            result ? (result[0] = false) : (result);
        }
        else {
            $(".verify-result-rePw").className = "verify-result-rePw verify-result-true";
        }
    }
});