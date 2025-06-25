#define GREEN_LED 25   // Green LED (Safe)
#define YELLOW_LED 26  // Yellow LED (Moderate)
#define RED_LED 14     // Red LED (Alert)

void setup() {
    Serial.begin(115200);  // Start Serial Monitor
    pinMode(GREEN_LED, OUTPUT);
    pinMode(YELLOW_LED, OUTPUT);
    pinMode(RED_LED, OUTPUT);
}

void loop() {
    // Test Green LED
    digitalWrite(GREEN_LED, HIGH);
    Serial.println("GREEN LED is ON");
    delay(1000);
    digitalWrite(GREEN_LED, LOW);
    Serial.println("GREEN LED is OFF");

    // Test Yellow LED
    digitalWrite(YELLOW_LED, HIGH);
    Serial.println("YELLOW LED is ON");
    delay(1000);
    digitalWrite(YELLOW_LED, LOW);
    Serial.println("YELLOW LED is OFF");

    // Test Red LED
    digitalWrite(RED_LED, HIGH);
    Serial.println("RED LED is ON");
    delay(1000);
    digitalWrite(RED_LED, LOW);
    Serial.println("RED LED is OFF");

    delay(1000);  // Small delay before repeating
}
