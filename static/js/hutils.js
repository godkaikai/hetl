;!function(win) {
	'use strict';
	var HUtils = function() {
		this.version = '0.0.1';
	}

	HUtils.prototype.compileUrl = function(url) {
		var __uid = this.getQueryString('__uid');
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

	HUtils.prototype.getQueryString = function(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return unescape(r[2]);
		}
		return null;
	}

	HUtils.prototype.parseData = function(res) {
		var count = 0, data = [ [] ];
		if (res.success) {
			count = res.data.total;
			data = res.data.rows;
		}
		return {
			"code" : res.errorCode,
			"msg" : res.errorMsg,
			"count" : count,
			"data" : data
		};
	}

	HUtils.prototype.getArea = function(width, height) {
		var width = $('body').width() < width ? $('body').width() : width;
		var height = $('body').height() < height ? $('body').height() : height;
		return [ width + 'px', height + 'px' ];
	}

	var CodeUtils = function() {
		this.version = '0.0.1';
		this.codeMap = {};
	}
	
	CodeUtils.prototype.load = function(codes) {
		var codeDS = [];
		$.each(codes, function(i, item) {
			codeDS.push({
				code_name : this
			});
		});
		var othis = this;
		$.ajax({
			type : 'post',
			async : false,
			url : hutils.compileUrl('/code/loadCode'),
			data : JSON.stringify({
				code_names : codeDS
			}),
			dataType : 'json',
			contentType : 'application/json;charset=UTF-8',
			success : function(res) {
				if (res.success) {
					$.each(res.data.codes, function(i, item) {
						othis.codeMap[this.code_name] = this.code_data;
					});
				} else {
					console.log('加载code失败:' + data.errorMsg);
				}
			}
		});
	}
	
	CodeUtils.prototype.renderTable = function(field, code_name, filter) {
		if(!filter) {
			filter = '';
		}
		var othis = this;
		return function(data) {
			var value = data[field];
			var select = '<select name="' + field + '" lay-filter="'+ filter +'" lay-search="true" value="' + value + '">';
			select += '<option value=""></option>';
			$.each(othis.codeMap[code_name], function(i, item) {
				select += '<option value="' + this.code_value + '" ' + (value === this.code_value ? 'selected' : '') + '>' + this.code_content + '</option>';
			});
			select += '</select>';
			return select;
		}
	}
	
	CodeUtils.prototype.fillTable = function(filters) {
		$.each(filters, function(i, item) {
			layui.form.on('select(' + this + ')', function(data) {
			 	var selectElem = $(data.elem);
		        var tdElem = selectElem.closest('td');
		        var trElem = tdElem.closest('tr');
		        var tableView = trElem.closest('.layui-table-view');
		        layui.table.cache[tableView.attr('lay-id')][trElem.data('index')][tdElem.data('field')] = data.value;
			});
		});
	}
	
	CodeUtils.prototype.renderForm = function(elem, code_name, value) {
		var othis = this;
		var $elem = $(elem);
		$elem.empty();
		var select = '<option value=""></option>';
		$.each(othis.codeMap[code_name], function(i, item) {
			select += '<option value="' + this.code_value + '" ' + (value === this.code_value ? 'selected' : '') + '>' + this.code_content + '</option>';
		});
		$elem.append(select);
	}
	
	var DateUtils = function() {
		this.version = '0.0.1';
	}
	
	DateUtils.prototype.renderTable = function(otable, field, type, format) {
		var tableView = otable.elem.next();
        var tableId = otable.id;
        
        if(!type) {
        	type = 'date'
        }
        if(!format) {
        	format = 'yyyy-MM-dd';
        }

        layui.each(tableView.find('td[data-field="' + field + '"]'), function (index, tdElem) {
          tdElem.onclick = function (event) {
            layui.stope(event)
          };
          layui.laydate.render({
            elem: tdElem.children[0],
            type: type,
            format: format,
            done: function (value, date) {
              var trElem = $(this.elem[0]).closest('tr');
              layui.table.cache[tableId][trElem.data('index')][field] = value;
            }
          })
		})
	}

	win.hutils = new HUtils();
	win.codeutils = new CodeUtils();
	win.dateutils = new DateUtils();
}(window);