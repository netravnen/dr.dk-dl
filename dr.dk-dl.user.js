// ==UserScript==
// @name         dr.dk-dl
// @namespace    https://github.com/Jeni4/dr.dk-dl
// @version      1.0
// @description
// @author       Jeni4
// @match        https://www.dr.dk/tv/se/*/*/*/*
// @grant        GM_xmlhttpRequest
// @license
// ==/UserScript==

var script = ['https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.3/FileSaver.js',
              'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.2/moment-with-locales.min.js'];

for (var i=0; i<script.length; i++) {
    if (typeof GM_addScript != "undefined") {
        GM_addScript(script[i]);
    } else if (typeof GM_addScript != "undefined") {
        GM_addScript(script[i]);
    } else {
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            var node = document.createElement("script");
            node.type = "text/javascript";
            node.src  = script[i];
            //	node.innerHTML = script;
            heads[0].appendChild(node);
        }
    }
}



(function() {
    'use strict';

    GM_xmlhttpRequest({
        method: "GET",
        url: document.querySelector('a.player-link.icon-wrap').getAttribute('data-resource'),
        onload: function(response) {
            var responseXML = null;
            // Inject responseXML into existing Object (only appropriate for XML content).
            if (!response.responseXML) {
                responseXML = new DOMParser().parseFromString(response.responseText, "text/xml");
            }

            var obj = JSON.parse(response.responseText);
            obj = obj.Links[1].Uri;

            GM_xmlhttpRequest({
                method: "GET",
                url: obj,
                onload: function(response) {
                    var responseXML = null;
                    // Inject responseXML into existing Object (only appropriate for XML content).
                    if (!response.responseXML) {
                        responseXML = new DOMParser().parseFromString(response.responseText, "text/xml");
                    }

                    var html = response.responseText.split(/\r?\n/);
                    html = html[html.length-2].split("?")[0];

                    GM_xmlhttpRequest({
                        method: "GET",
                        url: html,
                        onload: function(response) {
                            var responseXML = null;
                            // Inject responseXML into existing Object (only appropriate for XML content).
                            if (!response.responseXML) {
                                responseXML = new DOMParser().parseFromString(response.responseText, "text/xml");
                            }

                            var str = response.responseText.split("\n");

                            str = cleanArray(str);
                            str = cleanArray2(str);
                            str = cleanArray3(str);
                            str = concatArray(str);

                            //GM_log(str);

                            var htmlElemFile = str.split('undefined')[1];

                            //GM_log(htmlElemFile);

                            /*
                            var fileDate = document.querySelector('#player-bottom > div:nth-child(2) > span').innerHTML;
                            var fileDateHour = moment(fileDate.split(' KL. ')[1], "HH:MM").format("HH-MM");
                            fileDate = moment(fileDate.split(' KL. ')[0].split('. ')[2]+'-'+moment(document.querySelector('head > meta[name=pubdate]').getAttribute('content'), "ddd, DD MMM YYYY HH:MM:SS ZZ").format("MM")+'-'+fileDate.split(' KL. ')[0].split('. ')[0], "YYYY-MMM-D").format("YYYY-MM-DD");
                            */

                            var fileName = 'DR.DK';
                            fileName += ' - ';
                            fileName += document.querySelector('#kids-nav > div > ul.universal-nav-items > li > .active').innerHTML;
                            fileName += ' - ';
                            fileName += document.querySelector('a.player-link.icon-wrap').getAttribute('data-episode-slug').charAt(0).toUpperCase();
                            fileName += document.querySelector('a.player-link.icon-wrap').getAttribute('data-episode-slug').slice(1);
                            /*
                            fileName += ' - ';
                            fileName += fileDate;
                            fileName += ' - ';
                            fileName += fileDateHour;
                            */
                            fileName += '.txt';

                            var file = new File([htmlElemFile], fileName, {type: "text/plain;charset=ansi"});
                            saveAs(file);


                            /*var htmlElem = "<a href='data:application/octet-steam," + htmlElemFile + "'>TEXT FILE</a>";
                            var ul = document.querySelector('#kids-nav > div > ul.universal-nav-items');
                            var li = document.createElement('li');

                            //li.appendChild(document.createTextNode(htmlElem));
                            li.innerHTML = htmlElem;
                            ul.appendChild(li);*/
                        }
                    });
                }
            });
        }
    });

    function cleanArray(actual) {
        var newArray = new Array();
        for (var i=0; i<actual.length; i++) {
            if (actual[i]) {
                newArray.push(actual[i]);
            }
        }
        return newArray;
    }

    function cleanArray2(actual) {
        var newArray = new Array();
        for (var i=0; i<actual.length; i++) {
            if (/^#EXT.*$/mg.test(actual[i]) === false) {
                newArray.push(actual[i]);
            }
        }
        return newArray;
    }

    function cleanArray3(actual) {
        var newArray = new Array();
        for (var i=0; i<actual.length; i++) {
            newArray.push(actual[i].split("?null")[0]);
        }
        return newArray;
    }

    function concatArray(actual) {
        var newString;
        for (var i=0; i<actual.length; i++) {
            newString += "\n" + actual[i];
        }
        return newString;
    }

})();
