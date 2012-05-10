var fs = require('fs');
var http = require('https');
var url = "www.google.com"
var path = "/speech-api/v1/recognize?xjerr=1&client=node&lang=en-US&maxresults=10"

function post(data, callback) {
  var options = {
    host: url,
    port: 443,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'audio/x-flac; rate=32000',
      'Content-Length': data.length
    }
  };

  var req = http.request(options, function(res) {
    res.on('error',function(){
    });
    res.on('data', function (chunk) {
      var result = JSON.parse(chunk.toString());
      if (result.status == 0){
        for (var i in result.hypotheses){
          if (result.hypotheses[i].confidence){
            callback(result.hypotheses[i].utterance);
          }
        }
      }
    });
  });

  req.write(data);
  req.end();

}
var speech = {
  query:function(data,callback){
          post(data,callback);
        }
}
exports.speech = speech;
