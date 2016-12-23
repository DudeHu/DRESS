define(function(req,exp,mod){
	"use strict";
	var emit = req("emit");
	
	mod.exports = {
		getSurplusTicketCount: emit("surplusTicketCount")
	};

});
