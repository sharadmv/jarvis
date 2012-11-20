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
    parser: serialport.parsers.readline("\0")
  });
  var transport = new Transporter(serial, 10);
  setTimeout(transport.trigger, 2000);

  return transport;
}

var Transporter = function(serial, size) {
    var size = size;

    var data = [];

    var sequence = 0;

    var waiting = false;
    var received = 0;
    var timeout;
    var length;
    var count;
    var offset;

    var transmitting = false;

    var queue = [];

    var self = this;

    var callback;
    var rd;

    this.trigger = function() {
        rd();
    }

    serial.on('data', function(data) {
        //console.log(data);
        received++;
        var d = data.toString('ascii').split(":");
        var seqnum = parseInt(d[1]);
        if (!isNaN(seqnum)) {
            sequence = seqnum;
            if (sequence == length) {
                clearTimeout(timeout);
                fin();
            } else {
                //console.log(received, size)
                if (received == size) {
                    clearTimeout(timeout);
                    pack();
                } else {
                    clearTimeout(timeout);
                    timeout = setTimeout(pack, 500);
                }
            }
        } else {
            console.log(data)
            transmitting = false;
            sequence = 0;
            received = 0;
            temp = callback;
            if (queue.length > 0) {
                item = queue.pop();
                self.send(item[0], item[1]);
            }
            temp();
        }
    });

    var fin = function() {
        var send = "-1:\0"
        //console.log("Fin:", send);
        serial.write(send);
    }
    var pack = function() {
        if (length - sequence < size) {
            window = data.slice(sequence, length);
        } else {
            window = data.slice(sequence, sequence + size);
        }

        received = 0;
        var tempSeq = sequence;
        for (var i = 0; i < window.length; i++) {
            var send = tempSeq+":"+window[i]+"\0";
            //console.log("Sending:", send);
            serial.write(send);
            tempSeq++;
        }
    }

    this.ready = function(r) {
        rd = r;
    }

    this.send = function(str, cb) {
        if (transmitting) {
            queue.unshift([str, cb]);
        } else {
            callback = cb;
            length = str.length;
            offset = sequence;
            data = str.split("");
            pack();
            transmitting = true;
        }

    }
}

module.exports = init;
module.exports = init;
