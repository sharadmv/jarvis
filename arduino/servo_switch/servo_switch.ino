#include <Servo.h>

Servo switchServo;
int switchPin = 9;

void setup(){
  switchServo.attach(switchPin);
  Serial.begin(9600);
  
}

void loop(){
  //servo from 0 to 180 degrees
  switchServo.write(90);
  delay(1000);
  switchServo.write(0);
  delay(1000);
  
}
