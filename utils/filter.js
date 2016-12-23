/**
 * 格式化扩展
 * Created by likaituan on 16/8/31.
 */


define(function(req, exp) {
    "use strict";
    //外国日期格式化
    exp.timestamp2Date = function (timestampArg) {

        var timestamp = timestampArg < 0 ? -timestampArg : timestampArg;

        if (timestamp&&/^\d+$/.test(timestamp)) {
            var date = new Date();

            var getTimeFilter = function(i){
                if(i<10){
                    i = "0" + i;
                }
                return i;
            };

            date.setTime(timestamp);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            month = getTimeFilter(month);
            var day = getTimeFilter(date.getDate());

            var hours = getTimeFilter(date.getHours());
            var minutes = getTimeFilter(date.getMinutes());
            var seconds = getTimeFilter(date.getSeconds());

            var clock = hours + ":" + minutes + ":" + seconds;

            return year + "-" + month + "-" + day + "/" + clock;
        } else {
            return timestamp;
        }
    };

    /*生日格式化*/
    exp.birthdayFilter = function (timestampArg) {

        var timestamp = timestampArg < 0 ? -timestampArg : timestampArg;

        if (timestamp&&/^\d+$/.test(timestamp)) {
            var date = new Date();
            var getTimeFilter = function(i){
                if(i<10){
                    i = "0" + i;
                }
                return i;
            };

            date.setTime(timestamp);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            month = getTimeFilter(month);
            var day = getTimeFilter(date.getDate());

            return day + "-" + month + "-" + year;
        } else {
            return timestamp;
        }
    };

    exp.moneyBZFilter = function (amount) {

        if(amount&&/^\d+$/.test(amount)){
            var addSeparator = function (amountStr, separator) {
                if (amountStr.length <= 3) {
                    return amountStr;
                }
                var reverseStr = amountStr.split("").reverse().join("");

                var tmp = "";

                for (var i = 0; i < reverseStr.length; ++i) {
                    tmp += reverseStr.charAt(i);

                    if (i % 3 == 2) {
                        tmp += separator;
                    }
                }

                return tmp.split("").reverse().join("");

            };
            var amountFormat = function (centValue, intSeparator, decimalSeparator) {
                var decimalStr = (centValue / 100).toFixed(2).toString();

                var split = decimalStr.split(".");

                var intStr = split[0];
                var decStr = split[1];

                return "R$" + addSeparator(intStr, intSeparator) + decimalSeparator + decStr;

            };

            return amountFormat(amount, ".", ",");
        }else{
            return amount;
        }
    };

    /*CPF格式转化*/
    exp.cpfFormat = function (cpf) {
        var n_cpf = cpf.replace(/[^0-9]/g,'');
        if(n_cpf.length>11){
            n_cpf = n_cpf.substring(0,11);
        }
        var len = n_cpf.length;
        if(len<=6&&len>3){
            return ( n_cpf.substring(0,3)+ "." + n_cpf.substring(3,len) );
        }else if(len>6&&len<=9){
            return ( n_cpf.substring(0,3)+ "." + n_cpf.substring(3,6) + "." + n_cpf.substring(6,len));
        }else if(len>9&&len<=11){
            return ( n_cpf.substring(0,3)+"." + n_cpf.substring(3,6) + "." + n_cpf.substring(6,9) + "-" + n_cpf.substring(9,len) );
        }else{
            return n_cpf;
        }
    };

});