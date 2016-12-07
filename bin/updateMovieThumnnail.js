var Q = require('q');
var fs = require('fs');
var moment = require('moment');
var http = require('http');
var request = require('request');
var _ = require('lodash');
var client = require('scp2');
console.log('start');
if (!process || !process.env || !process.env.API)
    return;
if (!process || !process.env || !process.env.SCP_LOCATION)
    return;

var test = false;
if (process.env.TEST) test = process.env.TEST;

var api = process.env.API;
console.log('api = ', api);
fetchHtml(api)
    .then(function(result) {
        if (!result) return;
        console.log('result : ', result);
        var objs = JSON.parse(result);
        console.log('length : ', objs.length);

        processIndex(0);
        function processIndex(i) {
            if (test && i >= test) {
                console.log('FINISH TEST');
                return;
            }

            if (objs[i]) {
                var imdbId = objs[i];
                console.log('process imdbID = ', imdbId);
                var omdbapi = 'http://www.omdbapi.com/?i=' + imdbId + '&plot=short&r=json';
                console.log(' ' + i + ' omdbapi = ', omdbapi);
                fetchHtml(omdbapi).then(function(result) {
                    var json = JSON.parse(result);
                    if (json && json.Poster) {
                        var fileUrl = json.Poster;
                        var imdbId = json.imdbID;
                        if (isValidateUrl(fileUrl)) {
                            console.log(' imdbId = ', imdbId);
                            console.log(' title = ', json.Title);
                            console.log(' fileUrl = ', fileUrl);
                            var fileName = imdbId + '.jpg';
                            var imagePath = '/home/wiwitaditya/workspace/testjavascript/watchitlater/bin/' + fileName; 
                            console.log(' fileName = ', fileName);
                            console.log(' start download ');
                            request.get({ url: fileUrl, encoding: 'binary' }, function (err, response, body) {
                                if (err) {
                                    console.log(' error download ');
                                    processIndex(i+1);
                                } else {
                                    console.log(' success download ');
                                    fs.writeFile(imagePath, body, 'binary', function (err) {
                                        if (process.env.DOCOPY && process.env.DOCOPY === true) {
                                            console.log(' upload ....');
                                            var sshTarget = process.env.SCP_LOCATION + fileName;
                                            console.log(' sshTarget = ', sshTarget);
                                            client.scp(fileName, sshTarget, function(err) {
                                                console.log(' error : ', err);
                                                processIndex(i+1);
                                            });
                                        } else {
                                            console.log(' skip upload');
                                            processIndex(i+1);
                                        }
                                    });
                                }
                            });
                        } else {
                            console.log(' image still empty');
                            processIndex(i+1);
                        }                       
                    }
                });
            } else {
                console.log('FINISH ALL')
            }
        }
    });

function isValidateUrl(value) {
    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}

function fetchHtml(url) {
    var deferred = Q.defer();
    http.get(url, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            deferred.resolve(data);
        });
    });
    return deferred.promise;
}