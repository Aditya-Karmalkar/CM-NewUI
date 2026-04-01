import Bytez from 'bytez.js';
import { buildHealthContext, formatHealthContextForAI, analyzeHealthMetrics, getRecommendedSpecialties } from './healthContextService';

// Initialize Bytez SDK with API key from environment variable
const BYTEZ_API_KEY = process.env.REACT_APP_BYTEZ_API_KEY || 'ba2458f496e23353b5b09fc57b548bd7';
const MISTRAL_API_KEY = process.env.REACT_APP_MISTRAL_API_KEY || 'mBGZS5Mz5J8jXhTzDmTfDx6GLfvW2RjH';

const sdk = new Bytez(BYTEZ_API_KEY);

// Model mapping for the UI - Using verified Bytez model IDs under free-tier size limits
export const AVAILABLE_MODELS = {
  // Mistral Direct API Models (Reliable Fallbacks)
  'Mistral Large (Direct)': 'mistral-large-latest',
  'Mistral Small (Direct)': 'mistral-small-latest',

  // Meta Llama Models - Strong general reasoning
  'Llama 3.2 1B (Standard)': 'meta-llama/Llama-3.2-1B-Instruct',
  
  // Qwen Models (Alibaba) - Excellent multilingual support
  'Qwen 2.5 1.5B (Standard)': 'Qwen/Qwen2.5-1.5B-Instruct',
  'Qwen 2.5 0.5B (Fast)': 'Qwen/Qwen2.5-0.5B-Instruct',
  
  // Google Gemma - Efficient and fast
  'Gemma 2 2B (Detailed)': 'google/gemma-2-2b-it',
};


/**
 * Transcribes audio via Bytez Whisper
 * @param {string|File|Blob} audioInput - Audio data
 * @returns {Promise<string|null>} Transcript text
 */
export const transcribeVoiceToText = async (audioInput) => {
  try {
    const whisper = sdk.model("openai/whisper-large-v3");
    const { error, output } = await whisper.run(audioInput);
    
    if (error) {
      console.error('Whisper Transcription Error:', error);
      return null;
    }
    
    if (typeof output === 'string') return output;
    if (Array.isArray(output) && output[0]?.text) return output[0].text;
    if (output?.text) return output.text;
    
    return JSON.stringify(output);
  } catch (err) {
    console.error('Whisper Pipeline Error:', err);
    return null;
  }
};

/**
 * Send a chat message to the selected model
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} modelName - Display name of the model
 * @returns {Promise<Object>} Response with error and output
 */
