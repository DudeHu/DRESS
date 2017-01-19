define(function(req,exp){
    "use strict";
	var app = req("sys.app");

	exp.alert = function(){
		var args = [].slice.call(arguments);
		app.plugin.dialog.alert.apply(null,args);
	};

    exp.confirm = function(){
        var args = [].slice.call(arguments);
        app.plugin.dialog.confirm.apply(null,args);
    };

    exp.tip = function () {
        var args = [].slice.call(arguments);
        app.plugin.tip.showTip.apply(app.plugin.tip, [].slice.call(arguments));
    }
});
