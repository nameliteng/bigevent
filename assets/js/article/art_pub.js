let $image = null;
let options = null;
$(function () {
    // 初始化富文本编辑器
    initEditor()
    //请求分类下拉框数据
    initCateList();
    // 1. 初始化图片裁剪器
    $image = $('#image')

    // 2. 裁剪选项
    options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    $('#btnChoose').on('click', function () {
        $('#coverFile').click();
    })
    $('#btnPublish').on('click', publish)
    $('#btnDraft').on('click', draft)

    $('#form-pub').on('submit', doSubmit)
})
function initCateList() {
    $.ajax({
        method: 'get',
        url: '/my/article/cates',
        success: function (res) {
            let strHtml = template('tpl-pub', res)
            $('#cate_id').html(strHtml)
            //通过layui 重新渲染下拉框
            layui.form.render();
        },
    })
}
function fileChange(e) {
    let fileList = e.target.files;
    if (fileList.length == 0) return layui.layer.msg('请选择文件');
    let file = fileList[0];
    let newImgURL = URL.createObjectURL(file);
    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域

}
let state = '已发布'
function publish() {
    state = '已发布'
}
function draft() {
    state = '存为草稿 '
}
function doSubmit(e) {
    e.preventDefault();
    let fd = new FormData(this);
    fd.append('state', state);
    $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img', blob)
            $.ajax({
                method: 'post',
                url: '/my/article/add',
                data: fd,
                processData: false,
                contentType: false,
                success: function (res) {
                    // console.log(res);
                    if (res.status != 0) return layui.layer.msg(rees.message)
                    location.href = "/article/art_list.html";
                }
            })
        })

}