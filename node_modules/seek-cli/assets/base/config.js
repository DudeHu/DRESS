/**
 * Created by gao on 15/12/1.
 */
define(function(req, exp){
    "use strict";

    var $ = req("sys.query");
    var app = req("sys.app");
    exp.baseUri = "/service/";
    //AJAX设置
    exp.ajaxSetup = function() {
        $.ajaxSetup({
            global: true,
            cache: false,
            dataType: "JSON",
            timeout: 30000,
            beforeSend: function (xhr) {
                app.plugin.mask.showMask({
                    loading: true,
                    bg: "#fff",
                    opacity: 0
                });
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            },
            complete: function (rs) {
                app.plugin.mask.hide();
            },
            error: function (rs) {
                if (rs.status == 403) {
                    alert("登陆超时,请重新登陆!");
                } else if (rs.status == 404) {
                    console.warn("找不到nodejs服务或nodejs未启动");
                    alert("系统出错,请联系客服,致电400-991-0099");
                } else if (rs.statusText == "timeout") {
                    alert("系统超时, 请刷新重试, 如多次刷新无效,请联系客服,致电400-991-0099");
                } else if (rs.statusText == "error") {
                    alert("对不起, 您没有权限访问,请联系客服,致电400-991-0099");
                } else {
                    alert("系统故障, 请刷新重试, 如多次刷新无效,请联系客服,致电400-991-0099");
                }
            }
        });
    };

    //AJAX数据处理
    exp.ajaxRes = function(callback, params){
        return function(rs){
            if(rs.code==-1) {
                //sessionStorage.login_or_register_go_page = location.href.split("#")[1];
                if($.session.get("sessionId")){
                    alert("登陆超时,请重新登陆!");
                }
            }
            else if(rs.code==500){
                alert("系统故障, 请刷新重试, 如多次刷新无效,请联系客服,致电400-991-0099!");
            }
            else{
                if(params && params.data && rs.data){
                    params.data = rs.data;
                }
                callback({success:rs.success, code:rs.code, message:rs.message, data:rs.data});
            }
        }
    };

});