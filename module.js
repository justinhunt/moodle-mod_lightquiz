// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * JavaScript library for the lightquiz module.
 *
 * @package    mod
 * @subpackage lightquiz
 * @copyright  2014 Justin Hunt  {@link http://poodll.com}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


M.mod_lightquiz = M.mod_lightquiz || {};

M.mod_lightquiz.playerhelper = {
	gY: null,
	resultsmode: null,
	playerdiv: null,
	resultsdiv: null,
	accesstoken: null,
	mediaid: null,
	appid: null,
	opts: null,

	 /**
     * @param Y the YUI object
     * @param start, the timer starting time, in seconds.
     * @param preview, is this a quiz preview?
     */
    init: function(Y,opts) {
    	//console.log("entered init");
    	M.mod_lightquiz.playerhelper.gY = Y;
		M.mod_lightquiz.playerhelper.opts = opts;
    	M.mod_lightquiz.playerhelper.playerdiv = opts['playerdiv'];
    	M.mod_lightquiz.playerhelper.resultsdiv = opts['resultsdiv'];
    	M.mod_lightquiz.playerhelper.mediaid = opts['mediaid'];
		M.mod_lightquiz.playerhelper.appid = opts['appid'];
		M.mod_lightquiz.playerhelper.accesstoken = opts['accesstoken'];
		M.mod_lightquiz.playerhelper.resultsmode = opts['resultsmode'];
		
		//default to show in div, but could be in lightbox
		var usecontainer = M.mod_lightquiz.playerhelper.playerdiv;
		var pdiv = Y.one('#' + M.mod_lightquiz.playerhelper.playerdiv);
		var rdiv = Y.one('#' + M.mod_lightquiz.playerhelper.resultsdiv);
		//no player div is loaded when the user os out of attempts, so we exit in this case
		if(!pdiv){
			return;
		}
		if(opts['lightbox']){
			usecontainer = null;
			/*
			pdiv.addClass('lightquiz_hidediv');
			rdiv.addClass('lightquiz_showdiv');
			*/
		}else{
			pdiv.addClass('lightquiz_showdiv');
			rdiv.addClass('lightquiz_hidediv');
		}
		

    }, 
    
    handleresults: function(results) {
    	
		console.log(results);
		M.mod_lightquiz.playerhelper.ajaxpost(results);
		
		/*
		if(M.mod_lightquiz.playerhelper.resultsmode=='form'){
			M.mod_lightquiz.playerhelper.formpost(results);
			//do the ui updates
			var thebutton = this.gY.one('#mod_lightquiz_startfinish_button');
			if(M.mod_lightquiz.playerhelper.opts['lightbox'] ){
				thebutton.removeClass('lightquiz_hidediv');
				thebutton.addClass('lightquiz_showdiv');
			}
			this.showresultsdiv(true);
			thebutton.set('innerHTML','Try Again');	
		}else{
			M.mod_lightquiz.playerhelper.ajaxpost(results);
		}
		*/	
    },
	
	handleerror: function(message) {
		//console.log(message);
		M.mod_lightquiz.playerhelper.showresponse("ERRORMSG <br />" + message);  
    },
	
	startfinish: function(){
		var thebutton = this.gY.one('#mod_lightquiz_startfinish_button');
		if(thebutton.get('innerHTML') =='Start' || thebutton.get('innerHTML') =='Try Again'){
			//if(!EC.getReadyStatus()){return;}
			this.play();
			if(M.mod_lightquiz.playerhelper.resultsmode=='form' && M.mod_lightquiz.playerhelper.opts['lightbox'] ){
				thebutton.removeClass('lightquiz_showdiv');
				thebutton.addClass('lightquiz_hidediv');
			}else{
				thebutton.set('innerHTML','Finish');
			}
			this.showresultsdiv(false);
		}else{
			//EC.getResults('M.mod_lightquiz.playerhelper.handleresults');
		}
	
	},
	
	showresultsdiv: function(showresults){
		var pdiv = Y.one('#' + M.mod_lightquiz.playerhelper.playerdiv);
		var rdiv = Y.one('#' + M.mod_lightquiz.playerhelper.resultsdiv);
		if(showresults){
			pdiv.removeClass('lightquiz_showdiv');
			pdiv.addClass('lightquiz_hidediv');
			rdiv.removeClass('lightquiz_hidediv');
			rdiv.addClass('lightquiz_showdiv');
		}else{
			rdiv.removeClass('lightquiz_showdiv');
			rdiv.addClass('lightquiz_hidediv');
			pdiv.removeClass('lightquiz_hidediv');
			pdiv.addClass('lightquiz_showdiv');
		}

	},
	
	play: function(){
		EC.play(this.mediaid);
    },
    
	login: function(){
		//console.log('logginin');
		//EC.login(M.mod_lightquiz.playerhelper.accesstoken,M.mod_lightquiz.playerhelper.showresponse);
    },
	
	logout: function(){
		console.log('logginout');
		//EC.logout(M.mod_lightquiz.playerhelper.showresponse);
    },
    
    showresponse: function(showtext){
    	var resultscontainer = M.mod_lightquiz.playerhelper.gY.one('#' + M.mod_lightquiz.playerhelper.resultsdiv);
		if((typeof showtext) != 'string'){
			showtext = JSON.stringify(showtext);
		}
		resultscontainer.setContent(showtext);
		//console.log('that was:' + showtext);
    },
	
	    // Define a function to handle the AJAX response.
    ajaxresult: function(id,o,args) {
    	var id = id; // Transaction ID.
        var returndata = o.responseText; // Response data.
        var Y = M.mod_lightquiz.playerhelper.gY;
    	//console.log(returndata);
        var result = Y.JSON.parse(returndata);
        if(result.success){
        	//we used to reload the page ..but not any more
        	//location.reload(true);
        }
    },
    
    formpost: function(resultobj){
    	var Y = M.mod_lightquiz.playerhelper.gY;
		var opts = M.mod_lightquiz.playerhelper.opts;
		for (i in resultobj){
			var elem = M.mod_lightquiz.playerhelper.gY.one('.' + 'lightquiz_' + i);
			if(elem){
				elem.set('value',resultobj[i]);
			}
		}
		return;
    },
    
	
	ajaxpost: function(resultobj){
		/* This and init are the most important functions in this module.js file
		A lot of the other functions are junk left over from the mods former life as
		the English Central mod */
	
	
    	var Y = M.mod_lightquiz.playerhelper.gY;
		var opts = M.mod_lightquiz.playerhelper.opts;
		
		//bail if we are in preview mode
		//if(opts['preview']){return;}
		
    	var uri  = 'ajaxfriend.php?id=' +  opts['cmid'] + 
				'&lqresult=' +  encodeURIComponent(JSON.stringify(resultobj)) +
    			'&sesskey=' + M.cfg.sesskey;
		//we dhoul donly declare this callback once. but actually it blocks
		Y.on('io:complete', M.mod_lightquiz.playerhelper.ajaxresult, Y,null);
		Y.io(uri);
		return;
    },
	
	
};
