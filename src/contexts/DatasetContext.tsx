
import React, { createContext, useContext, useState, ReactNode } from "react";
import { adaptiveDetector } from "@/utils/adaptiveDataLeakageDetector";

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
  threatTypes: Record<string, number>;
  unauthorizedUsers: string[];
  phishingAttempts: string[];
  dataSensitivity: Record<string, string>;
  report: string | null;
}

interface DatasetContextProps {
  isDatasetUploaded: boolean;
  setIsDatasetUploaded: (value: boolean) => void;
  metrics: DatasetMetrics | null;
  setMetrics: (metrics: DatasetMetrics) => void;
  processCSVFile: (file: File) => Promise<DatasetMetrics>;
  generateReport: () => string | null;
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
  csvData: null,
  threatTypes: {},
  unauthorizedUsers: [],
  phishingAttempts: [],
  dataSensitivity: {},
  report: null
};

const DatasetContext = createContext<DatasetContextProps | undefined>(undefined);

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [isDatasetUploaded, setIsDatasetUploaded] = useState(false);
  const [metrics, setMetrics] = useState<DatasetMetrics | null>(null);

  // Generate report from processed data
  const generateReport = (): string | null => {
    if (!metrics?.csvData) return null;
    
    const report = adaptiveDetector.generateReport(metrics.csvData);
    
    // Update metrics with report
    setMetrics(prev => prev ? { ...prev, report } : null);
    
    return report;
  };

  // Process CSV file and generate metrics using our adaptive detector
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
          
          // Process with our adaptive detector
          const detectorResults = adaptiveDetector.processData([headers, ...data]);
          
          // Get threat count from results
          const totalThreats = detectorResults.predictions.filter(p => p === 1).length;
          
          // Generate metrics based on detector results
          const generatedMetrics: DatasetMetrics = {
            userStats: {
              total: data.length,
              active: Math.floor(data.length * 0.8),
              new: Math.floor(data.length * 0.15),
              unapproved: detectorResults.unauthorizedUsers.length
            },
            dataLeakageStats: {
              potentialIncidents: totalThreats,
              criticalRisk: Math.floor(totalThreats * 0.3),
              mediumRisk: Math.floor(totalThreats * 0.5),
              lowRisk: totalThreats - Math.floor(totalThreats * 0.3) - Math.floor(totalThreats * 0.5),
              mitigated: Math.floor(totalThreats * 0.4)
            },
            networkData: generateNetworkData(data),
            anomalyDistribution: [
              { name: 'Unauthorized Access', value: detectorResults.threatTypes["Unauthorized Access"] || 0 },
              { name: 'Phishing', value: detectorResults.threatTypes["Phishing Attempt"] || 0 },
              { name: 'Data Exposure', value: detectorResults.threatTypes["Sensitive Data Exposure"] || 0 },
              { name: 'Data Exfiltration', value: detectorResults.threatTypes["Data Exfiltration"] || 0 }
            ],
            alerts: generateAlerts(detectorResults),
            lastUpdated: new Date(),
            csvData: [headers, ...data],
            threatTypes: detectorResults.threatTypes,
            unauthorizedUsers: detectorResults.unauthorizedUsers,
            phishingAttempts: detectorResults.phishingAttempts,
            dataSensitivity: detectorResults.dataSensitivity,
            report: null // Will be generated on download
          };
          
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

  // Generate alerts from detector results
  const generateAlerts = (detectorResults: any): Array<{
    type: string;
    title: string;
    description: string;
    time: string;
    severity: "low" | "medium" | "high";
  }> => {
    const alerts = [];
    const alertTypes = ['network', 'database', 'file', 'user'];
    const severities: ("low" | "medium" | "high")[] = ['low', 'medium', 'high'];
    
    // Create alerts based on threat types
    Object.entries(detectorResults.threatTypes).forEach(([threatType, count]) => {
      if (Number(count) > 0) {
        const formattedType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        const formattedSeverity = threatType.includes('Unauthorized') || threatType.includes('Phishing') 
          ? 'high' 
          : (threatType.includes('Sensitive') ? 'medium' : 'low');
          
        const minutesAgo = Math.floor(Math.random() * 60) + 1;
        
        alerts.push({
          type: formattedType,
          title: generateAlertTitle(threatType),
          description: generateAlertDescription(threatType),
          time: `${minutesAgo}m ago`,
          severity: formattedSeverity
        });
      }
    });
    
    // Add alerts for unauthorized users
    detectorResults.unauthorizedUsers.slice(0, 3).forEach((user: string) => {
      alerts.push({
        type: 'user',
        title: 'Unauthorized Access Attempt',
        description: `User "${user}" attempted to access restricted resources`,
        time: `${Math.floor(Math.random() * 30) + 1}m ago`,
        severity: 'high'
      });
    });
    
    // Add alerts for phishing attempts
    detectorResults.phishingAttempts.slice(0, 3).forEach((url: string) => {
      alerts.push({
        type: 'network',
        title: 'Phishing URL Detected',
        description: `Suspicious URL detected: ${url.substring(0, 30)}...`,
        time: `${Math.floor(Math.random() * 45) + 1}m ago`,
        severity: 'high'
      });
    });
    
    return alerts;
  };

  // Generate alert titles
  const generateAlertTitle = (threatType: string): string => {
    switch (threatType) {
      case "Unauthorized Access":
        return "Unauthorized Access Detected";
      case "Phishing Attempt":
        return "Phishing Attempt Identified";
      case "Sensitive Data Exposure":
        return "Sensitive Data Exposure Risk";
      case "Data Exfiltration":
        return "Potential Data Exfiltration";
      case "Suspicious File Access":
        return "Suspicious File Access Pattern";
      default:
        return "Security Alert Detected";
    }
  };
  
  // Generate alert descriptions
  const generateAlertDescription = (threatType: string): string => {
    switch (threatType) {
      case "Unauthorized Access":
        return "Unusual access pattern detected from unverified source";
      case "Phishing Attempt":
        return "Suspicious URL or email pattern identified in communications";
      case "Sensitive Data Exposure":
        return "Potential exposure of sensitive information detected";
      case "Data Exfiltration":
        return "Unusual data transfer pattern suggests possible exfiltration";
      case "Suspicious File Access":
        return "Abnormal file access pattern detected in system";
      default:
        return "Unusual pattern detected in dataset";
    }
  };

  return (
    <DatasetContext.Provider value={{ 
      isDatasetUploaded, 
      setIsDatasetUploaded, 
      metrics, 
      setMetrics,
      processCSVFile,
      generateReport
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
