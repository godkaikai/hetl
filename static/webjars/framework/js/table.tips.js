/*!
 * table.tips.js Version:1.5
 * @author:wenmo
 * @email:809097465@qq.com
 * @requires:jquery,layer,bootstrop.table
 */

/*!
* 更新日志
* 1.点击和滑动实现tips显示溢出文本。
* 2.实现class控制style以及插件调用机制。
* 3.扩展插件的监听状态，解决表内容更新时失效的bug；更改代码逻辑，解决无限绑定的bug。TableTips监听表引起数据刷新的事件，TableTipsAll监听表所有的事件。增加自定义样式参数。
* 4.代码逻辑更新，取消之前的预加载模式，使用实时加载的模式以提高表格加载和刷新速度。
* 5.新增根据列序号自定义某些列是否显示或不显示。onTableTips([4，5])即表第五六列显示，offTableTips([4])即表第五列不显示;
* 6.更新判断逻辑，使得插件可以适配select2的使用，避免bug发生。
*/

/*!
 * 参数：
 * type: 触发tips出现的方式，0为滑入，1为点击，默认0；
 * maxWidth: tips的单行最大文字长度，默认为当前td的1.5倍长度；
 * time: tips的持续时间，默认为0ms，即不消失；
 * classobject: tips的样式接口，可自定义样式名与内容。
 * onarr: 指定哪些列的tips显示。
 * offarr: 指定哪些列的tips不显示。
 *
 * 调用方式：
 * table表添加class属性table-tips启用插件，table-tips-green指定样式。
 * 若自定义table.tips参数，需要在js中设置TableTips(type, maxWidth, time, classobject)，其位置任意，无需放在数据加载之后。.
 * 如果页面首次运行时table.tips无反应，数据刷新时才有效果，原因是脚本监听器未监听到页面table数据加载，需要手动在页面JavaScript中初始化插件，即TableTips()。
 * 如果需要设置某列不显示tips，可以直接在页面JavaScript中调用offTableTips([4])，即表第五列不显示tips。
 */
function initTableTips(type, maxWidth, time, classobject, onarr, offarr) {
    var style,
        type = typeof type == "undefined" || type == null ? 0 : type,
        time = typeof time == "undefined" || time == null ? 0 : time,
        maxWidth = typeof maxWidth == "undefined" || maxWidth == null ? 0 : maxWidth,
        classobject = typeof classobject == "undefined" || classobject == null ? [
            {
                'classname': 'table-tips-green',
                'classcode':
                    {
                        'color': '#ffffff',
                        'background': '#0b9284'
                    }
            }, {
                'classname': 'table-tips-default',
                'classcode':
                    {
                        'color': '#000',
                        'background': '#ffffff'
                    }
            }
        ] : classobject;
    $('.table-tips').each(function () {
        for (var i in classobject) {
            if ($(this).hasClass(classobject[i].classname)) {
                style = classobject[i].classcode;
                break;
            } else {
                style = {'color': '#000', 'background': '#ffffff'};
            }
        }
        /*用于修正某系统空表bug，属于代码编写的规范问题，其他系统可注释掉该段代码。*/
        if ($(this).find('.no-records-found').length > 0) {
            $(this).addClass('table-tips-empty');
        } else {
            $(this).removeClass('table-tips-empty');
        }
        /*--end--*/
        $(this).find('tr').each(function () {
            $(this).find('th,td').each(
                function (index) {
                    if (typeof onarr != 'undefined' && onarr != null && onarr.length > 0 && onarr.indexOf(index) == -1) {
                        return;
                    }
                    if (typeof offarr != 'undefined' && offarr != null && offarr.length > 0 && offarr.indexOf(index) > -1) {
                        return;
                    }
                    $(this).off('.tips');
                    if (type == 1) {
                        $(this).on('click.tips', function () {
                            if (!$(this).hasClass('td-tips')) {
                                var text = $(this).text(),
                                    td_width = $(this).width(),
                                    font_size = $(this).css('font-size'),
                                    font_family = $(this).css('font-family'),
                                    text_width = textSize(font_size, font_family, text).width;
                                if (text_width > td_width) {
                                    $(this).addClass('td-tips');
                                }
                            }
                            if ($(this).hasClass('td-tips')&&$(this).find('.select2').length==0) {
                                var that = this,
                                    tips_index,
                                    maxWidth = maxWidth == 0 ? (td_width * 1.5) : maxWidth;
                                tips_index = layer.tips('<span style="color:' + style.color + ';word-break: break-all;" >' + $(this).text() + '</span>', that, {
                                    tips: [3, style.background],
                                    time: time,
                                    maxWidth: maxWidth
                                });
                                $(document).unbind('close.tips');
                                $(document).bind('close.tips', function (e) {
                                    if ($(e.target).closest('.layui-layer-tips').length == 0 && $(e.target).closest('.td-tips').length == 0) {
                                        layer.close(tips_index);
                                        $(document).unbind('close.tips');
                                    }
                                });
                                $(document).click(function (e) {
                                    if ($(e.target).closest('.layui-layer-tips').length == 0 && $(e.target).closest('.td-tips').length == 0) {
                                        $(this).trigger("close.tips");
                                    }
                                })
                            }
                        })
                    } else {
                        $(this).on('mouseover.tips', function () {
                            if (!$(this).hasClass('td-tips')) {
                                var text = $(this).text(),
                                    td_width = $(this).width(),
                                    font_size = $(this).css('font-size'),
                                    font_family = $(this).css('font-family'),
                                    text_width = textSize(font_size, font_family, text).width;
                                if (text_width > td_width) {
                                    $(this).addClass('td-tips');
                                }
                            }
                            if ($(this).hasClass('td-tips')&&$(this).find('.select2').length==0) {
                                var that = this,
                                    tips_index,
                                    maxWidth = maxWidth == 0 ? (td_width * 1.5) : maxWidth;
                                tips_index = layer.tips('<span style="color:' + style.color + ';word-break: break-all;" >' + $(this).text() + '</span>', that, {
                                    tips: [3, style.background],
                                    time: time,
                                    maxWidth: maxWidth,
                                    success: function (layero, index) {
                                        var top = layero.css('top'),
                                            i_top = layero.find('i').css('top'),
                                            i_bottom = layero.find('i').css('bottom');
                                        if (i_top == '-8px') {
                                            layero.css('top', (parseInt(top) - 12) + 'px');
                                        } else if (i_bottom == '-8px') {
                                            layero.css('top', (parseInt(top) + 12) + 'px');
                                        }
                                        layero.hover(function () {
                                        }, function () {
                                            layer.close(tips_index);
                                        });
                                    }
                                });
                                $(document).unbind('close.tips');
                                $(document).bind('close.tips', function (e) {
                                    if ($(e.target).closest('.layui-layer-tips').length == 0 && $(e.target).closest('.td-tips').length == 0) {
                                        layer.close(tips_index);
                                        $(document).unbind('close.tips');
                                    }
                                });
                                $(document).click(function (e) {
                                    if ($(e.target).closest('.layui-layer-tips').length == 0 && $(e.target).closest('.td-tips').length == 0) {
                                        $(this).trigger("close.tips");
                                    }
                                })
                            }
                        })
                    }
                });
        })
    })
}

