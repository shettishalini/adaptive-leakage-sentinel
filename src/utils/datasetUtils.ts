
// Generate network data from CSV
export const generateNetworkData = (data: string[][]): Array<{ name: string; Traffic: number; Alerts: number }> => {
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
export const generateAlerts = (detectorResults: any): Array<{
  type: string;
  title: string;
  description: string;
  time: string;
  severity: "low" | "medium" | "high";
}> => {
  const alerts = [];
  const alertTypes = ['network', 'database', 'file', 'user'];
  
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
export const generateAlertTitle = (threatType: string): string => {
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
export const generateAlertDescription = (threatType: string): string => {
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
