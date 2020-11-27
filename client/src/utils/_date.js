Date.prototype.AddHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}

Date.prototype.AddDays = function (d) {
    this.setDate(this.getDate() + d);
    return this;
}

Date.prototype.YearMonth = function () {
    var year = this.getFullYear();
    var month = ('0' + (this.getMonth() + 1)).slice(-2);
    return year + '-' + month;
}

Date.prototype.ShortDate = function () {
    var year = this.getFullYear();
    var month = ('0' + (this.getMonth() + 1)).slice(-2);
    var day = ('0' + this.getDate()).slice(-2);
    return year + '/' + month + '/' + day;
}

Date.prototype.ShortTime = function () {
    var hours = ('0' + this.getHours()).slice(-2);
    var minutes = ('0' + this.getMinutes()).slice(-2);
    return hours + ':' + minutes;
}

Date.prototype.GetWeekDay = function () {
    let weekDayArr = ['一', '二', '三', '四', '五', '六', '日'];
    return '星期' + weekDayArr[this.getDay() - 1];
}

Date.prototype.CustomShortDate = function () {
    return this.ShortDate() + ' ' + this.ShortTime();
}

Date.prototype.CustomLongDate = function () {
    return this.ShortDate() + ' ' + this.GetWeekDay() + ' ' + this.ShortTime();
}

//回傳月初的日期
Date.prototype.BeginMonth = function () {
    var year = this.getFullYear();
    var month = this.getMonth();
    return new Date(Date.UTC(year, month, 0)).AddDays(1).AddHours(-8);
}

//回傳隔月初的日期
Date.prototype.AllMonth = function () {
    var year = this.getFullYear();
    var month = this.getMonth() + 1;
    return new Date(Date.UTC(year, month, 0)).AddHours(16);
}