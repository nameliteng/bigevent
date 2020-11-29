$(function () {
    initArtCateList()
    $('#btnAddCate').on('click', showWindow)
    $('body').on('submit', '#formAdd', doAdd)
    $('tbody').on('click', '.btn-delete', doDelete)
    $('tbody').on('click', '.btn-edit', showEdit)
})
//加载文章列表
function initArtCateList() {
    $.ajax({
        method: 'get',
        url: '/my/article/cates',
        success: function (res) {
            // console.log(res);
            //遍历数组 生成html数组
            let strHtml = template('tpl-cate', res)
            //将html 字符串 渲染到tbody里面
            $('tbody').html(strHtml);
        }
    })
}
let layerID = null;
function showWindow() {
    layerID = layui.layer.open({
        type: 1,
        area: ['500px', '260px'],
        title: '添加文章分类',
        content: $('#tpl-window').html()
    })
}
function doAdd(e) {
    e.preventDefault();


    let title = $(".layui-layer-title").text().trim();
    console.log(title);
    //新增
    if (title == '添加文章分类') {
        let dataStr = $(this).serialize();
        dataStr = dataStr.replace('Id=&', '')
        console.log(dataStr);
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: dataStr,
            success: function (res) {
                console.log(res);
                layui.layer.msg(res.message)
                if (res.status != 0) return;
                initArtCateList()
                layui.layer.close(layerID)
            }

        })
    } else {
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                layui.layer.msg(res.message);
                if (res.status != 0) return
                //删除成功 重新渲染页面
                initArtCateList();
                layui.layer.close(layerID);

            }
        })
    }

}
//执行删除
function doDelete() {
    // let id = this.getAttrbute('data-id')
    let id = this.dataset.id
    // console.log('删除：' + id);
    layui.layer.confirm('你确定要删除这条数据吗?', function (index) {
        $.ajax({
            method: 'get',
            url: '/my/article/deletecate/' + id,
            success: function (res) {
                layui.layer.msg(res.message);
                if (res.status != 0) return
                //删除成功 重新渲染页面
                initArtCateList()
            }
        })

        layui.layer.close(index);
    });

}

function showEdit() {
    // console.log(this.dataset.id);
    layerID = layui.layer.open({
        type: 1,
        area: ['500px', '260px'],
        title: '编辑文章分类',
        content: $('#tpl-window').html()
    })
    let id = this.dataset.id;
    $.ajax({
        method: 'get',
        url: '/my/article/cates/' + id,
        success: function (res) {
            console.log(res);
            layui.form.val('formData', res.data);
        }
    })
}