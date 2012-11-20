#include <SoftwareSerial.h>

SoftwareSerial mySerial(13, 12); // RX, TX

void setup() {
  Serial.begin(9600);
  mySerial.begin(9600);
}

String packet = "";
int incomingByte;
int window = 10;
int sequence = 0;
String curString = "";
int latest = window;
String data = "";

void loop() {

  if (Serial.available() > 0) {
    incomingByte = Serial.read();
    if (incomingByte == 0) {
      String sub = curString.substring(0, curString.indexOf(":"));
      int s = stringToNumber(sub);
      if (sub == "-1") {
        sequence = 0;
        curString = "";
        execute(data);
        data = "";
      } else {
        String d = curString.substring(curString.indexOf(":")+1);
        if (sequence == s) {
          data += d;
        }
        Serial.print('a');
        Serial.print(':');
        Serial.print(sequence+1);
        Serial.print('\0');
        sequence = sequence + 1;
        curString = "";
      }
    } else {
      curString += (char) incomingByte;
    }
  }
}

void execute(String command) {
  Serial.print("Received command: ");
  Serial.print(command);
  Serial.print('\0');
}

int stringToNumber(String thisString) {
  int i, value = 0, length;
  length = thisString.length();
  for(i=0; i<length; i++) {
    value = (10*value) + thisString.charAt(i)-(int) '0';;
  }
  return value;
}
