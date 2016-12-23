/**
 * Created by 庄 on 2016/7/5.
 */
/**
 * 验证规则
 * Created by Administrator on 2016/5/11.
 */

module.exports = {
    //手机号码
    cellphone:{
        chk_empty:false,
        re:  /^(7|8|9)\d{8}$/,
        re_title:"cellphone_format_error"
    },
    account:{
        chk_empty:false,
        re:/(^(7|8|9)\d{8}$)|(^[\w\-]+@([\w\-]+\.)+(com|net|cn|com\.cn|cc|info|me|org)$)/,
        re_title:"account_format_error"
    },
    not_empty:{
        minLen : 1
    },
    captcha:{
        chk_empty:false,
        re:/^\d{4}$/,
        re_title:"captcha_format_error"
    },
    confirmPassword:{
        diff:"password"
    },
    email:{
        chk_empty:false,
        re:/^[\w\-]+@([\w\-]+\.)+(com|net|cn|com\.cn|cc|info|me|org)$/,
        minLen : 1 ,
        maxLen : 32
        //re_title:"long_time_no_operation"
    },
    labelChk:{
        maxLen:32
    },
    numberType:{
        chk_empty:true,
        number:true,
        bit:8
    },
    numberType3:{
        number:true,
        maxLen:6,
        unit:"{bit}"
    },
    numberType4:{
        number:true,
        min:1,
        minBit:1,
        maxBit:11
    },
    DDD:{
        number:true,
        bit:"2-3"
    },
    phone:{
        number:true,
        minLen:8,
        maxLen:9
    },
    password:{
        minLen:6,
        maxLen:32
    },
    password2:{
        minLen:6,
        maxLen:32,
        diff: "password"
    },
    money:{
        chk_empty:true,
        number:0,
        min : 1000,
        max : 35000
    },

    alertMoney:{
        re : /^[1-9]\d*$/,
        min : 1000,
        max : 35000
    },

    token:{
        bit: 64
    },
    
    note:{
        chk_empty:false,
        minLen : 0,
        maxLen : 200
    },
    newUser:{
        minLen : 1,
        maxLen : 20
    },
    ageRule :{
        re : /^[1-9]\d*$/,
        minBit:1,
        maxBit : 16
    },
    cep :{
        re : /^[1-9]\d*$/,
        minBit:8,
        maxBit : 8
    },

    // 修改字段字符1~150，不能为空
    ComModifyFields : {
        minLen : 1,
        maxLen : 150
    }

};