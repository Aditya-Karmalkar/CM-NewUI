import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, FileText, Heart, AlertTriangle, Phone, Pill } from 'lucide-react';
import { toast } from 'react-hot-toast';

const QRCodeScanner = ({ onClose, onDataReceived, darkMode = false }) => {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError('');
      setScanning(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Start QR code detection
      detectQRCode();
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const detectQRCode = () => {
    if (!videoRef.current || !scanning) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    const scanFrame = () => {
      if (!scanning || !video.videoWidth) {
        requestAnimationFrame(scanFrame);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Simple QR code detection simulation
      // In a real implementation, you would use a QR code library like jsQR
      // For now, we'll simulate detection with a timeout
      setTimeout(() => {
        if (scanning) {
          // Simulate successful scan
          const mockData = {
            bloodType: 'A+',
            allergies: ['Penicillin', 'Peanuts'],
            emergencyContacts: [
              {
                name: 'John Doe',
                relationship: 'Spouse',
                phoneNumber: '+1-555-0123'
              }
            ],
            medications: [
              {
                name: 'Aspirin',
                dosage: '81mg',
                frequency: 'Daily'
              }
            ],
            medicalConditions: ['Hypertension'],
            lastUpdated: new Date().toISOString()
          };
          
          handleScannedData(mockData);
        }
      }, 3000); // Simulate 3 second scan time
    };

    scanFrame();
  };

  const handleScannedData = (data) => {
    try {
      // Validate the scanned data structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid QR code data');
      }

      // Ensure required fields exist
      const validatedData = {
        bloodType: data.bloodType || 'Unknown',
        allergies: Array.isArray(data.allergies) ? data.allergies : [],
        emergencyContacts: Array.isArray(data.emergencyContacts) ? data.emergencyContacts : [],
        medications: Array.isArray(data.medications) ? data.medications : [],
        medicalConditions: Array.isArray(data.medicalConditions) ? data.medicalConditions : [],
        lastUpdated: data.lastUpdated || new Date().toISOString()
      };

      setScannedData(validatedData);
      setShowPreview(true);
      stopScanning();
      toast.success('QR code scanned successfully!');
    } catch (err) {
      console.error('Error processing scanned data:', err);
      setError('Invalid QR code format. Please try again.');
      stopScanning();
    }
  };

  const handleManualInput = () => {
    const input = prompt('Please paste the QR code data (JSON format):');
    if (input) {
      try {
        const data = JSON.parse(input);
        handleScannedData(data);
      } catch (err) {
        setError('Invalid JSON format. Please check your data.');
      }
    }
  };

  const confirmData = () => {
    if (scannedData) {
      onDataReceived(scannedData);
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    setShowPreview(false);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Camera className="text-blue-500" size={28} />
            Scan Emergency QR Code
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {!showPreview ? (
            <div className="space-y-6">
              {/* Camera View */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className={`w-80 h-80 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center ${
                    scanning ? 'border-blue-500' : ''
                  }`}>
                    {scanning ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="mx-auto mb-4 text-gray-400" size={48} />
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Camera will activate when scanning starts
                        </p>
                      </div>
                    )}
                  </div>
                  {scanning && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-64 border-2 border-blue-500 rounded-lg animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                {!scanning ? (
                  <>
                    <button
                      onClick={startScanning}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Camera size={20} />
                      Start Scanning
                    </button>
                    <button
                      onClick={handleManualInput}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <FileText size={20} />
                      Manual Input
                    </button>
                  </>
                ) : (
                  <button
                    onClick={stopScanning}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X size={20} />
                    Stop Scanning
                  </button>
                )}
              </div>

              {/* Instructions */}
              <div className={`text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>Point your camera at an emergency medical QR code to scan</p>
                <p className="mt-2">Or use manual input to paste QR code data</p>
              </div>
            </div>
          ) : (
            /* Scanned Data Preview */
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
                  <Heart className="text-red-500" size={24} />
                  Scanned Emergency Data
                </h3>
              </div>

              <div className={`p-6 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                {/* Blood Type */}
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="text-red-500" size={20} />
                  <span className="font-semibold">Blood Type:</span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-bold">
                    {scannedData.bloodType}
                  </span>
                </div>

                {/* Allergies */}
                {scannedData.allergies.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="text-yellow-500" size={20} />
                      <span className="font-semibold">Allergies:</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      {scannedData.allergies.map((allergy, index) => (
                        <div key={index} className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {allergy}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Emergency Contacts */}
                {scannedData.emergencyContacts.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="text-green-500" size={20} />
                      <span className="font-semibold">Emergency Contacts:</span>
                    </div>
                    <div className="ml-6 space-y-2">
                      {scannedData.emergencyContacts.map((contact, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-semibold">{contact.name}</div>
                          <div className="text-gray-600">{contact.relationship}</div>
                          <div className="text-blue-600 font-mono">{contact.phoneNumber}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medications */}
                {scannedData.medications.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Pill className="text-blue-500" size={20} />
                      <span className="font-semibold">Current Medications:</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      {scannedData.medications.map((medication, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-semibold">{medication.name}</div>
                          <div className="text-gray-600">{medication.dosage}</div>
                          {medication.frequency && (
                            <div className="text-gray-600">{medication.frequency}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medical Conditions */}
                {scannedData.medicalConditions.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="text-orange-500" size={20} />
                      <span className="font-semibold">Medical Conditions:</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      {scannedData.medicalConditions.map((condition, index) => (
                        <div key={index} className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
                          {condition}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-center pt-4 border-t border-gray-300">
                  <p className="text-xs text-gray-500">
                    Last Updated: {new Date(scannedData.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={confirmData}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Heart size={20} />
                  Use This Data
                </button>
                <button
                  onClick={resetScanner}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Camera size={20} />
                  Scan Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner; 