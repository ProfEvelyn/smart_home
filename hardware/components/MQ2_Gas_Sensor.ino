#define MQ2_PIN 36     // Analog input pin for MQ2 Gas Sensor
#define GREEN_LED 25   // Green LED (Safe Gas Level)
#define YELLOW_LED 26  // Yellow LED (Moderate Gas Level)
#define RED_LED 14     // Red LED (High Gas Level)

void setup() {
  Serial.begin(115200);
  pinMode(MQ2_PIN, INPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);

  // Enable full voltage range for ESP32 ADC
  analogSetPinAttenuation(MQ2_PIN, ADC_11db);  

  // Ensure LEDs start in the correct state
  digitalWrite(GREEN_LED, HIGH);   // Green LED ON at start (Safe)
  digitalWrite(YELLOW_LED, LOW);   // Yellow LED OFF at start
  digitalWrite(RED_LED, LOW);      // Red LED OFF at start

  Serial.println("MQ-2 Gas Sensor Test");
}

void loop() {
  int rawValue = analogRead(MQ2_PIN);  // Read ADC value
  float voltage = rawValue * (3.3 / 4095.0);  // Convert ADC value to voltage

  Serial.print("Raw ADC Value: ");
  Serial.print(rawValue);
  Serial.print(" | Voltage: ");
  Serial.print(voltage);
  Serial.println("V");

  // Define Gas level thresholds based on ADC readings
  if (rawValue < 3500) {  // Safe Gas Level
    Serial.println("🟢 Safe Gas Level ✅");
    digitalWrite(GREEN_LED, HIGH);  // Green LED ON
    digitalWrite(YELLOW_LED, LOW);  // Yellow LED OFF
    digitalWrite(RED_LED, LOW);     // Red LED OFF
  } 
  else if (rawValue >= 3500 && rawValue < 3600) {  // Moderate Gas Level
    Serial.println("🟡 Moderate Gas Level ⚠️");
    digitalWrite(GREEN_LED, LOW);   // Green LED OFF
    digitalWrite(YELLOW_LED, HIGH); // Yellow LED ON
    digitalWrite(RED_LED, LOW);     // Red LED OFF
  } 
  else {  // High Gas Level
    Serial.println("🔴 HIGH GAS LEVEL DETECTED! 🚨");
    digitalWrite(GREEN_LED, LOW);   // Green LED OFF
    digitalWrite(YELLOW_LED, LOW);  // Yellow LED OFF
    digitalWrite(RED_LED, HIGH);    // Red LED ON
  }

  delay(1000);  // Wait before next reading
}
