# OCR API Integration Guide

This document explains how to integrate and use the OCR (Optical Character Recognition) API for scanning Emirates ID and Passport documents in the Neurula Patient App.

## Overview

The app now supports real-time document scanning with OCR capabilities for:
- **Emirates ID**: Extract personal information from UAE Emirates ID cards
- **Passport**: Extract personal information from international passports

## Recent Updates (v1.1.0)

### Critical Fixes Applied

**Network Request Failed Error - FIXED** ✅
- Removed manual Content-Type header setting (was causing network failures)
- Implemented proper timeout handling using AbortController API
- Added network connectivity checks before API calls
- Enhanced error handling with detailed, user-friendly messages
- Added comprehensive logging for debugging

**Dependencies Added**:
- `@react-native-community/netinfo` - For network connectivity checks

**What Changed**:
1. `src/config/api.js` - Removed Content-Type header from getAPIHeaders()
2. `src/services/ocrService.js` - Added fetchWithTimeout, network checks, better error handling
3. `package.json` - Added @react-native-community/netinfo dependency

---

## Architecture

### Files Created

1. **`src/config/api.js`**
   - API configuration and base URLs
   - Request headers configuration
   - Endpoint definitions

2. **`src/services/ocrService.js`**
   - `scanEmiratesID(imageUri)` - Processes Emirates ID images
   - `scanPassport(imageUri)` - Processes Passport images
   - `scanDocument(imageUri, documentType)` - Generic scanner function

3. **`.env.example`**
   - Environment variable template
   - API configuration examples

### Updated Files

1. **`src/screens/ScanEmiratesID.jsx`**
   - Integrated Emirates ID OCR API
   - Added proper error handling
   - Displays processing status to users

2. **`src/screens/ScanPassport.jsx`**
   - Integrated Passport OCR API
   - Added proper error handling
   - Displays processing status to users

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Update the `.env` file with your API credentials:

```env
API_BASE_URL=https://your-api-domain.com/api
OCR_API_ENDPOINT=/ocr/scan
```

### 2. API Configuration

Update `src/config/api.js` with your specific endpoint URLs if needed:

```javascript
export const API_CONFIG = {
    BASE_URL: process.env.API_BASE_URL || 'https://your-api-domain.com/api',
    TIMEOUT: 30000, // 30 seconds
    ENDPOINTS: {
        OCR_SCAN: '/ocr/scan',
        EMIRATES_ID: '/ocr/emirates-id',
        PASSPORT: '/ocr/passport',
    },
};
```

### 3. Authentication (if required)

If your API requires authentication, update the `getAPIHeaders()` function in `src/config/api.js`:

```javascript
export const getAPIHeaders = (token) => ({
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`, // Add your auth token
});
```

## API Endpoints

### Emirates ID Endpoint

**Endpoint:** `POST /ocr/emirates-id`

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `image`: Image file (JPEG/PNG)
  - `document_type`: "emirates_id"

**Expected Response:**
```json
{
  "success": true,
  "extracted": {
    "full_name": "string",
    "emirates_id": "string",
    "nationality": "string",
    "date_of_birth": "YYYY-MM-DD",
    "sex": "M/F",
    "expiry": "YYYY-MM-DD"
  },
  "confidence": 0.95,
  "raw_data": {}
}
```

### Passport Endpoint

**Endpoint:** `POST /ocr/passport`

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `image`: Image file (JPEG/PNG)
  - `document_type`: "passport"

**Expected Response:**
```json
{
  "success": true,
  "extracted": {
    "full_name": "string",
    "passport_number": "string",
    "nationality": "string",
    "date_of_birth": "YYYY-MM-DD",
    "sex": "M/F",
    "expiry": "YYYY-MM-DD",
    "issue_date": "YYYY-MM-DD",
    "place_of_birth": "string"
  },
  "confidence": 0.95,
  "raw_data": {}
}
```

## Usage

### Using Emirates ID Scanner

```javascript
import { scanEmiratesID } from '../services/ocrService';

