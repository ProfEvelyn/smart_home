#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

Adafruit_BME280 bme;


#define SDA_PIN 17  
#define SCL_PIN 16  

// Pin for Red LED
#define RED_LED 14

void setup() {
  Serial.begin(115200);
  Wire.begin(SDA_PIN, SCL_PIN);  

  
  pinMode(RED_LED, OUTPUT);

  if (!bme.begin(0x76)) {
    Serial.println("Could not find a valid BME280 sensor, check wiring!");
    while (1);
  }

  Serial.println("BME280 Sensor Found!");
}

void loop() {
  float temperature = bme.readTemperature();
  float humidity = bme.readHumidity();
  float pressure = bme.readPressure() / 100.0F; // Convert Pa to hPa

  // Check the temperature range and display accordingly
  if (temperature <= 17) {
    // Turn off Red LED when temperature is safe
    digitalWrite(RED_LED, LOW);
    
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" °C");
  } else {
    // Turn on Red LED when temperature is high
    digitalWrite(RED_LED, HIGH);

    Serial.print("🔴High Temperature: ");
    Serial.print(temperature);
    Serial.println(" °C");
  }

  // Always display humidity and pressure
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");

  Serial.print("Pressure: ");
  Serial.print(pressure);
  Serial.println(" hPa");

  Serial.println("----------------------");

  delay(2000);  // Wait before the next reading
}
