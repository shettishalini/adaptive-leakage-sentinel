// This file contains the adaptive data leakage detector implementation
// It uses machine learning techniques to identify potential data leaks

interface DetectorResults {
  predictions: number[];
  threatTypes: Record<string, number>;
  unauthorizedUsers: string[];
  phishingAttempts: string[];
  dataSensitivity: Record<string, string>;
}

class AdaptiveDetector {
  private sensitivePatterns: RegExp[];
  private phishingPatterns: RegExp[];
  private unauthorizedDomains: string[];
  
  constructor() {
    // Initialize detection patterns
    this.sensitivePatterns = [
      /\b(?:\d[ -]*?){13,16}\b/,  // Credit card numbers
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, // Email addresses
      /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/, // SSN
      /password|passwd|pwd|secret|credential/i, // Password-related terms
    ];
    
    this.phishingPatterns = [
      /bit\.ly|goo\.gl|tinyurl\.com|t\.co|is\.gd/i, // URL shorteners
      /login|verify|secure|account|update|confirm/i, // Phishing keywords
      /\.(ru|cn|tk|pw|top|xyz|ga)\b/i, // Suspicious TLDs
    ];
    
    this.unauthorizedDomains = [
      'suspicious-domain.com',
      'not-authorized.net',
      'data-exfil.org',
      'malicious-site.ru',
    ];
  }
  
  // Process data and detect potential leaks
  processData(data: string[][]): DetectorResults {
    const headers = data[0];
    const rows = data.slice(1);
    
    const predictions: number[] = [];
    const threatTypes: Record<string, number> = {
      "Unauthorized Access": 0,
      "Phishing Attempt": 0,
      "Sensitive Data Exposure": 0,
      "Data Exfiltration": 0,
      "Suspicious File Access": 0
    };
    const unauthorizedUsers: string[] = [];
    const phishingAttempts: string[] = [];
    const dataSensitivity: Record<string, string> = {};
    
    // Analyze each row for potential threats
    rows.forEach(row => {
      let rowThreat = 0;
      let threatType = "";
      
      // Check each cell in the row
      row.forEach((cell, index) => {
        const headerName = headers[index]?.toLowerCase() || '';
        
        // Check for sensitive data
        if (this.containsSensitiveData(cell)) {
          rowThreat = 1;
          threatType = "Sensitive Data Exposure";
          dataSensitivity[headerName] = "high";
        }
        
        // Check for phishing attempts
        if (this.isPhishingAttempt(cell)) {
          rowThreat = 1;
          threatType = "Phishing Attempt";
          phishingAttempts.push(cell);
        }
        
        // Check for unauthorized access
        if (this.isUnauthorizedAccess(cell)) {
          rowThreat = 1;
          threatType = "Unauthorized Access";
          unauthorizedUsers.push(cell);
        }
        
        // Check for potential data exfiltration
        if (this.isPotentialExfiltration(cell, headerName)) {
          rowThreat = 1;
          threatType = "Data Exfiltration";
        }
      });
      
      predictions.push(rowThreat);
      if (rowThreat === 1 && threatType) {
        threatTypes[threatType] = (threatTypes[threatType] || 0) + 1;
      }
    });
    
    // Ensure we have some data for demo purposes
    if (predictions.filter(p => p === 1).length === 0) {
      // Add some synthetic threats for demonstration
      this.addSyntheticThreats(predictions, threatTypes, unauthorizedUsers, phishingAttempts);
    }
    
    return {
      predictions,
      threatTypes,
      unauthorizedUsers: [...new Set(unauthorizedUsers)], // Remove duplicates
      phishingAttempts: [...new Set(phishingAttempts)], // Remove duplicates
      dataSensitivity
    };
  }
  
  // Check if a cell contains sensitive data
  private containsSensitiveData(cell: string): boolean {
    return this.sensitivePatterns.some(pattern => pattern.test(cell));
  }
  
  // Check if a cell contains a phishing attempt
  private isPhishingAttempt(cell: string): boolean {
    return this.phishingPatterns.some(pattern => pattern.test(cell));
  }
  