const handleScan = async (imageUri) => {
  try {
    const result = await scanEmiratesID(imageUri);

    if (result.success) {
      console.log('Extracted data:', result.extracted);
      console.log('Confidence:', result.confidence);
    }
  } catch (error) {
    console.error('Scan failed:', error.message);
  }
};
```

### Using Passport Scanner

```javascript
import { scanPassport } from '../services/ocrService';

const handleScan = async (imageUri) => {
  try {
    const result = await scanPassport(imageUri);

    if (result.success) {
      console.log('Extracted data:', result.extracted);
      console.log('Confidence:', result.confidence);
    }
  } catch (error) {
    console.error('Scan failed:', error.message);
  }
};
```

### Generic Document Scanner

```javascript
import { scanDocument } from '../services/ocrService';

const handleScan = async (imageUri, documentType) => {
  try {
    const result = await scanDocument(imageUri, documentType);
    // documentType: 'emirates_id' or 'passport'

    if (result.success) {
      console.log('Extracted data:', result.extracted);
    }
  } catch (error) {
    console.error('Scan failed:', error.message);
  }
};
```

## Error Handling

The OCR service includes comprehensive error handling:

1. **Network Errors**: Catches connection issues and timeouts
2. **API Errors**: Handles API response errors with proper messages
3. **Validation Errors**: Validates response data format
4. **User-Friendly Messages**: Displays clear error messages to users

Example error flow in the screens:
```javascript
try {
  const result = await scanEmiratesID(imageUri);
  // Process result...
} catch (error) {
  Alert.alert(
    'Processing Failed',
    error.message || 'Failed to process document.',
    [
      { text: 'Try Again', style: 'default' },
      { text: 'Enter Manually', onPress: handleManual },
    ]
  );
}
```

## Testing

### Testing with Mock Data

For development and testing, you can temporarily modify the API service to return mock data:

```javascript
// In ocrService.js - for testing only
export const scanEmiratesID = async (imageUri) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Return mock data
  return {
    success: true,
    extracted: {
      full_name: 'Test User',
      emirates_id: '784-1987-1234567-1',
      nationality: 'UAE',
      date_of_birth: '1990-01-01',
      sex: 'M',
      expiry: '2030-01-01',
    },
    confidence: 0.95,
  };
};
```

### Testing Checklist

- [ ] Camera permissions work correctly
- [ ] Image capture works on both iOS and Android
- [ ] API requests include proper headers
- [ ] Loading states display correctly during processing
- [ ] Success flow navigates to OCR Review screen
- [ ] Error handling displays user-friendly messages
- [ ] Manual entry option works as fallback
- [ ] Network timeout handling works properly

## Backend Requirements

Your backend API should:

1. **Accept multipart/form-data** requests with image files
2. **Process images** using OCR technology (e.g., Tesseract, Google Vision API, AWS Textract)
3. **Extract structured data** from documents
4. **Return JSON responses** in the expected format
5. **Handle errors gracefully** with appropriate HTTP status codes
6. **Validate image quality** and document type
7. **Provide confidence scores** for extraction accuracy

### Recommended OCR Services

- Google Cloud Vision API
- AWS Textract
- Azure Computer Vision
- Tesseract OCR (open source)
- ABBYY Cloud OCR SDK

## Security Considerations

1. **HTTPS Only**: Always use HTTPS for API communication
2. **Authentication**: Implement proper authentication tokens
3. **Rate Limiting**: Implement rate limiting on the backend
4. **Input Validation**: Validate image size and format
5. **Data Privacy**: Ensure PII data is handled securely
6. **Encryption**: Encrypt sensitive data in transit and at rest

## Performance Optimization

1. **Image Compression**: Images are captured at 0.8 quality to balance size and clarity
2. **Timeout Configuration**: 30-second timeout prevents hanging requests
3. **Error Recovery**: Provides fallback to manual entry
4. **Loading States**: Clear feedback during processing

## Troubleshooting

### Common Issues

#### **Issue**: "Network request failed" (MOST COMMON)

This is the most common error when integrating OCR functionality. Here are the causes and solutions:

**Cause #1: Content-Type Header Misconfiguration** (CRITICAL)
- **Problem**: Setting `Content-Type: multipart/form-data` manually in headers when using FormData
- **Why it fails**: React Native's fetch API needs to auto-generate the multipart boundary. Setting this header manually breaks the boundary generation
- **Solution**: Do NOT set Content-Type header when using FormData. Let React Native handle it automatically
- **Fixed in**: `src/config/api.js` - Content-Type header has been removed from getAPIHeaders()

**Cause #2: API URL Not Configured**
- **Problem**: API_BASE_URL is not set or still using placeholder value
- **Solution**:
  1. Create a `.env` file in project root
  2. Set `API_BASE_URL=https://your-actual-api-domain.com/api`
  3. Restart the development server
