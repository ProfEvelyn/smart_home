
# Smart Home Monitoring System

## Overview
This project implements a comprehensive smart home monitoring system using an ESP32 microcontroller, various environmental sensors, and a web-based frontend. The system provides real-time monitoring of multiple environmental parameters and security features, with both local and remote monitoring capabilities.

## System Architecture

### Hardware Components

#### Core Components
1. **ESP32 Microcontroller**
   - Model: ESP32-WROOM-32
   - Operating Voltage: 3.3V
   - Flash Memory: 4MB
   - SRAM: 520KB
   - Clock Speed: 240MHz
   - WiFi: 802.11 b/g/n
   - Bluetooth: 4.2 BR/EDR and BLE
   - GPIO Pins: 34 (GPIO 6-11 not available)

2. **LCD Display**
   - Type: 16x2 I2C LCD
   - Interface: I2C
   - Address: 0x27 (default)
   - Operating Voltage: 5V
   - Backlight: Yes
   - Characters: 16x2
   - I2C Pins: SDA (GPIO 17), SCL (GPIO 16)

3. **BME280 Sensor**
   - Interface: I2C
   - Address: 0x76
   - Operating Voltage: 3.3V
   - Temperature Range: -40°C to +85°C
   - Humidity Range: 0-100%
   - Pressure Range: 300-1100 hPa
   - I2C Pins: SDA (GPIO 17), SCL (GPIO 16)

#### Safety Sensors

1. **Gas Sensors**
   a. **MQ-2 (General Gas Sensor)**
      - Operating Voltage: 5V
      - Detection Range: 200-10000ppm
      - Response Time: <10s
      - Pin: GPIO 36 (ADC)
      - Thresholds:
        - Safe: <3430
        - Moderate: 3430-3460
        - High: >3460

   b. **MQ-7 (Carbon Monoxide Sensor)**
      - Operating Voltage: 5V
      - Detection Range: 20-2000ppm
      - Response Time: <60s
      - Pin: GPIO 39 (ADC)
      - Thresholds:
        - Safe: <2750
        - Moderate: 2750-2800
        - High: >2800

   c. **MQ-135 (Air Quality Sensor)**
      - Operating Voltage: 5V
      - Detection Range: 10-1000ppm
      - Response Time: <10s
      - Pin: GPIO 35 (ADC)
      - Thresholds:
        - Good: <3190
        - Moderate: 3190-3200
        - Poor: >3200

2. **Security Sensors**
   a. **Flame Sensor**
      - Operating Voltage: 3.3V
      - Detection Range: 760-1100nm
      - Response Time: <1s
      - Pin: GPIO 34 (ADC)
      - Detection Threshold: >300

   b. **PIR Motion Sensor**
      - Operating Voltage: 3.3V
      - Detection Range: 3 meters
      - Response Time: <1s
      - Pin: GPIO 12
      - Output: Digital (HIGH/LOW)

#### Visual Indicators
1. **LED Status System**
   - Green LED (GPIO 25)
     - Indicates safe conditions
     - Voltage: 3.3V
     - Current: 20mA
   - Yellow LED (GPIO 26)
     - Indicates moderate/warning conditions
     - Voltage: 3.3V
     - Current: 20mA
   - Red LED (GPIO 14)
     - Indicates critical conditions
     - Voltage: 3.3V
     - Current: 20mA

2. **Alert System**
   - Buzzer (GPIO 27)
     - Operating Voltage: 3.3V
     - Frequency: 2.7kHz
     - Current: 30mA

### Pin Configuration
```
I2C Interface:
- SDA_PIN: 17
- SCL_PIN: 16

Analog Sensors:
- MQ2_PIN: 36 (ADC1_CH0)
- MQ7_PIN: 39 (ADC1_CH3)
- MQ135_PIN: 35 (ADC1_CH7)
- FLAME_SENSOR: 34 (ADC1_CH6)

Digital Sensors:
- PIR_SENSOR_PIN: 12
- BUTTON_PIN: 13 (Internal Pull-up)

Output Pins:
- GREEN_LED: 25
- YELLOW_LED: 26
- RED_LED: 14
- BUZZER_PIN: 27
```

## Software Architecture

### ESP32 Firmware
The ESP32 firmware (`esp32_main.ino`) implements a multi-threaded architecture:

