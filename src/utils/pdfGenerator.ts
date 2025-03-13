
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DatasetMetrics } from "@/types/dataset";

// Function to generate a PDF report from dataset metrics
export const generatePDFReport = (metrics: DatasetMetrics): jsPDF => {
  // Create a new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Add title
  doc.setFontSize(18);
  doc.setTextColor(33, 33, 33);
  doc.text("Data Leakage Detection Report", pageWidth / 2, 15, { align: "center" });
  
  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 22, { align: "center" });
  
  // Add report summary section
  doc.setFontSize(14);
  doc.setTextColor(33, 33, 33);
  doc.text("Executive Summary", 14, 30);
  
  // Summary text
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const summaryText = [
    `Total Records Analyzed: ${metrics.userStats.total}`,
    `Active Users: ${metrics.userStats.active}`,
    `New Users: ${metrics.userStats.new}`,
    `Unapproved Users: ${metrics.userStats.unapproved}`,
    `Potential Data Leakage Incidents: ${metrics.dataLeakageStats.potentialIncidents}`,
    `Critical Risk Incidents: ${metrics.dataLeakageStats.criticalRisk}`,
    `Medium Risk Incidents: ${metrics.dataLeakageStats.mediumRisk}`,
    `Low Risk Incidents: ${metrics.dataLeakageStats.lowRisk}`,
    `Mitigated Incidents: ${metrics.dataLeakageStats.mitigated}`
  ];
  
  let yPos = 35;
  summaryText.forEach(line => {
    doc.text(line, 14, yPos);
    yPos += 5;
  });
  
  // Model performance metrics if available
  if (metrics.modelTrained) {
    yPos += 5;
    doc.setFontSize(14);
    doc.text("Model Performance", 14, yPos);
    yPos += 5;
    
    doc.setFontSize(10);
    const modelText = [
      `Accuracy: ${metrics.accuracy ? (metrics.accuracy * 100).toFixed(2) : 0}%`,
      `Precision: ${metrics.precision ? (metrics.precision * 100).toFixed(2) : 0}%`,
      `Recall: ${metrics.recall ? (metrics.recall * 100).toFixed(2) : 0}%`
    ];
    
    modelText.forEach(line => {
      doc.text(line, 14, yPos);
      yPos += 5;
    });
  }
  
  // Add threat distribution section
  yPos += 5;
  doc.setFontSize(14);
  doc.text("Threat Distribution", 14, yPos);
  yPos += 10;
  
  // Create threat distribution table
  const threatHeaders = [["Threat Type", "Count"]];
  const threatData = Object.entries(metrics.threatTypes).map(([type, count]) => [type, count.toString()]);
  
  autoTable(doc, {
    startY: yPos,
    head: threatHeaders,
    body: threatData,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
    margin: { left: 14, right: 14 }
  });
  
  yPos = (doc as any).lastAutoTable.finalY + 10;
  
  // Add unauthorized users section
  doc.setFontSize(14);
  doc.text("Unauthorized Users", 14, yPos);
  yPos += 10;
  
  if (metrics.unauthorizedUsers.length > 0) {
    const userHeaders = [["User", "Status"]];
    const userData = metrics.unauthorizedUsers.map(user => [user, "Unauthorized"]);
    
    autoTable(doc, {
      startY: yPos,
      head: userHeaders,
      body: userData,
      theme: 'striped',
      headStyles: { fillColor: [192, 57, 43] },
      margin: { left: 14, right: 14 }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(10);
    doc.text("No unauthorized users detected", 14, yPos);
    yPos += 10;
  }
  
  // Add phishing attempts section
  doc.setFontSize(14);
  doc.text("Phishing Attempts", 14, yPos);
  yPos += 10;
  
  if (metrics.phishingAttempts.length > 0) {
    const phishingHeaders = [["Target", "Status"]];
    const phishingData = metrics.phishingAttempts.map(attempt => [attempt, "Blocked"]);
    
    autoTable(doc, {
      startY: yPos,
      head: phishingHeaders,
      body: phishingData,
      theme: 'striped',
      headStyles: { fillColor: [211, 84, 0] },
      margin: { left: 14, right: 14 }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(10);
    doc.text("No phishing attempts detected", 14, yPos);
    yPos += 10;
  }
  
  // Check if we need a new page for alerts
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }
  
  // Add recent alerts section
  doc.setFontSize(14);
  doc.text("Recent Alerts", 14, yPos);
  yPos += 10;
  
  if (metrics.alerts.length > 0) {
    const alertHeaders = [["Type", "Title", "Severity", "Time"]];
    const alertData = metrics.alerts.map(alert => [
      alert.type,
      alert.title,
      alert.severity,
      alert.time
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: alertHeaders,
      body: alertData,
      theme: 'striped',
      headStyles: { fillColor: [52, 152, 219] },
      margin: { left: 14, right: 14 }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(10);
    doc.text("No alerts detected", 14, yPos);
    yPos += 10;
  }
  
  // Check if we need a new page for data sensitivity
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }
  
  // Add data sensitivity section
  doc.setFontSize(14);
  doc.text("Data Sensitivity Analysis", 14, yPos);
  yPos += 10;
  
  if (Object.keys(metrics.dataSensitivity).length > 0) {
    const sensitivityHeaders = [["Data Item", "Sensitivity Level"]];
    const sensitivityData = Object.entries(metrics.dataSensitivity).map(([item, level]) => [item, level]);
    
    autoTable(doc, {
      startY: yPos,
      head: sensitivityHeaders,
      body: sensitivityData,
      theme: 'striped',
      headStyles: { fillColor: [142, 68, 173] },
      margin: { left: 14, right: 14 }
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 10;
  } else {
    doc.setFontSize(10);
    doc.text("No sensitive data detected", 14, yPos);
    yPos += 10;
  }
  
  // Add full report from analysis if available
  if (metrics.report) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Detailed Analysis Report", 14, 20);
    
    // Format the report text
    const reportLines = metrics.report.split('\n');
    let reportY = 30;
    
    doc.setFontSize(10);
    reportLines.forEach(line => {
      // Check if we need a new page
      if (reportY > pageHeight - 20) {
        doc.addPage();
        reportY = 20;
      }
      
      // Handle section headers
      if (line.endsWith(':')) {
        doc.setFont(undefined, 'bold');
        doc.text(line, 14, reportY);
        doc.setFont(undefined, 'normal');
      } else {
        doc.text(line, 14, reportY);
      }
      
      reportY += 5;
    });
  }
  
  return doc;
};
