import { supabase } from '../supabase';
import { auth } from '../firebase';
// Firebase Firestore is deprecated, moving to Supabase for all health data

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
      const mType = metric.metric_type || metric.type;
      if (mType && organizedMetrics[mType]) {
        organizedMetrics[mType].push(metric);
      }
      
      // Keep track of latest value for each type
      if (mType && !organizedMetrics.latest[mType]) {
        organizedMetrics.latest[mType] = metric;
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
      .eq('user_id', userId);
      // Removed .eq('is_active', true) to prevent empty results if column missing

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
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('appointment_date', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching appointments from Supabase:', error);
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

  if (!metrics) return { concerns, recommendations, urgencyLevel };

  // 1. Blood Pressure Analysis (Closer to ICMR/AHA standards)
  const bpHistory = metrics.blood_pressure || [];
  if (bpHistory.length > 0) {
    const latest = bpHistory[0];
    const systolic = latest.systolic || latest.value_systolic;
    const diastolic = latest.diastolic || latest.value_diastolic;

    if (systolic >= 140 || diastolic >= 90) {
      concerns.push(`High Blood Pressure: Last reading was ${systolic}/${diastolic} mmHg.`);
      recommendations.push("Consult a cardiologist for a hypertensive evaluation.");
      urgencyLevel = systolic >= 180 || diastolic >= 120 ? 'critical' : 'high';
    } else if (systolic >= 130 || diastolic >= 80) {
      concerns.push(`Stage 1 Hypertension: Reading was ${systolic}/${diastolic} mmHg.`);
      recommendations.push("Monitor daily and reduce sodium intake.");
      if (urgencyLevel === 'normal') urgencyLevel = 'moderate';
    }
  }

  // 2. Blood Glucose Analysis (ADA Standards)
  const glucoseHistory = metrics.blood_glucose || [];
  if (glucoseHistory.length > 0) {
    const latest = glucoseHistory[0];
    const value = latest.value || latest.glucose_level;
    const isFasting = latest.status === 'fasting' || latest.is_fasting;

    if (isFasting) {
      if (value > 126) {
        concerns.push(`High Fasting Glucose: ${value} mg/dL.`);
        recommendations.push("See an endocrinologist; this may indicate diabetes.");
        urgencyLevel = 'high';
      } else if (value > 100) {
        concerns.push(`Prediabetic Fasting Glucose: ${value} mg/dL.`);
        recommendations.push("Discuss lifestyle changes and glucose monitoring with your doctor.");
        if (urgencyLevel === 'normal') urgencyLevel = 'moderate';
      }
    } else {
      if (value > 200) {
        concerns.push(`Hyperglycemia: Random glucose is ${value} mg/dL.`);
        recommendations.push("Seek immediate medical assessment for glucose management.");
        urgencyLevel = 'high';
      }
    }
  }

  return { concerns, recommendations, urgencyLevel };
};

/**
 * Format health context data for AI readability
 * @param {Object} data - Health data object
 * @returns {string} Formatted string
 */
export const formatHealthContextForAI = (data) => {
  if (typeof data === 'string') return data;
  return JSON.stringify(data, null, 2);
};

/**
 * Get recommended doctor specialties based on health concerns
 * @param {Array} concerns - List of health concerns
 * @returns {Array} List of specialties
 */
export const getRecommendedSpecialties = (concerns) => {
  const specialties = new Set();
  const lowerConcerns = Array.isArray(concerns) ? concerns.map(c => c.toLowerCase()) : [];
  
  lowerConcerns.forEach(concern => {
    if (concern.includes('heart') || concern.includes('blood pressure') || concern.includes('hypertension')) {
      specialties.add('Cardiologist');
    }
    if (concern.includes('glucose') || concern.includes('diabetes') || concern.includes('sugar')) {
      specialties.add('Endocrinologist');
    }
    if (concern.includes('weight') || concern.includes('diet')) {
      specialties.add('Nutritionist');
    }
    if (concern.includes('kidney')) {
      specialties.add('Nephrologist');
    }
  });

  return Array.from(specialties);
};

/**
 * Build a comprehensive patient context for the AI
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Object containing the context string and raw analysis
 */
export const buildHealthContext = async (userId) => {
  if (!userId) return { context: "No patient user ID provided.", analysis: null };

  try {
    const [metrics, medications, appointments] = await Promise.all([
      getPatientHealthMetrics(userId),
      getPatientMedications(userId),
      getPatientAppointments(userId)
    ]);

    const analysis = analyzeHealthMetrics(metrics);

    let contextString = "PATIENT HEALTH CONTEXT:\n";
    
    // Medications
    contextString += "\nCURRENT MEDICATIONS:\n";
    if (medications && medications.length > 0) {
      medications.forEach(m => {
        contextString += `- ${m.name}: ${m.dosage || ''} ${m.frequency || ''} (Instructions: ${m.instructions || 'N/A'})\n`;
      });
    } else {
      contextString += "No active medications found.\n";
    }

    // Recent Metrics
    contextString += "\nLATEST VITALS & METRICS:\n";
    const latest = metrics?.latest || {};
    if (Object.keys(latest).length > 0) {
      if (latest.blood_pressure) {
        contextString += `- Blood Pressure: ${latest.blood_pressure.systolic}/${latest.blood_pressure.diastolic} mmHg\n`;
      }
      if (latest.blood_glucose) {
        contextString += `- Blood Glucose: ${latest.blood_glucose.value} mg/dL (${latest.blood_glucose.status || 'random'})\n`;
      }
    } else {
      contextString += "No recent health metrics recorded.\n";
    }

    // Upcoming Appointments
    contextString += "\nRECENT & UPCOMING APPOINTMENTS:\n";
    if (appointments && appointments.length > 0) {
      appointments.forEach(a => {
        contextString += `- ${a.doctor_name || 'Doctor'} (${a.appointment_type || 'Consultation'}): ${new Date(a.appointment_date).toLocaleString()}\n`;
      });
    }

    if (analysis.concerns.length > 0) {
      contextString += "\nAI PRE-ANALYSIS CONCERNS:\n";
      analysis.concerns.forEach(c => contextString += `! ${c}\n`);
    }

    return {
      context: contextString,
      analysis,
      raw: { metrics, medications, appointments }
    };
  } catch (error) {
    console.error("Error building health context:", error);
    return { 
      context: "Error retrieving patient health context.", 
      analysis: null 
    };
  }
};
