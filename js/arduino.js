var serialport = require('serialport');
var Serial = serialport.SerialPort;

var TERMINATOR = "\n";

var Packet = function() {
  this.serialize = function() {
    return JSON.stringify(this);
  }
}
Packet.deserialize = function(serial) {
  return JSON.parse(serial);
}

var init = function(port, options) {
  var serial = new Serial(port, {
    parser: serialport.parsers.readline(TERMINATOR)  
  });
  var transport = new Transporter(serial);
  var count = 0;
  for (var i = 0; i < 1000; i++) {
    transport.enqueue("hellomynameiswha", function() {
      count++;
      console.log(count);
      if (count == 1000) {
        //console.log("SUCCESS");
      }
    });
  }
}

var Transporter = function(serial) {
  var id = 0;

  var ACK = "a\r";
  var NACK = "n\r";

  var packet;

  var queue = [];
  var sending = false;
  var curTimeout;

  serial.on('data', function(data) {
    parse(data);
  });
  this.enqueue = function(data, callback) {
    queue.push({ data : data, callback : callback });
    if (queue.length == 1 && !sending) {
      send();
      sending = true;
    }
  }
  var send = function() {
    if (queue.length > 0) {
      packet = queue[0];
      //console.log(packet);
      serial.write(packet.data+TERMINATOR);
      curTimeout = setTimeout(function() {
        send();
      }, 500);
    }
  }

  var parse = function(data) {
    clearTimeout(curTimeout);
    if (data == ACK) {
      packet = queue.shift();
      packet.callback();
      if (queue.length > 0) {
        send();
      } else {
        sending = false;
      }
    } else if (data == NACK) {
      console.log("SENDING FAILURE");
      send();
    }
  }
}

module.exports = init;
