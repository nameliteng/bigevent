$(function () {
    initCropper();
    //1.4为按钮绑定事件
    $('#btnUpload').on('click', chooseFile)
    //为文件选择 绑定 onchange 事件 获取文件信息
    $('#file').on('change', fileChange)
    $('#btnOk').on('click', upLoad)
})
let $image = null
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

function initCropper() {
    // 1.1 获取裁剪区域的 DOM 元素
    $image = $('#image')
    // 1.2 配置选项
    // 1.3 创建裁剪区域
    $image.cropper(options)
}

function chooseFile() {
    $('#file').click();
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
function upLoad() {
    //获取选中 裁剪的图片数据
    var dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    //提交到服务接口
    $.ajax({
        method: 'post',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL
        },
        success: function (res) {
            layui.layer.msg(res.message)
            if (res.status != 0) return;
            window.top.getUserInfo();
        }
    })

}