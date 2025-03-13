import { generateAlerts, generateNetworkData } from "./datasetUtils";

// Define weights for different risk factors
const weights = {
  unusualActivity: 0.4,
  dataSensitivity: 0.3,
  externalAccess: 0.2,
  phishingIndicators: 0.1
};

// Define thresholds for risk scores
const riskThreshold = 0.6;

// Define sensitivity levels for data
const sensitivityLevels = {
  "Public": 0.1,
  "Internal": 0.4,
  "Confidential": 0.7,
  "Highly Confidential": 0.9
};

// Define threat types and their initial counts
const threatTypes = {
  "Unauthorized Access": 0,
  "Phishing Attempt": 0,
  "Sensitive Data Exposure": 0,
  "Data Exfiltration": 0
};

// Define unauthorized users and phishing attempts lists
const unauthorizedUsers: string[] = [];
const phishingAttempts: string[] = [];

// Define data sensitivity levels
const dataSensitivity: Record<string, string> = {};

export const adaptiveDetector = {
  weights: weights,
  riskThreshold: riskThreshold,
  sensitivityLevels: sensitivityLevels,
  threatTypes: threatTypes,
  unauthorizedUsers: unauthorizedUsers,
  phishingAttempts: phishingAttempts,
  dataSensitivity: dataSensitivity,

  // Function to calculate risk score based on various factors
  calculateRiskScore(record: any) {
    let score = 0;

    // Unusual activity (e.g., access outside working hours)
    if (record.unusualActivity) {
      score += weights.unusualActivity;
    }

    // Data sensitivity (e.g., accessing highly confidential data)
    if (record.dataSensitivity) {
      score += weights.dataSensitivity * sensitivityLevels[record.dataSensitivity];
    }

    // External access (e.g., accessing data from outside the network)
    if (record.externalAccess) {
      score += weights.externalAccess;
    }

    // Phishing indicators (e.g., clicking on a suspicious link)
    if (record.phishingIndicators) {
      score += weights.phishingIndicators;
    }

    return score;
  },

  // Function to adjust weights based on feedback
  adjustWeights(trainingData: any[]) {
    // Example: Increase weight for data sensitivity if it's a strong indicator
    let sensitivityImpact = 0;
    trainingData.forEach(record => {
      if (record.isAnomaly && record.dataSensitivity) {
        sensitivityImpact++;
      }
    });

    if (sensitivityImpact > trainingData.length * 0.3) {
      weights.dataSensitivity += 0.05;
    }
  },

  processData(csvData: string[][]) {
    // Extract headers and data from CSV
    const headers = csvData[0];
    const data = csvData.slice(1);

    // Initialize threat types
    const threatTypes = {
      "Unauthorized Access": 0,
      "Phishing Attempt": 0,
      "Sensitive Data Exposure": 0,
      "Data Exfiltration": 0
    };

    const unauthorizedUsers: string[] = [];
    const phishingAttempts: string[] = [];
    const dataSensitivity: Record<string, string> = {};

    // Process each record
    data.forEach(record => {
      // Extract relevant fields from record
      const activity = record[0];
      const user = record[1];
      const timestamp = record[2];
      const dataAccessed = record[3];
      const location = record[4];
      const ipAddress = record[5];
      const device = record[6];
      const action = record[7];
      const status = record[8];

      // Check for unauthorized access
      if (action === "login" && status === "failed") {
        threatTypes["Unauthorized Access"]++;
        if (!unauthorizedUsers.includes(user)) {
          unauthorizedUsers.push(user);
        }
      }

      // Check for phishing attempts
      if (activity.toLowerCase().includes("phishing") || dataAccessed.toLowerCase().includes("phishing")) {
        threatTypes["Phishing Attempt"]++;
        if (!phishingAttempts.includes(dataAccessed)) {
          phishingAttempts.push(dataAccessed);
        }
      }

      // Check for sensitive data exposure
      if (dataAccessed.toLowerCase().includes("confidential")) {
        threatTypes["Sensitive Data Exposure"]++;
        dataSensitivity[dataAccessed] = "Confidential";
      }

      // Check for data exfiltration
      if (action === "upload" || action === "download") {
        threatTypes["Data Exfiltration"]++;
      }
    });
    
    // Calculate features for each record
    const features = data.map(record => {
      const isAnomaly = Math.random() < 0.1; // Simulate anomaly detection
      return {
        unusualActivity: Math.random() > 0.5,
        dataSensitivity: ["Public", "Internal", "Confidential", "Highly Confidential"][Math.floor(Math.random() * 4)],
        externalAccess: Math.random() > 0.5,
        phishingIndicators: Math.random() > 0.5,
        isAnomaly: isAnomaly
      };
    });

    // Train model if enough data
    let modelTrained = false;
    let trainResults = {
      accuracy: 0,
      precision: 0,
      recall: 0
    };

    if (features.length > 50) {
      // Split into training and test sets (80/20)
      const splitIndex = Math.floor(features.length * 0.8);
      const trainingFeatures = features.slice(0, splitIndex);
      const testFeatures = features.slice(splitIndex);
      
      // Train on training set
      this.adjustWeights(trainingFeatures);
      
      // Test on test set
      let truePositives = 0;
      let falsePositives = 0;
      let falseNegatives = 0;
      let trueNegatives = 0;
      
      testFeatures.forEach(feature => {
        const score = this.calculateRiskScore(feature);
        const predicted = score > this.riskThreshold ? 1 : 0;
        const actual = feature.isAnomaly ? 1 : 0;
        
        if (predicted === 1 && actual === 1) truePositives++;
        if (predicted === 1 && actual === 0) falsePositives++;
        if (predicted === 0 && actual === 1) falseNegatives++;
        if (predicted === 0 && actual === 0) trueNegatives++;
      });
      
      // Calculate metrics
      const accuracy = testFeatures.length > 0 ? 
        (truePositives + trueNegatives) / testFeatures.length : 0;
      
      const precision = (truePositives + falsePositives) > 0 ? 
        truePositives / (truePositives + falsePositives) : 0;
      
      const recall = (truePositives + falseNegatives) > 0 ? 
        truePositives / (truePositives + falseNegatives) : 0;
      
      trainResults = {
        accuracy: Number(accuracy.toFixed(2)),
        precision: Number(precision.toFixed(2)),
        recall: Number(recall.toFixed(2))
      };
      
      modelTrained = true;
    }
    
    // Generate predictions for all records
    const predictions = features.map(feature => {
      const score = this.calculateRiskScore(feature);
      return score > this.riskThreshold ? 1 : 0;
    });
    
    return {
      predictions,
      threatTypes,
      unauthorizedUsers,
      phishingAttempts,
      dataSensitivity,
      modelTrained,
      accuracy: trainResults.accuracy,
      precision: trainResults.precision,
      recall: trainResults.recall
    };
  },

  generateReport(csvData: string[][]) {
    // Extract headers and data from CSV
    const headers = csvData[0];
    const data = csvData.slice(1);

    // Generate report content
    let report = "Security Threat Analysis Report\n\n";
    report += "Executive Summary:\n";
    report += `Total records analyzed: ${data.length}\n`;
    report += `Potential threats detected: ${data.filter(record => record.includes("phishing")).length}\n\n`;

    report += "Detailed Findings:\n";
    report += "Unauthorized Access Attempts:\n";
    unauthorizedUsers.forEach(user => {
      report += `- ${user}\n`;
    });
    report += "\nPhishing Attempts:\n";
    phishingAttempts.forEach(attempt => {
      report += `- ${attempt}\n`;
    });
    report += "\nData Sensitivity:\n";
    Object.entries(dataSensitivity).forEach(([data, sensitivity]) => {
      report += `- ${data}: ${sensitivity}\n`;
    });

    return report;
  }
};
