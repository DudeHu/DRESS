/**
 * Created by huyuqiong on 2016/12/17.
 */
define(function(req,exp){
    "use strict";

    var $ = req("jquery");
    var service = req("utils.ajax");
    var FileProgress = req("utils.fileprogress");
    var stopCount = 0;
    var searchList = [];
    var page_count = 0;
    var total = 0;
    req("../bower_components/plupload/js/moxie.js");
    req("../bower_components/plupload/js/plupload.dev.js");
    req("../bower_components/plupload/js/i18n/zh_CN.js");
    req("utils.qiniu");
    exp.videoList = [];
    exp.delList = [];
    exp.lists = {
        cursor:1,                   //当前页数
        page_count:0,               //总页数
        total:0,                    //总条数
        step:10                      //每页显示数量
    };

    exp.args = {
        step:10,
        serachString:"",
        userId:sessionStorage.userId
    };

    const LENGTH=50*1024*1024;

    exp.onInit = function (done) {
        exp.videoList = [];
        exp.args = {
            step:10,
            serachString:"",
            userId:sessionStorage.userId
        };
        exp.delList = [];
        exp.lists = {
            cursor:1,                   //当前页数
            page_count:0,               //总页数
            total:0,                    //总条数
            step:10                      //每页显示数量
        };
        exp.getList(exp.args,done);
    }

    exp.goPage = function (page,render) {
        exp.args.cursor = exp.lists.cursor =  page;
        if(!exp.serachStatus){

            exp.getList(exp.args,function () {
                render();
                exp.render();
            });
        }else{
            exp.args.size = exp.lists.step;
            exp.args.page = page;
            service.searchByName(exp.args,function (rs) {
                if(rs.status == "SUCCESS"){
                    rs.data.list && (exp.videoList = rs.data.list);
                    exp.lists.page_count = rs.data.maxPage;
                    exp.lists.total = rs.data.totalCount;
                    exp.serachStatus = true;
                }else{
                    exp.lists.page_count = 0;
                    exp.lists.total = 0;
                    exp.videoList = [];
                }
                render();
                exp.listPart.render();
            });
        }
    }

    exp.getList = function (args,fn) {
        service.getVideoList(args,function (rs) {
            if(rs.status == "SUCCESS"){
                total = exp.lists.total = rs.data.totalCount;
                page_count = exp.lists.page_count = exp.lists.total%exp.lists.step==0?parseInt(exp.lists.total/exp.lists.step):parseInt(exp.lists.total/exp.lists.step)+1;
                rs.data.size && (exp.lists.step = rs.data.size);
                rs.data.list && (exp.videoList = rs.data.list);
                searchList = exp.videoList;
                fn && fn();
            }else{
                exp.alert(rs.msg);
            }
        });
    }
    
    var currentFile;
    var currentIndex = 0;
    exp._oldFilesCount = 0;
    exp.hasUploadCount = 0;
    exp.totalUploadCount = 0;
    var uploaded = [];
    exp._files = [];
    exp.onRender = function () {
        var uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',
            browse_button: 'pickfiles',
            container: 'container',
            drop_element: 'container',
            max_file_size: '500mb',
            flash_swf_url: '../bower_components/plupload/js/Moxie.swf',
            dragdrop: true,
            chunk_size: '5mb',
            max_retries: 0,
            get_new_uptoken: true,
            filters:{
                mime_types : [
                    { title : "video files", extensions : "mp4,flv" },
                ]
            },
            multi_selection: !(mOxie.Env.OS.toLowerCase()==="ios"),
            uptoken_url: "/node_service/checkMsgFile",
            // uptoken_func: function(){
            //     var ajax = new XMLHttpRequest();
            //     ajax.open('GET', $('#uptoken_url').val(), false);
            //     ajax.setRequestHeader("If-Modified-Since", "0");
            //     ajax.send();
            //     if (ajax.status === 200) {
            //         var res = JSON.parse(ajax.responseText);
            //         console.log('custom uptoken_func:' + res.uptoken);
            //         return res.uptoken;
            //     } else {
            //         console.log('custom uptoken_func err');
            //         return '';
            //     }
            // },
            domain: 'http://oj9agbelr.bkt.clouddn.com',
            // downtoken_url: '/downtoken',
            unique_names: true,
            save_key: true,
            // x_vars: {
            //     'id': '1234'
            // },
            auto_start: true,
            log_level: 5,
            init: {
                'FilesAdded': function(up, files) {
                    exp.totalUploadCount += files.length;
                    if(exp._files.length>0){
                        exp._oldFilesCount += exp._files.length;
                    }
                    var totalSize = 0;
                    plupload.each(files, function(file,index) {
                        FileProgress.bindEvent(file);
                        var _item = {};
                        _item.name = file.name;
                        _item.size = file.size/1024/1024;
                        totalSize += _item.size;
                        _item.status = true;
                        exp.parent.uploadCuList.push(_item);
                        console.log(exp.parent.uploadCuList);
                        exp._files.push(file);
                    });
                    service.getUserInfo({userId:sessionStorage.userId},function (rs) {
                        if(rs.status == "SUCCESS"){
                            var _space = 500 - Number(rs.data.space);
                            if( _space >= totalSize/1024/1024){

                                exp.parent.status = "uploading";
                                exp.parent.statusPart.render();
                                $(".ui-upload-box-stop").each(function(index) {
                                    var _this = $(this);
                                    var _file = files[index];
                                    _this.on('click', function () {
                                        if (!$(this).hasClass("start")) {
                                            $(this).addClass("start");
                                            stopCount += 1;
                                            exp.parent.uploadCuList[index].status = false;
                                            var _index = exp.findNext(files, index);
                                            up.stop();
                                            if(_index!=null){
                                                var _tem = up.files[0];
                                                up.files[0] = up.files[_index];
                                                up.files[_index] = _tem;
                                                currentIndex = _index;
                                                up.start();
                                            }
                                        } else {
                                            up.stop();
                                            exp.parent.uploadCuList[index] = true;
                                            stopCount > 0 && (stopCount -= 1);
                                            var _index = exp.findCurrent(up.files,_file.name);
                                            if(_index!=null){
                                                var _tem = up.files[_index];
                                                up.files[_index] = up.files[0];
                                                up.files[0] = _tem;
                                                currentIndex = index;
                                                up.start();
                                            }

                                        }
                                    });
                                });
                            }else {
                                exp.alert("存储空间不足！");
                            }
                        }else{
                            exp.alert(rs.msg);
                        }
                    });


                },
                'BeforeUpload': function(up, file) {
                    var _index = exp.findCurrent(exp._files,file.name);
                    if(_index!=null){
                        currentIndex = _index;
                    }
                    currentFile = file;
                },
                'UploadProgress': function(up, file) {
                    var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                    FileProgress.countProgress(file,currentIndex);
                },
                'UploadComplete': function(up,flie) {
                    if(up.status == plupload.DONE){
                        exp.parent.status = "success";
                        exp.parent.uploadCuList = uploaded;
                        exp.parent.statusPart.render();
                        exp.getList(exp.args,exp.listPart.render);
                    }else{
                        exp.alert("上传失败！请重新上传！");
                    }

                },
                'FileUploaded': function(up, file, info) {
                    FileProgress.countProgress(file,currentIndex);
                    var re = exp.findNext(up.files,currentIndex);
                    var ce = exp.findCurrent(exp._files,file.name);
                    exp.hasUploadCount += 1;
                    //$(".ui-upload-box-stop-"+(ce + exp._oldFilesCount)).hide();
                    exp.parent.uploadCuList[ce].complete = true;
                    exp.parent.statusPart.render();
                    if(re != null){
                        currentIndex = re;
                    }else{
                        up.stop();
                    }
                    info = JSON.parse(info);
                    var _item = {};
                    _item.userId = sessionStorage.userId;
                    _item.name = file.name;
                    _item.size = Math.round(file.size/1024/1024);
                    _item.qnVideoId = info.persistentId;
                    if(info.url){
                        _item.url = info.url;
                    }else{
                        var domain = up.getOption('domain');
                        _item.url = `${domain}/${encodeURI(info.key)}`;
                    }
                    service.getUserInfo({userId:sessionStorage.userId},function (rs) {
                            if(rs.status == "SUCCESS"){
                                var _space = 500-Number(rs.data.space);
                                exp.parent.header.space =  Number(rs.data.space);
                                exp.parent.header.render();
                                if( _space >= _item.size){
                                    service.uploadVideo(_item,function (rs) {
                                        if(rs.status == "SUCCESS"){
                                            uploaded.push(rs.data);
                                            exp.getList(exp.args,exp.listPart.render);
                                        }else{
                                            exp.alert(rs.msg);
                                        }
                                    });
                                }else {
                                    exp.alert("存储空间不足！");
                                }
                            }else{
                                exp.alert(rs.msg);
                                up.stop();
                            }
                    });

                },
                'Error': function(up, err, errTip) {
                    var _index = exp.findNext(exp._files,currentIndex);
                    console.log(err);
                   // exp.alert(err.file.name + "上传" + errTip +"，" + "请重新上传！");
                    if(!_index){
                        up.stop();
                    }
                    up.stop();
                }
            }
        });

        uploader.bind('FileUploaded', function() {
            if(exp.hasUploadCount == exp.totalUploadCount){
                exp.parent.status = "success";
                //exp.parent.uploadCuList = uploaded;
                exp.parent.statusPart.render();
                exp.hasUploadCount = 0;
                exp.totalUploadCount = 0;
                exp.parent.uploadCuList = [];
                setTimeout(function () {
                    exp.parent.status = "none";
                    exp.parent.statusPart.render();
                },3000);
            }
        });
        exp.dealClear();
    }


    exp.selectSingle = function (id) {
        var _ele = exp.$element;
        if(_ele.is(':checked') && ($("[name='checkboxInput']:checked").length == exp.videoList.length)){
            $("#checkboxInput").prop("checked",true);
            $("#checkboxInput").parent().addClass("on");
        }else if(!_ele.is(':checked') &&  $("#checkboxInput").is(':checked')){
            $("#checkboxInput").prop("checked",false);
            $("#checkboxInput").removeClass("on");
            exp.delListFromId(id);
        }
        if(_ele.is(':checked')){
            _ele.parent().addClass("on");
            exp.delList.push(id);
        }else{
            exp.delListFromId(id);
            _ele.parent().removeClass("on");
        }
        exp.showDelBtn();
    }

    exp.findCurrent = function (files,name) {
        var result = null;
        files.forEach(function (ele,index) {
            if(ele.name == name){
                result = index;
                return false;
            }

        });
        return result;
    }

    exp.findNext = function (files,index) {
        var result = null;
        for(var i=index;i<files.length;i++){
            if((files[i].status == 1)&&(exp.parent.uploadCuList[i].status)){
                result = i;
                break;
            }
        }

        if(!result){
            for(var i=0;i<index;i++){
                if((files[i].status == 1)&&(exp.parent.uploadCuList[i].status)){
                    result = i;
                    break;
                }
            }
        }

        return result;
    }
    exp.delListFromId = function (id) {
        exp.delList.forEach(function (ele,index) {
            if(ele == id){
                exp.delList.splice(index,1);
            }
        });
    }

    exp.selectAll = function () {
        var _ele = exp.$element;
        if(_ele.is(':checked')){
            exp.delList = [];
            $("[name='checkboxInput']").prop("checked",true);
            $("[name='checkboxInput']").parent().addClass("on");
            exp.videoList.forEach(function (ele) {
                exp.delList.push(ele.id);
            })
            _ele.parent().addClass("on");
        }else{
            $("[name='checkboxInput']").prop("checked",false);
            exp.delList = [];
            $("[name='checkboxInput']").parent().removeClass("on");
            _ele.parent().removeClass("on");
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
        if($("#searchInput").val()!=""){
            exp.args.size = exp.lists.step;
            //exp.args.page = exp.lists.cursor;
            service.searchByName(exp.args,function (rs) {
                if(rs.status == "SUCCESS"){
                    rs.data.list && (exp.videoList = rs.data.list);
                    exp.lists.page_count = rs.data.maxPage;
                    exp.lists.total = rs.data.totalCount;
                    exp.serachStatus = true;
                }else{
                    exp.lists.page_count = 0;
                    exp.lists.total = 0;
                    exp.videoList = [];
                }
                exp.listPart.render();
            });
        }
            /*else{
            exp.args.serachString = "";
            exp.serachStatus = false;
            exp.showOlderList();
            exp.listPart.render();
        }*/

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


    exp.uploadA = function () {
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
    exp.delVideo = function () {
      console.log(exp.delList);
      if(exp.delList.length>0) {
          service.deleteVideo({videoIds:exp.delList.toString()}, function (rs) {
                if(rs.status == "SUCCESS"){
                    service.getVideoList(exp.args,function (rs) {
                        if(rs.status == "SUCCESS"){
                            exp.lists.total = rs.data.totalCount;
                            exp.lists.page_count = exp.lists.total%exp.lists.step==0?parseInt(exp.lists.total/exp.lists.step):parseInt(exp.lists.total/exp.lists.step)+1;
                            if(rs.data.list)
                                exp.videoList = rs.data.list;
                            else
                                exp.videoList = [];
                            exp.parent.header.getSpace(function () {
                                exp.parent.header.render();
                                exp.render();
                                exp.autoTip("删除成功！");
                            });

                        }else{
                            exp.alert(rs.msg);
                        }

                    });

                }else{
                    exp.alert("删除失败！");
                }
          })
      }
    }
    exp.clearSearch = function () {
        $("#searchInput").val("");
        exp.args.serachString = "";
        exp.serachStatus = false;
        exp.showOlderList();
    }

    exp.showOlderList = function () {
        $(".ui-clearBtn").hide();
        exp.videoList = searchList;
        exp.lists.page_count = page_count;
        exp.lists.total = total;
        exp.listPart.render();
    }

    exp.dealClear = function(){
       $("#searchInput").on("input",function () {
           if($(this).val()!="")
               $(".ui-clearBtn").show();
           else
               exp.showOlderList();
       });
    }

    exp.autoTip = function (msg) {
        var tipHtml = $('<div class="sk-dialog-position">'
                     +'<div>'
                     +'<div class="sk-dialog">'
                     +'<div class="sk-dialog-top">'
                     +'<div class="sk-dialog-tit">'
                     +'<strong>提示</strong>'
                     +'</div>'
                     +'</div>'
                     +'<div class="sk-dialog-cont">'
                     +'<div class="sk-dialog-txt">'
                     +'<p>'+msg+'</p>'
                     +'</div>'
                     + '</div>'
                     +'<div class="sk-com-clear"></div>'
                     +'</div>    </div>    <div class="sk-dialog-bg"></div></div>');

        $("body").append(tipHtml);
        setTimeout(function () {
            tipHtml.remove();
        },1500)
    }
});