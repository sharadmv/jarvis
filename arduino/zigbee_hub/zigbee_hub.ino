#include <SoftwareSerial.h>

SoftwareSerial mySerial(13, 12); // RX, TX

void setup() {
  Serial.begin(9600);
  mySerial.begin(9600);
}

String packet = "";
int commandLength = 17;

void loop() {
  if (mySerial.available()) {
    Serial.write(mySerial.read());
  }
  if (Serial.available()) {
    char temp = Serial.read();
    packet += temp;
    if (temp == '\n') {
      if (packet.length() != (commandLength)) {
        Serial.println('n');
      } else {
        Serial.println('a');
      }
      packet = "";
    }    
    mySerial.write(Serial.read());
  }
}
