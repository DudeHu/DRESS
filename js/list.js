/**
 * Created by huyuqiong on 2016/12/17.
 */
define(function(req,exp){
    "use strict";
    exp.status = "none";
    exp.page="video";
    exp.uploadCuList = [];
    exp.uploadList = []
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

    exp.showCloseUploadBox = function () {
        if(exp.$element.hasClass("ui-export-btn")){
            exp.closeUploadBox();
        }else{
            exp.showUploadBox();
        }
    }

    exp.closeUploadBox = function () {
        $(".ui-upload-box").hide();
        $(".ui-upload-ex-btn").removeClass("ui-export-btn").addClass("ui-unexport-btn");
    }
    exp.showUploadBox = function () {
        $(".ui-upload-box").show();
        $(".ui-upload-ex-btn").removeClass("ui-unexport-btn").addClass("ui-export-btn");;
    }
});