function onTableTips(arr) {
    TableTips(null, null, null, null, arr, null);
    initTableTips(null, null, null, null, arr, null);
}

function offTableTips(arr) {
    TableTips(null, null, null, null, null, arr);
    initTableTips(null, null, null, null, null, arr);
}

function textSize(fontSize, fontFamily, text) {
    var span = document.createElement("span");
    var result = {};
    result.width = span.offsetWidth;
    result.height = span.offsetHeight;
    span.style.visibility = "hidden";
    span.style.fontSize = fontSize;
    span.style.fontFamily = fontFamily;
    span.style.display = "inline-block";
    document.body.appendChild(span);
    if (typeof span.textContent != "undefined") {
        span.textContent = text;
    } else {
        span.innerText = text;
    }
    result.width = parseFloat(window.getComputedStyle(span).width) - result.width;
    result.height = parseFloat(window.getComputedStyle(span).height) - result.height;
    document.body.removeChild(span);
    return result;
}

TableTipsSign = 0;

function TableTips(type, maxWidth, time, classobject, onarr, offarr) {
    loadCssCode();
    $('body').on('load-success.bs.table', '.table-tips', function () {
        initTableTips(type, maxWidth, time, classobject, onarr, offarr);
    })
    $('body').on('sort.bs.table', '.table-tips', function () {
        initTableTips(type, maxWidth, time, classobject, onarr, offarr);
    })
    $('body').on('column-search.bs.table', '.table-tips', function () {
        initTableTips(type, maxWidth, time, classobject, onarr, offarr);
    })
    $('body').on('search.bs.table', '.table-tips', function () {
        initTableTips(type, maxWidth, time, classobject, onarr, offarr);
    })
    $('body').on('toggle.bs.table', '.table-tips', function () {
        initTableTips(type, maxWidth, time, classobject, onarr, offarr);
    })
    $('body').on('collapse-row.bs.table', '.table-tips', function () {
        initTableTips(type, maxWidth, time, classobject, onarr, offarr);
    })
    $('body').on('refresh-options.bs.table', '.table-tips', function () {
        initTableTips(type, maxWidth, time, classobject, onarr, offarr);
    })
    $('body').on('reset-view.bs.table', '.table-tips', function () {
        initTableTips(type, maxWidth, time, classobject, onarr, offarr);
    })
    $('body').on('refresh.bs.table', '.table-tips', function () {
        initTableTips(type, maxWidth, time, classobject, onarr, offarr);
    })
    $('body').on('page-change.bs.table', '.table-tips', function () {
        initTableTips(type, maxWidth, time, classobject, onarr, offarr);
    })
    TableTipsSign++;
}

function TableTipsAll(type, maxWidth, time, classobject, onarr, offarr) {
    loadCssCode();
    $('body').on('all.bs.table', '.table-tips', function () {
        initTableTips(type, maxWidth, time, classobject, onarr, offarr);
    })
    TableTipsSign++;
}

$(function () {
    setTimeout(function () {
        if (TableTipsSign == 0) {
            TableTips();
        }
    }, 1000)
})

function loadCssCode() {
    var code = ' .table-tips {\n' +
        '            table-layout: fixed;\n' +
        '        }\n' +
        '\n' +
        '        .table-tips td {\n' +
        '            overflow: hidden !important;\n' +
        '            text-overflow: ellipsis !important;\n' +
        '            white-space: nowrap !important;\n' +
        '        }' +
        ' .table-tips-empty {\n' +
        '            table-layout: auto;\n' +
        '        }\n';
    var style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    //for Chrome Firefox Opera Safari
    style.appendChild(document.createTextNode(code));
    //for IE
    //style.styleSheet.cssText = code;
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
}
