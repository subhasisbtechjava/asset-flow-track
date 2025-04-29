
// This file contains API endpoint definitions for reporting functionality
// These would be implemented on a Node.js backend

import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

export const reportAPI = {
  // Get store progress summary
  getStoreProgressSummary: async () => {
    try {
      const response = await axios.get(`${API_URL}/reports/store-progress`);
      return response.data;
    } catch (error) {
      console.error('Error fetching store progress summary:', error);
      throw error;
    }
  },

  // Get asset acquisition report
  getAssetAcquisitionReport: async (params: {
    startDate?: string;
    endDate?: string;
    storeId?: string;
    brandId?: string;
  }) => {
    try {
      const response = await axios.get(`${API_URL}/reports/asset-acquisition`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching asset acquisition report:', error);
      throw error;
    }
  },

  // Get finance booking report
  getFinanceBookingReport: async (params: {
    startDate?: string;
    endDate?: string;
    storeId?: string;
    brandId?: string;
  }) => {
    try {
      const response = await axios.get(`${API_URL}/reports/finance-booking`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching finance booking report:', error);
      throw error;
    }
  },

  // Generate and download CSV export
  exportToCSV: async (reportType: string, params: any = {}) => {
    try {
      const response = await axios.get(`${API_URL}/reports/export/${reportType}`, {
        params,
        responseType: 'blob'
      });
      
      // Create download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error(`Error exporting ${reportType} to CSV:`, error);
      throw error;
    }
  }
};