export const sendChatMessage = async (messages, modelName = 'Mistral Small (Direct)') => {
  try {
    console.log('API Service - Sending message with model:', modelName);
    
    const modelId = AVAILABLE_MODELS[modelName] || AVAILABLE_MODELS['Llama 3.2 1B (Standard)'];
    
    // ----------------------------------------------------------------------
    // MISTRAL API BRANCH
    // ----------------------------------------------------------------------
    if (modelName.includes('(Direct)')) {
      const systemMsg = messages.find(msg => msg.role === 'system');
      const mistralMessages = [];
      if (systemMsg) mistralMessages.push({ role: 'system', content: systemMsg.content });
      
      messages.filter(msg => msg.role !== 'system').forEach(msg => {
        mistralMessages.push({ role: msg.role === 'bot' ? 'assistant' : msg.role, content: msg.content });
      });

      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${MISTRAL_API_KEY}` },
        body: JSON.stringify({ model: modelId, messages: mistralMessages, temperature: 0.7 })
      });

      if (!response.ok) {
        throw new Error(`Mistral API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return { error: null, output: data.choices[0].message.content };
    }

    // ----------------------------------------------------------------------
    // BYTEZ API BRANCH
    // ----------------------------------------------------------------------
    const model = sdk.model(modelId);

    // Format messages for Bytez API - must alternate user/assistant
    let formattedMessages = [];
    let systemMessage = null;
    
    // Extract system message if present
    const systemMsg = messages.find(msg => msg.role === 'system');
    if (systemMsg) {
      systemMessage = { role: 'system', content: systemMsg.content };
    }
    
    // Filter out system messages and format the rest
    const conversationMessages = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role === 'bot' ? 'assistant' : msg.role,
        content: msg.content
      }));
    
    // Ensure alternating user/assistant pattern
    let lastRole = null;
    const alternatingMessages = [];
    
    for (const msg of conversationMessages) {
      // Skip consecutive messages with the same role
      if (msg.role !== lastRole) {
        alternatingMessages.push(msg);
        lastRole = msg.role;
      }
    }
    
    // Build final message array
    if (systemMessage) {
      formattedMessages.push(systemMessage);
    }
    formattedMessages = formattedMessages.concat(alternatingMessages);
    
    // Ensure the conversation ends with a user message
    if (formattedMessages.length > 0 && formattedMessages[formattedMessages.length - 1].role === 'assistant') {
      console.warn('Conversation ends with assistant message, this may cause issues');
    }

    console.log('Bytez Service - Formatted messages:', formattedMessages);
    console.log('Bytez Service - Calling model.run()...');
    
    const result = await model.run(formattedMessages);
    
    console.log('Bytez Service - Raw result:', result);
    
    const { error, output } = result;

    if (error) {
      console.error('Bytez API Error:', error);
      return { 
        error, 
        output: `I'm having trouble connecting to the AI service. Error: ${JSON.stringify(error)}` 
      };
    }

    if (!output) {
      console.error('Bytez API returned no output');
      return {
        error: 'No output',
        output: 'The AI service returned an empty response. Please try again.'
      };
    }

    // Handle different output formats
    let textOutput = '';
    
    if (typeof output === 'string') {
      textOutput = output;
    } else if (typeof output === 'object') {
      // Handle object responses (e.g., with tool_calls, content, etc.)
      if (output.content) {
        textOutput = output.content;
      } else if (output.message) {
        textOutput = output.message;
      } else if (output.text) {
        textOutput = output.text;
      } else if (Array.isArray(output)) {
        // Handle array of message objects
        textOutput = output.map(msg => msg.content || msg.text || '').join('\n');
      } else {
        // Fallback: stringify the object
        console.warn('Unexpected output format:', output);
        textOutput = JSON.stringify(output);
      }
    } else {
      textOutput = String(output);
    }

    console.log('Bytez Service - Success! Output:', textOutput);
    return { error: null, output: textOutput };
  } catch (err) {
    console.error('Bytez Service Error:', err);
    console.error('Error stack:', err.stack);
    return { 
      error: err, 
      output: `Service error: ${err.message || 'Unknown error occurred'}. Please check the console for details.` 
    };
  }
};

/**
 * Stream chat response from the selected model
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} modelName - Display name of the model
 * @param {Function} onChunk - Callback for each chunk of streamed data
 * @returns {Promise<void>}
 */
export const streamChatMessage = async (messages, modelName, onChunk) => {
  try {
    const modelId = AVAILABLE_MODELS[modelName] || AVAILABLE_MODELS['Llama 3.2 1B (Standard)'];
    const model = sdk.model(modelId);

    // Format messages for Bytez API - must alternate user/assistant
    let formattedMessages = [];
    let systemMessage = null;
    
    // Extract system message if present
    const systemMsg = messages.find(msg => msg.role === 'system');
    if (systemMsg) {
      systemMessage = { role: 'system', content: systemMsg.content };
    }
    
    // Filter out system messages and format the rest
    const conversationMessages = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role === 'bot' ? 'assistant' : msg.role,
        content: msg.content
      }));
    
    // Ensure alternating user/assistant pattern
    let lastRole = null;
    const alternatingMessages = [];
    
    for (const msg of conversationMessages) {
      if (msg.role !== lastRole) {
        alternatingMessages.push(msg);
        lastRole = msg.role;
      }
    }
    
    // Build final message array
    if (systemMessage) {
      formattedMessages.push(systemMessage);
    }
    formattedMessages = formattedMessages.concat(alternatingMessages);

    const { error, output } = await model.run(formattedMessages);

    if (error) {
      console.error('Bytez Stream Error:', error);
      onChunk('Sorry, I encountered an error processing your request. Please try again.');
      return;
    }

    // Handle different output formats
    let textOutput = '';
    
    if (typeof output === 'string') {
      textOutput = output;
    } else if (typeof output === 'object') {
      if (output.content) {
        textOutput = output.content;
      } else if (output.message) {
        textOutput = output.message;
      } else if (output.text) {
        textOutput = output.text;
      } else {
        textOutput = JSON.stringify(output);
      }
    } else {
      textOutput = String(output);
    }

    if (textOutput) {
      onChunk(textOutput);
    }
  } catch (err) {
    console.error('Bytez Stream Service Error:', err);
    onChunk('Sorry, I encountered an error processing your request. Please try again.');
  }
};


