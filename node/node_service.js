/**
 * Created by huyuqiong on 2017/1/6.
 */
var config = require('../upload.config.js');
var qiniu = require('qiniu');
qiniu.conf.ACCESS_KEY = config.ACCESS_KEY;
qiniu.conf.SECRET_KEY = config.SECRET_KEY;
var uptoken = new qiniu.rs.PutPolicy(config.Bucket_Name);
exports.checkMsgFile = function() {
    var token = uptoken.token();
    return{
        uptoken:token
    }
};