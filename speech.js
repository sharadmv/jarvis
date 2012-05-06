var fs = require('fs');
var http = require('https');
var url = "www.google.com"
var path = "/speech-api/v1/recognize?xjerr=1&client=node&lang=en-US&maxresults=10"

function post(data) {
  // An object of options to indicate where to post to
  var post_options = {
      host: url,
      port: 443,
      path: path,
      method: 'POST',
      headers: {
          'Content-Type': 'audio/x-flac; rate=32000',
          'Content-Length': data.length
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.on('error',function(){
      });
      res.on('data', function (chunk) {
          var result = JSON.parse(chunk.toString());
          if (result.status == 0){
            for (var i in result.hypotheses){
              if (result.hypotheses[i].confidence){
                console.log(result.hypotheses[i].utterance);
              }
            }
          }
      });
  });

  // post the data
  post_req.write(data);
  post_req.end();

}

// This is an async file read
fs.readFile(process.argv[2], function (err, data) {
  if (err) {
    // If this were just a small part of the application, you would
    // want to handle this differently, maybe throwing an exception
    // for the caller to handle. Since the file is absolutely essential
    // to the program's functionality, we're going to exit with a fatal
    // error instead.
    console.log("FATAL An error occurred trying to read in the file: " + err);
    process.exit(-2);
  }
  // Make sure there's data before we post it
  if(data) {
    post(data);
  }
  else {
    console.log("No data to post");
    process.exit(-1);
  }
});
