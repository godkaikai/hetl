function AjaxRequest(url, data, callback) {
    this.url = url;
    this.data = data;
    this.callback = callback;
    this._async = false;
    this.contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
}

AjaxRequest.prototype.async = function () {
    this._async = true;
    return this;
};

AjaxRequest.prototype.json = function () {
    this.contentType = 'application/json;charset=UTF-8';
    if (typeof this.data != 'string') {
        this.data = JSON.stringify(this.data);
    }
    return this;
};

AjaxRequest.prototype.execute = function () {
    var result = null;
    var callback = this.callback;
    if (this._async) {
        $.ajax({
            type: 'post',
            async: true,
            url: this.url,
            data: this.data,
            dataType: 'json',
            contentType: this.contentType,
            success: function (data) {
                if (!data.success) {
                    layer.alert(data.errorMsg);
                } else {
                    result = data.data;
                    if (callback) {
                        callback(result);
                    }
                }
            },
            error: function (XMLHttpRequest) {
                layer.alert(XMLHttpRequest.responseText);
            }
        });
    } else {
        $.ajax({
            type: 'post',
            async: false,
            url: this.url,
            data: this.data,
            dataType: 'json',
            contentType: this.contentType,
            success: function (data) {
                if (!data.success) {
                    layer.alert(data.errorMsg);
                } else {
                    result = data.data;
                    if (callback) {
                        callback(result);
                    }
                }
            },
            error: function (XMLHttpRequest) {
                layer.alert(XMLHttpRequest.responseText);
            }
        });
        return result;
    }
};


function AjaxForm(dom, url, data, callback) {
    this.dom = dom;
    this.url = url;
    this.data = data;
    this.callback = callback;
}

AjaxForm.prototype.execute = function () {
    var result = false;
    var callback = this.callback;
    $(this.dom).ajaxForm({
        type: 'post',
        url: this.url,
        data: this.data,
        dataType: 'json',
        success: function (data) {
            if (!data.success) {
                layer.alert(data.errorMsg);
            } else {
                result = data.data;
                if (callback) {
                    callback(result);
                }
            }
        },
        error: function (XMLHttpRequest) {
            layer.alert(XMLHttpRequest.responseText);
        }
    });
};

function formCallback(data) {
    if (!data) {
        return false;
    }
    layer.confirm(data, function (index) {
        layer.close(index);
        var index = parent.layer.getFrameIndex(window.name);
        if (parent.$('#layer_refresh').length > 0) {
            parent.$('#layer_refresh').val('true');
        }
        parent.layer.close(index);
    });
}

$(function () {
    var required = '<span style="color:#FF4500;padding: 5px;font-size: 10px;">*</span>';
    $('.required').prepend(required);
});

if (!typeof($.fn.editable) == 'undefined') {
    $.fn.editable.defaults.mode = 'inline';
}

//编译url,拼接__uid
function compileUrl(url) {
    var __uid = getQueryString('__uid');
    if (!__uid) {
        return url;
    }

    var separator;
    if (url.indexOf('?') != -1) {
        separator = '&';
    } else {
        separator = '?';
    }

    return url + separator + '__uid=' + __uid;
}

// 获取当前url中的参数
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }

    return null;
}
//判断浏览器
function myBrowser() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    if (!(userAgent.indexOf("Chrome") != -1)) {
        alert("请使用谷歌Chrome浏览器打开页面");
    }
}
$(function () {
    //myBrowser();
})
//处理ajax重定向
$(function () {
    $(document).ajaxComplete(function (event, xhr, settings) {
        var redirect = xhr.getResponseHeader("redirect");
        var redirectUrl = xhr.getResponseHeader("redirectUrl");

        if (redirect && redirectUrl) {
            var win = window;
            while (win != win.top) {
                win = win.top;
            }
            win.location.href = redirectUrl;
        }
    })
});

