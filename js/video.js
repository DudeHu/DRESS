/**
 * Created by huyuqiong on 2016/12/17.
 */
define(function(req,exp){
    "use strict";
    exp.videoList = []
    exp.lists = {
        cursor:1,                   //当前页数
        page_count:2,               //总页数
        total:0,                    //总条数
        step:0                      //每页显示数量
    };
    exp.args = {
        "serachString":""
    }

    const LENGTH=50*1024*1024;

    exp.onInit = function (done) {
        exp.videoList = [
            {
                "name":"如果蜗牛有爱情.mp4",
                "time":1481974491687,
                "size":"93MB",
                "counts":320,
                "state":"ed"
            },
            {
                "name":"如果蜗牛有爱情.mp4",
                "time":1481974411687,
                "size":"13MB",
                "counts":320,
                "state":"ed"
            },
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
        ];
        exp.lists.total = 3;
        done();
    }

    exp.onRender = function () {
        /*$('#uploadFile').uploadify({
            'formData'     : {
                'timestamp' : new Date().getTime(),
                'token'     : "dsadad23342342dzsdsdkg"
            },
            'fileTypeDesc':'支持的格式：',
            'buttonClass':'ui-web-btn-mid',
            'buttonText':'上传',
            'swf':"../utils/uploadify.swf",
            'onFallback':function(){             //检测FLASH失败调用
                alert("您未安装FLASH控件，无法上传图片！请安装FLASH控件后再试。");
             },
            'averageSpeed':100,
            'onUploadSuccess':function(file, data, response) {  //上传到服务器，服务器返回相应信息到data里
                if (data) {
                    var dataObj = eval("(" + data + ")");//转换为json对象
                    //$('#uploadify').uploadify('upload')
                    conlog.log(dataObj);
                }
            },
            'itemTemplate' : '<div id="${fileID}" class="uploadify-queue-item">\
					<div class="cancel">\
						<a href="javascript:$(\'#${instanceID}\').uploadify(\'cancel\', \'${fileID}\')">X</a>\
					</div>\
					<span class="fileName">${fileName} (${fileSize})</span><span class="data"></span>\
				</div>'
        });*/
    }


    exp.selectSingle = function () {
        var _ele = exp.$element;
        if(_ele.is(':checked') && ($("[name='checkboxInput']:checked").length == exp.videoList.length)){
            $("#checkboxInput").prop("checked",true);
        }else if(!_ele.is(':checked') &&  $("#checkboxInput").is(':checked')){
            $("#checkboxInput").prop("checked",false);
        }
        exp.showDelBtn();
    }

    exp.selectAll = function () {
        var _ele = exp.$element;
        if(_ele.is(':checked')){
            $("[name='checkboxInput']").prop("checked",true);
        }else{
            $("[name='checkboxInput']").prop("checked",false);
        }
        exp.showDelBtn();
    }

    exp.showDelBtn = function () {
        if(($("[name='checkboxInput']:checked").length>0))
            $(".ui-web-del-btn").show();
        else
            $(".ui-web-del-btn").hide();
    }

    exp.search = function () {
        console.log(exp.args.serachString);
    }
    
    exp.uploadProgressShow = function (files,loaded) {
        for(var i=0;i<files.length;i++){
            var _size = 0;
            var _csize = files[i].size;
            for(var j=0;j<=i;j++){
                _size += files[j].size;
            }
            if(loaded>=_size) {
                for (var k = 0; k <= i; k++) {
                    $(".ui-upload-box-process-" + k).children("span").css('width', "100%");
                    $(".ui-upload-process-val-" + k).text("100%");
                }
            }else{
                    var _tent = Math.round((1-(_size-loaded)/_csize)*100);
                    console.log(_tent);
                    $(".ui-upload-box-process-"+i).children("span").css('width',_tent + "%");
                    $(".ui-upload-process-val-"+i).text(_tent+"%");
                    break;
            }

        }

    }

    var filesList=[];

    exp.upload = function () {
        var el = document.getElementById("uploadFile");
        for(var i=0;i<el.files.length;i++){
            var _file = el.files[i];
            var _item = {};
            _item.name = _file.name;
            _item.size = Math.ceil(_file.size/1024/1024) + "MB";
            exp.parent.uploadCuList.push(_item);
            filesList.push(_file);
        }
        exp.parent.status = "uploading";
        exp.parent.statusPart.render();
        filesList.forEach(function (ele,index) {
            exp.uploadFiles(ele,index);
        });
    }

    exp.uploadFiles = function (file,index) {
        var form = new FormData();
        var dataset = document.body.dataset;
        var host = dataset && dataset.host || "";
        var ot;
        var oloaded;

        form.append("files",file);
        form.append("userId","123123132");
        form.append("orderId","11111");

        var oReq = new XMLHttpRequest();
        oReq.open( "POST", `${host}/service/checkMsgFile`, true );
        oReq.onload = function(oEvent) {
            var rs = JSON.parse(oReq.responseText);
            if (oReq.status == 200 && rs.success) {
                console.log("success");
            } else {
                console.log("fail");
            }
        };
        $(".ui-upload-box-stop-"+index).on('click',function () {
            var _this = $(this);
            exp.confirm("确定取消该文件的上传？",function () {
                oReq.abort();
                _this.remove();
            },function(){

            });
        });

        oReq.upload.onprogress= function (evt) {
            if (evt.lengthComputable) {//
                var _tent = Math.round(evt.loaded / evt.total * 100);
                $(".ui-upload-box-process-"+index).children("span").css('width',_tent + "%");
                $(".ui-upload-process-val-"+index).text(_tent + "%");
                if(_tent==100)
                $(".ui-upload-box-stop-"+index).remove();
            }

            var time = document.getElementById("time");
            var nt = new Date().getTime();//获取当前时间
            var pertime = (nt-ot)/1000; //计算出上次调用该方法时到现在的时间差，单位为s
            ot = new Date().getTime(); //重新赋值时间，用于下次计算

            var perload = evt.loaded - oloaded; //计算该分段上传的文件大小，单位b
            oloaded = evt.loaded;//重新赋值已上传文件大小，用以下次计算

            //上传速度计算
            var speed = perload/pertime;//单位b/s
            var bspeed = speed;
            var units = 'b/s';//单位名称
            if(speed/1024>1){
                speed = speed/1024;
                units = 'k/s';
            }
            if(speed/1024>1){
                speed = speed/1024;
                units = 'M/s';
            }
            speed = speed.toFixed(1);
            //剩余时间
            var resttime = ((evt.total-evt.loaded)/bspeed).toFixed(1);

            time.innerHTML = '，速度：'+speed+units+' ，剩余时间：'+resttime+'s';
            if(bspeed==0)
                time.innerHTML = '上传已取消';
            }

            oReq.send(form);
    }
});