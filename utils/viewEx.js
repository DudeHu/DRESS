define(function(req,exp){
    "use strict";
	var app = req("sys.app");

	exp.alert = function(){
		var args = [].slice.call(arguments);
		app.plugin.dialog.alert.apply(null,args);
	};

    exp.alert = function(){
        var args = [].slice.call(arguments);
        app.plugin.dialog.confirm.apply(null,args);
    };
});
