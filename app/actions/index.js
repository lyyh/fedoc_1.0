

//是否是小页面(false:不是)
var isSmallSceen = false;

//监听页面大小变化
$(window).resize(function () {
    var width = $(this).width();
    if (width <= 768) {
        $('.navlist').css('display', 'none');
        if (!isSmallSceen) {
            tinyScreen();
        }
    }
    if (width > 768) {
        $('.navlist').css('display', 'block');
    }
});

//根据页面大小绑定下拉菜单事件
function tinyScreen() {
    if ($(window).width() <= 768) {
        //判断初始化是否是小屏幕
        if (!isSmallSceen)isSmallSceen = true;

        $('.nav-btn').on('click', function () {
            if ($(window).width() > 768) {
                return;
            }
            $('.nav .navlist').toggle();
            $('.nav-btn-bottom').toggle();
        })
    }
}
tinyScreen();

//展开菜单中的文件夹
$(".docbox .nav").on("click", "p,li.right ", function () {
    $(".docbox .nav").find('.active').removeClass('active');
    $(this).toggleClass("down").toggleClass('active').next("ul").toggle();
})

//显示多级菜单
function navlist() {
    $.getJSON('/nav', function (json, textStatus) {
        var navjson = JSON.parse(json.navlist);
        var endstr = "";
        var str = "";
        var strul = "";
        initNav(navjson);
        //初始化根目录
        function initNav(navjson) {
            navjson.forEach(function (element) {
                str = "<div class='navlist'><p class='right'>" + element.name + "</p>";
                createElement(element)
                str += "</div>"
                endstr += str;
            });
            $(".nav-content").append(endstr)
        }

        //生成所有子目录
        function createElement(element) {
            if (element.children && element.children.length) {
                str += strul;
                strul = '<ul>';
                element.children.forEach(function (eleeach) {
                    eleeach.value ? strul += "<li data-path = " + eleeach.value + ">" + eleeach.name + "</li>" : strul += "<li data-path = 'directory' class='right'>" + eleeach.name + "</li>";
                    createElement(eleeach)
                })
                str += strul + '</ul>';
                strul = '';
            }
        }
    });
}
navlist()

$(".nav").on("click", "li", function () {
    $(".docbox .nav").find('.active').removeClass('active');
    $(this).toggleClass('active');
    var datapath = $(this).attr("data-path");
    updateByPage(datapath)
})

$(window).on("popstate", function (event) {
    var state = event.state;
    console.log(state)
    if (state == null)return;
    updateByPage(state.url,true);
});

$('.markdown-body').on('click', 'a', function () {
    var datapath = $(this).attr('data-path');
    updateByPage(datapath);
})

//更新md文档(浏览器后退前进,origin为true,否则为false)
function updateByPage(datapath,origin) {
    //非md文档不能打开
    var reg = new RegExp(/\.md$/);

    if (!reg.test(datapath) || datapath == "directory")return;

    if(!origin)history.pushState({"url": datapath}, "", "?" + datapath);

    $.ajax({
            url: "http://localhost:1234/?seacherpage=" + datapath,
            type: 'GET',
        })
        .done(function (data) {
            var str = data.htmlstr.replace(/<a href=/g, "<a data-path=");
            $(".markdown-body").html(str);
        })
        .fail(function () {
            console.log("error");
        })
}

updateByPage("doc/各类文档例子/fe文档平台说明.md");


