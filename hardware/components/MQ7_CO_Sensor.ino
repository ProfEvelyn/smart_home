#define MQ7_PIN 39      // Analog input pin for MQ7 CO sensor
#define GREEN_LED 25    // Green LED (Safe)
#define YELLOW_LED 26   // Yellow LED (Moderate)
#define RED_LED 14      // Red LED (High)

void setup() {
  Serial.begin(115200);
  pinMode(MQ7_PIN, INPUT);
  pinMode(GREEN_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);

  // Ensure LEDs start in the correct state
  digitalWrite(GREEN_LED, HIGH);   // Green LED ON at start (Safe)
  digitalWrite(YELLOW_LED, LOW);   // Yellow LED OFF at start
  digitalWrite(RED_LED, LOW);      // Red LED OFF at start

  Serial.println("MQ-7 Carbon Monoxide Sensor Test");
}

void loop() {
  int rawValue = analogRead(MQ7_PIN);  // Read raw ADC value
  float voltage = rawValue * (3.3 / 4095.0);  // Convert ADC value to voltage

  Serial.print("Raw ADC Value: ");
  Serial.print(rawValue);
  Serial.print(" | Voltage: ");
  Serial.print(voltage);
  Serial.println("V");

  if (rawValue < 2270) {  // Safe CO Level
    Serial.println("🟢 Safe CO Level ✅");
    digitalWrite(GREEN_LED, HIGH);  // Green LED ON
    digitalWrite(YELLOW_LED, LOW);  // Yellow LED OFF
    digitalWrite(RED_LED, LOW);     // Red LED OFF
  } 
  else if (rawValue >= 2270 && rawValue < 2300) {  // Moderate CO Level
    Serial.println("🟡 Moderate CO Level ⚠️");
    digitalWrite(GREEN_LED, LOW);  // Green LED OFF
    digitalWrite(YELLOW_LED, HIGH); // Yellow LED ON
    digitalWrite(RED_LED, LOW);    // Red LED OFF
  } 
  else {  // High CO Level
    Serial.println("🔴 HIGH CO LEVEL DETECTED! 🚨");
    digitalWrite(GREEN_LED, LOW);   // Green LED OFF
    digitalWrite(YELLOW_LED, LOW);  // Yellow LED OFF
    digitalWrite(RED_LED, HIGH);    // Red LED ON
  }

  delay(1000);  // Wait before next reading
}