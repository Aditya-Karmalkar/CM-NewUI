import React, { useState, useEffect, useCallback } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';

const DataSettings = () => {
  // Use settings from context instead of local state
  const { settings, updateSettings } = useSettings();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  // Get data settings from context or use defaults
  const [dataOptions, setDataOptions] = useState(
    settings.data || {
      autoBackup: true,
      backupFrequency: 'weekly',
      dataRetention: '6months',
      dataSharing: {
        anonymousResearch: true,
        serviceImprovement: true,
        thirdParties: false
      }
    }
  );
  
  const [syncStatus, setSyncStatus] = useState('idle'); 
  const [exportFormat, setExportFormat] = useState('json');
  const [dataUsage, setDataUsage] = useState({
    chatHistory: { size: 0, count: 0 },
    healthMetrics: { size: 0, count: 0 },
    medications: { size: 0, count: 0 },
    appointments: { size: 0, count: 0 }
  });
  const [fileInput, setFileInput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load real data usage statistics when component mounts
  useEffect(() => {
    fetchDataUsageStats();
  }, []);

  // Update local state when settings change
  useEffect(() => {
    if (settings.data) {
      setDataOptions(settings.data);
    }
  }, [settings.data]);

  // Helper function to estimate data size from documents
  const estimateSizeFromData = (data) => {
    if (!data) return 0;
    return JSON.stringify(data).length;
  };

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      setDataOptions(prev => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setDataOptions(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  }, []);

  const handleSync = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      // Simulate sync operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSyncStatus('synced');
      addToast('Data synced successfully', 'success');
    } catch (error) {
      setSyncStatus('error');
      addToast('Sync failed', 'error');
    }
  }, [addToast]);

  const handleExport = useCallback(async (format) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        addToast('Please sign in to export data', 'error');
        return;
      }

      // Fetch user's health data
      const [metrics, medications, chatHistory] = await Promise.all([
        supabase.from('health_metrics').select('*').eq('user_id', user.id),
        supabase.from('medications').select('*').eq('user_id', user.id),
        supabase.from('chat_history').select('*').eq('user_id', user.id)
      ]);

      const exportData = {
        healthMetrics: metrics.data || [],
        medications: medications.data || [],
        chatHistory: chatHistory.data || [],
        exportDate: new Date().toISOString()
      };

      if (format === 'pdf') {
        // Generate PDF report
        generatePDFReport(exportData);
      } else if (format === 'csv') {
        // Generate CSV files
        const csvData = Papa.unparse(exportData.healthMetrics);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'cura-mind-health-data.csv');
      } else {
        // JSON export
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        saveAs(blob, 'cura-mind-health-data.json');
      }

      addToast('Data exported successfully', 'success');
    } catch (error) {
      console.error('Export error:', error);
      addToast('Export failed', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  const handleImport = useCallback(async (e) => {
    e.preventDefault();
    if (!fileInput?.files?.[0]) return;

    setIsLoading(true);
    try {
      const file = fileInput.files[0];
      const text = await file.text();
      
      let importData;
      if (file.name.endsWith('.json')) {
        importData = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        const parsed = Papa.parse(text, { header: true });
        importData = { healthMetrics: parsed.data };
      }

      // Import data to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        addToast('Please sign in to import data', 'error');
        return;
      }

      if (importData.healthMetrics) {
        await supabase.from('health_metrics').insert(
          importData.healthMetrics.map(item => ({
            ...item,
            user_id: user.id,
            created_at: new Date().toISOString()
          }))
        );
      }

      addToast('Data imported successfully', 'success');
      setFileInput(null);
    } catch (error) {
      console.error('Import error:', error);
      addToast('Import failed', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [fileInput, addToast]);

  const saveSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        addToast('Please sign in to save settings', 'error');
        return;
      }

      // Save settings to user profile or settings table
      await supabase.from('user_settings').upsert({
        user_id: user.id,
        data_options: dataOptions,
        updated_at: new Date().toISOString()
      });

      addToast('Settings saved successfully', 'success');
    } catch (error) {
      console.error('Save settings error:', error);
      addToast('Failed to save settings', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [dataOptions, addToast]);

  const generatePDFReport = (data) => {
    // PDF generation logic (placeholder)
    console.log('Generating PDF report...', data);
    addToast('PDF report generation not implemented yet', 'info');
  };

  // Fetch real data usage statistics from Supabase
  const fetchDataUsageStats = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setIsLoading(true);
    const userId = user.id;
    const stats = {
      totalSize: 0,
      chatHistory: { size: 0, count: 0 },
      healthMetrics: { size: 0, count: 0 },
      medications: { size: 0, count: 0 },
      appointments: { size: 0, count: 0 }
    };
    
    try {
      // Fetch chat history count
      const { data: chatData, error: chatError } = await supabase
        .from('conversations')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);
      
      if (!chatError) {
        stats.chatHistory.count = chatData?.length || 0;
        stats.chatHistory.size = estimateSizeFromData(chatData);
      }
      
      // Fetch health metrics count
      const { data: healthData, error: healthError } = await supabase
        .from('health_metrics')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);
      
      if (!healthError) {
        stats.healthMetrics.count = healthData?.length || 0;
        stats.healthMetrics.size = estimateSizeFromData(healthData);
      }
      
      // Fetch medications count
      const { data: medsData, error: medsError } = await supabase
        .from('medications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);
      
      if (!medsError) {
        stats.medications.count = medsData?.length || 0;
        stats.medications.size = estimateSizeFromData(medsData);
      }
      
      // Fetch appointments count
      const { data: apptsData, error: apptsError } = await supabase
        .from('appointments')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);
      
      if (!apptsError) {
        stats.appointments.count = apptsData?.length || 0;
        stats.appointments.size = estimateSizeFromData(apptsData);
      }
      
      // Calculate total size
      stats.totalSize = stats.chatHistory.size + stats.healthMetrics.size + 
                       stats.medications.size + stats.appointments.size;
      
      setDataUsage(stats);
    } catch (error) {
      console.error('Error fetching data usage:', error);
      addToast('Error loading data usage statistics', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  const importJsonData = async (content) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be signed in to import data');
    
    const userId = user.id;
    const data = JSON.parse(content);
    
    // Process and import different types of data
    if (data.healthMetrics && data.healthMetrics.length > 0) {
      const healthMetrics = data.healthMetrics.map(metric => ({
        ...metric,
        user_id: userId,
        timestamp: new Date(metric.timestamp).toISOString(),
        created_at: new Date().toISOString()
      }));
      
      const { error } = await supabase
        .from('health_metrics')
        .insert(healthMetrics);
      
      if (error) throw error;
    }
    
    // Add other data types as needed
  };

  const importCsvData = async (content) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be signed in to import data');
    
    const userId = user.id;
    const results = Papa.parse(content, { header: true });
    
    if (results.errors.length > 0) {
      throw new Error(`CSV parsing error: ${results.errors[0].message}`);
    }
    
    // Try to determine data type from CSV structure
    const firstRow = results.data[0];
    if (!firstRow) throw new Error('CSV file is empty');
    
    // Process based on detected data type
    if ('systolic' in firstRow || 'diastolic' in firstRow) {
      // Looks like blood pressure data
      const healthMetrics = results.data.filter(row => row.date).map(row => ({
        user_id: userId,
        type: 'bloodPressure',
        date: new Date(row.date).toISOString(),
        systolic: parseInt(row.systolic) || 0,
        diastolic: parseInt(row.diastolic) || 0,
        created_at: new Date().toISOString()
      }));
      
      if (healthMetrics.length > 0) {
        const { error } = await supabase.from('health_metrics').insert(healthMetrics);
        if (error) throw error;
      }
    } else if ('value' in firstRow && 'metric' in firstRow) {
      // Generic health metric
      const healthMetrics = results.data.filter(row => row.date && row.metric).map(row => ({
        user_id: userId,
        type: row.metric.toLowerCase(),
        date: new Date(row.date).toISOString(),
        value: parseFloat(row.value) || 0,
        created_at: new Date().toISOString()
      }));
      
      if (healthMetrics.length > 0) {
        const { error } = await supabase.from('health_metrics').insert(healthMetrics);
        if (error) throw error;
      }
    } else if ('medication' in firstRow) {
      // Medication data
      const medications = results.data.filter(row => row.medication).map(row => ({
        user_id: userId,
        name: row.medication,
        dosage: row.dosage || '',
        frequency: row.frequency || '',
        start_date: new Date(row.startDate || row.date).toISOString(),
        created_at: new Date().toISOString()
      }));
      
      if (medications.length > 0) {
        const { error } = await supabase.from('medications').insert(medications);
        if (error) throw error;
      }
    } else if ('appointment' in firstRow) {
      // Appointment data
      const appointments = results.data.filter(row => row.appointment && row.date).map(row => ({
        user_id: userId,
        title: row.appointment,
        date: new Date(row.date).toISOString(),
        time: row.time || '',
        description: row.description || '',
        created_at: new Date().toISOString()
      }));
      
      if (appointments.length > 0) {
        const { error } = await supabase.from('appointments').insert(appointments);
        if (error) throw error;
      }
    } else {
      throw new Error('Unable to determine data type from CSV structure');
    }
  };

  const exportAsCsv = (name, data) => {
    if (!data || data.length === 0) return;
    
    // Convert to CSV
    const csv = Papa.unparse(data);
    
    // Create blob and save
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `CuraMind-${name}-${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Export data as PDF
  const exportAsPdf = async (data) => {
    const pdf = new jsPDF();
    let yPos = 20;
    
    // Add title
    pdf.setFontSize(18);
    pdf.text('CuraMind Health Data Export', 105, yPos, { align: 'center' });
    yPos += 10;
    
    // Add date
    pdf.setFontSize(12);
    pdf.text(`Export Date: ${new Date().toLocaleDateString()}`, 105, yPos, { align: 'center' });
    yPos += 20;
    
    // Add health metrics
    if (data.healthMetrics && data.healthMetrics.length > 0) {
      pdf.setFontSize(14);
      pdf.text('Health Metrics', 20, yPos);
      yPos += 10;
      
      // Only include first 50 records to avoid PDF getting too large
      const limitedMetrics = data.healthMetrics.slice(0, 50);
      
      pdf.setFontSize(10);
      for (const metric of limitedMetrics) {
        let metricText = `Date: ${new Date(metric.date).toLocaleDateString()} | `;
        
        if (metric.type === 'bloodPressure') {
          metricText += `Type: Blood Pressure | Systolic: ${metric.systolic} | Diastolic: ${metric.diastolic}`;
        } else {
          metricText += `Type: ${metric.type} | Value: ${metric.value || metric.hours || 'N/A'}`;
        }
        
        pdf.text(metricText, 20, yPos);
        yPos += 6;
        
        // Add page if needed
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
      }
      
      if (data.healthMetrics.length > 50) {
        pdf.text(`Note: Showing 50 of ${data.healthMetrics.length} health metrics.`, 20, yPos);
        yPos += 10;
      }
    }
    
    // Similar sections for medications and appointments would be added here
    
    pdf.save(`CuraMind-health-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Handle cloud sync
  const handleCloudSync = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      addToast('You must be signed in to sync data', 'error');
      return;
    }
    
    try {
      const userId = user.id;
      
      // Prepare data for backup
      const { data: healthMetrics, error: healthError } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', userId);
      
      const { data: medications, error: medsError } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', userId);
      
      const { data: appointments, error: apptsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId);
      
      if (healthError || medsError || apptsError) {
        throw new Error('Error fetching data for backup');
      }
      
      const backupData = {
        healthMetrics: healthMetrics || [],
        medications: medications || [],
        appointments: appointments || [],
        timestamp: new Date().toISOString()
      };
      
      // Create backup file in Supabase Storage
      const backupBlob = new Blob([JSON.stringify(backupData)], { type: 'application/json' });
      const fileName = `backups/${userId}/curamind-backup-${new Date().toISOString()}.json`;
      
      const { data, error } = await supabase.storage
        .from('user-data')
        .upload(fileName, backupBlob, {
          contentType: 'application/json',
          upsert: false
        });
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('user-data')
        .getPublicUrl(fileName);
      
      // Save backup reference to user's profile
      const { error: backupError } = await supabase
        .from('user_backups')
        .insert({
          user_id: userId,
          file_url: publicUrl,
          file_path: fileName,
          timestamp: new Date().toISOString(),
          data_count: {
            health_metrics: backupData.healthMetrics.length,
            medications: backupData.medications.length,
            appointments: backupData.appointments.length
          }
        });
      
      if (backupError) throw backupError;
      
      setSyncStatus('synced');
      addToast('Data synchronized with cloud storage!', 'success');
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      addToast(`Sync failed: ${error.message}`, 'error');
    }
  };

  // Handle data deletion
  const handleDeleteData = async (dataType) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      addToast('You must be signed in to delete data', 'error');
      return;
    }
    
    // Confirmation with detailed warning
    const confirmMessage = dataType === 'all' 
      ? 'Are you sure you want to delete ALL your data? This action cannot be undone and will permanently remove all your health records, medications, and appointment history.'
      : `Are you sure you want to delete your ${dataType} data? This action cannot be undone.`;
      
    if (!window.confirm(confirmMessage)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userId = user.id;
      
      if (dataType === 'all') {
        // Delete all data
        const tables = ['health_metrics', 'medications', 'appointments', 'conversations'];
        
        for (const tableName of tables) {
          const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('user_id', userId);
          
          if (error) throw error;
        }
        
        // Delete chat history
        const { error } = await supabase
          .from('conversations')
          .delete()
          .eq('user_id', userId);
        
        if (error) throw error;
      } else if (dataType === 'chat history') {
        // Delete chat history
        const { error } = await supabase
          .from('conversations')
          .delete()
          .eq('user_id', userId);
        
        if (error) throw error;
      } else if (dataType === 'health metrics') {
        // Delete health metrics
        const { error } = await supabase
          .from('health_metrics')
          .delete()
          .eq('user_id', userId);
        
        if (error) throw error;
      } else if (dataType === 'medication') {
        // Delete medications
        const { error } = await supabase
          .from('medications')
          .delete()
          .eq('user_id', userId);
        
        if (error) throw error;
      }
      
      // No batch commit needed for Supabase operations
      
      // Update usage statistics
      fetchDataUsageStats();
      
      addToast(`Your ${dataType} data has been deleted.`, 'success');
    } catch (error) {
      console.error('Delete error:', error);
      addToast(`Failed to delete data: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };



  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Data Management</h2>
      
      <div className="space-y-8">
        {/* Data Usage */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <h2 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Data Usage
            </h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900">Total Storage Used</h3>
                <span className="text-lg font-bold text-violet-600">
                  {formatSize(Object.values(dataUsage).reduce((total, item) => total + item.size, 0))}
                </span>
              </div>
              
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-violet-500 to-indigo-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <p className="mt-1 text-xs text-gray-500">30% of allocated storage</p>
            </div>
            
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Records</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(dataUsage).map(([key, data]) => (
                  <tr key={key}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatSize(data.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Data Backup & Export */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <h2 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Backup & Export
            </h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-2">Cloud Backup</h3>
              
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  Automatically back up your health data to secure cloud storage
                </p>
                <div className="flex items-center">
                  <input
                    id="auto-backup"
                    name="autoBackup"
                    type="checkbox"
                    checked={dataOptions.autoBackup}
                    onChange={handleChange}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auto-backup" className="ml-2 text-sm text-gray-700">
                    Enable
                  </label>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="backupFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Backup Frequency
                </label>
                <select
                  id="backupFrequency"
                  name="backupFrequency"
                  value={dataOptions.backupFrequency}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div className="flex">
                <button
                  onClick={handleSync}
                  disabled={syncStatus === 'syncing'}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-300 flex items-center disabled:opacity-50"
                >
                  {syncStatus === 'syncing' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Syncing...
                    </>
                  ) : syncStatus === 'synced' ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Sync Now
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Retry Sync
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Export Health Data</h3>
              
              <div className="mb-4">
                <label htmlFor="exportFormat" className="block text-sm font-medium text-gray-700 mb-1">
                  Export Format
                </label>
                <select
                  id="exportFormat"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                >
                  <option value="json">JSON</option>
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF Report</option>
                </select>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => handleExport(exportFormat)}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-300 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export All Data
                </button>
                
                <button
                  onClick={() => handleExport('health-summary')}
                  className="px-4 py-2 border border-violet-600 text-violet-600 rounded-lg hover:bg-violet-50 transition-colors duration-300 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Health Summary
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Import Health Data</h3>
              
              <form onSubmit={handleImport} className="flex items-center">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-violet-600 hover:text-violet-500 focus-within:outline-none">
                  <span>Upload a file</span>
                  <input 
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    accept=".json,.csv" 
                    className="sr-only"
                    onChange={(e) => setFileInput(e.target)} 
                  />
                </label>
                <p className="pl-1 text-sm text-gray-500">or drag and drop</p>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="ml-auto px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-300 flex items-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Importing...
                    </>
                  ) : 'Import'}
                </button>
              </form>
              <p className="mt-1 text-xs text-gray-500">JSON or CSV files up to 10MB</p>
            </div>
          </div>
        </div>
        
        {/* Data Retention & Privacy */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <h2 className="text-lg font-medium text-white px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              Data Retention & Privacy
            </h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-2">Data Retention</h3>
              <p className="text-sm text-gray-600 mb-3">
                Choose how long CuraMind should store your health data
              </p>
              
              <select
                name="dataRetention"
                value={dataOptions.dataRetention}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
              >
                <option value="forever">Indefinitely (until manually deleted)</option>
                <option value="1year">1 Year</option>
                <option value="6months">6 Months</option>
                <option value="3months">3 Months</option>
                <option value="1month">1 Month</option>
              </select>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-2">Data Sharing</h3>
              <p className="text-sm text-gray-600 mb-3">
                Control how your anonymized health data may be shared
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="anonymous-research"
                    name="dataSharing.anonymousResearch"
                    type="checkbox"
                    checked={dataOptions.dataSharing.anonymousResearch}
                    onChange={handleChange}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                  />
                  <label htmlFor="anonymous-research" className="ml-3 text-sm text-gray-700">
                    Anonymous medical research
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="service-improvement"
                    name="dataSharing.serviceImprovement"
                    type="checkbox"
                    checked={dataOptions.dataSharing.serviceImprovement}
                    onChange={handleChange}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                  />
                  <label htmlFor="service-improvement" className="ml-3 text-sm text-gray-700">
                    Service improvement (AI training)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="third-parties"
                    name="dataSharing.thirdParties"
                    type="checkbox"
                    checked={dataOptions.dataSharing.thirdParties}
                    onChange={handleChange}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                  />
                  <label htmlFor="third-parties" className="ml-3 text-sm text-gray-700">
                    Trusted third parties (for additional services)
                  </label>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Data Management</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="text-sm font-medium text-red-800 mb-1">Delete Specific Data</h4>
                  <p className="text-xs text-red-600 mb-3">
                    Delete specific categories of your health data. This action cannot be undone.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleDeleteData('chat history')}
                      className="px-3 py-1 bg-white border border-red-300 text-red-700 rounded hover:bg-red-50 text-xs"
                    >
                      Chat History
                    </button>
                    <button
                      onClick={() => handleDeleteData('health metrics')}
                      className="px-3 py-1 bg-white border border-red-300 text-red-700 rounded hover:bg-red-50 text-xs"
                    >
                      Health Metrics
                    </button>
                    <button
                      onClick={() => handleDeleteData('medication')}
                      className="px-3 py-1 bg-white border border-red-300 text-red-700 rounded hover:bg-red-50 text-xs"
                    >
                      Medication Data
                    </button>
                  </div>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="text-sm font-medium text-red-800 mb-1">Clear All Data</h4>
                  <p className="text-xs text-red-600 mb-3">
                    Delete all your health data from CuraMind. This action cannot be undone.
                  </p>
                  <button
                    onClick={() => handleDeleteData('all')}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                  >
                    Delete All My Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={saveSettings}
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-700 text-white rounded-lg hover:from-violet-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50"
          >
            Save Data Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSettings;