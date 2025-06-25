#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <LiquidCrystal_I2C.h>  // Include the LCD library
#include <FirebaseESP32.h>      // Include Firebase library
#include <WiFi.h>               // Include Wi-Fi library

// Initialize BME280 sensor
Adafruit_BME280 bme;

// Initialize LCD (I2C address, columns, rows)
LiquidCrystal_I2C lcd(0x27, 16, 2);

#define SDA_PIN 17  
#define SCL_PIN 16  

// Pin Definitions
#define MQ2_PIN 36     // MQ-2 Gas Sensor
#define MQ7_PIN 39     // MQ-7 Carbon Monoxide Sensor
#define MQ135_PIN 35   // MQ-135 Air Quality Sensor

#define GREEN_LED 25   // Green LED (Safe)
#define YELLOW_LED 26  // Yellow LED (Moderate)
#define RED_LED 14     // Red LED (High) - Also used for flame

#define FLAME_SENSOR 34  // Flame sensor pin
#define PIR_SENSOR_PIN 12  // PIR sensor OUT pin
#define BUZZER_PIN 27      // Buzzer pin

#define BUTTON_PIN 13      // Push button pin

// Variables for LCD display
int displayState = 0;  // Tracks the current display state (0-7)
bool buttonPressed = false;

// Wi-Fi credentials
#define WIFI_SSID "Scott-zw"      // Replace with your Wi-Fi SSID
#define WIFI_PASSWORD "12233334444"  // Replace with your Wi-Fi password

// Firebase configuration
#define FIREBASE_HOST "smarthome-e80a2-default-rtdb.europe-west1.firebasedatabase.app"
#define FIREBASE_AUTH "AIzaSyCXguo_C46WdT3CwqZxL53Ko0MGJcTp09k"

FirebaseData firebaseData;
FirebaseConfig config;
FirebaseAuth auth;

void setup() {
  Serial.begin(115200);
  Wire.begin(SDA_PIN, SCL_PIN);  // Initialize I2C for BME280

  // Initialize LCD
  lcd.begin(16, 2);
  lcd.backlight();
  lcd.print("Eve Sensors");  // Startup message

  // Set pin modes
  pinMode(MQ2_PIN, INPUT);
  pinMode(MQ7_PIN, INPUT);
  pinMode(MQ135_PIN, INPUT);
  pinMode(FLAME_SENSOR, INPUT);
  pinMode(PIR_SENSOR_PIN, INPUT); 
  pinMode(BUTTON_PIN, INPUT_PULLUP);  // Button with internal pull-up

  pinMode(GREEN_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  // Start with all LEDs & buzzer OFF
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(YELLOW_LED, LOW);
  digitalWrite(RED_LED, LOW);
  digitalWrite(BUZZER_PIN, LOW);

  if (!bme.begin(0x76)) {
    Serial.println("Could not find a valid BME280 sensor, check wiring!");
    while (1);
  }

  Serial.println("BME280 Sensor Found!");
  Serial.println("MQ-2, MQ-7, MQ-135 Sensor & Flame Detection System");

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("Connected to Wi-Fi");

  // Initialize Firebase
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  Serial.println("Firebase initialized!");
}

void loop() {
  // Read BME280 Sensor Data
  float temperature = bme.readTemperature();
  float humidity = bme.readHumidity();
  float pressure = bme.readPressure() / 100.0F; // Convert Pa to hPa

  // Read Gas Sensor Values
  int mq2Value = analogRead(MQ2_PIN);
  int mq7Value = analogRead(MQ7_PIN);
  int mq135Value = analogRead(MQ135_PIN);

  float mq2Voltage = mq2Value * (3.3 / 4095.0);
  float mq7Voltage = mq7Value * (3.3 / 4095.0);
  float mq135Voltage = mq135Value * (3.3 / 4095.0);

  // Check if the button is pressed
  if (digitalRead(BUTTON_PIN) == LOW) {
    if (!buttonPressed) {
      displayState = (displayState + 1) % 7;  // Cycle through 7 states
      buttonPressed = true;
      delay(200);  // Debounce delay
    }
  } else {
    buttonPressed = false;
  }

  // Update LCD display based on the button state
  lcd.clear();
  switch (displayState) {
    case 0:
      lcd.print("Eve Sensors");
      break;
    case 1:
      lcd.print("MQ2: ");
      if (mq2Value < 3430) {
        lcd.print("Safe ");
      } else if (mq2Value >= 3430 && mq2Value < 3460) {
        lcd.print("Moderate ");
      } else {
        lcd.print(" HIGH");
      }
      lcd.setCursor(0, 1);
      lcd.print("Raw: ");
      lcd.print(mq2Value);
      break;
    case 2:
      lcd.print("MQ7: ");
      if (mq7Value < 2750) {
        lcd.print("Safe ");
      } else if (mq7Value >= 2750 && mq7Value < 2800) {
        lcd.print("Moderate ");
      } else {
        lcd.print("HIGH ");
      }
      lcd.setCursor(0, 1);
      lcd.print("Raw: ");
      lcd.print(mq7Value);
      break;
    case 3:
      lcd.print("MQ135: ");
      if (mq135Value < 3190) {
        lcd.print("Good");
      } else if (mq135Value >= 3190 && mq135Value < 3200) {
        lcd.print("Moderate");
      } else {
        lcd.print("POOR");
      }
      lcd.setCursor(0, 1);
      lcd.print("Raw: ");
      lcd.print(mq135Value);
      break;
    case 4:
      lcd.print("Temp: ");
      lcd.print(temperature);
      lcd.print(" C");
      lcd.setCursor(0, 1);
      lcd.print("High Temp: ");
      lcd.print(temperature > 17 ? "Yes" : "No");
      break;
    case 5:
      lcd.print("Humidity: ");
      lcd.print(humidity);
      lcd.print(" %");
      lcd.setCursor(0, 1);
      lcd.print("Pressure: ");
      lcd.print(pressure);
      lcd.print(" hPa");
      break;
    case 6:
      lcd.print("Flame: ");
      lcd.print(analogRead(FLAME_SENSOR) > 300 ? " Detected " : "No ");
      lcd.setCursor(0, 1);
      lcd.print("Motion: ");
      lcd.print(digitalRead(PIR_SENSOR_PIN) == HIGH ? " Detected " : "No ");
      break;
  }

  // Send sensor data to Firebase
  Serial.println("Sending data to Firebase...");
  Serial.println("----------------------------------------");

  // Print data being sent to Firebase
  Serial.print("Temperature: "); Serial.println(temperature);
  Serial.print("Humidity: "); Serial.println(humidity);
  Serial.print("Pressure: "); Serial.println(pressure);
  Serial.print("MQ2: "); Serial.println(mq2Value);
  Serial.print("MQ7: "); Serial.println(mq7Value);
  Serial.print("MQ135: "); Serial.println(mq135Value);
  Serial.print("Flame Detected: "); Serial.println(analogRead(FLAME_SENSOR) > 6000 ? "Yes" : "No");
  Serial.print("Motion Detected: "); Serial.println(digitalRead(PIR_SENSOR_PIN) == HIGH ? "Yes" : "No");

  if (Firebase.setFloat(firebaseData, "/sensors/temperature", temperature) &&
      Firebase.setFloat(firebaseData, "/sensors/humidity", humidity) &&
      Firebase.setFloat(firebaseData, "/sensors/pressure", pressure) &&
      Firebase.setInt(firebaseData, "/sensors/mq2", mq2Value) &&
      Firebase.setInt(firebaseData, "/sensors/mq7", mq7Value) &&
      Firebase.setInt(firebaseData, "/sensors/mq135", mq135Value) &&
      Firebase.setBool(firebaseData, "/sensors/flameDetected", analogRead(FLAME_SENSOR) > 6000) &&
      Firebase.setBool(firebaseData, "/sensors/motionDetected", digitalRead(PIR_SENSOR_PIN) == HIGH)) {
    Serial.println("Data sent to Firebase successfully!");
  } else {
    Serial.println("Failed to send data to Firebase");
    Serial.println(firebaseData.errorReason());
  }

  Serial.println("----------------------------------------");

  delay(500);  // Delay before displaying sensor outputs

  // Display sensor outputs on Serial Monitor
  Serial.println("_____________________________________ Sensor Readings __________________________________________");

  // MQ-2 Gas Sensor Logic
  bool greenLEDState = false;
  bool yellowLEDState = false;
  bool redLEDState = false;

  Serial.print("MQ2: ");
  if (mq2Value < 3430) {
    Serial.print("🟢 Safe Gas Level ✅");
    greenLEDState = true;
  } else if (mq2Value >= 3430 && mq2Value < 3460) {
    Serial.print("🟡 Moderate Gas Level ⚠️");
    yellowLEDState = true;
  } else {
    Serial.print("🔴 HIGH GAS LEVEL DETECTED! 🚨");
    redLEDState = true;
  }
  Serial.print(" | Raw ADC Value: "); Serial.print(mq2Value);
  Serial.print(" | Voltage: "); Serial.print(mq2Voltage);
  Serial.println("V");

  // MQ-7 Carbon Monoxide Sensor Logic
  Serial.print("MQ7: ");
  if (mq7Value < 2750) {
    Serial.print("🟢 Safe CO Level ✅");
    greenLEDState = true;
  } else if (mq7Value >= 2750 && mq7Value < 2800) {
    Serial.print("🟡 Moderate CO Level ⚠️");
    yellowLEDState = true;
  } else {
    Serial.print("🔴 HIGH CO LEVEL DETECTED! 🚨");
    redLEDState = true;
  }
  Serial.print(" | Raw ADC Value: "); Serial.print(mq7Value);
  Serial.print(" | Voltage: "); Serial.print(mq7Voltage);
  Serial.println("V");

  // MQ-135 Air Quality Sensor Logic
  Serial.print("MQ135: ");
  if (mq135Value < 3190) {
    Serial.print("🟢 Good Air Quality ✅");
    greenLEDState = true;
  } else if (mq135Value >= 3190 && mq135Value < 3200) {
    Serial.print("🟡 Moderate Air Quality ⚠️");
    yellowLEDState = true;
  } else {
    Serial.print("🔴 POOR AIR QUALITY DETECTED! 🚨");
    redLEDState = true;
  }
  Serial.print(" | Raw ADC Value: "); Serial.print(mq135Value);
  Serial.print(" | Voltage: "); Serial.print(mq135Voltage);
  Serial.println("V");

  // Temperature Check
  if (temperature > 17) {
    Serial.print("🔴 High Temperature: ");
    redLEDState = true; // If temperature is high, turn ON Red LED
  } else {
    Serial.print("Temperature: ");
  }
  Serial.print(temperature);
  Serial.println(" °C");

  // Print Humidity & Pressure
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");

  Serial.print("Pressure: ");
  Serial.print(pressure);
  Serial.println(" hPa");

  // Read Flame Sensor
  int flameValue = analogRead(FLAME_SENSOR);
  Serial.print("Flame Sensor Value: ");
  Serial.println(flameValue);

  if (flameValue > 300) {  // Flame detected
    Serial.println("🔥 FLAME DETECTED! 🚨");
    digitalWrite(BUZZER_PIN, HIGH);  // Turn ON buzzer

    // Blink red LED continuously
    digitalWrite(RED_LED, HIGH);
    delay(100);
    digitalWrite(RED_LED, LOW);
    delay(100);
  } 
  else {  // No flame detected
    Serial.println("🟢 NO FLAME DETECTED");
    digitalWrite(BUZZER_PIN, LOW);   // Turn OFF buzzer
    digitalWrite(RED_LED, LOW);   // Turn OFF red LED
  }

  // PIR Motion Detection
  int pirValue = digitalRead(PIR_SENSOR_PIN);  // Read PIR sensor value
  if (pirValue == HIGH) { // Motion detected
    Serial.println("🚨 PERSON DETECTED WITHIN 3 METERS! 🚨");

    // Keep the buzzer ON non-stop
    digitalWrite(BUZZER_PIN, HIGH);

    // Blink LED continuously while motion is detected
    while (digitalRead(PIR_SENSOR_PIN) == HIGH) {
      digitalWrite(RED_LED, HIGH);
      delay(500);
      digitalWrite(RED_LED, LOW);
      delay(500);
    }
  } else {
    Serial.println("✅ No Motion. System Normal.");

    // Turn OFF both LED and buzzer
    digitalWrite(RED_LED, LOW);
    digitalWrite(BUZZER_PIN, LOW);
  }

  // Set LED States (Ensuring Multiple LEDs Can Be ON)
  digitalWrite(GREEN_LED, greenLEDState ? HIGH : LOW);
  digitalWrite(YELLOW_LED, yellowLEDState ? HIGH : LOW);
  digitalWrite(RED_LED, redLEDState ? HIGH : LOW);

  delay(1);  // Short delay to improve responsiveness
}