/**
 * Test the Bytez API connection
 * @returns {Promise<Object>} Test result
 */
export const testBytezConnection = async () => {
  try {
    console.log('Testing Bytez API connection...');
    console.log('API Key:', BYTEZ_API_KEY ? `${BYTEZ_API_KEY.substring(0, 10)}...` : 'NOT SET');
    
    const model = sdk.model('Qwen/Qwen2.5-7B-Instruct');
    const testMessages = [
      { role: 'user', content: 'Say "Hello" if you can hear me.' }
    ];
    
    const { error, output } = await model.run(testMessages);
    
    if (error) {
      console.error('Connection test failed:', error);
      return { success: false, error, message: 'API connection failed' };
    }
    
    console.log('Connection test successful:', output);
    return { success: true, output, message: 'API connection successful' };
  } catch (err) {
    console.error('Connection test error:', err);
    return { success: false, error: err, message: err.message };
  }
};


/**
 * Create health-focused system prompt with patient context
 * @param {Object} healthContext - Patient health context
 * @returns {string} System prompt
 */
const createHealthSystemPrompt = (healthContext) => {
  let prompt = `You are CuraMind Health Assistant, an AI medical advisor integrated into a comprehensive health management platform, specifically optimized for users in India.

CRITICAL RULES:
1. ONLY answer health, medical, and wellness-related questions.
2. If asked about non-health topics, politely redirect: "I'm specialized in health and medical topics. Please ask me about your health concerns, symptoms, medications, or wellness."
3. Always recommend consulting healthcare professionals for serious conditions.
4. Never provide definitive diagnoses - only educational information.
5. Be empathetic, clear, and supportive.
6. Use the patient's health data to provide personalized insights.
7. If you detect serious conditions, STRONGLY recommend seeing a doctor.

INDIAN LOCALIZATION RULES:
- For any financial/cost mentions, use Indian Rupees (₹/INR).
- Use Indian emergency numbers: 102 (Ambulance), 108 (Emergency) where relevant.
- Align medical advice with guidelines from the Indian Council of Medical Research (ICMR).
- When suggesting diet or wellness, consider Indian cultural contexts, seasonal items, and regional practices.

YOUR CAPABILITIES:
- Analyze symptoms and suggest possible causes
- Provide medication information and interactions
- Offer lifestyle and wellness advice
- Interpret health metrics and trends
- Recommend when to seek medical attention
- Answer general health questions`;

  if (healthContext) {
    prompt += formatHealthContextForAI(healthContext);
    
    if (healthContext.analysis?.requiresDoctorConsultation) {
      prompt += `\n\n⚠️ IMPORTANT: Based on the patient's current health metrics, there are concerning values that require medical attention. You MUST recommend scheduling an appointment with a doctor in your response.\n`;
    }
  }

  return prompt;
};

/**
 * Check if response requires doctor consultation
 * @param {string} response - AI response text
 * @param {Object} healthContext - Patient health context
 * @returns {Object} Consultation recommendation
 */
const checkDoctorConsultationNeeded = (response, healthContext) => {
  const urgentKeywords = [
    'emergency', 'urgent', 'immediately', 'serious', 'critical',
    'seek medical attention', 'call doctor', 'go to hospital',
    'chest pain', 'difficulty breathing', 'severe'
  ];

  const responseText = response.toLowerCase();
  const hasUrgentKeyword = urgentKeywords.some(keyword => responseText.includes(keyword));
  
  const requiresConsultation = hasUrgentKeyword || 
    healthContext?.analysis?.requiresDoctorConsultation ||
    healthContext?.analysis?.urgencyLevel === 'high' ||
    healthContext?.analysis?.urgencyLevel === 'critical';

  let urgencyLevel = 'normal';
  let recommendedSpecialties = [];

  if (requiresConsultation) {
    urgencyLevel = healthContext?.analysis?.urgencyLevel || 'moderate';
    
    if (healthContext?.analysis?.concerns) {
      recommendedSpecialties = getRecommendedSpecialties(healthContext.analysis.concerns);
    }
    
    if (recommendedSpecialties.length === 0) {
      recommendedSpecialties = ['General Practitioner'];
    }
  }

  return {
    requiresConsultation,
    urgencyLevel,
    recommendedSpecialties,
    concerns: healthContext?.analysis?.concerns || []
  };
};

