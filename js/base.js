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
    }, time || 10);
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
                height: window.innerHeight,
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
 */
function linear(obj, speed, target, fn) {
    clearInterval(obj.timer);
    var begin = obj.offsetLeft;
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

// DOM加载完毕后执行函数
function DOMready(fn) {
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


function Barrage(option) {
    this._init(option);
}

Barrage.prototype = {
    constructor: Barrage,
    _init: function (option) {
        for (var obj in option) {
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
