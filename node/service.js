/**
 * Created by qu on 2016/8/23.
 */



//登陆
exports.login = function(params){
   return {
       url:"/java/adminUser/login",
       type:"post",
       data:{
           username:params.name,
           password:params.password
       }

   }
};

exports.checkMsgFile = function() {
    /* return {
     url: `/java/pc/order/check/login/submit_check_doc_item`,
     type: "post"
     };*/
    return{
        url:"http://192.168.5.183:8090/java/pc/order/check/login/submit_check_doc_batch",
        type: "post"
    };
};






