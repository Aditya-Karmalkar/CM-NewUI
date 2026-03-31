import { supabase } from '../supabase';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

/**
 * Fetch patient's health metrics history
 * @param {string} userId - User ID
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Promise<Object>} Health metrics data
 */
export const getPatientHealthMetrics = async (userId, days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Organize metrics by type
    const organizedMetrics = {
      blood_pressure: [],
      heart_rate: [],
      blood_glucose: [],
      weight: [],
      sleep: [],
      latest: {}
    };

    data.forEach(metric => {
      if (organizedMetrics[metric.type]) {
        organizedMetrics[metric.type].push(metric);
      }
      
      // Keep track of latest value for each type
      if (!organizedMetrics.latest[metric.type]) {
        organizedMetrics.latest[metric.type] = metric;
      }
    });

    return organizedMetrics;
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    return null;
  }
};

/**
 * Fetch patient's medication list
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of medications
 */
export const getPatientMedications = async (userId) => {
  try {
    const { data, error} = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching medications:', error);
    return [];
  }
};

/**
 * Fetch patient's appointment history
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of appointments
 */
export const getPatientAppointments = async (userId) => {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    const appointmentsRef = collection(db, 'users', userId, 'appointments');
    const q = query(
      appointmentsRef,
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    const appointments = [];
    
    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });

    return appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

/**
 * Analyze health metrics for concerning patterns
 * @param {Object} metrics - Organized health metrics
 * @returns {Object} Analysis results with concerns and recommendations
 */
export const analyzeHealthMetrics = (metrics) => {
  const concerns = [];
  const recommendations = [];
  let urgencyLevel = 'normal'; // normal, moderate, high, critical

  // Analyze Blood Pressure
  if (metrics.latest.blood_pressure) {
    const bp = metrics.latest.blood_pressure;
    const systolic = bp.systolic;
    const diastolic = bp.diastolic;

    if (systolic >= 180 || diastolic >= 120) {
      concerns.push({
        type: 'blood_pressure',
        severity: 'critical',
        message: 'Hypertensive Crisis - Extremely high blood pressure detected',
        value: `${systolic}/${diastolic} mmHg`
      });
      urgencyLevel = 'critical';
      recommendations.push('Seek immediate medical attention');
    } else if (systolic >= 140 || diastolic >= 90) {
      concerns.push({
        type: 'blood_pressure',
        severity: 'high',
        message: 'High blood pressure (Hypertension)',
        value: `${systolic}/${diastolic} mmHg`
      });
      if (urgencyLevel === 'normal') urgencyLevel = 'high';
      recommendations.push('Consult with a cardiologist');
    } else if (systolic < 90 || diastolic < 60) {
      concerns.push({
        type: 'blood_pressure',
        severity: 'moderate',
        message: 'Low blood pressure (Hypotension)',
        value: `${systolic}/${diastolic} mmHg`
      });
      if (urgencyLevel === 'normal') urgencyLevel = 'moderate';
    }
  }

  // Analyze Heart Rate
  if (metrics.latest.heart_rate) {
    const hr = metrics.latest.heart_rate.value;

    if (hr > 100) {
      concerns.push({
        type: 'heart_rate',
        severity: hr > 120 ? 'high' : 'moderate',
        message: 'Elevated heart rate (Tachycardia)',
        value: `${hr} bpm`
      });
      if (urgencyLevel === 'normal') urgencyLevel = hr > 120 ? 'high' : 'moderate';
      recommendations.push('Consider consulting a cardiologist');
    } else if (hr < 60) {
      concerns.push({
        type: 'heart_rate',
        severity: 'moderate',
        message: 'Low heart rate (Bradycardia)',
        value: `${hr} bpm`
      });
      if (urgencyLevel === 'normal') urgencyLevel = 'moderate';
    }
  }

  // Analyze Blood Glucose
  if (metrics.latest.blood_glucose) {
    const glucose = metrics.latest.blood_glucose.value;

    if (glucose > 200) {
      concerns.push({
        type: 'blood_glucose',
        severity: 'high',
        message: 'Very high blood sugar level',
        value: `${glucose} mg/dL`
      });
      if (urgencyLevel === 'normal' || urgencyLevel === 'moderate') urgencyLevel = 'high';
      recommendations.push('Consult with an endocrinologist immediately');
    } else if (glucose > 126) {
      concerns.push({
        type: 'blood_glucose',
        severity: 'moderate',
        message: 'Elevated blood sugar (possible diabetes)',
        value: `${glucose} mg/dL`
      });
      if (urgencyLevel === 'normal') urgencyLevel = 'moderate';
      recommendations.push('Schedule an appointment with an endocrinologist');
    } else if (glucose < 70) {
      concerns.push({
        type: 'blood_glucose',
        severity: 'high',
        message: 'Low blood sugar (Hypoglycemia)',
        value: `${glucose} mg/dL`
      });
      if (urgencyLevel === 'normal' || urgencyLevel === 'moderate') urgencyLevel = 'high';
      recommendations.push('Consume fast-acting carbohydrates and monitor closely');
    }
  }

  // Analyze Weight trends
  if (metrics.weight && metrics.weight.length >= 2) {
    const latestWeight = metrics.weight[0].value;
    const previousWeight = metrics.weight[metrics.weight.length - 1].value;
    const weightChange = ((latestWeight - previousWeight) / previousWeight) * 100;

    if (Math.abs(weightChange) > 10) {
      concerns.push({
        type: 'weight',
        severity: 'moderate',
        message: `Significant weight ${weightChange > 0 ? 'gain' : 'loss'} detected`,
        value: `${Math.abs(weightChange).toFixed(1)}% change`
      });
      if (urgencyLevel === 'normal') urgencyLevel = 'moderate';
      recommendations.push('Discuss weight changes with your doctor');
    }
  }

  // Analyze Sleep
  if (metrics.latest.sleep) {
    const sleepHours = metrics.latest.sleep.value;

    if (sleepHours < 6) {
      concerns.push({
        type: 'sleep',
        severity: 'moderate',
        message: 'Insufficient sleep duration',
        value: `${sleepHours} hours`
      });
      recommendations.push('Aim for 7-9 hours of sleep per night');
    }
  }

  return {
    concerns,
    recommendations,
    urgencyLevel,
    requiresDoctorConsultation: urgencyLevel === 'high' || urgencyLevel === 'critical'
  };
};

