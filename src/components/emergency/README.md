# Emergency Medical Profile (Offline QR Code) Feature

## Overview

The Emergency Medical Profile feature allows users to create and manage their emergency medical information, which can be accessed offline through scannable QR codes. This feature is crucial for emergency situations where immediate access to medical information is needed without requiring internet connectivity or app login.

## Features

### Core Functionality
- **Blood Type Management**: Store and display blood type information
- **Allergies Tracking**: Add and manage multiple allergies
- **Emergency Contacts**: Store contact information for emergency situations
- **Medications List**: Track current medications with dosage and frequency
- **Medical Conditions**: Document existing medical conditions
- **QR Code Generation**: Create scannable QR codes containing all medical data
- **QR Code Scanning**: Scan existing QR codes to import medical data
- **Offline Access**: All data is encoded in QR codes for offline use

### User Interface Features
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Consistent with the main application theme
- **Real-time Updates**: Changes are saved immediately
- **Data Validation**: Ensures data integrity and proper formatting
- **Download Options**: Save QR codes and emergency cards as images

## Technical Implementation

### Backend Components

#### 1. Database Model (`emergencyProfileModel.js`)
```javascript
const emergencyProfileSchema = new mongoose.Schema({
  userId: String,
  bloodType: String,
  allergies: [String],
  emergencyContacts: [{
    name: String,
    relationship: String,
    phoneNumber: String
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String
  }],
  medicalConditions: [String],
  qrCodeData: String,
  lastUpdated: Date
});
```

#### 2. API Endpoints
- `GET /api/emergency-profile/:userId` - Retrieve user's emergency profile
- `PUT /api/emergency-profile/:userId` - Update emergency profile and generate QR code
- `GET /api/emergency-profile/:userId/qr-code` - Generate QR code for profile
- `POST /api/emergency-profile/decode` - Decode QR code data

#### 3. QR Code Generation
- Uses `qrcode` library for QR code generation
- High error correction level (H) for reliability
- JSON data format for easy parsing
- Optimized for medical emergency scenarios

### Frontend Components

#### 1. Main Component (`EmergencyProfile.jsx`)
- Form management for all medical data
- Real-time data validation
- Integration with backend API
- Modal management for QR features

#### 2. QR Code Generator (`QRCodeGenerator.jsx`)
- Generates QR codes from profile data
- Download functionality for QR codes
- Printable emergency card generation
- Data copying to clipboard

#### 3. QR Code Scanner (`QRCodeScanner.jsx`)
- Camera-based QR code scanning
- Manual data input option
- Data validation and preview
- Integration with main profile

## Data Structure

### QR Code Data Format
```json
{
  "bloodType": "A+",
  "allergies": ["Penicillin", "Peanuts"],
  "emergencyContacts": [
    {
      "name": "John Doe",
      "relationship": "Spouse",
      "phoneNumber": "+1-555-0123"
    }
  ],
  "medications": [
    {
      "name": "Aspirin",
      "dosage": "81mg",
      "frequency": "Daily"
    }
  ],
  "medicalConditions": ["Hypertension"],
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- React application with existing authentication

### Backend Dependencies
```bash
npm install qrcode
```

### Frontend Dependencies
```bash
npm install qrcode react-qr-scanner html2canvas
```

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:5000
MONGO_URI=your_mongodb_connection_string
```

## Usage Instructions

### For Users

1. **Access Emergency Profile**
   - Navigate to `/emergency-profile` in the application
   - Or click "Emergency" in the main navigation

2. **Add Medical Information**
   - Select blood type from dropdown
   - Add allergies by typing and pressing Enter
   - Add emergency contacts with name, relationship, and phone
   - Add medications with name, dosage, and frequency
   - Add medical conditions

3. **Generate QR Code**
   - Click "Generate QR Code" button
   - View and download the QR code
   - Download printable emergency card

4. **Scan QR Code**
   - Click "Scan QR Code" button
   - Allow camera permissions
   - Point camera at QR code
   - Review scanned data and confirm

### For Developers

