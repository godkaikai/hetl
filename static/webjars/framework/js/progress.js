/*
* 进度条插件(体现加载过程)
* selecter 选择器
* rate     初始化进度比例() 默认0
* speed    速度 (1-100)  默认10
* 用法：
* 开始：var progress = new progress("#example",0).execute()
* 停止：progress.stop().execute()
* ui使用bootstrap 进度条
*
* */
var progress = function (selecter, rate, speed) {
    this._selecter = selecter;

    if (!rate) {
        this._width = 0;
    } else {
        this._width = rate;
    }
    if (!speed) {
        this._speed = 10;
    } else {
        this._speed = speed;
    }
    this._timeId;
    return this;
}
progress.prototype.stop = function () {
    this._width = 100;
    return this;
}
progress.prototype.execute = function () {
    var selecter = this._selecter;
    var width = this._width;
    var time = 1000/this._speed;
    if (width == 100) {
        $(selecter).find('.progress-bar').css('width', width + '%');
        $(selecter).parent().find('.progress-text').text(width + '%');
        clearInterval(this._timeId);
    } else {
        this._timeId = setInterval(function () {
            if (width < 99) {
                width++;
            }
            $(selecter).find('.progress-bar').css('width', width + '%');
            $(selecter).parent().find('.progress-text').text(width + '%')
        }, time);
    }
    return this;
}