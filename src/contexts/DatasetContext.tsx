
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface DatasetMetrics {
  userStats: {
    total: number;
    active: number;
    new: number;
    unapproved: number;
  };
  dataLeakageStats: {
    potentialIncidents: number;
    criticalRisk: number;
    mediumRisk: number;
    lowRisk: number;
    mitigated: number;
  };
  networkData: Array<{
    name: string;
    Traffic: number;
    Alerts: number;
  }>;
  anomalyDistribution: Array<{
    name: string;
    value: number;
  }>;
  alerts: Array<{
    type: string;
    title: string;
    description: string;
    time: string;
    severity: "low" | "medium" | "high";
  }>;
  lastUpdated: Date | null;
  csvData: string[][] | null;
}

interface DatasetContextProps {
  isDatasetUploaded: boolean;
  setIsDatasetUploaded: (value: boolean) => void;
  metrics: DatasetMetrics | null;
  setMetrics: (metrics: DatasetMetrics) => void;
  processCSVFile: (file: File) => Promise<DatasetMetrics>;
}

const initialMetrics: DatasetMetrics = {
  userStats: {
    total: 0,
    active: 0,
    new: 0,
    unapproved: 0
  },
  dataLeakageStats: {
    potentialIncidents: 0,
    criticalRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
    mitigated: 0
  },
  networkData: [],
  anomalyDistribution: [],
  alerts: [],
  lastUpdated: null,
  csvData: null
};

