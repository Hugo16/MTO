"use strict";
DOMready(function () {
    /**************************** 背景Canvas部分代码****************************/

        // 获取canvas
    let bgCanvas = $("#bg_canvas"),
        // 获取环境
        ctx = bgCanvas.getContext("2d"),
        // 设置背景渐变
        gra = ctx.createLinearGradient(20, 10, 0, client().height),
        // 存储音符的数组
        note = [],
        // 音符图片
        img = new Image;
    img.src = "source/note.png";
    // 设置音符数量和参数
    for (let i = 0; i < 100; i++) {
        // 随机一个放大倍数（0.3-1.2）
        let zoom = Math.random() * 0.9 + 0.3;
        // 随机一个透明度（0.5-1）
        let alpha = Math.random() * 0.5 + 0.5;
        // 为每一个音符准备属性
        note[i] = {
            // 图片
            img: img,
            // 裁剪的X轴位置（0||27）
            sx: (Math.random() > 0.5 ? 1 : 0) * 27,
            // 裁剪的Y轴位置（0||1||2 * 37）
            sy: parseInt(Math.random() * 3) * 37,
            // 裁剪图片的宽高
            swidth: 27,
            sheight: 32,
            // 图片在canvas中的X轴位置（浏览器可视区域宽度中随机）
            x: Math.random() * client().width,
            // 图片在canvas中的Y轴位置（浏览器可视区域高度*（1-1.5））
            y: (Math.random() * 0.5 + 1) * client().height,
            // 宽高按照之前的随机数 放大||缩小
            width: 27 * zoom,
            height: 37 * zoom,
            // 图片移动的速度
            speed: Math.random() * 2,
            // 透明度为之前的随机数
            alpha: alpha
        }
    }

    /**
     * @description 绘制音符函数
     */
    function drawNote() {
        for (let i = 0; i < note.length; i++) {
            // 拿到每一个音符准备好的属性
            let p = note[i];
            // 设置透明度
            ctx.globalAlpha = p.alpha;
            // 根据属性绘制每一个音符
            ctx.drawImage(p.img, p.sx, p.sy, p.swidth, p.sheight, p.x, p.y, p.width, p.height);
            // 修改音符的Y轴值（让音符往上走）
            p.y -= p.speed;
            // 修改透明度（逐渐透明）
            p.alpha -= 0.0025;
            // 如果音符移动到了浏览器顶端或者透明度为0
            if (p.y <= 0 || p.alpha <= 0) {
                // 重新随机音符的位置和透明度
                p.y = (Math.random() * 0.5 + 1) * client().height;
                p.x = Math.random() * client().width;
                p.alpha = Math.random() * 0.5 + 0.5;
            }
        }
    }

    /**
     * @description 绘制Canvas
     */
    function drawBgCanvas() {
        // 绘制背景
        // 设置透明度为1
        ctx.globalAlpha = 1;
        // 清除canvas
        ctx.clearRect(0, 0, client().width, client().height);
        // 设置渐变颜色
        gra.addColorStop(0, "#596164");
        gra.addColorStop(1, "#868f96");
        // 设置填充
        ctx.fillStyle = gra;
        // 填充canvas
        ctx.fillRect(0, 0, client().width, client().height);
        // 绘制音符
        drawNote();
    }

    /**************************** 事件 ****************************/

    // 浏览器窗口大小改变
    window.onresize = function () {
        // 重新设置canvas的大小
        bgCanvas.width = client().width;
        bgCanvas.height = client().height;
        // 绘制canvas
        drawBgCanvas();
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
            ease(main, {left: 450});
            // 设置50毫秒画一次canvas
            bgTimer = setInterval(drawBgCanvas, 50);
        }
    };
    main.onclick = function () {
        // 侧边内容减小
        ease($("#nav_content"), {width: 0, opacity: 0});
        // 背景出现
        ease($("#content_bg"), {opacity: 1});
        // 内容左移
        // ease(content, {left: 50});
        ease(main, {left: 0});
        // 背景canvas停止绘制
        clearInterval(bgTimer);
        bgTimer = null;
    };

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
    //     console.log(tempArr);
    //     console.log(barrageArr);
    //     console.log(tempArr.length);
    //     for (let i = 0; i < tempArr.length; i++) {
    //         let barrage = tempArr[i].render();
    //         barrage.node.className = "barrage";
    //         barrage.node.style.top = (i * 20) + "px";
    //         barrage.shoot();
    //     }
    // }, 2000);
});