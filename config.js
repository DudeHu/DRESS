/**
 * Created by gao on 15/12/1.
 */
define(function(req, exp){
    "use strict";

    var $ = req("sys.lib.jquery");
    var app = req("sys.app");

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
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
                xhr.setRequestHeader("sessionId",sessionStorage.sessionId);
                xhr.setRequestHeader("adminUserId",sessionStorage.adminUserId);
            },
            complete: function (rs) {
                app.plugin.mask.hide();
            },
            error: function (rs) {
                if (rs.status == 403) {
                    app.viewEx.alert("403错误");
                } else if (rs.status == 404) {
                    console.warn("找不到nodejs服务或nodejs未启动");
                    app.viewEx.alert("服务器错误");
                } else if (rs.statusText == "timeout") {
                    app.viewEx.alert("请求超时");
                } else if (rs.statusText == "error") {
                    app.viewEx.alert("500服务器错误！");
                } else {
                    app.viewEx.alert("网络错误");
                }
            }
        });
    };

    //AJAX数据处理
    exp.ajaxRes = function(callback, params){
        return function(rs){
            if(rs.code==-1) {
                //sessionStorage.login_or_register_go_page = location.href.split("#")[1];
                if($.session && $.session.get("sessionId")){
                    app.viewEx.alert("A sessão expira!Favor fazer o login de novo!");
                }
            }
            else if(rs.code==500){
                app.viewEx.alert("Servidor Falha!Favor atualizar a página atual!");
            }else if(rs.code==1102){
                app.viewEx.alert("Favor fazer o login no primeiro!");
                app.go("login");
            }
            else{
                if(params && params.data && rs.data){
                    params.data = rs.data;
                }
                callback({status:rs.status, codes:rs.codes||rs.code, msg:rs.msg||rs.message, data:rs.data});
            }
        }
    };

});