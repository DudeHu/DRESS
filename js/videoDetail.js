/**
 * Created by huyuqiong on 2016/12/17.
 */
define(function (req,exp) {
    "use strict";

    var service = req("utils.ajax");
    var maskTime = null;
    var currentPlayTime = 0;
    var times = {};
    exp.args = {
        rangeVal:3,
        serachString:""
    }

    exp.playList = {
        1:{
            name:"aaa",
            duration:3.25,
            width:200,
            height:100,
            top:100,
            left:200
        },
        10:{
            name:"爱的啊",
            duration:1.55,
            width:200,
            height:100,
            top:200,
            left:100
        },
        15:{
            name:"wodefs",
            duration:2.25,
            width:150,
            height:250,
            top:100,
            left:200
        },
        35:{
            name:"我是多少",
            duration:3.25,
            width:200,
            height:100,
            top:100,
            left:200
        },
        60:{
            name:"哎哎",
            duration:1.78,
            width:300,
            height:100,
            top:200,
            left:50
        }
    }
    exp.masks = [];

    exp.rangeWidth = 0;

    exp.searchResultList = {};

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
    exp.onInit = function (done) {

        exp.parent.params[1] && (exp.args.videoId = exp.parent.params[1]);

        service.getVideoDetail(exp.args,function (rs) {
            if(rs.status == "SUCCESS"){
                exp.videoInfo = rs.data;
                exp.playList = rs.data.trailInfo;
                done();
            }else{
                exp.alert(rs.msg);
            }
        });


    }
    
    exp.onRender = function () {
        var Media = document.getElementById("videoDom");
        var has = false;

        Media.addEventListener("timeupdate",function(e){
           //currentPlayTime = Math.round(Media.currentTime*25);
           //exp.dealMask(true);
           /* if(!has && (Media.readyState > 0)) {
                var hour = parseInt(Media.duration / 60 /60);
                var minutes = parseInt(Media.duration / 60);
                var seconds = Math.round(Media.duration % 60);
                hour = hour<10?("0"+hour):hour;
                minutes = minutes<10?("0"+minutes):minutes;
                seconds = seconds<10?("0"+seconds):seconds;
                exp.videoInfo.duration = `${hour}:${minutes}:${seconds}`;
                exp.videoInfoPart.render();
                has = true;
            }
            if(_e && _e.length>0){
                var _t = exp.playList[_t1]?_t1:_t2;
                _e.forEach(function (ele,index) {
                    var text = ele.name;
                    clearInterval(time);
                    var time = window.setInterval(function () {
                        var _c = ele.trail[_t];
                        if(_c !== undefined){
                            exp.masks[index] = {};
                            exp.masks[index].text = text;
                            exp.masks[index].width = Math.round(_c.width * 100);
                            exp.masks[index].height = Math.round(_c.height * 100);
                            exp.masks[index].x = Math.round(_c.x * 100);
                            exp.masks[index].y = Math.round(_c.y * 100);
                            exp.videoMask.render();
                            _t = _t+1;
                        }else{
                            exp.masks = [];
                            clearInterval(time);
                        }
                    },1000/exp.videoInfo.fps);
                });
                exp.videoMask.show();
            }else{
                exp.videoMask.hide();
            }
            */
        },false);
        Media.addEventListener("play",function(e){
            if(!has && (Media.readyState > 0)) {
                var hour = parseInt(Media.duration / 60 /60);
                var minutes = parseInt(Media.duration / 60);
                var seconds = Math.ceil(Media.duration % 60);
                seconds = seconds>0?seconds-1:seconds;
                hour = hour<10?("0"+hour):hour;
                minutes = minutes<10?("0"+minutes):minutes;
                seconds = seconds<10?("0"+seconds):seconds;
                exp.videoInfo.duration = `${hour}:${minutes}:${seconds}`;
                exp.videoInfoPart.render();
                has = true;
            }
            currentPlayTime = Math.round(e.currentTarget.currentTime * 25);
            exp.dealMask(true);
        },false);
        Media.addEventListener("pause",function(e){
            currentPlayTime = Math.round(e.currentTarget.currentTime * 25);
            exp.dealMask(false);
        },false);
        Media.addEventListener("waitting",function(e){
            currentPlayTime = Math.round(e.currentTarget.currentTime * 25);
            exp.dealMask(false);
        },false);
    }



    exp.dealTimes = function () {
        clearInterval(maskTime);
        for(var o in times){
            clearInterval(times[o]);
        }
    }
    
    exp.dealMask = function (flag) {
        exp.dealTimes();
        if(flag){
         maskTime = window.setInterval(function () {
             var _e = exp.playList[currentPlayTime];
            if(_e && _e.length>0){
                exp.masks=[];
                _e.forEach(function (ele,index) {
                    var text = ele.name;
                    var _c = ele.trail[currentPlayTime];
                    if(_c){
                        var time_index = currentPlayTime;
                        clearInterval(maskTime);
                        clearInterval(times[currentPlayTime+""+index]);
                        times[currentPlayTime+""+index] = setInterval(function () {
                            _c = ele.trail[currentPlayTime];
                            if(_c){
                                exp.masks[index] = {};
                                exp.masks[index].text = text;
                                exp.masks[index].width = Math.round(_c.width * 100);
                                exp.masks[index].height = Math.round(_c.height * 100);
                                exp.masks[index].x = Math.round(_c.x * 100);
                                exp.masks[index].y = Math.round(_c.y * 100);
                                exp.videoMask.render();
                                currentPlayTime += 1;
                            }else{
                                exp.videoMask.hide();
                                clearInterval(times[time_index+""+index]);
                                delete times[time_index+""+index];
                                exp.dealMask(true);
                            }
                        },1000/exp.videoInfo.fps);
                        exp.videoMask.show();
                    }else{
                        currentPlayTime += 1;
                    }
                });
            }else{
                currentPlayTime += 1;
            }

        },1000/exp.videoInfo.fps);
        }
    }


    exp.timeSelect = function () {
        var _ele = exp.$element;
        var _min = _ele.attr("min");
        var _max = _ele.attr("max");
        var _val = _ele.val();
        console.log(_val);
        exp.rangeWidth = (_val-_min)/(_max-_min) * 100-0.4*_val+"%";
        exp.rangePart.render();
        exp.search();
    }

    exp.showHideAllDetail = function () {
        var _ele = exp.$element;
        if(_ele.text() == "－"){
            _ele.closest(".ui-statics-list-con").find(".ui-list-item-detail").hide();
            _ele.text("＋");
        }else{
            _ele.closest(".ui-statics-list-con").find(".ui-list-item-detail").show();
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


    exp.search = function () {
        if($("#queryTag").val() && $("#queryTag").val().length>1) {
            service.searchByTag(exp.args, function (rs) {
                if (rs.status == "SUCCESS") {
                    exp.searchResultList = rs.data;
                } else {
                    exp.searchResultList = {};
                }
                exp.searchResultListStatus = true;
                exp.tagListPart.render();
            });
        }else{
            exp.searchResultListStatus = false;
            exp.searchResultList = {};
            exp.tagListPart.render();
        }

    }

});