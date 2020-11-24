//在dom 创建完毕 开始执行
$(function () {
    getUserInfo()
    $('#btnLoaout').on('click', logout)
})
//加载
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'get',
        //headers 请求头配置

        // headers: {
        //     Authorization: localStorage.getItem('token') //|| ''
        // },
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            renderAvatar(res.data);
        }

    })
}
//2.渲染用户信息
function renderAvatar(usrData) {
    //先获取用户名
    let usrName = usrData.nickname || usrData.username;
    //
    $('#welcome').html('欢迎 ' + usrName);
    //渲染头像
    if (usrData.user_pic != null) {
        $('.layui-nav-img').attr('src', usrData.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        let firstChar = usrName[0].toUpperCase();
        $('.text-avatar').text(firstChar).show();
    }
} 9
function logout() {
    layui.layer.confirm('你确定要退出吗?', { icon: 3, title: '系统提示' }, function (index) {
        localStorage.removeItem('token');
        location.href = "/login.html"
        layer.close(index);
    });
}