/**
 * Determine recommended doctor specialty based on health concerns
 * @param {Array} concerns - List of health concerns
 * @returns {Array} Recommended specialties
 */
export const getRecommendedSpecialties = (concerns) => {
  const specialtyMap = {
    blood_pressure: ['Cardiologist', 'General Practitioner'],
    heart_rate: ['Cardiologist'],
    blood_glucose: ['Endocrinologist', 'General Practitioner'],
    weight: ['Endocrinologist', 'Nutritionist', 'General Practitioner'],
    sleep: ['Sleep Specialist', 'General Practitioner']
  };

  const recommendedSpecialties = new Set();

  concerns.forEach(concern => {
    const specialties = specialtyMap[concern.type] || ['General Practitioner'];
    specialties.forEach(spec => recommendedSpecialties.add(spec));
  });

  return Array.from(recommendedSpecialties);
};

/**
 * Build comprehensive health context for AI
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Complete health context
 */
export const buildHealthContext = async (userId) => {
  try {
    const [metrics, medications, appointments] = await Promise.all([
      getPatientHealthMetrics(userId),
      getPatientMedications(userId),
      getPatientAppointments(userId)
    ]);

    const analysis = metrics ? analyzeHealthMetrics(metrics) : null;

    return {
      metrics,
      medications,
      appointments,
      analysis,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error building health context:', error);
    return null;
  }
};

/**
 * Format health context for AI prompt
 * @param {Object} healthContext - Health context object
 * @returns {string} Formatted context string
 */
export const formatHealthContextForAI = (healthContext) => {
  if (!healthContext) return '';

  let context = '\n\n=== PATIENT HEALTH CONTEXT ===\n';

  // Latest metrics
  if (healthContext.metrics?.latest) {
    context += '\nCurrent Health Metrics:\n';
    
    if (healthContext.metrics.latest.blood_pressure) {
      const bp = healthContext.metrics.latest.blood_pressure;
      context += `- Blood Pressure: ${bp.systolic}/${bp.diastolic} mmHg\n`;
    }
    
    if (healthContext.metrics.latest.heart_rate) {
      context += `- Heart Rate: ${healthContext.metrics.latest.heart_rate.value} bpm\n`;
    }
    
    if (healthContext.metrics.latest.blood_glucose) {
      context += `- Blood Glucose: ${healthContext.metrics.latest.blood_glucose.value} mg/dL\n`;
    }
    
    if (healthContext.metrics.latest.weight) {
      context += `- Weight: ${healthContext.metrics.latest.weight.value} kg\n`;
    }
    
    if (healthContext.metrics.latest.sleep) {
      context += `- Sleep: ${healthContext.metrics.latest.sleep.value} hours\n`;
    }
  }

  // Current medications
  if (healthContext.medications?.length > 0) {
    context += '\nCurrent Medications:\n';
    healthContext.medications.forEach(med => {
      context += `- ${med.name} (${med.dosage}): ${med.frequency}\n`;
    });
  }

  // Health concerns
  if (healthContext.analysis?.concerns?.length > 0) {
    context += '\nHealth Concerns Detected:\n';
    healthContext.analysis.concerns.forEach(concern => {
      context += `- ${concern.message} (${concern.value}) - Severity: ${concern.severity}\n`;
    });
  }

  // Recommendations
  if (healthContext.analysis?.recommendations?.length > 0) {
    context += '\nRecommendations:\n';
    healthContext.analysis.recommendations.forEach(rec => {
      context += `- ${rec}\n`;
    });
  }

  context += '\n=== END PATIENT CONTEXT ===\n';

  return context;
};
