define(function(req, exp){
	"use strict";

	exp.appName = "unknown";

	exp.onInit = function(done){
		window.setTimeout(function(){
			exp.appName = "seekjs";
			done();
		},500);
	};
});
