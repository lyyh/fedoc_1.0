import urlConfig from '../refs/urlConfig';
import scrConfig from '../refs/screenConfig';
import PubSub from 'pubsub-js';

export function getNavList(obj){
	$.get(urlConfig.navListUrl,function(result){
	       let navjson = JSON.parse(result.navlist);
	       navCallBack(obj,navjson);
    });
}

function navCallBack(obj,navjson){
	obj.setState({
		navlist:navjson
	}) 
}

//展开菜单中的文件夹
export function handlerDir(){
$(".docbox .nav").on("click", "p,li.right ", function () {
    $(".docbox .nav").find('.active').removeClass('active');
    $(this).toggleClass("down").toggleClass('active').nextAll("ul").toggle()
})
}

//md文件点击事件
export function handlerMdClick(){
$(".nav").on("click", "li", function () {
    if($(this).attr('data-path')=='directory'){
        return
    }

    PubSub.publish('load');

    $(".docbox .nav").find('.active').removeClass('active');
    $(this).toggleClass('active')
    var datapath = $(this).attr("data-path")
    updateByPage(datapath)
})
}

//更新md文档(浏览器后退前进,origin为true,否则为false)
function updateByPage(datapath,origin) {
    //非md文档不能打开
    var reg = new RegExp(/\.md$/);

    if (!reg.test(datapath) || datapath == "directory")return


        if(origin){
            $.pjax({
                url: urlConfig.updatePageUrl + datapath,
                container: '.markdown-body'
            })
        }else{
             $.pjax({
                url: urlConfig.updatePageUrl + datapath,
                container: '.markdown-body'
            }).success(function(){
                 PubSub.publish('complete');
             })
        }
       
}

//markdown内容中的超链接（跳转到其他文档）
export function linkMd(){
$('.markdown-body').on('click', 'a', function () {
    var datapath = $(this).attr('data-path');
    updateByPage(datapath);
})
}

//初始化页面
export function initPage(){
updateByPage(urlConfig.homePageUrl,true)
}


export function selfAdaption(){
//是否是小页面(false:不是)
var isSmallSceen = false;

//监听页面大小变化
$(window).resize(function () {
    var width = $(this).width();
    if (width <= scrConfig.tinyWidth) {
        $('.navlist').css('display', 'none');
        if (!isSmallSceen) {
            tinyScreen();
        }
    }
    if (width > scrConfig.tinyWidth) {
        $('.navlist').css('display', 'block');
        $('.nav-btn-bottom').css('display','none')
    }
});


//根据页面大小绑定下拉菜单事件
function tinyScreen() {
    if ($(window).width() <= scrConfig.tinyWidth) {
        //判断初始化是否是小屏幕
        if (!isSmallSceen)isSmallSceen = true;
        $('.nav-btn').on('click', function () {
            if ($(window).width() > scrConfig.tinyWidth) {
                return;
            }
            $('.nav .navlist').slideToggle(100,function(){});
            
            $('.nav-btn-bottom').toggle();
        })
    }
}
tinyScreen()
}
