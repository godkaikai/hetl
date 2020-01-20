function doNewProcess(pdkey, para, callbackFn) {
	// 开启流程
	var params = {
		"pdkey" : pdkey,
		"data" : para
	};

	var result;

	var url = compileUrl('/framework/flowable/startProcess');

	new AjaxRequest(url, params, function(data) {
		result = data;
	}).json().execute();

	if (result.nextflag) {
		// 当前有权，直接打开流程页面
		openFlowablePanel(result, callbackFn);
	} else {
		layer.msg('任务已开启');
	}
}
var piid;
function openFlowablePanel(para, callbackFn) {
    piid = para.piid;//定义一个全局的piid,用来查询流程图

	var btnArray = new Array();

	var uturl = compileUrl('/framework/flowable/getUTInfo');
	var utpara = {
		"piid" : para.piid,
		"pdkey" : para.pdkey,
		"pdversion" : para.pdversion
	}

	var utdo;
	var taskid;
	var taskname;
	new AjaxRequest(uturl, utpara, function(data) {
		if ("utdo" in data) {
			utdo = data.utdo;

			var i = 0;
			if ("next_btn" in utdo && utdo.next_btn == 'on') {
				btnArray[i++] = "下一步";
			}
			if ("save_btn" in utdo && utdo.save_btn == 'on') {
				btnArray[i++] = "保存";
			}
			if ("abort_btn" in utdo && utdo.abort_btn == 'on') {
				btnArray[i++] = "作废";
			}
		} else {
			btnArray[0] = "下一步";
			btnArray[1] = "保存";
			btnArray[2] = "作废";
		}

		if ("taskid" in data) {
			taskid = data.taskid;
		}
		if ("taskname" in data) {
			taskname = data.taskname;
		}
        taskname = taskname+"<span style='padding-right: 50px;float: right;cursor: pointer;' id='showProcessDiagram'><i class='icon iconfont iconliucheng-copy' style='color: #0b9284;' title='查看流程图'></i>查看流程图</span>";
	}).execute();

	if(!taskid){
		layer.msg('流程异常：未知的任务编号');
	}
	if (!taskname) {
		taskname = "流程页面";
	}
	
	var params = {
		"pdid" : para.pdid,
		"pdkey" : para.pdkey,
		"pdversion" : para.pdversion,
		"piid" : para.piid,
		"utdo" : utdo,
		"taskid" : taskid,
		"taskname" : taskname
	};

	layer.open({
		type : 2,
		title : taskname,
		btn : btnArray,
		content : compileUrl('/framework/flowable/flowablePanel?params='
				+ encodeURIComponent(JSON.stringify(params))),
		area : [ '90vw', '90vh' ],
		maxmin : true,// 最大化最小化 建议开启
		resize : false,// 拖动改变大小 建议关闭 据情况定
        move: false,
		success : function(layer_obj, index) {// 弹出成功后操作
		},
		end : function() { // 子页面(弹窗)销毁时回调的方法
		},
		yes : function(index, layero) {
			layerbtn(index, layero, '0', btnArray, params);
		},
		btn2 : function(index, layero) {
			layerbtn(index, layero, '1', btnArray, params);
		},
		btn3 : function(index, layero) {
			layerbtn(index, layero, '2', btnArray, params);
		},
		cancel : function() {
			var cancel_url = compileUrl('/framework/flowable/returnClaim');
			new AjaxRequest(cancel_url, params, function(data) {
				if (data.errormsg) {
					layer.msg(data.errormsg);
					return;
				}
				layer.msg('任务已退领');
			}).execute();
		}
	});

	function layerbtn(index, layero, btnindex, btnArray, params) {
		if (btnArray[btnindex] == '下一步') {
			// 获取open弹窗页面
			var iframeWin = window["layui-layer-iframe" + index];
			var next_url = compileUrl('/framework/flowable/completeTask');
			var otherData = iframeWin.getFlowablePanelData();
			params.data = otherData;
			var result_ = new AjaxRequest(next_url, params, function(data) {
				if (data.errormsg) {
					layer.msg(data.errormsg);
					return;
				}
			}).json().execute();
			layer.close(index);

			// 当前有权，直接打开流程页面
			if (result_.nextflag) {
				var params = {
					"pdid" : result_.pdid,
					"pdkey" : result_.pdkey,
					"pdversion" : result_.pdversion,
					"piid" : result_.piid
				};
                piid=params.piid;
				openFlowablePanel(params, callbackFn);
			}else{
				layer.msg('任务已完成');
			}
		} else if (btnArray[btnindex] == '保存') {
			layer.msg("开发中");
			return;
		} else if (btnArray[btnindex] == '作废') {
			var zf_url = compileUrl('/framework/flowable/invalidProcess');
			new AjaxRequest(zf_url, params, function(data) {
				if (data.errormsg) {
					layer.msg(data.errormsg);
					return;
				}
				layer.msg('任务已作废');
			}).execute();
		} else {
			layer.msg('未知按钮功能');
		}
	}
}
$(document).on('click',"#showProcessDiagram",function () {
    showProcessDiagram(piid);
})
function showProcessDiagram(piid){
    layer.open({
        type : 2,
        title : "查看流程图",
        content : compileUrl('/framework/flowable/showProcessDiagram?piid='+piid),
        area : [ '60vw', '60vh' ],
        maxmin : true,// 最大化最小化 建议开启
        resize : false,// 拖动改变大小 建议关闭 据情况定
        shadeClose : true,
        success : function(layer_obj, index) {// 弹出成功后操作
        },
        end : function() { // 子页面(弹窗)销毁时回调的方法
        },
        cancel : function() {
        }
    });
}