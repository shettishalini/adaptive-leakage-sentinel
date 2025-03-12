
import { useState } from "react";
import { DatasetMetrics } from "@/types/dataset";
import { adaptiveDetector } from "@/utils/adaptiveDataLeakageDetector";
import { generateNetworkData, generateAlerts } from "@/utils/datasetUtils";

export const useDatasetProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Generate report from processed data
  const generateReport = (metrics: DatasetMetrics | null): string | null => {
    if (!metrics?.csvData) return null;
    
    return adaptiveDetector.generateReport(metrics.csvData);
  };

  // Process CSV file and generate metrics using our adaptive detector
  const processCSVFile = async (file: File): Promise<DatasetMetrics> => {
    setIsProcessing(true);
    
    try {
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
          } finally {
            setIsProcessing(false);
          }
        };
        
        reader.onerror = () => {
          setIsProcessing(false);
          reject(new Error("Failed to read file"));
        };
        
        reader.readAsText(file);
      });
    } catch (error) {
      setIsProcessing(false);
      throw error;
    }
  };

  return {
    isProcessing,
    processCSVFile,
    generateReport
  };
};
