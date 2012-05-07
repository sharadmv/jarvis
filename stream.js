var Bridge = require('./bridge/bridge.js');
var bridge = new Bridge({apiKey:"abcdefgh"});
var speech = require('./speech.js').speech;
bridge.connect();
var cleverbot;
bridge.getService('cleverbot',function(obj){
  cleverbot = obj;
});
var Buffer = require('buffertools');
var fs = require('fs');
var curSpeak = null;
var speaking = false;
var sampleRate = 32000;
var spawn = require('child_process').spawn;
var SPEAKING_THRESHOLD = -27;
var record = spawn('rec',['-b','16','-e','signed-integer','-c','1','-r',sampleRate,'-p']);
record.stdout.on('data', function (d) {
  fs.writeFile('temp',d);
  var process = spawn('sox',['-b','16','-e','signed-integer','-c','1','-r',sampleRate,'-t','raw','temp','-n','stats']);
  process.stderr.on('data',function(data){
    var stats = data.toString('ascii').trim();
    var splt = stats.split("\n");
    for (var i in splt){
      if (splt[i].indexOf("RMS lev dB")!=-1){
        var vol = parseFloat(splt[i].match(/[-]?[0-9]+\.[0-9]+/)[0]);
        if (vol > SPEAKING_THRESHOLD){
          if (speaking){
            curSpeak = Buffer.concat(curSpeak,d);
          } else {
            curSpeak = d;
            speaking = true;
          }
        } else {
          if (speaking){
            fs.writeFile('full.raw',curSpeak);
            var temp = spawn('sox',['-c','2','-b','16','-e','signed-integer','-r',sampleRate,'-t','raw','full.raw','temp.flac']);
            temp.on('exit',function(code){
              var temp2 = spawn('sox',['temp.flac','-c','1','final.flac']);
              temp2.on('exit',function(code){
                fs.readFile('final.flac',function(err, data){
                  speech.query(data,function(output){
                    console.log("YOU SAID: "+output);
                    cleverbot.ask(output,function(response){
                      console.log("HE SAYS: "+response);
                      var temp2 = spawn('espeak',["'"+response+"'",'--punct="<characters>"']);
                    });
                  });
                });
              });
            });
            speaking = false;
          }
        }
      }
    }
  });
});

record.stderr.on('data', function (data) {
});

record.on('exit', function (code) {
  if (code !== 0) {
    console.log('record process exited with code ' + code);
  }
  process.stdin.end();
});

/*
   process.stderr.on('data', function (data) {
   });

   process.on('exit', function (code) {
   if (code !== 0) {
   console.log('process process exited with code ' + code);
   }
   });
   */
