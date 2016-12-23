seekjs.config({
    ns:{
        ex: seekjs.resolve("./utils/"),
        js: seekjs.resolve("./js/"),
        tp: seekjs.resolve("./templates/"),
        st: seekjs.resolve("./css/")
    },
    alias:{
        service: seekjs.resolve("./utils/service")
    }
});

define(function(req,exp,mod){
	"use strict";
	var app = req("sys.app");
	var config = req("root.config");
	
	config.ajaxSetup();
	app.viewEx = req("ex.viewEx");
	
	app.setPath({
		js: "js.",
		tp: "tp.",
		st: 'css.'
	});

	//app.usePlugin("sys.ui.dialog");
	//app.usePlugin("sys.ui.mask");

	app.init("home");

});
