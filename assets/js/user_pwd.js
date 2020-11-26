$(function () {
    layui.form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6-12位字符之间'],
        samepwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '新旧密码不能一致'
            }
        },
        confirmpwd: function (value) {
            if (value != $('[name=reNewPwd]').val()) {
                return '确认密码和新密码不一致'
            }
        }
    })
    $('.layui-form').on('submit', changePwd);

})
function changePwd(e) {
    e.preventDefault();
    $.ajax({
        method: 'post',
        url: '/my/updatepwd',
        data: $(this).serialize(),
        success: function (res) {
            if (res.status != 0) return layui.layer.res(res.message);
            layui.layer.msg(res.message, {
                icon: 1,
                time: 1500//2秒关闭（如果不配置，默认是3秒）
            }, function () {
                localStorage.removeItem('token');
                window.top.location = '/login.html';
            });
        }
    })
}