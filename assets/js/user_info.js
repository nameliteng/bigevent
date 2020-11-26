$(function () {
    layui.form.verify({
        nickname: [/^\S{6,12}$/, '昵称必须6-12位字符之间']
    })
    //加载用户基本信息
    initUserInfo();
    $('#btnResent').on('click', function () {
        initUserInfo();
    })
    $('.layui-form').on('submit', sunmitData)
})
function initUserInfo() {
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        success: function (res) {
            // console.log(res);
            //判断错误
            if (res.status != 0) return layui.layer.msg(res.message);
            //将数据 传入 同名的 表单元素 中
            layui.form.val('userForm', res.data);
        }
    })
}
//提交表单数据
function sunmitData(e) {
    e.preventDefault();
    $.ajax({
        url: '/my/userinfo',
        method: 'post',
        data: $(this).serialize
            (),
        success: function (res) {
            //不管成功与否都显示消息
            layui.layer.msg(res.message);
            //有错停止执行函数
            if (res.status != 0) return layui.layer.msg(res.message);
            //加载父页面里面的方法 window.top window.
            window.top.getUserInfo();

        }

    })
}