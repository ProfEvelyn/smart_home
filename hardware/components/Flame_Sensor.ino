const int flameSensorPin = 34;  // Flame sensor pin
const int buzzerPin = 27;       // Buzzer pin
const int redLedPin = 14;       // Red LED pin

void setup() {
  Serial.begin(115200);
  pinMode(flameSensorPin, INPUT);  // Set flame sensor as input
  pinMode(buzzerPin, OUTPUT);      // Set buzzer as output
  pinMode(redLedPin, OUTPUT);      // Set red LED as output

  digitalWrite(buzzerPin, LOW);   // Ensure buzzer is off at start
  digitalWrite(redLedPin, LOW);   // Ensure red LED is off at start
}

void loop() {
  int flameValue = analogRead(flameSensorPin);  // Read flame sensor value
  Serial.print("Flame Sensor Value: ");
  Serial.println(flameValue);  // Print the sensor value

  if (flameValue < 100) {  // Flame detected
    Serial.println("🔥 FLAME DETECTED! 🚨");
    digitalWrite(buzzerPin, HIGH);  // Turn ON buzzer

    // Blink red LED continuously
    digitalWrite(redLedPin, HIGH);
    delay(500);
    digitalWrite(redLedPin, LOW);
    delay(500);
  } 
  else {  // No flame detected
    Serial.println("🟢 NO FLAME DETECTED");
    digitalWrite(buzzerPin, LOW);   // Turn OFF buzzer
    digitalWrite(redLedPin, LOW);   // Turn OFF red LED
    delay(500);  // Short delay to avoid flooding serial monitor
  }
}