var curWwwPath = window.location.href;
var pos = window.location.pathname;
var localhostPaht = curWwwPath.replace(pos, '');

/**
 * 数字格式化
 * [number_format 参数说明：]
 * @param  {[type]} number        [number：要格式化的数字]
 * @param  {[type]} decimals      [decimals：保留几位小数]
 * @param  {[type]} roundtag      [roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入]
 * @return {[type]}               [description]
 *
 */
function number_format(number, decimals, roundtag) {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    roundtag = roundtag || "ceil"; //"ceil","floor","round"
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = ',',
        dec = '.',
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k;
        };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

/**
 * 元素滚动
 * @param selecter
 * gyq
 */
function scroll(selecter) {
    $(selecter).niceScroll({
        cursorwidth: 6,
        cursoropacitymin: 0.1,
        cursorcolor: '#999',
        cursorborder: 'none',
        cursorborderradius: 4,
        autohidemode: 'leave',
        cursorborder: "1px solid #fff", // CSS方式定义滚动条边框
        cursorborderradius: "5px", // 滚动条圆角（像素）
        zindex: "auto", // 改变滚动条的DIV的z-index值
        scrollspeed: 40, // 滚动速度
        mousescrollstep: 60, // 鼠标滚轮的滚动速度 (像素)
        touchbehavior: true, // 激活拖拽滚动
        hwacceleration: true, // 激活硬件加速
        boxzoom: false, // 激活放大box的内容
        dblclickzoom: true, // (仅当 boxzoom=true时有效)双击box时放大
        gesturezoom: true, // (仅 boxzoom=true 和触屏设备时有效) 激活变焦当out/in（两个手指外张或收缩）
        grabcursorenabled: true, // (仅当 touchbehavior=true) 显示“抓住”图标display "grab" icon
        autohidemode: true, // 隐藏滚动条的方式, 可用的值:
    });
}


/**
 * 控制进度条
 * @param id
 * @param width
 * @param number
 * gyq
 */
function moveProgress(id, width, number) {
    $('#' + id).children('.progress').children('.progress-bar').css('width', width);
    $('#' + id).children('.progress-text').html(width);
    $('#' + id).children('.progress').children('.progress-bar').html(number);
}

// 在新窗口打开切入点
function openPointInNewWindow(opts) {
    var settings = {
        context: '/',
        point_name: '',
        point_para: {},
    };
    settings = $.extend({}, settings, opts);

    var url;
    if (settings.context.lastIndexOf('/') == (settings.context.length - 1)) {
        url = compileUrl(settings.context + 'genPointToken');
    } else {
        url = compileUrl(settings.context + '/genPointToken');
    }
    var data = {
        point_name: settings.point_name,
        point_para: settings.point_para
    };

    $.ajax({
        type: 'post',
        async: false,
        url: url,
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        success: function (data) {
            if (!data.success) {
                layer.alert(data.errorMsg, {
                    shade: 0
                });
            } else {
                window.open(data.data.page_url);
            }
        },
        error: function (XMLHttpRequest) {
            layer.alert(XMLHttpRequest.responseText, {
                shade: 0
            });
        }
    });
}
//回车切换input
$(function () {
    $('input:text:first').focus();
    var $inp = $('input:text');
    $inp.bind('keydown', function (e) {
        var key = e.which;
        if (key == 13) {
            e.preventDefault();
            var nxtIdx = $inp.index(this) + 1;
            $(":input:text:eq(" + nxtIdx + ")").focus();
        }
    });
});

/**
 * 时间格式化
 * @param fmt
 * @param date
 * @returns {*}
 * @constructor
 * gyq
 */
function DateFormmater(fmt, date) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * adminLTE左侧菜单选中状态
 * myj
 */
window.onload=function() {
    $(".treeview-menu>.treeview>a").click(function() {
        var index = $(this).index();
        $(".curriframe").removeClass("curriframe");
        $(this).addClass("curriframe");
    });
};