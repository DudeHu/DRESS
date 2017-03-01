/**
 * Created by huyuqiong on 2016/12/17.
 */
define(function (req,exp) {
    "use strict";

    var service = req("utils.ajax");
    var currentPlayTime = 0;
    var times = {};
    var pauseTime = 0;
    exp.args = {
        rangeVal:0,
        serachString:""
    }

    exp.senceMask = {};

    exp.playList = {};
    exp.masks = [];

    exp.rangeWidth = 0;

    exp.searchResultList = {};
    exp.searchResultListStatus = false;
    exp.mask = {
        width:0,
        height:0,
        x:0,
        y:0,
        text:""
    }
    exp.videoInfo = {
        name:"",
        objectTagNums:0,
        sceneTagNums:0,
        starTagNums:0,
        size:0,
        videoUrl:"",
        uploadTime:""
    };
    var doneStatus = false;
    var renderStatus = false;
    var playStatus = false;
    var hasStart = false;
    exp.onInit = function (done) {
        exp.playList = {};
        exp.masks = [];
        exp.senceMask = {};
        exp.rangeWidth = 0;

        exp.searchResultList = {};

        exp.mask = {
            width:0,
            height:0,
            x:0,
            y:0,
            text:""
        }
        exp.args = {
            rangeVal:0,
            serachString:""
        }
        exp.videoInfo = {
            name:"",
            objectTagNums:0,
            sceneTagNums:0,
            starTagNums:0,
            size:0,
            videoUrl:"",
            uploadTime:""
        };
        exp.parent.params[1] && (exp.args.videoId = exp.parent.params[1]);
        exp.searchResultListStatus = false;
        service.getVideoDetail(exp.args,function (rs) {
            if(rs.status == "SUCCESS"){
                exp.videoInfo = rs.data;
                exp.playList = rs.data.trailInfo;
                renderStatus = true;
                if(doneStatus){
                    exp.render();
                }else{
                    done();
                }
            }else{
                exp.alert(rs.msg);
            }
        });

        setTimeout(function (rs) {
            done();
            doneStatus = true;
        },5000);

    }

    var firstPlay = false;

    exp.onRender = function () {
        if(renderStatus) {
            var _ew = $(".ui-video-detail-video").width()+ $(".ui-video-detail-info").width();
            var _aw = $(".ui-videoDetail-con").width();
            if(_ew > _aw ){
                $(".ui-videoDetail-con").css("width",_ew + 60 + "px");
            }
            var Media = document.getElementById("videoDom");
            Media.addEventListener("timeupdate",function (e) {
                var _n = Math.round(e.currentTarget.currentTime);
                var _f = exp.videoInfo.fps;
                var _time = Math.round(e.currentTarget.currentTime*_f);
                if(!playStatus){
                    currentPlayTime = _time;
                    playStatus = true;
                    exp.runMask(1);
                }

                exp.dealSenceMask(_n);
            });
            Media.addEventListener("play", function (e) {
                playStatus = true;
                hasStart = false;
                if(!firstPlay){
                    exp.dealMask(1000/exp.videoInfo.fps);
                    firstPlay = true;
                }else{
                    var sTime = new Date().getTime();
                    var _n = Math.floor(e.currentTarget.currentTime);
                    var _f = exp.videoInfo.fps;
                    var _time = _n * _f;
                    if((_time-pauseTime>=_f)||(pauseTime-_time>=_f)){
                        Media.currentTime = _n;
                        currentPlayTime = _time;
                       $(".ui-video-mask").html("").hide();
                    }
                    var eTime = new Date().getTime();
                    exp.dealMask(1000/exp.videoInfo.fps-(eTime-sTime));
                }
            }, false);
            Media.addEventListener("pause", function (e) {
                console.log(currentPlayTime,"current");
                pauseTime = Math.round(e.currentTarget.currentTime * exp.videoInfo.fps);
                console.log(pauseTime,"pause");
                playStatus = false;
            }, false);
            Media.addEventListener("waitting", function (e) {
                pauseTime =  Math.round(e.currentTarget.currentTime * exp.videoInfo.fps);
                playStatus = false;
            }, false);
        }
        exp.dealClear();
    }



    exp.dealTimes = function () {
        clearTimeout(maskTime);
        for(var o in times){
            clearInterval(times[o]);
            delete times[o];
        }
    }

    exp.dealMask = function (_time) {
         window.setTimeout(function () {
             exp.runMask();
        },_time);
    }

    exp.runMask = function (flag) {
        var sTime = new Date().getTime();
        if(playStatus){
            var _e = exp.playList[currentPlayTime];
            if(_e && _e.length>0){
                $(".ui-video-mask").html("");
                $(".ui-video-mask").show();
                _e.forEach(function (ele,index) {
                   exp.dealCMask(ele,index,currentPlayTime);
                });
            }else{
                $(".ui-video-mask").html("");
                $(".ui-video-mask").hide();
            }
            if(!flag){
                currentPlayTime += 1;
                var eTime = new Date().getTime();
                var difTime = eTime-sTime;
                exp.dealMask(1000/exp.videoInfo.fps-difTime-1);
            }else{
                playStatus = false;
            }

        }
    }

    exp.dealCMask = function (ele,index,c) {
                        var mask = {};
                        mask.text = ele.name;
                        mask.width = Math.round(ele.width * 100);
                        mask.height = Math.round(ele.height * 100);
                        mask.x = Math.round(ele.x * 100);
                        mask.y = Math.round(ele.y * 100);
                        mask.i = c + '' + index;
                        exp.addMask(mask);
    }


    exp.addMask =  function (mask) {
        $('.ui-video-mask-con-'+mask.i).remove();
        var tipLeft = Number(mask.x)>94?94:mask.x;

       var maskHtml =  $('<div class="ui-com-clearFix ui-video-mask-con-'+mask.i+'"><div style="left:'+tipLeft+'%;top:'+(Number(mask.y)-6)+'%" class="ui-video-mask-tip">'
            +'<div class="ui-video-mask-txt">'+mask.text+'</div>'
            +'<div class="ui-video-mask-trangle"></div>'
            +'</div>'
            +'<div style="width:'+mask.width+'%;height:'+mask.height+'%;left:'+mask.x+'%;top:'+mask.y+'%"  class="ui-video-mask-range ui-video-mask-range'+mask.i+'"></div></div>');
       $(".ui-video-mask").append(maskHtml);
    }
    
    exp.dealSenceMask = function (time) {
        exp.videoInfo.senceList.forEach(function (ele,index) {
            var _t =exp.formatTime(ele.startTime);
            var _te = exp.formatTime(ele.endTime);
            if( _t == time){
                exp.senceMask.name =  ele.name;
                exp.senceMaskPart.render().show();
                var _t = setTimeout(function () {
                    if(!playStatus){
                        exp.senceMaskPart.hide();
                        clearTimeout(_t);
                    }
                }, (_te - _t)*1000);
            }
        });
    }

    exp.timeSelect = function () {
        var _ele = exp.$element;
        var _min = _ele.attr("min");
        var _max = _ele.attr("max");
        var _val = _ele.val();
        exp.rangeWidth = (_val-_min)/(_max-_min) * 100-0.39*_val+"%";
        exp.rangePart.render();
        exp.search(true,_val);
    }

    exp.showHideAllDetail = function () {
        var _ele = exp.$element;
        if(_ele.text() == "－"){
            _ele.closest(".ui-statics-list-con").find(".ui-statics-list").hide();
            _ele.text("＋");
        }else{
            _ele.closest(".ui-statics-list-con").find(".ui-statics-list").show();
            _ele.text("－");
        }
    }

    exp.showHideDetail = function () {
        var _ele = exp.$element;
        if(_ele.hasClass("ui-detail-unexport-icon")){
            _ele.closest("li").find(".ui-list-item-detail").show();
            _ele.removeClass("ui-detail-unexport-icon").addClass("ui-detail-export-icon");
        }else{
            _ele.closest("li").find(".ui-list-item-detail").hide();
            _ele.removeClass("ui-detail-export-icon").addClass("ui-detail-unexport-icon");
        }
    }

    exp.formatTime = function (timeStr) {
        var times = timeStr.split(":");
        var hour = parseInt(times[0],10);
        var min = parseInt(times[1],10);
        var second = parseInt(times[2],10);
        return second + min*60 + hour*60*60;
    }

    exp.downloadJSON = function (url) {
        var aLink = document.createElement('a');
        //var blob = new Blob([JSON.stringify(content)]);
        var _fileReg = new RegExp(".+/(.+)$");
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", false, false);
        aLink.download = url.match(_fileReg);
        aLink.href = url;
        aLink.dispatchEvent(evt);
        aLink.click();
    }


    exp.search = function (flag,value) {
        if(($("#searchInput").val()!="")||flag) {
            service.searchByTag(exp.args, function (rs) {
                if (rs.status == "SUCCESS") {
                    exp.searchResultList = rs.data;
                } else {
                    exp.searchResultList = {};
                }
                exp.searchResultListStatus = true;
                exp.tagListPart.render();
            });
        }

    }

    exp.clearSearch = function () {
        $("#searchInput").val("");
        exp.args.serachString = "";
        exp.search(true);
    }

    exp.showOlderList = function () {
        $(".ui-clearBtn").hide();
        exp.searchResultListStatus = false;
        exp.searchResultList = {};
        exp.tagListPart.render();
    }

    exp.dealClear = function(){
        $("#searchInput").on("input",function () {
            if($(this).val()!="")
                $(".ui-clearBtn").show();
            else{
                exp.args.serachString = "";
                exp.search(true);
            }
        });
    }
});