1. **Sensor Data Collection**
   - Sampling Rate: 500ms
   - ADC Resolution: 12-bit (0-4095)
   - Data Processing:
     ```cpp
     float mq2Voltage = mq2Value * (3.3 / 4095.0);
     float mq7Voltage = mq7Value * (3.3 / 4095.0);
     float mq135Voltage = mq135Value * (3.3 / 4095.0);
     ```

2. **Real-time Monitoring**
   - LCD Update Rate: 500ms
   - Serial Output Rate: 500ms
   - Firebase Update Rate: 500ms

3. **Data Processing**
   - Temperature Conversion: °C
   - Humidity Conversion: %
   - Pressure Conversion: hPa
   - Gas Sensor Calibration:
     ```cpp
     // MQ-2 Calibration
     if (mq2Value < 3430) {
       // Safe condition
     } else if (mq2Value >= 3430 && mq2Value < 3460) {
       // Moderate condition
     } else {
       // High condition
     }
     ```

4. **Firebase Communication**
   - Database Structure:
     ```json
     {
       "sensors": {
         "temperature": float,
         "humidity": float,
         "pressure": float,
         "mq2": int,
         "mq7": int,
         "mq135": int,
         "flameDetected": boolean,
         "motionDetected": boolean
       }
     }
     ```
   - Update Frequency: 500ms
   - Error Handling: Automatic reconnection

5. **LCD Display Management**
   - Display States: 7
   - Button Debounce: 200ms
   - Display Format:
     ```
     Line 1: Parameter Name
     Line 2: Value/Status
     ```

6. **Alert System Control**
   - LED Patterns:
     - Safe: Green ON
     - Moderate: Yellow ON
     - Critical: Red ON + Buzzer
   - Buzzer Patterns:
     - Gas Alert: Continuous
     - Flame Alert: Continuous
     - Motion Alert: Intermittent

### Data Flow
1. **Sensor Data Collection**
   ```cpp
   float temperature = bme.readTemperature();
   float humidity = bme.readHumidity();
   float pressure = bme.readPressure() / 100.0F;
   int mq2Value = analogRead(MQ2_PIN);
   int mq7Value = analogRead(MQ7_PIN);
   int mq135Value = analogRead(MQ135_PIN);
   ```

2. **Data Processing**
   - Temperature Check: >17°C triggers high temp alert
   - Gas Level Analysis: Voltage-based thresholds
   - Motion Detection: Digital HIGH/LOW
   - Flame Detection: Analog threshold >300

3. **Data Display**
   - LCD: 7-state rotation
   - Serial: Detailed debug information
   - Firebase: Real-time updates

4. **Alert System**
   ```cpp
   if (flameValue > 300) {
     digitalWrite(BUZZER_PIN, HIGH);
     digitalWrite(RED_LED, HIGH);
   }
   ```

## Frontend Integration

### Firebase Integration
1. **Configuration**
   ```cpp
   #define FIREBASE_HOST "smarthome-e80a2-default-rtdb.europe-west1.firebasedatabase.app"
   #define FIREBASE_AUTH "AIzaSyCXguo_C46WdT3CwqZxL53Ko0MGJcTp09k"
   ```

2. **Data Structure**
   - Real-time updates
   - Historical data storage
   - Event logging

3. **Security**
   - Firebase Authentication
   - Database Rules
   - SSL Encryption

### Data Points
1. **Environmental Data**
   - Temperature: -40°C to +85°C
   - Humidity: 0-100%
   - Pressure: 300-1100 hPa

2. **Gas Levels**
   - MQ2: 0-4095 (ADC)
   - MQ7: 0-4095 (ADC)
   - MQ135: 0-4095 (ADC)

3. **Security Status**
   - Flame: Boolean
   - Motion: Boolean

## Setup Instructions

### Hardware Setup
1. **Power Requirements**
   - Main Power: 5V/2A
   - Sensor Power: 3.3V
   - Current Draw: ~500mA

2. **Sensor Connections**
   ```
   BME280:
   - VCC → 3.3V
   - GND → GND
   - SDA → GPIO 17
   - SCL → GPIO 16

   Gas Sensors:
   - VCC → 5V
   - GND → GND
   - AOUT → Respective GPIO pins

   LCD:
   - VCC → 5V
   - GND → GND
   - SDA → GPIO 17
   - SCL → GPIO 16
   ```

