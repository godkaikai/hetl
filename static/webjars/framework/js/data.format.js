/*!
 * data.format.js Version:1.2
 * @author:wenmo
 * @email:809097465@qq.com
 * @requires:jquery
 */

/*!
* 更新日志
* 1.自动格式化小数。
* 2.新增小数位精度满后光标前移后小数部分为更新操作而不是新增。
* 3.更改旧值存储机制，实现在相应元素上存储旧值；定义jquery的赋值接口，以用来动态渲染时存储数据。
*/

/*!
 * 调用方式：
 * input控件的type='text',添加class='number-format'启用插件，number-mask指定小数属性。
 * number-mask='6,2'即整数长度为6，小数精度为2；number-mask='2'则为小数精度为2;number-mask='6,0'则为六位整数。
 * 使用JQuery动态赋值时，需要使用自定义接口setValue(value),例如:$('input').setValue('13.14');。
 */
$(function () {
    $.fn.setValue = function (value) {
        $(this).data('data', value.toString());
        $(this).val(value);
    }
    $('body').on('input propertychange ', '.number-format', function () {
        var number_mask = $(this).attr('number-mask'),
            mask = number_mask.split(','),
            str = $(this).val(),
            id = $(this).attr('id'),
            index = getTextCursorPosition(id),
            s = str.charAt(index - 1);
        if (/[^\d.]/g.test(str)) {
            str = str.replace(/[^\d.]/g, '');
            index--;
        }
        if (str.indexOf('.') > -1) {
            var num = str.split('.');
            if (num.length == 2) {
                if (/^\.[0-9]*/.test(str)) {
                    str = parseInt('0' + num[0], 10) + '.' + num[1];
                    index++;
                } else {
                    str = parseInt(num[0], 10) + '.' + num[1];
                }
            } else {
                str = $(this).data('data');
                index--;
            }
        }
        var num = str.split('.');
        if (num.length == 2) {
            if (mask.length == 2) {
                if (num[0].length > mask[0]) {
                    str = $(this).data('data');
                    index--;
                } else if (num[1].length > mask[1]) {
                    str = $(this).data('data');
                    if (index != str.length + 1) {
                        str = str.substring(0, index - 1) + s + str.substring(index);
                    }
                } else if (mask[1] == '0') {
                    str = str.replace(/[^\d]/g, '');
                } else {
                }
            } else {
                if (num[1].length > mask[0]) {
                    str = $(this).data('data');
                    if (index != str.length + 1) {
                        str = str.substring(0, index - 1) + s + str.substring(index);
                    }
                }
            }
        } else if (num.length == 1) {
            if (mask.length == 2 && num[0].length > mask[0]) {
                str = $(this).data('data');
                index++;
            } else {
                str = parseInt(num[0], 10) + '';
            }
        } else {
            str = $(this).data('data');
        }
        if (str == 'NaN') {
            str = '';
        }
        $(this).val(str);
        textFocus(id, index);
        $(this).data('data', str);
    });
})

function textFocus(obj, spos) {
    var tobj = document.getElementById(obj);
    if (spos < 0)
        spos = tobj.value.length;
    if (tobj.setSelectionRange) { //兼容火狐,谷歌
        setTimeout(function () {
                tobj.setSelectionRange(spos, spos);
                tobj.focus();
            }
            , 0);
    } else if (tobj.createTextRange) { //兼容IE
        var rng = tobj.createTextRange();
        rng.move('character', spos);
        rng.select();
    }
}

function getTextCursorPosition(obj) {
    var $input = document.getElementById(obj);
    var cursurPosition = 0;
    if ($input.selectionStart) {//非IE
        cursurPosition = $input.selectionStart;
    } else {//IE
        try {
            var range = document.selection.createRange();
            range.moveStart("character", -$input.value.length);
            cursurPosition = range.text.length;
        } catch (e) {
            cursurPosition = 0;
        }
    }
    return cursurPosition;
}