import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const DebugAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const testGoogleSignIn = async () => {
    setLoading(true);
    addLog('🧪 Starting Google sign-in test...');
    
    try {
      addLog('🔍 Attempting Firebase Google sign-in...');
      
      // Basic Firebase Google sign-in
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      addLog(`✅ Firebase sign-in successful: ${user.email}`);
      addLog(`📊 User UID: ${user.uid}`);
      addLog(`📧 User email: ${user.email}`);
      addLog(`👤 Display name: ${user.displayName}`);
      
      // Now test Supabase sync
      addLog('🔄 Testing Supabase sync...');
      
      try {
        const { syncOAuthUserToSupabase } = await import('../firebase');
        const syncResult = await syncOAuthUserToSupabase(user);
        addLog('✅ Supabase sync completed');
        addLog(`📊 Sync result: ${JSON.stringify(syncResult)}`);
      } catch (syncError) {
        addLog(`❌ Supabase sync failed: ${syncError.message}`);
        console.error('Sync error:', syncError);
      }
      
    } catch (error) {
      addLog(`❌ Google sign-in failed: ${error.message}`);
      console.error('Sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testEmailSignIn = async () => {
    setLoading(true);
    addLog('🧪 Starting email sign-in test...');
    
    try {
      addLog(`🔍 Attempting email sign-in: ${email}`);
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      addLog(`✅ Email sign-in successful: ${user.email}`);
      
      // Test Supabase sync for email auth
      try {
        const { syncOAuthUserToSupabase } = await import('../firebase');
        const syncResult = await syncOAuthUserToSupabase(user);
        addLog('✅ Supabase sync completed for email auth');
      } catch (syncError) {
        addLog(`❌ Supabase sync failed: ${syncError.message}`);
      }
      
    } catch (error) {
      addLog(`❌ Email sign-in failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => setLogs([]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔧 Auth Debug Tool</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            
            <div className="space-y-4">
              <button
                onClick={testGoogleSignIn}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
              >
                {loading ? 'Testing...' : 'Test Google Sign-in'}
              </button>
              
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                />
                <button
                  onClick={testEmailSignIn}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Test Email Sign-in
                </button>
              </div>
              
              <button
                onClick={clearLogs}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Clear Logs
              </button>
            </div>
          </div>
          
          {/* Logs */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
            <div className="bg-black text-green-400 p-4 rounded h-96 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <p>No logs yet. Click a test button to start.</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugAuth;
