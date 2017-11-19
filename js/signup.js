"use strict";
new domReady(function () {
    /**************************** canvas背景部分事件 ****************************/
    (function () {
        // 获取canvas
        let bgCanvas = $("#bg_canvas"),
            // 获取环境
            ctx = bgCanvas.getContext("2d");

        let note = createNote(100);

        // 浏览器窗口大小改变
        window.onresize = function () {
            // 重新设置canvas的大小
            bgCanvas.width = client().width;
            bgCanvas.height = client().height;
            // 绘制背景
            drawBgCanvas(ctx);
        };
        window.onresize();


        setInterval(function () {
            // 绘制背景
            drawBgCanvas(ctx);
            // 绘制音符
            drawNote(ctx, note);
        }, 50);
    })();

    /**************************** 注册部分事件 ****************************/

    (function () {
        // 提示文字
        let tipText = [
            "输入正确的手机格式\n11位",
            "6到14位字母、数字、不包含空格的符号",
            "与上面的密码要相同",
            "输入正确的email地址"
        ];
        // 验证输入
        let testInput = [
            function () {
                return /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0-2,5-9])|(177))\d{8}$/.test($("#phone").value);
            },
            function () {
                return /^([\w\S]){6,14}$/.test($("#password").value);
            },
            function () {
                return $("#password").value == $("#rePassword").value;
            },
            function () {
                return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($("#email").value)
            }
        ];


        let tipTop = $(".tip-box").offsetTop;
        let liHeight = $("#password").parentNode.offsetTop - $("#phone").parentNode.offsetTop;
        $(".main-center").onclick = function (event) {
            let e = event || window.event;
            if (e.target.dataset.index) {
                $(".tip-wrap").style.color = "white";
                testInputFn(e);
                ease($(".tip-box"), {
                    top: tipTop + liHeight * e.target.dataset.index,
                    opacity: 1
                }, 10);
                $(".tip-wrap").innerHTML = tipText[e.target.dataset.index];
            }
            else {
                $(".tip-box").style.opacity = "0";
            }
        };

        $(".main-center").oninput = function(event){
            let e = event || window.event;
            if (e.target.dataset.index) {
                testInputFn(e);
            }
        };

        function testInputFn(e){
            if(testInput[e.target.dataset.index]()){
                e.target.style.borderColor = $(".tip-wrap").style.color = "#4ee51e";
            }
            else{
                e.target.style.borderColor = $(".tip-wrap").style.color = "#e54244";
            }
            if(e.target.dataset.index == 1){
                if(testInput[2]()){
                    $("#rePassword").style.borderColor = $(".tip-wrap").style.color = "#4ee51e";
                }
                else{
                    $("#rePassword").style.borderColor = $(".tip-wrap").style.color = "#e54244";
                }
            }
        }
    })();
});