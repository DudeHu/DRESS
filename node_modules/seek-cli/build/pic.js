/**
 * 图片编码
 * Created by likaituan on 15/9/18.
 */

var fs = require("fs");
var path = require("path");
var {getResolveFile} = require("./utils");

var allImages = {};
var index = 0;

//获取短路径
var getShortImage = function (uri, referUrl) {
    var fullImage = getResolveFile(uri, referUrl);
    var sn = allImages[fullImage];
    if(!sn) {
        sn = allImages[fullImage] = ++index + path.parse(fullImage).ext;
        imgList.push({sn:sn, url:fullImage});
    }
    return sn;
};

//查找图片
exports.findImage = function(mod){
    var url = mod.url;
    if(/\.html$/i.test(url)){
        mod.code = mod.code.replace(/src\s*=\s*\"(.+?)\"/ig, function(_,img){
            if(/\{.+?\}/.test(_)){
                return _;
            }
            return 'src="' + getShortImage(img,url) + '"';
        });
    }else if(/\.css$/i.test(url)){
        mod.code = mod.code.replace(/url\s*\([\"\']?(.+?)[\"\']?\)\s*/ig, function(_,img){
            return "url(" + getShortImage(img,url) + ")";
        });
    }else{
        mod.code = mod.code.replace(/(?:module|mod)\.resolve\(\"(.+\.(?:gif|jpg|png))\"\)/g, function(_,img){
            return `"${getShortImage(img,url)}"`;
        });
    }
};

//拷贝图片
exports.copyImage = function(){
    imgList.forEach(function(mod){
        var fileReadStream = fs.createReadStream(mod.url);
        var fileWriteStream = fs.createWriteStream(`${cfg.dist}/${mod.sn}`);
        fileReadStream.pipe(fileWriteStream);
    });
};

//图片转base64
exports.pic2base64 = function(path){
    var startTime = Date.now();

    var o = {};
    var id = 'sys.ui.'+path+'.pic';
    path = "public/seekjs/ui/"+path+"/";
    var data = fs.readdirSync(path);
    data.forEach(function (fileName) {
        if(/^(\w+)\.(gif|jpg|png|bmp)$/.test(fileName)){
            var imageBuf = fs.readFileSync(path+fileName);
            o[RegExp.$1] = "data:image/"+RegExp.$2+";base64,"+imageBuf.toString("base64")+"==";
        }
    });
    var code = 'define("'+id+'", '+JSON.stringify(o)+');';
    fs.writeFileSync(path+"pic.js", code);

    var endTime = Date.now();
    var time = endTime - startTime;
    console.log("merge complete, use time "+time+"ms");
};