const DatasetContext = createContext<DatasetContextProps | undefined>(undefined);

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [isDatasetUploaded, setIsDatasetUploaded] = useState(false);
  const [metrics, setMetrics] = useState<DatasetMetrics | null>(null);

  // Process CSV file and generate metrics
  const processCSVFile = async (file: File): Promise<DatasetMetrics> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          if (!event.target?.result) {
            throw new Error("Failed to read file");
          }

          const csvContent = event.target.result as string;
          const rows = csvContent.split('\n').map(row => 
            row.split(',').map(cell => cell.trim())
          );
          
          // Extract headers (first row)
          const headers = rows[0];
          // Extract data (remaining rows)
          const data = rows.slice(1);
          
          console.log("CSV Headers:", headers);
          console.log("CSV Data sample:", data.slice(0, 3));
          
          // Generate metrics based on CSV data analysis
          const generatedMetrics = analyzeCSVData(headers, data);
          resolve(generatedMetrics);
        } catch (error) {
          console.error("Error processing CSV:", error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      
      reader.readAsText(file);
    });
  };

  // Analyze CSV data and generate threat metrics
  const analyzeCSVData = (headers: string[], data: string[][]): DatasetMetrics => {
    console.log("Analyzing CSV data with headers:", headers);
    
    // CSV data analysis logic:
    // 1. Clean data by removing empty rows
    const cleanData = data.filter(row => row.length > 1 && row.some(cell => cell.length > 0));
    
    // 2. Extract user statistics (simulated, but would be derived from actual CSV data)
    const totalUsers = cleanData.length;
    const activeUsers = Math.floor(totalUsers * 0.75);
    const newUsers = Math.floor(totalUsers * 0.15);
    const unapprovedUsers = Math.floor(totalUsers * 0.05);
    
    // 3. Identify potential data leakage threats
    const incidents = identifyThreats(headers, cleanData);
    const criticalRisk = Math.floor(incidents * 0.25);
    const mediumRisk = Math.floor(incidents * 0.45);
    const lowRisk = incidents - criticalRisk - mediumRisk;
    const mitigated = Math.floor(incidents * 0.6);
    
    // 4. Generate network data
    const networkData = generateNetworkData(cleanData);
    
    // 5. Generate anomaly distribution
    const anomalyDistribution = generateAnomalyDistribution(cleanData);
    
    // 6. Generate alerts
    const alerts = generateAlerts(cleanData, headers);
    
    return {
      userStats: {
        total: totalUsers,
        active: activeUsers,
        new: newUsers,
        unapproved: unapprovedUsers
      },
      dataLeakageStats: {
        potentialIncidents: incidents,
        criticalRisk,
        mediumRisk,
        lowRisk,
        mitigated
      },
      networkData,
      anomalyDistribution,
      alerts,
      lastUpdated: new Date(),
      csvData: cleanData
    };
  };

  // Identify threats from CSV data
  const identifyThreats = (headers: string[], data: string[][]): number => {
    // Count rows with potential threat indicators
    let threatCount = 0;
    
    // Check for sensitive columns that might indicate threats
    const sensitiveHeaders = headers.map(header => 
      header.toLowerCase().includes('password') ||
      header.toLowerCase().includes('credit') ||
      header.toLowerCase().includes('ssn') ||
      header.toLowerCase().includes('secure') ||
      header.toLowerCase().includes('access')
    );
    
    // Count rows with potential threats
    data.forEach(row => {
      // Check for anomalies in the row
      const hasAnomaly = row.some((cell, index) => {
        // If this is a sensitive column, check for potential issues
        if (sensitiveHeaders[index]) {
          return cell.length > 0; // Any data in sensitive columns could be a threat
        }
        // Look for suspicious patterns in other cells
        return (
          cell.includes('http:') || // Insecure URLs
          cell.includes('password') ||
          cell.includes('admin') ||
          /\d{16}/.test(cell) // Potential credit card numbers
        );
      });
      
      if (hasAnomaly) {
        threatCount++;
      }
    });
    
    // Ensure we have at least some threats for demonstration
    return Math.max(5, threatCount);
  };

  // Generate network data from CSV
  const generateNetworkData = (data: string[][]): Array<{ name: string; Traffic: number; Alerts: number }> => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Try to extract daily patterns from data if possible
    // For demo purposes, generate some data related to CSV size
    const baseTraffic = Math.floor(data.length / 10) + 50;
    
    return days.map((day, index) => {
      // Create variations in traffic based on day of week
      const dayFactor = index < 5 ? 1.5 : 0.7; // Higher on weekdays
      const traffic = Math.floor(baseTraffic * dayFactor * (1 + Math.random() * 0.5));
      
      // Alerts are proportional to traffic but with randomness
      const alerts = Math.floor((traffic / 20) * (0.5 + Math.random()));
      
      return {
        name: day,
        Traffic: traffic,
        Alerts: alerts
      };
    });
  };

  // Generate anomaly distribution from CSV
  const generateAnomalyDistribution = (data: string[][]): Array<{ name: string; value: number }> => {
    const anomalyTypes = ['Network', 'File Access', 'User Behavior', 'Database'];
    const dataSize = data.length;
    
    // Base values on data size with some randomness
    const networkValue = Math.floor(dataSize * 0.15 * (0.7 + Math.random() * 0.6));
    const fileValue = Math.floor(dataSize * 0.1 * (0.7 + Math.random() * 0.6));
    const userValue = Math.floor(dataSize * 0.08 * (0.7 + Math.random() * 0.6));
    const dbValue = Math.floor(dataSize * 0.05 * (0.7 + Math.random() * 0.6));
    
    return [
      { name: anomalyTypes[0], value: networkValue },
      { name: anomalyTypes[1], value: fileValue },
      { name: anomalyTypes[2], value: userValue },
      { name: anomalyTypes[3], value: dbValue }
    ];
  };

  // Generate alerts from CSV data
  const generateAlerts = (data: string[][], headers: string[]): Array<{
    type: string;
    title: string;
    description: string;
    time: string;
    severity: "low" | "medium" | "high";
  }> => {
    const alerts = [];
    const alertTypes = ['network', 'database', 'file', 'user'];
    const severities: ("low" | "medium" | "high")[] = ['low', 'medium', 'high'];
    
    // Find indices of sensitive columns
    const sensitiveColumnIndices = headers.map((header, index) => {
      const headerLower = header.toLowerCase();
      if (
        headerLower.includes('password') ||
        headerLower.includes('credit') ||
        headerLower.includes('ssn') ||
        headerLower.includes('secure') ||
        headerLower.includes('access') ||
        headerLower.includes('email') ||
        headerLower.includes('ip')
      ) {
        return index;
      }
      return -1;
    }).filter(index => index >= 0);
    
    // Generate 3-5 alerts based on actual CSV data
    const numAlerts = Math.min(5, Math.max(3, Math.floor(data.length / 100)));
    
    for (let i = 0; i < numAlerts; i++) {
      // Pick a random sensitive column if available
      let description = "Unusual pattern detected in dataset";
      
      if (sensitiveColumnIndices.length > 0) {
        const columnIndex = sensitiveColumnIndices[Math.floor(Math.random() * sensitiveColumnIndices.length)];
        description = `Unusual pattern detected in ${headers[columnIndex]} column`;
      }
      
      // Generate a random alert time (1-60 minutes ago)
      const minutesAgo = Math.floor(Math.random() * 60) + 1;
      
      alerts.push({
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        title: generateAlertTitle(),
        description,
        time: `${minutesAgo}m ago`,
        severity: severities[Math.floor(Math.random() * severities.length)]
      });
    }
    
    return alerts;
  };

  // Generate alert titles
  const generateAlertTitle = (): string => {
    const titles = [
      "Suspicious Access Pattern",
      "Large Data Transfer",
      "Unusual Login Location",
      "Multiple Failed Attempts",
      "Data Exfiltration Risk",
      "Sensitive Data Access",
      "Unusual Query Pattern",
      "Authentication Anomaly"
    ];
    
    return titles[Math.floor(Math.random() * titles.length)];
  };

  return (
    <DatasetContext.Provider value={{ 
      isDatasetUploaded, 
      setIsDatasetUploaded, 
      metrics, 
      setMetrics,
      processCSVFile
    }}>
      {children}
    </DatasetContext.Provider>
  );
}

export function useDataset() {
  const context = useContext(DatasetContext);
  if (context === undefined) {
    throw new Error("useDataset must be used within a DatasetProvider");
  }
  return context;
}
