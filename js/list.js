/**
 * Created by huyuqiong on 2016/12/17.
 */
define(function(req,exp){
    "use strict";
    exp.status = "none";
    exp.page="video";
    exp.uploadCuList = [];
    exp.uploadList = [
        {
            "name":"如果蜗牛有爱情.mp4",
            "time":1481974341687,
            "size":"23MB",
            "counts":320,
            "state":"ing"
        },  {
            "name":"如果蜗牛有爱情.mp4",
            "time":1481974411687,
            "size":"13MB",
            "counts":320,
            "state":"ing"
        },
        {
            "name":"如果蜗牛有爱情.mp4",
            "time":1481974341687,
            "size":"23MB",
            "counts":320,
            "state":"ing"
        },  {
            "name":"如果蜗牛有爱情.mp4",
            "time":1481974341687,
            "size":"23MB",
            "counts":320,
            "state":"ing"
        },  {
            "name":"如果蜗牛有爱情.mp4",
            "time":1481974411687,
            "size":"13MB",
            "counts":320,
            "state":"ing"
        },
        {
            "name":"如果蜗牛有爱情.mp4",
            "time":1481974341687,
            "size":"23MB",
            "counts":320,
            "state":"ing"
        },  {
            "name":"如果蜗牛有爱情.mp4",
            "time":1481974341687,
            "size":"23MB",
            "counts":320,
            "state":"ing"
        },  {
            "name":"如果蜗牛有爱情.mp4",
            "time":1481974411687,
            "size":"13MB",
            "counts":320,
            "state":"ing"
        },
        {
            "name":"如果蜗牛有爱情.mp4",
            "time":1481974341687,
            "size":"23MB",
            "counts":320,
            "state":"ing"
        }
    ]
    exp.paramType = "single";
    exp.onInit = function (done) {
        if(!sessionStorage.userId){
            exp.go("login");
        }else{
            if(exp.params[0]){
                exp.page = exp.params[0];
            }
            done();
        }

    }
    exp.stopUpload = function (index) {

    }
    exp.closeUploadBox = function () {
        $(".ui-upload-box").hide();
        $(".ui-export-btn").text("<<");
    }
    exp.showUploadBox = function () {
        $(".ui-upload-box").show();
        $(".ui-export-btn").text(">>");
    }
});