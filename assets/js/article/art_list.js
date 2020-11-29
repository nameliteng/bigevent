let q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state: '',
}

$(function () {
    initArtList();
    initCate();
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        let y = dt.getFullYear();
        let m = dt.getMonth() + 1;
        let d = dt.getDate();
        let hh = dt.getHours();
        let mm = dt.getMinutes();
        let ss = dt.getSeconds();
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    $('#form-search').on('submit', search)
    $('tbody').on('click', '.btn-delete', del)
})
function initArtList() {
    $.ajax({
        method: 'get',
        url: '/my/article/list',
        data: q,
        success: function (res) {
            // console.log(res);
            //遍历生成html字符串
            let strHtml = template('tpl-list', res);
            //将html字符串渲染到 tbody
            $('tbody').html(strHtml);
            rederPage(res.total)
        }
    })
}
function initCate() {
    $.ajax({
        method: 'get',
        url: '/my/article/cates',
        success: function (res) {
            // console.log(res);
            //遍历生成html字符串
            let htmlStr = template('tpl-cate', res);
            //将html字符串渲染到 tbody
            // $('tbody').html(htmlStr);
            // console.log(htmlStr);
            //将HTML代码渲染到分类可选项
            $('select[name=cate_id]').html(htmlStr)
            //通过layui 重新渲染下拉框
            layui.form.render();
        }
    })
}
//查询事件处理函数
function search(e) {
    e.preventDefault();
    q.cate_id = $('select[name=cate_id]').val();
    q.state = $('select[name=state]').val();
    // console.log(q);
    initArtList();

}
function rederPage(total) {
    layui.laypage.render({
        elem: 'pageBar', // 页码容器
        count: total, // 数据总数
        curr: q.pagenum, //获取起始页
        limit: q.pagesize, // 总页数 
        limits: [2, 3, 5, 10],
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],// 页码条功能
        jump(obj, first) {
            // console.log(obj);
            q.pagenum = obj.curr;
            q.pagesize = obj.limit;//获取下拉框 选中的 页融量
            if (!first) {
                initArtList();
            }
        }

    })

}
function del() {
    let id = this.dataset.id
    // console.log('删除：' + id);
    layui.layer.confirm('你确定要删除这条数据吗?', function (index) {
        let rows = $('tbody tr .btn-delete').length;
        $.ajax({
            method: 'get',
            url: '/my/article/delete/' + id,
            success: function (res) {
                layui.layer.msg(res.message);
                if (res.status != 0) return
                //删除成功 重新渲染页面
                if (rows <= 0) {
                    q.pagenum = q.pagenum <= 1 ? 1 : q.pagenum - 1;
                }
                initArtList();
            }
        })
        layui.layer.close(index);
    })
}