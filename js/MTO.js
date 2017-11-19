"use strict";
new domReady(function () {
    /**************************** canvas背景部分变量 ****************************/
        // 获取canvas
    let bgCanvas = $("#bg_canvas"),
        // 获取环境
        ctx = bgCanvas.getContext("2d");

    let note = createNote(100);

    /**************************** canvas背景部分事件 ****************************/

    // 浏览器窗口大小改变
    window.onresize = function () {
        // 重新设置canvas的大小
        bgCanvas.width = client().width;
        bgCanvas.height = client().height;
        // 绘制背景
        drawBgCanvas(ctx);
    };
    window.onresize();

    /*
    侧边栏点击事件
     */
    let aside = $("#aside"),
        main = $("#main"),
        // 绘制背景canvas的计时器
        bgTimer = null;
    aside.onclick = function () {
        // 如果计时器不存在
        if (!bgTimer) {
            // 侧边内容变大
            ease($("#nav_content"), {width: 400, opacity: 1});
            // 背景消失
            ease($("#content_bg"), {opacity: 0});
            // 内容右移
            ease(main, {left: 450},16,function(){
                    // 设置50毫秒画一次canvas
                    bgTimer = setInterval(function () {
                        drawBgCanvas(ctx);
                        // 绘制音符
                        drawNote(ctx,note);
                    }, 50);
            });
        }
    };
    main.onclick = function () {
        // 背景canvas停止绘制
        clearInterval(bgTimer);
        bgTimer = null;
        // 侧边内容减小
        ease($("#nav_content"), {width: 0, opacity: 0});
        // 背景出现
        ease($("#content_bg"), {opacity: 1});
        ease(main, {left: 0},10);
    };

    /**************************** 聊天部分事件 ****************************/

    /*
    输入款限制字数
     */
    $("#cb_input").oninput = function () {
        let maxText = 30;
        if (this.value.length > maxText) this.value = this.value.slice(0, maxText);
    };


    /*
    输入款限制字数
     */
    let barrageArr = [];
    $(".cb-btn-sent").onclick = function () {
        let barrage = new Barrage({
            text: $("#cb_input").value.toString(),
            color: "white",
            parentNode: $("#lrc_box")
        });
        barrageArr.push(barrage);
    };

    // setInterval(function () {
    //     let tempArr = barrageArr.splice(0, barrageArr.length);
    //     for (let i = 0; i < tempArr.length; i++) {
    //         let barrage = tempArr[i].render();
    //         barrage.node.className = "barrage";
    //         barrage.node.style.top = (i * 20) + "px";
    //         barrage.shoot();
    //     }
    // }, 2000);
});