- **Check**: Look for error message: "API URL not configured"

**Cause #3: No Internet Connection**
- **Problem**: Device has no network connectivity
- **Solution**:
  1. Check device WiFi/mobile data is enabled
  2. The app now checks connectivity before making requests
  3. Error message will say: "No internet connection"

**Cause #4: Request Timeout**
- **Problem**: API takes longer than 30 seconds to respond
- **Solution**:
  1. Check backend performance
  2. Optimize image size (already set to 0.8 quality)
  3. Increase timeout in `src/config/api.js` if needed
- **Error message**: "Request timeout - Please check your internet connection"

**Cause #5: CORS or SSL Issues**
- **Problem**: API endpoint not accessible from mobile app
- **Solution**:
  1. Ensure API uses HTTPS (not HTTP)
  2. Check API allows requests from mobile apps
  3. Verify SSL certificate is valid

---

#### **Issue**: "API request failed with status 401"
- **Solution**: Check authentication headers and API keys in `src/config/api.js`

#### **Issue**: "Invalid response format from OCR API"
- **Solution**: Ensure backend returns data in expected JSON format with `extracted` field

#### **Issue**: Images not uploading
- **Solution**: ~~Check Content-Type header is set to multipart/form-data~~ **DO NOT set Content-Type header - this will cause errors!**

#### **Issue**: "API URL not configured"
- **Solution**: Set `API_BASE_URL` in `.env` file and restart the app

### Debugging Tips

1. **Check Console Logs**: Look for `[OCR]` prefixed messages in the console for detailed debugging info
2. **Verify Network**: Use `console.log('[OCR] Uploading to:', url)` to see the actual URL being called
3. **Test Connectivity**: Use airplane mode to test "No internet connection" error handling
4. **Inspect Response**: Check `[OCR] Response status:` logs to see HTTP status codes
5. **Review FormData**: Never manually set Content-Type with FormData in React Native!

### Error Messages Reference

| Error Message | Likely Cause | Solution |
|--------------|--------------|----------|
| "Network request failed" | Content-Type header set manually | Remove Content-Type from headers |
| "API URL not configured" | Missing .env configuration | Create .env with API_BASE_URL |
| "No internet connection" | Device offline | Check network connectivity |
| "Request timeout" | Slow API or network | Optimize backend or increase timeout |
| "Server returned status 4xx/5xx" | Backend API error | Check backend logs |

## Future Enhancements

- [ ] Add offline OCR capability using on-device ML
- [ ] Implement document quality checks before upload
- [ ] Add support for additional document types
- [ ] Batch document processing
- [ ] Real-time document edge detection
- [ ] Auto-capture when document is properly aligned

## Support

For issues or questions:
1. Check the error logs in the console
2. Verify API endpoint configuration
3. Test with mock data to isolate issues
4. Contact the backend team for API-related issues

---

**Last Updated**: January 2025
**Version**: 1.1.0 - Fixed "Network request failed" error