3. **LED Connections**
   ```
   All LEDs:
   - Anode → Respective GPIO pins
   - Cathode → 220Ω resistor → GND
   ```

### Software Setup
1. **Required Libraries**
   ```cpp
   #include <Wire.h>
   #include <Adafruit_Sensor.h>
   #include <Adafruit_BME280.h>
   #include <LiquidCrystal_I2C.h>
   #include <FirebaseESP32.h>
   #include <WiFi.h>
   ```

2. **WiFi Configuration**
   ```cpp
   #define WIFI_SSID "your-ssid"
   #define WIFI_PASSWORD "your-password"
   ```

3. **Firebase Configuration**
   ```cpp
   #define FIREBASE_HOST "your-firebase-host"
   #define FIREBASE_AUTH "your-firebase-auth"
   ```

## Usage

### LCD Display States
1. **System Status**
   ```
   Line 1: "Eve Sensors"
   Line 2: [Blank]
   ```

2. **MQ2 Gas Sensor**
   ```
   Line 1: "MQ2: [Status]"
   Line 2: "Raw: [Value]"
   ```

3. **MQ7 CO Sensor**
   ```
   Line 1: "MQ7: [Status]"
   Line 2: "Raw: [Value]"
   ```

4. **MQ135 Air Quality**
   ```
   Line 1: "MQ135: [Status]"
   Line 2: "Raw: [Value]"
   ```

5. **Temperature**
   ```
   Line 1: "Temp: [Value] C"
   Line 2: "High Temp: [Yes/No]"
   ```

6. **Humidity & Pressure**
   ```
   Line 1: "Humidity: [Value] %"
   Line 2: "Pressure: [Value] hPa"
   ```

7. **Flame & Motion**
   ```
   Line 1: "Flame: [Detected/No]"
   Line 2: "Motion: [Detected/No]"
   ```

### Monitoring
1. **Local Monitoring**
   - LCD Display
   - LED Indicators
   - Buzzer Alerts

2. **Remote Monitoring**
   - Firebase Console
   - Web Interface
   - Mobile App

3. **Debug Monitoring**
   - Serial Monitor (115200 baud)
   - Detailed sensor readings
   - System status

## Safety Features
1. **Gas Detection**
   - Multiple sensor redundancy
   - Calibrated thresholds
   - Immediate alerts

2. **Fire Detection**
   - Infrared flame detection
   - Immediate audio/visual alerts
   - Remote notification

3. **Motion Detection**
   - PIR sensor
   - 3-meter range
   - Configurable sensitivity

4. **Alert System**
   - Visual indicators
   - Audio alerts
   - Remote notifications

## Maintenance
1. **Regular Checks**
   - Sensor calibration
   - Battery status
   - Connection integrity

2. **System Updates**
   - Firmware updates
   - Library updates
   - Security patches

3. **Backup Systems**
   - Battery backup
   - Data backup
   - Redundant sensors

## Security Considerations
1. **Network Security**
   - WPA2 encryption
   - Firewall rules
   - Regular password updates

2. **Data Security**
   - Firebase authentication
   - Encrypted communication
   - Secure storage

3. **Physical Security**
   - Tamper detection
   - Secure mounting
   - Access control

## Future Enhancements
1. **Mobile Integration**
   - Native mobile app
   - Push notifications
   - Remote control

2. **Voice Integration**
   - Voice alerts
   - Voice commands
   - Status reports

3. **Automation**
   - Automated responses
   - Scheduled actions
   - Event triggers

4. **Energy Management**
   - Power monitoring
   - Energy optimization
   - Battery management

5. **Smart Home Integration**
   - Home Assistant
   - Google Home
   - Amazon Alexa

## Troubleshooting
1. **Sensor Issues**
   - Check connections
   - Verify power supply
   - Calibrate sensors

2. **Network Issues**
   - Check WiFi connection
   - Verify Firebase credentials
   - Test internet connectivity

3. **Display Issues**
   - Check I2C address
   - Verify connections
   - Test backlight

4. **Alert Issues**
   - Check buzzer
   - Verify LED connections
   - Test power supply