/**
 * Send a health-focused chat message with patient context
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} modelName - Display name of the model
 * @param {string} userId - User ID for health context
 * @returns {Promise<Object>} Response with error, output, and consultation info
 */
export const sendHealthChatMessage = async (messages, modelName = 'Mistral Small (Direct)', userId = null) => {
  try {
    console.log('Health Chat - Sending message with model:', modelName);
    
    // Build health context if userId provided
    let healthContext = null;
    if (userId) {
      healthContext = await buildHealthContext(userId);
      console.log('Health Context:', healthContext);
    }
    
    const modelId = AVAILABLE_MODELS[modelName] || Object.values(AVAILABLE_MODELS)[0];

    // Create health-focused system prompt
    const systemPrompt = createHealthSystemPrompt(healthContext);

    // Filter and format conversation messages
    const conversationMessages = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role === 'bot' ? 'assistant' : msg.role,
        content: msg.content
      }));

    // ----------------------------------------------------------------------
    // MISTRAL API BRANCH
    // ----------------------------------------------------------------------
    if (modelName.includes('(Direct)')) {
      console.log('Routing to Mistral API:', modelId);
      const mistralMessages = [
        { role: 'system', content: systemPrompt },
        ...conversationMessages
      ];

      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: modelId,
          messages: mistralMessages,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Mistral API Error details: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const textOutput = data.choices[0].message.content;
      const consultationInfo = checkDoctorConsultationNeeded(textOutput, healthContext);

      return { 
        error: null, 
        output: textOutput,
        consultationInfo,
        healthContext
      };
    }

    // ----------------------------------------------------------------------
    // BYTEZ API BRANCH
    // ----------------------------------------------------------------------
    const model = sdk.model(modelId);
    
    // Ensure alternating pattern
    let lastRole = null;
    const alternatingMessages = [];
    
    for (const msg of conversationMessages) {
      if (msg.role !== lastRole) {
        alternatingMessages.push(msg);
        lastRole = msg.role;
      }
    }
    
    // Some models reject the 'system' role. Embed system instructions into the first user message:
    if (alternatingMessages.length > 0 && alternatingMessages[0].role === 'user') {
      alternatingMessages[0].content = systemPrompt + "\n\nUser Query:\n" + alternatingMessages[0].content;
    } else {
      alternatingMessages.unshift({ role: 'user', content: systemPrompt });
    }

    const formattedMessages = alternatingMessages;

    console.log('Formatted messages:', formattedMessages);
    
    const result = await model.run(formattedMessages);
    const { error, output } = result;

    if (error) {
      console.error('Bytez API Error:', error);
      return { 
        error, 
        output: `I'm having trouble connecting to the AI service. Error: ${JSON.stringify(error)}`,
        consultationInfo: null
      };
    }

    // Handle different output formats
    let textOutput = '';
    
    if (typeof output === 'string') {
      textOutput = output;
    } else if (typeof output === 'object') {
      if (output.content) {
        textOutput = output.content;
      } else if (output.message) {
        textOutput = output.message;
      } else if (output.text) {
        textOutput = output.text;
      } else if (Array.isArray(output)) {
        textOutput = output.map(msg => msg.content || msg.text || '').join('\n');
      } else {
        console.warn('Unexpected output format:', output);
        textOutput = JSON.stringify(output);
      }
    } else {
      textOutput = String(output);
    }

    // Check if doctor consultation is needed
    const consultationInfo = checkDoctorConsultationNeeded(textOutput, healthContext);

    console.log('Health Chat - Success! Output:', textOutput);
    console.log('Consultation Info:', consultationInfo);
    
    return { 
      error: null, 
      output: textOutput,
      consultationInfo,
      healthContext
    };
  } catch (err) {
    console.error('Health Chat Service Error:', err);
    return { 
      error: err, 
      output: `Service error: ${err.message || 'Unknown error occurred'}. Please check the console for details.`,
      consultationInfo: null
    };
  }
};
