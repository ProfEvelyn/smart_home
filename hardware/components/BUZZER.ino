#define BUZZER_PIN 27  // Define buzzer pin

void setup() {
    Serial.begin(115200);  // Start serial communication
    pinMode(BUZZER_PIN, OUTPUT);  // Set buzzer pin as output
}

void loop() {
    Serial.println("Buzzer ON");
    digitalWrite(BUZZER_PIN, HIGH);  // Turn buzzer ON
    delay(1000);  // Wait 1 second

    Serial.println("Buzzer OFF");
    digitalWrite(BUZZER_PIN, LOW);  // Turn buzzer OFF
    delay(1000);  // Wait 1 second
}

