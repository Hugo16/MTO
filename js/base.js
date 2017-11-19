/**
 * @description 通过id获取元素
 * @returns {*} 获取的元素
 */
function $() {
    return document.querySelector.apply(document, arguments);
}

/**
 * 获取css属性值
 * @param obj 要获取的元素
 * @param attr 要获取哪个属性值
 * @returns {*} 返回获取好的属性值
 */
function getStyleAttr(obj, attr) {
    if (obj.currentStyle) { // IE 和 opera
        return obj.currentStyle[attr];
    } else {
        // w3c标准
        return window.getComputedStyle(obj, null)[attr];
    }
}

/**
 * @description 缓动动画函数
 * @param obj 要做动画的元素
 * @param json 要改变的属性
 * @param time 定时器时间
 * @param callback 动画结束后接下来要执行的函数
 */
function ease(obj, json, time, callback) {
    clearInterval(obj.timer);

    obj.timer = setInterval(function () {
        // 是否到达目标值的指示器
        let done = true;
        let begin = 0;
        let target = 0;

        for (let key in json) {
            // 1.获取初始值 和 目标值
            // 判断属性是不是透明值，如果是则乘以100（方便速度的取整）
            if (key == "opacity") {
                begin = parseInt(getStyleAttr(obj, key) * 100);
                begin = begin == 0 ? 0 : begin || 100;
                target = json[key] * 100;
            } else if (key == "scrollTop") {
                begin = obj.scrollTop;
                target = json[key];
            }
            else if (key == "transform") {
                obj.style.transform = json[key];
                continue;
            } else {
                begin = parseInt(getStyleAttr(obj, key)) || 0;
                target = json[key];
            }

            // 2.根据运动方向向上向下取整速度
            let speed = (target - begin) / 10;
            if (speed > 0) speed = Math.ceil(speed);
            else speed = Math.floor(speed);

            // 3.做缓动动画
            begin += speed;
            // 判断属性是不是透明值，如果是则除以100
            if (key == "opacity") {
                obj.style[key] = begin / 100;
                // 兼容IE浏览器
                obj.style.filter = 'alpha(opacity=' + begin + ')';
            }
            else if (key == "scrollTop") {
                obj.scrollTop = begin;
            }
            else if (key == 'zIndex') {
                // zIndex 不要渐变直接设置
                obj.style.zIndex = target;
            }
            else {
                obj.style[key] = begin + "px";
            }
//                console.log(key+"正在循环");
            // 判断是否到达目标值
            if (begin != target) {
                done = false;
                // console.log(key+"还没到目标！！！！");
            }
        }

        // 如果全部循环都到达目标值
        if (done) {
            clearInterval(obj.timer);

            // 调用函数
            if (callback) {
                callback();
            }
        }
    }, time || 16);
}

/**
 * @description 获取浏览器宽度
 * @returns {*} width：屏幕宽度 height：屏幕高度
 */
function client() {
    if (window.innerWidth || window.innerHeight) {
        client = function () {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }
    // 标准浏览器
    else if (document.compatMode == "CSS1Compat") {
        client = function () {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            }
        };
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    }
    // 怪异模式
    client = function () {
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        }
    };
    return {
        width: document.body.clientWidth,
        height: document.body.clientHeight
    }
}

/**
 * @description 匀速动画
 * @param obj
 * @param speed
 * @param target
 * @param fn
 */
function linear(obj, speed, target, fn) {
    clearInterval(obj.timer);
    let begin = obj.offsetLeft;
    if (begin > target) {
        speed = -speed;
    }
    obj.timer = setInterval(function () {
        begin = begin + speed;
        if (Math.abs(begin - target) <= Math.abs(speed)) {
            clearInterval(obj.timer);
            begin = target;
            if (fn) {
                fn();
            }
        }
        obj.style.left = begin + "px";
    }, 10);
}

/**
 * @description DOM加载完毕后执行函数
 * @param fn
 * @constructor
 */
function domReady(fn) {
    let wd = window.document;

    if (wd.addEventListener) {
        wd.addEventListener("DOMContentLoaded", fn);
    }
    // 兼容IE
    else {
        wd.attachEvent("onreadystatechange", function () {
            if (wd.readyState == "complete") {
                fn();
            }
        })
    }
}

/**
 * @description Ajax请求函数
 * @param option
 * @constructor
 */
function Ajax(option) {
    // 设置默认请求参数
    option.tyoe = option.type || "get";
    option.obj = option.obj || {};
    option.successCallBack = option.successCallBack || function () {
        console.log("请求成功！");
    };
    option.errorCallBack = option.errorCallBack || function () {
        console.log("请求失败！");
    };

    // 创建请求对象
    let xmlHttp;
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    else {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    // 设置请求路径
    let arrParam = [];
    for (let key in option.obj) {
        arrParam.push(key + "=" + option.obj[key]);
    }
    // 解决get请求在ie的缓存问题
    arrParam.push("time=" + Date.now());

    // 设置请求方法和路径
    let paramRes = arrParam.join("&");
    if (option.type == "get") {
        option.url = option.url + "?" + encodeURI(paramRes);
    }
    xmlHttp.open(option.type, option.url, true);

    // 发送请求
    if (option.type == "post") {
        // 设置请求报头
        xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // 发送请求
        xmlHttp.send(paramRes);
    }
    else {
        xmlHttp.send();
    }

    // 监听请求状态
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status >= 200 && xmlHttp.status < 300 || xmlHttp.status == 304) {
                clearTimeout(timer);
                option.successCallBack(xmlHttp);
            }
            else {
                option.errorCallBack(xmlHttp);
            }
        }
    };

    let timer = setTimeout(function () {
        xmlHttp.abort();
        alert("网络出了问题？");
    }, 1000);
}

/**
 * @description Ajax的get和post方法
 * @param option
 * @constructor
 */
function GET(option) {
    option.type = "get";
    new Ajax(option);
}

function POST(option) {
    option.type = "post";
    new Ajax(option);
}


/**
 * @description 创建随机音符
 * @param num 音符数量
 * @returns {Array}
 */
function createNote(num) {
    // 存储音符的数组
    let note = [],
        // 音符图片
        img = new Image();
    img.src = "source/note.png";
    // 设置音符数量和参数
    for (let i = 0; i < num; i++) {
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
    return note;
}


/**
 * @description 绘制音符函数
 */
function drawNote(ctx, note) {
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
 * @description 绘制Canvas背景
 */
function drawBgCanvas(ctx) {
    // 绘制背景
    // 设置背景渐变
    let gra = ctx.createLinearGradient(20, 10, 0, client().height);
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
}

function Barrage(option) {
    this._init(option);
}

Barrage.prototype = {
    constructor: Barrage,
    _init: function (option) {
        for (let obj in option) {
            this[obj] = option[obj];
        }
    },
    render: function () {
        let node = document.createElement("span");
        this.parentNode.appendChild(node);
        this.node = node;
        node.style.color = this.color;
        node.innerHTML = this.text;
        return this;
    },
    shoot: function () {
        let obj = this;
        linear(this.node, 1, -500, function () {
            obj.parentNode.removeChild(obj.node);
        });
    }
};
