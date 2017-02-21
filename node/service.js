/**
 * Created by qu on 2016/8/23.
 */

var config = require('../upload.config.js');
var qiniu = require('qiniu');
var uptoken = new qiniu.rs.PutPolicy(config.Bucket_Name);
//登陆
exports.login = function(params,session){
   return {
       url:"/user/login",
       type:"post",
       data:{
           user_name:params.account,
           password:params.password
       }

   }
};

exports.deleteVideo = function (params,session) {
    return{
        url:"/video/delete",
        type:"post",
        data:{
            videoIds:params.videoIds
        }
    }
}

exports.getVideoList = function (params,session) {
    return{
        url:"/video/list",
        type:"post",
        data:{
            userId:params.userId,
            page:params.cursor,
            size:params.step
        }
    }
}

exports.searchByName = function (params,session) {
    return{
        url:"/video/searchByName",
        type:"post",
        data:{
            userId:params.userId,
            videoName:params.serachString,
            page:params.page,
            size:params.size
        }
    }
}

exports.uploadVideo = function (params,seesion) {
    return{
        url:"/video/upload",
        type:"post",
        data:{
            userId:params.userId,
            videoUrl:params.url,
            videoName:params.name,
            videoSize:params.size,
            qnVideoId:params.qnVideoId
        }
    }
}

exports.searchByTag = function (params) {
    return{
        url:"/video/searchTag",
        type:"post",
        data:{
            videoId:params.videoId,
            tagName:params.serachString,
            duration:params.rangeVal
        }
    }
}

exports.getVideoDetail = function (params) {
    return{
        url:"/video/info",
        type:"post",
        data:{
            videoId:params.videoId
        }
    }
}


exports.getUserInfo = function (params) {
    return{
        url:"/user/info",
        type:"post",
        data:{
            userId:params.userId
        }
    }
}

exports.getToken = function (params) {
    return{
        url:"/video/qnUploadToken",
        type:"post",
        data:{}
    }
}