1. **API Integration**
   ```javascript
   // Get emergency profile
   const response = await fetch(`${API_URL}/api/emergency-profile/${userId}`);
   const data = await response.json();
   ```

2. **QR Code Generation**
   ```javascript
   // Generate QR code
   const qrCode = await QRCode.toDataURL(JSON.stringify(profileData));
   ```

3. **Data Validation**
   ```javascript
   // Validate scanned data
   const validatedData = {
     bloodType: data.bloodType || 'Unknown',
     allergies: Array.isArray(data.allergies) ? data.allergies : [],
     // ... other validations
   };
   ```

## Security Considerations

1. **Data Privacy**: All medical data is stored securely in the database
2. **QR Code Security**: QR codes contain only essential medical information
3. **Access Control**: Users can only access their own emergency profiles
4. **Data Validation**: All input data is validated before storage

## Emergency Use Cases

### Scenario 1: Medical Emergency
1. Patient is unconscious or unable to communicate
2. Medical personnel scan QR code from patient's phone/wallet
3. Immediate access to blood type, allergies, and emergency contacts
4. Quick decision-making for treatment

### Scenario 2: Travel Emergency
1. User is traveling and needs medical attention
2. Language barriers prevent effective communication
3. QR code provides universal medical information
4. Local medical staff can access critical information

### Scenario 3: Family Emergency
1. Family member needs to share medical information
2. QR code can be shared via messaging apps
3. Recipients can scan and access medical data
4. No app installation required

## Future Enhancements

1. **Advanced QR Code Features**
   - Encrypted QR codes for enhanced security
   - Multiple QR code formats (PDF, NFC)
   - QR code expiration dates

2. **Integration Features**
   - Integration with hospital systems
   - Emergency services integration
   - Wearable device compatibility

3. **Additional Data Fields**
   - Organ donor status
   - Advanced directives
   - Insurance information
   - Medical history timeline

## Troubleshooting

### Common Issues

1. **Camera Not Working**
   - Check browser permissions
   - Ensure HTTPS connection (required for camera access)
   - Try manual input option

2. **QR Code Not Scanning**
   - Ensure good lighting
   - Hold camera steady
   - Check QR code quality

3. **Data Not Saving**
   - Check internet connection
   - Verify API endpoint configuration
   - Check browser console for errors

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'emergency-profile');
```

## Contributing

When contributing to this feature:

1. Follow existing code patterns
2. Add proper error handling
3. Include unit tests for new functionality
4. Update documentation
5. Test on multiple devices and browsers

## License

This feature is part of the CuraMind AI project and follows the same licensing terms. 

## Virtual First-Aid Coach (NEW)

### Overview
The Virtual First-Aid Coach is an interactive feature that allows users to describe or upload a picture of a minor injury. CuraMind then provides step-by-step visual and audio guidance on what to do before reaching a hospital. The feature also recommends relevant video tutorials for the specific injury, such as CPR, burn treatment, and more.

### How It Works
- Users can access the Virtual First-Aid Coach from the Emergency Profile page or the main navigation.
- Users are prompted to describe their injury or upload a photo.
- CuraMind analyzes the input and recommends step-by-step first-aid instructions, including:
  - Visual guidance (images or video)
  - Audio guidance (playable instructions)
  - Links to trusted video tutorials for the specific injury (e.g., CPR, burns, cuts, fractures)
- Bonus: Includes quick-access buttons for CPR, burn treatment, and other common emergencies.

### Technologies Used
- React.js (frontend UI)
- TailwindCSS (styling)
- Axios (API calls)
- (Optional) HTML5 `<audio>` and `<video>` for media playback
- (Optional) Integration with YouTube or trusted medical video sources for recommendations

### Access
- The feature is accessible from the Emergency Profile page ("Virtual First-Aid Coach" button) and from the main navigation ("First-Aid Coach").

### Contribution
- Follow the same code and UI patterns as the Emergency Profile module.
- Ensure accessibility for both desktop and mobile users.
- Test with various injury descriptions and image uploads. 