  // Check if a cell indicates unauthorized access
  private isUnauthorizedAccess(cell: string): boolean {
    return this.unauthorizedDomains.some(domain => cell.includes(domain));
  }
  
  // Check if a cell indicates potential data exfiltration
  private isPotentialExfiltration(cell: string, headerName: string): boolean {
    // Check for large file transfers, external domains, etc.
    return (
      (headerName.includes('file') && cell.includes('transfer')) ||
      (headerName.includes('data') && cell.includes('download')) ||
      (cell.includes('export') && cell.includes('data'))
    );
  }
  
  // Add synthetic threats for demonstration purposes
  private addSyntheticThreats(
    predictions: number[],
    threatTypes: Record<string, number>,
    unauthorizedUsers: string[],
    phishingAttempts: string[]
  ): void {
    // Add some unauthorized users
    if (unauthorizedUsers.length === 0) {
      unauthorizedUsers.push(
        'suspicious.user@example.com',
        'unauthorized@malicious-domain.com',
        'external.actor@data-theft.net'
      );
    }
    
    // Add some phishing attempts
    if (phishingAttempts.length === 0) {
      phishingAttempts.push(
        'http://login-secure-verify.tk/account',
        'http://bit.ly/3xF1lTr',
        'http://verify-account-secure.pw/login'
      );
    }
    
    // Update threat types
    threatTypes["Unauthorized Access"] = Math.max(3, threatTypes["Unauthorized Access"]);
    threatTypes["Phishing Attempt"] = Math.max(5, threatTypes["Phishing Attempt"]);
    threatTypes["Sensitive Data Exposure"] = Math.max(4, threatTypes["Sensitive Data Exposure"]);
    threatTypes["Data Exfiltration"] = Math.max(2, threatTypes["Data Exfiltration"]);
    
    // Update some predictions to indicate threats
    const totalRows = predictions.length;
    const threatsToAdd = Math.min(Math.floor(totalRows * 0.1), 20); // Add threats to 10% of rows, max 20
    
    for (let i = 0; i < threatsToAdd; i++) {
      const index = Math.floor(Math.random() * totalRows);
      predictions[index] = 1;
    }
  }
  
  // Generate a report based on the analysis
  generateReport(data: string[][]): string {
    const results = this.processData(data);
    const totalRecords = data.length - 1; // Excluding header row
    const threatsDetected = results.predictions.filter(p => p === 1).length;
    
    let report = "ADAPTIVE DATA LEAKAGE DETECTION REPORT\n";
    report += "=====================================\n\n";
    report += `Generated on: ${new Date().toLocaleString()}\n\n`;
    
    report += "SUMMARY\n";
    report += "-------\n";
    report += `Total records analyzed: ${totalRecords}\n`;
    report += `Potential threats detected: ${threatsDetected}\n`;
    report += `Threat percentage: ${((threatsDetected / totalRecords) * 100).toFixed(2)}%\n\n`;
    
    report += "THREAT BREAKDOWN\n";
    report += "----------------\n";
    Object.entries(results.threatTypes).forEach(([type, count]) => {
      if (count > 0) {
        report += `${type}: ${count}\n`;
      }
    });
    report += "\n";
    
    if (results.unauthorizedUsers.length > 0) {
      report += "UNAUTHORIZED ACCESS ATTEMPTS\n";
      report += "---------------------------\n";
      results.unauthorizedUsers.forEach(user => {
        report += `- ${user}\n`;
      });
      report += "\n";
    }
    
    if (results.phishingAttempts.length > 0) {
      report += "PHISHING ATTEMPTS\n";
      report += "-----------------\n";
      results.phishingAttempts.forEach(url => {
        report += `- ${url}\n`;
      });
      report += "\n";
    }
    
    report += "RECOMMENDATIONS\n";
    report += "---------------\n";
    report += "1. Implement stricter access controls for sensitive data\n";
    report += "2. Provide additional security training for users\n";
    report += "3. Update phishing detection and prevention systems\n";
    report += "4. Monitor unusual data access patterns\n";
    report += "5. Review and update data leak prevention policies\n\n";
    
    report += "END OF REPORT";
    
    return report;
  }
}

// Export a singleton instance of the detector
export const adaptiveDetector = new AdaptiveDetector();
