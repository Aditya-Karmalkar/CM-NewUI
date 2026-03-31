import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Calendar, ArrowRight } from 'lucide-react';

const ConsultationPrompt = ({ consultationInfo, darkMode, onClose }) => {
  const navigate = useNavigate();

  console.log('ConsultationPrompt rendered with:', consultationInfo);

  if (!consultationInfo || !consultationInfo.requiresConsultation) {
    console.log('ConsultationPrompt: Not showing (no consultation required)');
    return null;
  }

  console.log('ConsultationPrompt: Showing consultation prompt');

  const { urgencyLevel, recommendedSpecialties, concerns } = consultationInfo;

  const urgencyColors = {
    critical: {
      border: 'border-red-200',
      strip: 'bg-red-500',
      iconBg: 'bg-red-100',
      icon: 'text-red-600',
      text: 'text-red-900'
    },
    high: {
      border: 'border-orange-200',
      strip: 'bg-orange-500',
      iconBg: 'bg-orange-100',
      icon: 'text-orange-600',
      text: 'text-orange-900'
    },
    moderate: {
      border: 'border-blue-200',
      strip: 'bg-blue-500',
      iconBg: 'bg-blue-100',
      icon: 'text-blue-600',
      text: 'text-blue-900'
    },
    normal: {
      border: 'border-gray-200',
      strip: 'bg-gray-400',
      iconBg: 'bg-gray-100',
      icon: 'text-gray-600',
      text: 'text-gray-900'
    }
  };

  const urgencyMessages = {
    critical: '🚨 Immediate Medical Attention Required',
    high: '⚠️ Please Consult a Doctor Soon',
    moderate: '💡 Consider Scheduling an Appointment',
    normal: 'ℹ️ Medical Consultation Recommended'
  };

  const handleScheduleAppointment = () => {
    console.log('Schedule Appointment clicked!');
    console.log('Navigation data:', {
      activeView: 'appointments',
      appointmentData: {
        preSelectedSpecialty: recommendedSpecialties[0] || 'General Practitioner',
        concerns: concerns,
        urgency: urgencyLevel,
        autoFillNotes: concerns.map(c => `${c.message} (${c.value})`).join('; ')
      }
    });
    
    // Navigate to new health dashboard with appointments view and pre-filled data
    navigate('/health-dashboard', {
      state: {
        activeView: 'appointments',
        appointmentData: {
          preSelectedSpecialty: recommendedSpecialties[0] || 'General Practitioner',
          concerns: concerns,
          urgency: urgencyLevel,
          autoFillNotes: concerns.map(c => `${c.message} (${c.value})`).join('; ')
        }
      }
    });
    
    console.log('Navigation called');
  };

  return (
    <div className={`mt-5 overflow-hidden rounded-xl border ${urgencyColors[urgencyLevel].border} bg-white shadow-sm transition-all duration-300 relative`}>
      {/* Decorative top pulse strip */}
      <div className={`absolute top-0 left-0 right-0 h-1 md:h-1.5 ${urgencyColors[urgencyLevel].strip || 'bg-blue-500'}`} style={{ animation: urgencyLevel==='critical'? 'pulse 2s infinite': 'none' }}></div>
      
      <div className="p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full flex-shrink-0 mt-1 ${urgencyColors[urgencyLevel].iconBg}`}>
            <AlertCircle className={`w-6 h-6 ${urgencyColors[urgencyLevel].icon}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-lg mb-1.5 ${urgencyColors[urgencyLevel].text}`}>
              {urgencyMessages[urgencyLevel]}
            </h3>
            
            {urgencyLevel === 'critical' && (
              <p className="text-sm text-red-700 font-semibold mb-3 bg-red-50 p-2.5 rounded-md border border-red-100">
                ⚠️ If this is a medical emergency, call 911 or emergency services immediately, or go to the nearest emergency room.
              </p>
            )}

            {concerns && concerns.length > 0 && (
              <div className="mb-4 mt-2">
                <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2">Primary Concerns</p>
                <div className="flex flex-col gap-1.5 ">
                  {concerns.map((concern, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-blue-500 mt-0.5 text-lg leading-none">•</span>
                      <span><span className="font-medium text-gray-900">{concern.message}</span> <span className="text-gray-500">({concern.value})</span></span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {recommendedSpecialties && recommendedSpecialties.length > 0 && (
              <div className="mb-5">
                <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2">Recommended Specialists</p>
                <div className="flex flex-wrap gap-2">
                  {recommendedSpecialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={handleScheduleAppointment}
                type="button"
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm shadow-sm transition-all focus:ring-2 focus:ring-offset-2 ${
                  urgencyLevel === 'critical' || urgencyLevel === 'high'
                    ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
                    : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Schedule Appointment
                <ArrowRight className="w-4 h-4" />
              </button>
              
              {onClose && (
                <button
                  onClick={onClose}
                  type="button"
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg font-medium text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 ring-1 ring-inset ring-gray-200 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPrompt;
