/**
 * Created by huyuqiong on 2017/1/6.
 */
var config = require('../upload.config.js');
var qiniu = require('qiniu');
qiniu.conf.ACCESS_KEY = config.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.SECRET_KEY;


//要上传的空间
var bucket = config.Bucket_Name;
//上传策略中设置pipeline以及fops
var uptoken = function(bucket, key) {
    //转码是使用的队列名称。
    var pipeline = 'abcdtest';

    //要进行转码的转码操作。
    var fops = "avthumb/mp4/vcodec/libx264"

    //可以对转码后的文件进行使用saveas参数自定义命名，当然也可以不指定文件会默认命名并保存在当间。
    var saveas_key = qiniu.util.urlsafeBase64Encode(`${bucket}:video/after_${key}`);
    fops = fops+'|saveas/'+saveas_key;
    var putPolicy = new qiniu.rs.PutPolicy(`${bucket}:video/${key}`);
    putPolicy.persistentOps = fops;
    //putPolicy.callbackUrl = "http://dressplus-api.appdevs.cn/video/uploadCallback";
    //putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)&id=$(x:id)';
    putPolicy.persistentNotifyUrl = "http://dressplus-api.appdevs.cn/video/qnNotify";
    putPolicy.persistentPipeline = pipeline;
    return putPolicy.token();
}

//构造上传函数
var uploadFile = function(uptoken, key, file) {
    var extra = new qiniu.io.PutExtra();
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putReadable(uptoken, key, file, extra, function(err, ret) {
        if(!err) {
            // 上传成功， 处理返回值
            console.log(ret.hash, ret.key, ret.persistentId);
        } else {
            // 上传失败， 处理返回代码
            console.log(err);
        }
    });
}

var UUID = function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);

    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}
//调用uploadFile上传
//uploadFile(token, key, filePath);

exports.checkMsgFile = function(params,session,req,res) {
    var key = UUID();
    console.log(key);
    return{
        uptoken:uptoken(bucket,key),
        key:key
    }
};



