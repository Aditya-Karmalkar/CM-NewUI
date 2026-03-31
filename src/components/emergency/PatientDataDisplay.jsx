import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Heart, 
  AlertTriangle, 
  Phone, 
  Pill, 
  User, 
  Calendar,
  MapPin,
  Stethoscope,
  X,
  Printer
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';

const PatientDataDisplay = ({ patientData, userProfile, medicalReports, onClose, onDownloadPDF }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Use real patient data from props - no mock data
  const patientProfile = {
    personalInfo: {
      fullName: userProfile?.fullName || patientData?.fullName || 'Not Available',
      dateOfBirth: userProfile?.dateOfBirth || patientData?.dateOfBirth || 'Not Available',
      gender: userProfile?.gender || patientData?.gender || 'Not Available',
      address: userProfile?.address || patientData?.address || 'Not Available',
      phone: userProfile?.phone || patientData?.phone || 'Not Available',
      email: userProfile?.email || patientData?.email || 'Not Available'
    },
    emergencyContacts: patientData?.emergencyContacts || [],
    medicalHistory: {
      bloodType: patientData?.bloodType || 'Not Available',
      allergies: patientData?.allergies || [],
      chronicConditions: patientData?.medicalConditions || [],
      currentMedications: patientData?.medications || [],
      previousSurgeries: patientData?.previousSurgeries || [],
      immunizations: patientData?.immunizations || []
    },
    doctorsConsulted: patientData?.doctorsConsulted || [],
    recentReports: medicalReports || [],
    vitalSigns: patientData?.vitalSigns || {
      lastRecorded: 'Not Available',
      bloodPressure: 'Not Available',
      heartRate: 'Not Available',
      temperature: 'Not Available',
      weight: 'Not Available',
      height: 'Not Available'
    }
  };

  const generateEmergencyPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 20;
      let yPosition = 30;

      // Header
      pdf.setFontSize(20);
      pdf.setTextColor(220, 38, 127); // Emergency red
      pdf.text('EMERGENCY MEDICAL PROFILE', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 20;
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 20;

      // Patient Information
      pdf.setFontSize(16);
      pdf.setTextColor(220, 38, 127);
      pdf.text('PATIENT INFORMATION', margin, yPosition);
      yPosition += 15;

      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      const patientInfo = [
        `Name: ${patientProfile.personalInfo.fullName}`,
        `DOB: ${patientProfile.personalInfo.dateOfBirth}`,
        `Gender: ${patientProfile.personalInfo.gender}`,
        `Phone: ${patientProfile.personalInfo.phone}`,
        `Address: ${patientProfile.personalInfo.address}`
      ];

      patientInfo.forEach(info => {
        pdf.text(info, margin, yPosition);
        yPosition += 8;
      });

      yPosition += 10;

      // Current Medications
      pdf.setFontSize(16);
      pdf.setTextColor(220, 38, 127);
      pdf.text('CURRENT MEDICATIONS', margin, yPosition);
      yPosition += 15;

      patientProfile.medicalHistory.currentMedications.forEach((medication, index) => {
        pdf.text(`${index + 1}. ${medication.name} - ${medication.dosage} (${medication.frequency})`, margin, yPosition);
        yPosition += 8;
      });

      yPosition += 10;

      // Emergency Contacts
      pdf.setFontSize(16);
      pdf.setTextColor(220, 38, 127);
      pdf.text('EMERGENCY CONTACTS', margin, yPosition);
      yPosition += 15;

      patientProfile.emergencyContacts.forEach((contact, index) => {
        pdf.text(`${index + 1}. ${contact.name} (${contact.relationship})`, margin, yPosition);
        yPosition += 8;
        pdf.text(`   Phone: ${contact.phoneNumber}`, margin, yPosition);
        yPosition += 12;
      });

      // Critical Emergency Information
      pdf.setFontSize(16);
      pdf.setTextColor(220, 38, 127);
      pdf.text('CRITICAL EMERGENCY INFORMATION', margin, yPosition);
      yPosition += 15;

      const emergencyInfo = [
        `Blood Type: ${patientProfile.medicalHistory.bloodType}`,
        `Allergies: ${patientProfile.medicalHistory.allergies.join(', ') || 'None'}`,
        `Medical Conditions: ${patientProfile.medicalHistory.chronicConditions.join(', ') || 'None'}`
      ];

      emergencyInfo.forEach(info => {
        pdf.text(info, margin, yPosition);
        yPosition += 8;
      });

      yPosition += 10;

      // Doctors Consulted
      pdf.setFontSize(16);
      pdf.setTextColor(220, 38, 127);
      pdf.text('DOCTORS CONSULTED', margin, yPosition);
      yPosition += 15;

      patientProfile.doctorsConsulted.forEach((doctor, index) => {
        pdf.text(`${index + 1}. Dr. ${doctor.name} - ${doctor.specialty}`, margin, yPosition);
        yPosition += 8;
        pdf.text(`   Hospital: ${doctor.hospital}`, margin, yPosition);
        yPosition += 8;
        pdf.text(`   Phone: ${doctor.phone} | Last Visit: ${doctor.lastVisit}`, margin, yPosition);
        yPosition += 12;
      });

      // Recent Reports
      if (yPosition > 200) {
        pdf.addPage();
        yPosition = 30;
      }

      pdf.setFontSize(16);
      pdf.setTextColor(220, 38, 127);
      pdf.text('RECENT MEDICAL REPORTS & TEST RESULTS', margin, yPosition);
      yPosition += 15;

      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      patientProfile.recentReports.forEach((report, index) => {
        // Check if we need a new page
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 30;
        }

        pdf.setFontSize(12);
        pdf.setTextColor(220, 38, 127);
        pdf.text(`${index + 1}. ${report.type} - ${report.date}`, margin, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Doctor: Dr. ${report.doctor}`, margin + 5, yPosition);
        yPosition += 8;
        pdf.text(`File: ${report.file}`, margin + 5, yPosition);
        yPosition += 8;
        pdf.text(`Summary: ${report.summary}`, margin + 5, yPosition);
        yPosition += 8;
        
        // Add detailed results
        pdf.setFontSize(9);
        pdf.setTextColor(60, 60, 60);
        pdf.text(`Results: ${report.results}`, margin + 5, yPosition);
        yPosition += 15;
        
        // Add separator line
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
      });

      // Vital Signs
      yPosition += 10;
      pdf.setFontSize(16);
      pdf.setTextColor(220, 38, 127);
      pdf.text('LATEST VITAL SIGNS', margin, yPosition);
      yPosition += 15;

      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      const vitalSigns = [
        `Last Recorded: ${patientProfile.vitalSigns.lastRecorded}`,
        `Blood Pressure: ${patientProfile.vitalSigns.bloodPressure}`,
        `Heart Rate: ${patientProfile.vitalSigns.heartRate}`,
        `Temperature: ${patientProfile.vitalSigns.temperature}`,
        `Weight: ${patientProfile.vitalSigns.weight}`,
        `Height: ${patientProfile.vitalSigns.height}`
      ];

      vitalSigns.forEach(vital => {
        pdf.text(vital, margin, yPosition);
        yPosition += 8;
      });

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text('This document contains confidential medical information. Handle with care.', 
               pageWidth / 2, pdf.internal.pageSize.height - 10, { align: 'center' });

      // Save the PDF
      const fileName = `Emergency_Profile_${patientProfile.personalInfo.fullName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast.success('Emergency profile PDF downloaded successfully!');
      
      if (onDownloadPDF) {
        onDownloadPDF(fileName);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-red-500" />
            <div>
              <h2 className="text-2xl font-bold">Emergency Medical Profile</h2>
              <p className="text-sm text-muted-foreground">Scanned QR Code Data</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={generateEmergencyPDF}
              disabled={isGeneratingPDF}
              className="bg-red-600 hover:bg-red-700"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p>{patientProfile.personalInfo.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                  <p>{patientProfile.personalInfo.dateOfBirth}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p>{patientProfile.personalInfo.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Gender</label>
                  <p>{patientProfile.personalInfo.gender}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Critical Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blood Type */}
            {patientProfile.medicalHistory.bloodType && patientProfile.medicalHistory.bloodType !== 'Not Available' && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <Heart className="h-5 w-5" />
                    Blood Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {patientProfile.medicalHistory.bloodType}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Allergies */}
            {patientProfile.medicalHistory.allergies.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="h-5 w-5" />
                    Allergies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {patientProfile.medicalHistory.allergies.map((allergy, index) => (
                      <Badge key={index} variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Medical Conditions */}
            {patientProfile.medicalHistory.chronicConditions.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <AlertTriangle className="h-5 w-5" />
                    Medical Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {patientProfile.medicalHistory.chronicConditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Current Medications */}
          {patientProfile.medicalHistory.currentMedications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-blue-500" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patientProfile.medicalHistory.currentMedications.map((medication, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <h4 className="font-semibold">{medication.name}</h4>
                      <p className="text-sm text-muted-foreground">Dosage: {medication.dosage}</p>
                      <p className="text-sm text-muted-foreground">Frequency: {medication.frequency}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-500" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patientProfile.emergencyContacts.map((contact, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <h4 className="font-semibold">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                    <p className="text-sm font-mono text-blue-600">{contact.phoneNumber}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Doctors Consulted */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-purple-500" />
                Doctors Consulted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientProfile.doctorsConsulted.map((doctor, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{doctor.name}</h4>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        <p className="text-sm">{doctor.hospital}</p>
                        <p className="text-sm font-mono text-blue-600">{doctor.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Last Visit</p>
                        <p className="text-sm font-semibold">{doctor.lastVisit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" />
                Recent Medical Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patientProfile.recentReports.map((report, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{report.type}</h4>
                        <p className="text-sm text-muted-foreground">Dr. {report.doctor} • {report.date}</p>
                        <p className="text-sm mt-1">{report.summary}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <h5 className="font-medium text-sm mb-2">Detailed Results:</h5>
                      <p className="text-sm text-gray-700">{report.results}</p>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      File: {report.file}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDataDisplay;
