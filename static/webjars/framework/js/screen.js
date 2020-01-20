/**
 * screen.js    1.3
 * @description 过滤条件插件
 * @author: gyq
 * @requires:jquery
 */
if (typeof jQuery === 'undefined') {
	throw new Error('screen\'s JavaScript requires jQuery')
}

+
function($) {
	'use strict';
	var version = $.fn.jquery.split(' ')[0].split('.')
	if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
		throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
	}
}(jQuery);

/**=================================================================================================
 * type  默认screen-radio/screen-checkbox(默认screen-radio单选)
 * 
 * data  格式为{id:"",text:""}
 * 
 * 如无特殊需求其他使用默认参数
 * 
 * ================================================================================================
 * 
 * 使用：
 * 		引入本jquery及本js，
 * 		初始化 $(selector).initScreen(option);
 * 		获取数据$(selector).getSelectData();（在初始化后调用此方法）
 * 
 * =================================================================================================
 * 版本1.1  发布
 * 
 * 版本1.2  解决同一个文件中加载多个screen时数据不隔离的bug
 * 
 * 版本1.3  增加对皮肤的支持
 * 		
 * 
 * =================================================================================================
 */
$SCREEN_DEFAULT_DATA = {
	option_class: "screen-option",
	active_class: "screen-active",
	type: "screen-radio",
	data_id: "data-id",
	data: []
};
$PRIVATE_USER_DATA = new Map();
(function($) {
	$.fn.initScreen = function(options) {
		$USER_DATA = {};
		$.extend(true, $USER_DATA, $SCREEN_DEFAULT_DATA, options);
		/* console.log(options);
		console.log($USER_DATA); */
		$PRIVATE_USER_DATA.set(this.attr("id"), $USER_DATA)
		//加载option
		var data = $USER_DATA.data;
		var html = '';
		var $this = this;
		if (data.length != 0) {
			$this.addClass("screen-container " + $USER_DATA.type);
			for (var i in data) {
				html += '<div id="' + this.attr("id") + data[i].id + '" class="' + $USER_DATA.option_class + '" data-id="' +
					data[i].id + '">' +
					data[i].text +
					'</div>'
			}
			$this.append(html);
			$this.find('.' + $USER_DATA.option_class).first().addClass($USER_DATA.active_class)
			$this.find('.'+$USER_DATA.option_class).on("click", function(e) {
				var $option = $(e.target);
				var $container = $(e.target).parent();
				//radio 
				if ($container.hasClass("screen-radio")) {
					if (!$option.hasClass('.'+$USER_DATA.active_class)) {
						var current = $container.find('.'+$USER_DATA.active_class);
						current.removeClass($USER_DATA.active_class);
						$option.addClass($USER_DATA.active_class);
					}
				}
				//checkbox
				if ($container.hasClass("screen-checkbox")) {
					console.log("checkbox")
					if (!$option.hasClass($USER_DATA.active_class)) {
						$option.addClass($USER_DATA.active_class);
					} else {
						$option.removeClass($USER_DATA.active_class);
					}
				}
			})
		}
	}
	$.fn.getSelectData = function() {
		var data_selected = [];
		if ($PRIVATE_USER_DATA.get(this.attr("id")).length == 0) {
			throw new Error('请在初始化后再请求数据！')
		} else {
			var options_selected = this.find(".screen-active");
			if (options_selected.length > 0) {
				for (var i = 0; i < options_selected.length; i++) {
					data_selected.push({
						id: $(options_selected[i]).attr($USER_DATA.data_id),
						text: $(options_selected[i]).text()
					});
				}
			}
		}
		return data_selected;
	}
})(jQuery);