5. **System Issues**
   - Check serial output
   - Verify firmware
   - Test all components

## Contributing
1. **Code Contributions**
   - Follow Arduino style guide
   - Document changes
   - Test thoroughly

2. **Documentation**
   - Update README
   - Add comments
   - Create guides

3. **Testing**
   - Unit tests
   - Integration tests
   - Performance tests

4. **Bug Reports**
   - Detailed description
   - Steps to reproduce
   - Expected behavior

## License
[Add your license information here]

## Contact
[Add your contact information here] =======
# HomePulse - Smart Home Monitoring System
 
HomePulse is a modern, real-time home monitoring system that provides comprehensive insights into your home's environmental conditions and security status. Built with React and Firebase, it offers a beautiful, responsive dashboard for monitoring various sensors and security features.
 
## 🌟 Features
 
- **Real-time Monitoring**: Live updates of all sensor data
- **Multi-sensor Support**:
  - Temperature monitoring
  - Humidity tracking
  - Pressure readings
  - Air quality (MQ2, MQ7, MQ135)
  - Flame detection
  - Motion detection
- **Interactive Dashboard**:
  - Responsive design for all devices
  - Horizontal scrolling cards for mobile
  - Real-time graphs with customizable time ranges
  - Status indicators for each sensor
- **Security Features**:
  - Instant email notifications for security alerts
  - Connection status monitoring
  - Last seen timestamps
- **Data Visualization**:
  - Interactive line/bar graphs
  - Customizable time ranges (5min, 15min, 1hour)
  - Real-time data updates
 
## 🖥️ Tech Stack
 
- **Frontend**:
  - React.js
  - Next.js
  - Tailwind CSS
  - Chart.js for data visualization
  - Lucide React for icons
- **Backend**:
  - Firebase Realtime Database
  - Firebase Authentication
- **Deployment**:
  - Vercel (recommended)
 
## 🚀 Getting Started
 
### Prerequisites
 
- Node.js (v14 or higher)
- npm or yarn
- Firebase account
 
### Installation
 
1. Clone the repository:
   ```bash
   hg clone https//evelyn21144053smarthomefir_241
   cd software
   ```
 
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
 
3. Set up Firebase:
   - Create a new Firebase project
   - Enable Realtime Database
   - Enable Authentication
   - Add your Firebase configuration to `.env.local`:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```
 
4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
 
5. Open [http://localhost:3000](http://localhost:3000) in your browser
 
## 📱 Mobile Responsiveness
 
The dashboard is fully responsive and optimized for mobile devices:
- Horizontal scrolling cards for better mobile navigation
- Full-width graphs for better visibility
- Touch-friendly controls and buttons
- Adaptive layouts for different screen sizes
 
## 🔒 Security
 
- Protected routes with Firebase Authentication
- Secure API endpoints
- Email notifications for security alerts
- Real-time connection status monitoring
 
## 📊 Dashboard Features
 
### Sensor Cards
- Real-time status indicators
- Color-coded thresholds
- Interactive selection
- Animated status bars
 
### Graph Visualization
- Customizable time ranges
- Interactive tooltips
- Responsive design
- Support for both line and bar charts
 
## 🛠️ Configuration
 
### Sensor Thresholds
The system comes with predefined thresholds for different sensors:
- Temperature: 0-30°C (safe), 30-40°C (warning), >40°C (danger)
- Humidity: 30-60% (safe), 20-30% (warning), <20% (danger)
- Pressure: 980-1050 hPa (safe), 950-980 hPa (warning), <950 hPa (danger)
- Air Quality: Configurable thresholds for MQ2, MQ7, and MQ135 sensors
 
## 📸 Screenshots
 
![Landing Page](images/landing_page.png)

 
## 🤝 Contributing
 
Contributions are welcome! Please feel free to submit a Pull Request.
 
## 📝 License
 
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
 
## 👥 Authors
 
- EVELYN SIBANDA 
 
## 🙏 Acknowledgments
 
- Firebase for real-time database and authentication
- Chart.js for data visualization
- Lucide React for beautiful icons
- Tailwind CSS for styling
 
 >>>>>>> destination
# Smart_home
# Smart_home
# fix
# smart_home
# smart_home
# smart_home
