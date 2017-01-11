/**
 * Created by huyuqiong on 2017/1/6.
 */
define(function (req,exp) {
    "use strict";
    var $ = req("jquery");

    exp.bindEvent = function (file) {
        var parseBtn = $(".ui-upload-box-parse");
        parseBtn.on("click",function () {
            if(parseBtn.attr("status") == "play"){
                parseBtn.attr("status","stop");
            }
        });
    }

    exp.countProgress = function (file,index) {
        var percentage = file.percent;

        var progressbar = $('.ui-upload-box-process-'+index).children("span");
        var progressText = $(".ui-upload-process-val-"+index);

        percentage = parseInt(percentage, 10);
        if (file.status !== plupload.DONE && percentage === 100) {
            percentage = 99;
        }

        progressbar.css('width', percentage + '%');
        progressText.text(percentage + '%');

    }
});