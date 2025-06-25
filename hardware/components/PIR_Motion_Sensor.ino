#define PIR_SENSOR_PIN 12  // PIR sensor OUT pin
#define LED_PIN 14         // LED pin
#define BUZZER_PIN 27      // Buzzer pin

void setup() {
    pinMode(PIR_SENSOR_PIN, INPUT); // PIR sensor as input
    pinMode(LED_PIN, OUTPUT);       // LED as output
    pinMode(BUZZER_PIN, OUTPUT);    // Buzzer as output

    Serial.begin(115200);
    Serial.println("🔄 System Initialized. Waiting for motion...");
}

void loop() {
    int pirValue = digitalRead(PIR_SENSOR_PIN);  // Read PIR sensor value

    if (pirValue == HIGH) { // Motion detected (approx. within 3m)
        Serial.println("🚨 PERSON DETECTED WITHIN 3 METERS! 🚨");

        // Keep the buzzer ON non-stop
        digitalWrite(BUZZER_PIN, HIGH);

        // Blink LED continuously while motion is detected
        while (digitalRead(PIR_SENSOR_PIN) == HIGH) {
            digitalWrite(LED_PIN, HIGH);
            delay(500);
            digitalWrite(LED_PIN, LOW);
            delay(500);
        }
    } else {
        Serial.println("✅ No Motion. System Normal.");

        // Turn OFF both LED and buzzer
        digitalWrite(LED_PIN, LOW);
        digitalWrite(BUZZER_PIN, LOW);
    }

} 