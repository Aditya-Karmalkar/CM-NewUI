import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Heart, AlertTriangle, Phone, Pill, User, Calendar, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import PatientDataDisplay from './PatientDataDisplay';

const EmergencyProfilePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const dataParam = searchParams.get('data');
    
    if (!dataParam) {
      setError('No emergency profile data found');
      setLoading(false);
      return;
    }

    try {
      const decodedData = decodeURIComponent(dataParam);
      const parsedData = JSON.parse(decodedData);
      
      // Validate the data structure
      if (parsedData.type === 'EMERGENCY_MEDICAL_PROFILE' && parsedData.data) {
        setPatientData(parsedData.data);
      } else {
        // Handle legacy format (direct JSON)
        setPatientData(parsedData);
      }
    } catch (err) {
      console.error('Error parsing emergency profile data:', err);
      setError('Invalid emergency profile data format');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading emergency profile...</p>
        </div>
      </div>
    );
  }

  if (error || !patientData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              Error Loading Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {error || 'Unable to load emergency profile data'}
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-red-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8" />
            <h1 className="text-3xl font-bold">EMERGENCY MEDICAL PROFILE</h1>
          </div>
          <p className="text-red-100">
            Critical medical information for emergency responders
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Critical Information Alert */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-bold text-red-800">CRITICAL INFORMATION</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-red-700">Blood Type</label>
                <Badge variant="destructive" className="text-lg font-bold block w-fit mt-1">
                  {patientData.bloodType || 'Unknown'}
                </Badge>
              </div>
              {patientData.allergies && patientData.allergies.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-red-700">Allergies</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {patientData.allergies.map((allergy, index) => (
                      <Badge key={index} variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        {patientData.emergencyContacts && patientData.emergencyContacts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-500" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patientData.emergencyContacts.map((contact, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-green-50">
                    <h4 className="font-semibold text-lg">{contact.name}</h4>
                    <p className="text-muted-foreground">{contact.relationship}</p>
                    <a 
                      href={`tel:${contact.phoneNumber}`}
                      className="text-lg font-mono text-green-600 hover:text-green-800 underline"
                    >
                      {contact.phoneNumber}
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medical Conditions */}
        {patientData.medicalConditions && patientData.medicalConditions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Medical Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {patientData.medicalConditions.map((condition, index) => (
                  <Badge key={index} variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 text-sm p-2">
                    {condition}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Medications */}
        {patientData.medications && patientData.medications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-blue-500" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patientData.medications.map((medication, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <h4 className="font-semibold">{medication.name}</h4>
                    <p className="text-sm text-muted-foreground">Dosage: {medication.dosage}</p>
                    {medication.frequency && (
                      <p className="text-sm text-muted-foreground">Frequency: {medication.frequency}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <PatientDataDisplay
            patientData={patientData}
            onClose={() => {}}
            onDownloadPDF={() => {}}
            trigger={
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                <Download className="h-5 w-5 mr-2" />
                Download Complete Medical Profile
              </Button>
            }
          />
          <Button variant="outline" size="lg" onClick={() => navigate('/')}>
            Return to CuraMind
          </Button>
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Last Updated: {patientData.lastUpdated ? new Date(patientData.lastUpdated).toLocaleString() : 'Unknown'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyProfilePage;
