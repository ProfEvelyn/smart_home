#define MQ135_PIN 35    // Analog input pin for MQ135 Air Quality sensor
#define GREEN_LED 25    // Green LED (Good Air Quality)
#define YELLOW_LED 26   // Yellow LED (Moderate Air Quality)
#define RED_LED 14      // Red LED (Poor Air Quality)

void setup() {
  Serial.begin(115200);
  pinMode(MQ135_PIN, INPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);

  // Ensure LEDs start in the correct state
  digitalWrite(GREEN_LED, HIGH);   // Green LED ON at start (Good Air)
  digitalWrite(YELLOW_LED, LOW);   // Yellow LED OFF at start
  digitalWrite(RED_LED, LOW);      // Red LED OFF at start

  Serial.println("MQ-135 Air Quality Sensor Test");
}

void loop() {
  int rawValue = analogRead(MQ135_PIN);  // Read raw ADC value
  float voltage = rawValue * (3.3 / 4095.0);  // Convert ADC value to voltage

  Serial.print("Raw ADC Value: ");
  Serial.print(rawValue);
  Serial.print(" | Voltage: ");
  Serial.print(voltage);
  Serial.println("V");

  if (rawValue < 3250) {  // Good Air Quality
    Serial.println("🟢 Good Air Quality ✅");
    digitalWrite(GREEN_LED, HIGH);  // Green LED ON
    digitalWrite(YELLOW_LED, LOW);  // Yellow LED OFF
    digitalWrite(RED_LED, LOW);     // Red LED OFF
  } 
  else if (rawValue >= 3250 && rawValue < 3300) {  // Moderate Air Quality
    Serial.println("🟡 Moderate Air Quality ⚠️");
    digitalWrite(GREEN_LED, LOW);   // Green LED OFF
    digitalWrite(YELLOW_LED, HIGH); // Yellow LED ON
    digitalWrite(RED_LED, LOW);     // Red LED OFF
  } 
  else {  // Poor Air Quality
    Serial.println("🔴 POOR AIR QUALITY DETECTED! 🚨");
    digitalWrite(GREEN_LED, LOW);   // Green LED OFF
    digitalWrite(YELLOW_LED, LOW);  // Yellow LED OFF
    digitalWrite(RED_LED, HIGH);    // Red LED ON
  }

  delay(1000);  // Wait before next reading
}
