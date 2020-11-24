$.ajaxPrefilter(function (ajaxOpt) {
    // console.log(ajaxOpt);
    ajaxOpt.url = 'http://ajax.frontend.itheima.net' + ajaxOpt.url;

    //统一为有权限的接口设置headers请求头 添加token
    if (ajaxOpt.url.indexOf('/my/') > -1) {
        ajaxOpt.headers = {
            Authorization: localStorage.getItem('token')
        }
    }
    //c.
    ajaxOpt.complete = function (res) {
        console.log(res.responseJSON);
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            layer.msg(res.responseJSON.message, {
                icon: 1,
                time: 1500 //2秒关闭（如果不配置，默认是3秒）
            }, function () {
                //do something
                localStorage.removeItem('token');
                location.href = '/login.html';
            });
        }
    }
});