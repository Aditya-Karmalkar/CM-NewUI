import React, { useState } from 'react';
import { testBytezConnection, sendChatMessage } from '../services/bytezService';

const BytezTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [chatResult, setChatResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTestConnection = async () => {
    setLoading(true);
    setTestResult(null);
    const result = await testBytezConnection();
    setTestResult(result);
    setLoading(false);
  };

  const handleTestChat = async () => {
    setLoading(true);
    setChatResult(null);
    
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'What is 2+2?' }
    ];
    
    const result = await sendChatMessage(messages, 'Gemini 2.0 Flash');
    setChatResult(result);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Bytez API Test</h1>
      
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-3">Connection Test</h2>
          <button
            onClick={handleTestConnection}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>
          
          {testResult && (
            <div className={`mt-4 p-4 rounded ${testResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
              <p className="font-semibold">{testResult.message}</p>
              {testResult.output && <p className="mt-2">Response: {testResult.output}</p>}
              {testResult.error && (
                <pre className="mt-2 te
