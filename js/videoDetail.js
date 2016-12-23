/**
 * Created by huyuqiong on 2016/12/17.
 */
define(function (req,exp) {

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

    exp.rangeWidth = 0;

    exp.onInit = function () {

    }
    exp.mask = {
        width:0,
        height:0,
        x:0,
        y:0,
        text:""
    }

    exp.onInit = function (done) {
        done();
    }
    
    exp.onRender = function () {
        var Media = document.getElementById("videoDom");
        Media.addEventListener("timeupdate",function(e){
            var _t = Math.round(Media.currentTime);
            var _e =exp.playList[_t];
            if(_e){
                exp.mask.width = _e.width;
                exp.mask.height = _e.height;
                exp.mask.text = _e.name;
                exp.mask.x = _e.left;
                exp.mask.y = _e.top;
                exp.videoMask.render();
                exp.videoMask.show();
                window.setTimeout(function () {
                    exp.videoMask.hide();
                },_e.duration*1000);
            }
        },false);
    }

    exp.search = function () {

    }

    exp.timeSelect = function () {
        var _ele = exp.$element;
        var _min = _ele.attr("min");
        var _max = _ele.attr("max");
        var _val = _ele.val();
        console.log(_val);
        exp.rangeWidth = (_val-_min)/(_max-_min) * 100-0.4*_val+"%";
        exp.rangePart.render();
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
    var fileName = "video.json";
    var content = {
        name:123123,
        sadd:3123
    };
    exp.downloadJSON = function () {
            var aLink = document.createElement('a');
            var blob = new Blob([JSON.stringify(content)]);
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
            aLink.download = fileName;
            aLink.href = URL.createObjectURL(blob);
            aLink.dispatchEvent(evt);
            aLink.click();
    }
});