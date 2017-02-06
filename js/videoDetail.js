/**
 * Created by huyuqiong on 2016/12/17.
 */
define(function (req,exp) {
    "use strict";

    var service = req("utils.ajax");
    var maskTime = null;
    var currentPlayTime = 0;
    var currentPlayTimeS = 0;
    var times = {};
    var currentTotal = 0;
    var maskChildTime = {};
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
    var playStatusS = false;
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
            var has = false;
            var oldTime = 0;
            Media.addEventListener("timeupdate",function (e) {
                exp.dealSenceMask(Math.round(e.currentTarget.currentTime));
                var _time = Math.round(e.currentTarget.currentTime * exp.videoInfo.fps);
                if((_time < currentPlayTimeS) || (oldTime == _time)){
                    currentPlayTime = _time;
                    exp.videoMask.hide();
                    exp.dealMask(true);
                }
                oldTime = _time;

            });
            Media.addEventListener("play", function (e) {
                //currentPlayTime = Math.round(e.currentTarget.currentTime * exp.videoInfo.fps);
                playStatus = true;
                if(!firstPlay){
                    exp.dealMask();
                    firstPlay = true;
                }else{
                    exp.dealMask(true);
                }
            }, false);
            Media.addEventListener("pause", function (e) {
                currentPlayTimeS = Math.round(e.currentTarget.currentTime * exp.videoInfo.fps);
                playStatus = false;
                playStatusS = false;
                console.log("pause:"+currentPlayTime + "..." + currentPlayTimeS);
            }, false);
            Media.addEventListener("waitting", function (e) {
                currentPlayTimeS = Math.round(e.currentTarget.currentTime * exp.videoInfo.fps);
                //exp.dealMask(false);
                playStatus = false;
                playStatusS = false;

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

    exp.dealMask = function (flag) {
        //exp.dealTimes();
         maskTime = window.setTimeout(function () {
          if(playStatus){
            var _e = exp.playList[currentPlayTime];
            if(_e && _e.length>0){
                exp.masks=[];
                _e.forEach(function (ele,index) {
                    if(!flag)
                        currentPlayTimeS = currentPlayTime;
                    playStatus = false;
                    playStatusS = true;
                    currentTotal = 0;
                    var _c = ele.trail[currentPlayTimeS];
                    if(_c)
                        exp.dealCMask(ele,index,_e.length);
                    else{
                        currentTotal += 1;
                        if(_e.length == currentTotal){
                            exp.videoMask.hide();
                            playStatus = true;
                            currentPlayTime = currentPlayTimeS + 1;
                            exp.dealMask();
                        }
                    }
                });
            }else{
                currentPlayTime += 1;
                clearTimeout(maskTime);
                exp.dealMask();
            }
          }
        },1000/exp.videoInfo.fps);

    }


    exp.dealCMask = function (ele,index,total) {
        var text = ele.name;
            var time_index = currentPlayTimeS;
            setTimeout(function () {
                if(playStatusS) {
                   var _c = ele.trail[currentPlayTimeS];
                    if (_c) {
                        exp.masks[index] = {};
                        exp.masks[index].text = text;
                        exp.masks[index].width = Math.round(_c.width * 100);
                        exp.masks[index].height = Math.round(_c.height * 100);
                        exp.masks[index].x = Math.round(_c.x * 100);
                        exp.masks[index].y = Math.round(_c.y * 100);
                        exp.videoMask.render();
                        currentPlayTimeS += 1;
                        exp.dealCMask(ele, index,total);
                    }else{
                        exp.videoMask.hide();
                        currentTotal += 1;
                        if(total == currentTotal){
                            exp.videoMask.hide();
                            playStatus = true;
                            currentPlayTime = currentPlayTimeS + 1;
                            exp.dealMask();
                        }
                    }
                }
            },1000/exp.videoInfo.fps);
            exp.videoMask.show();
    }
    
    exp.dealSenceMask = function (time) {
        exp.videoInfo.senceList.forEach(function (ele,index) {
            var _t =exp.formatTime(ele.startTime);
            var _te = exp.formatTime(ele.endTime);
            if( _t == time){
                exp.senceMask.name =  ele.name;
                exp.senceMaskPart.render().show();
                var _t = setTimeout(function () {
                    exp.senceMaskPart.hide();
                    clearTimeout(_t);
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
            if(value == 3){
                exp.args.rangeVal = 0;
            }
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