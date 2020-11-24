$(function () {
    //注册点击事件--------------
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    //登录点击事件-------------
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })
    // 从 layui 获取form对象---------------
    let form = layui.form
    form.verify({
        //自定义pwd校验规则
        pwd: [/^[\S]{6,12}$/, '密码须6-12位，且不能出现空格'],
        //校验两次密码是否输入一致
        repwd: function (pwd2) {
            //获取密码框密码
            let pwd1 = $('.reg-box [name=password]').val();
            console.log(pwd1);
            console.log(pwd2);
            //比较两个密码框是否相同
            if (pwd1 != pwd2) return '两次密码不一致'
        }
    })
    //3.注册表单事件
    $('#form_reg').on('submit', submitData);
    //4.注册表单事件(登录)
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        let dataStr = $(this).serialize();
        $.ajax({
            url: '/api/login',
            method: 'post',
            data: dataStr,
            success: function (res) {
                //登录失败
                if (res.status != 0) return layui.layer.msg(res.message);
                //登录成功
                layui.layer.msg(res.message, {
                    icon: 1,
                    time: 1500
                }, function () {
                    //a.保存token数据到localStorage
                    localStorage.setItem('token', res.token)
                    //b.跳转到主页 index.html
                    location = 'index.html'
                })


            }
        })
    })

})
//注册函数
// let baseurl = 'http://ajax.frontend.itheima.net'
function submitData(e) {
    e.preventDefault();
    let dataStr = $(this).serialize();
    //异步请求
    $.ajax({
        url: '/api/reguser',
        method: 'post',
        data: dataStr,
        success(res) {
            //不论成功 都显示消息
            layui.layer.msg(res.message);
            //注册出错
            if (res.status != 0) return;
            //将用户名密码 自动填充到登录表单
            let uname = $('.reg-box [name=username]').val().trim();
            $('.login-box [name=username]').val(uname);
            let upwd = $('.reg-box [name=password]').val().trim();
            $('.login-box [name=password]').val(upwd);
            //注册成功清空表单
            $('#form_reg')[0].reset();
            //切换到登录页面
            $('#link_login').click();

        }
    })
}
