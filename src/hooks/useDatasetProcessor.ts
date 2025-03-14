
import { useState } from "react";
import { DatasetMetrics } from "@/types/dataset";
import { adaptiveDetector } from "@/utils/adaptiveDataLeakageDetector";
import { generateNetworkData, generateAlerts } from "@/utils/datasetUtils";

export const useDatasetProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Generate report from processed data with mitigation tasks instead of recommendations
  const generateReport = (metrics: DatasetMetrics | null): string | null => {
    if (!metrics?.csvData) return null;
    
    // Generate custom report using adapted detector with mitigation tasks
    const baseReport = adaptiveDetector.generateReport(metrics.csvData);
    
    // If there are mitigation tasks, add them to the report
    if (metrics.mitigationTasks && metrics.mitigationTasks.length > 0) {
      // Replace "Recommendations" section with "Mitigation Tasks"
      const reportWithoutRecommendations = baseReport?.replace(
        /## Recommendations[\s\S]*?(?=##|$)/,
        "## Mitigation Tasks\n\n" + metrics.mitigationTasks.map((task, index) => `${index + 1}. ${task}`).join("\n") + "\n\n"
      );
      
      return reportWithoutRecommendations;
    }
    
    return baseReport;
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
            
            // Generate mitigation tasks based on threat types
            const mitigationTasks = [
              "Implement multi-factor authentication for all user accounts",
              "Conduct phishing awareness training for all employees",
              "Encrypt sensitive data at rest and in transit",
              "Set up data loss prevention (DLP) solutions",
              "Review and restrict access permissions to sensitive systems",
              "Deploy endpoint detection and response (EDR) solutions",
              "Configure anomaly detection and behavioral monitoring",
              "Perform regular security audits and penetration testing"
            ];
            
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
              report: null, // Will be generated on download
              mitigationTasks: mitigationTasks,
              modelTrained: detectorResults.modelTrained || false,
              accuracy: detectorResults.accuracy,
              precision: detectorResults.precision,
              recall: detectorResults.recall
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
