function createDWZTree(id, data, expandflag, callback) {
	this.id = id;
	this.data = data;
	this.expandflag = expandflag;
	this.callback = callback;
}

createDWZTree.prototype.click = function(clickFun) {
	if(clickFun){
		this.clickFun = clickFun;
	}else{
		this.clickFun = null;
	}
	return this;
};

createDWZTree.prototype.rightClick = function(rightClickFun) {
    if(rightClickFun){
        this.rightClickFun = rightClickFun;
    }else{
        this.rightClickFun = null;
    }
    return this;
};

createDWZTree.prototype.addDiyDom = function(addDiyDom) {
    if(addDiyDom){
        this.addDiyDom = addDiyDom;
    }else{
        this.addDiyDom = null;
    }
    return this;
};

createDWZTree.prototype.build = function() {
	if (!this.data) {
		this.data = [ {
			name : 'ROOT',
			id : 'root',
			pid : 'root'
		} ];
	}

	var processTreeSetting = {
		view : {
			selectedMulti : false,
			addDiyDom: this.addDiyDom
		},
		data : {
			simpleData : {
				enable : true,
				idKey : "id",
				pIdKey : "pid",
				rootPId : "root"
			},
			key : {
				name : "name",
				url : "disable"
			}
		},
		callback : {
			onClick : this.clickFun,
            onRightClick: this.rightClickFun,
			onAsyncSuccess  : this.callback
		}
	};

	var tree = $.fn.zTree.init($("#" + this.id), processTreeSetting, this.data);
	if (this.expandflag) {
		tree.expandAll(true);
	} else {
		tree.expandAll(false);
	}
	return tree;
};
