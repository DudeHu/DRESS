/**
 * Created by hyq on 2016/4/7.
 */
define(function(req,exp){
    "use strict";
    exp.lists = {
        cursor:0,                   //当前页数
        page_count:0,               //总页数
        total:0,                    //总条数
        step:0                      //每页显示数量
    };

    /*初始化数据*/
    exp.onInit = function(done){
        exp.lists.cursor = exp.parent.lists.cursor||0;
        exp.lists.page_count = exp.parent.lists.page_count||0;
        exp.lists.total = exp.parent.lists.total||0;
        exp.lists.step = exp.parent.lists.step||0;
        done();
    };

    /*跳转页面*/
    exp.goPage = function(page){
        var _page = parseInt(page);
        if(_page<1 || _page>exp.lists.page_count)
            return;
        if(exp.lists.cursor !== _page){
            document.body.scrollTop=100;
            exp.lists.cursor = _page;
            if(exp.parent.goPage !== undefined){
                //先加载翻页数据再变化页码
                exp.parent.goPage(_page,exp.render);
            }else{
                //直接变化页码
                exp.render();
            }
        }
    }
});