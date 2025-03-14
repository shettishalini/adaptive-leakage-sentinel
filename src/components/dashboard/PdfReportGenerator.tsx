
import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DatasetMetrics } from "@/types/dataset";
import { useToast } from "@/hooks/use-toast";

interface PdfReportGeneratorProps {
  metrics: DatasetMetrics | null;
  generateReport: () => string | null;
  isDatasetUploaded: boolean;
}

const usePdfReportGenerator = ({ metrics, generateReport, isDatasetUploaded }: PdfReportGeneratorProps) => {
  const { toast } = useToast();

  const handleDownloadReport = () => {
    if (!isDatasetUploaded || !metrics) {
      toast({
        title: "No data available",
        description: "Please upload a dataset before generating a report",
        variant: "destructive",
      });
      return;
    }

    try {
      const reportText = generateReport();
      
      if (!reportText) {
        throw new Error("Could not generate report");
      }
      
      const pdf = new jsPDF();
      
      // Add title and header
      pdf.setFillColor(66, 133, 244);
      pdf.rect(0, 0, pdf.internal.pageSize.width, 30, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.text("Adaptive Data Leakage Detection Report", 20, 20);
      
      pdf.setFontSize(11);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 40);
      
      // Executive Summary Section
      pdf.setFillColor(240, 240, 240);
      pdf.rect(0, 50, pdf.internal.pageSize.width, 12, 'F');
      pdf.setTextColor(50, 50, 50);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text("EXECUTIVE SUMMARY", 20, 58);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      
      // Create summary text
      const threatPercentage = ((metrics.dataLeakageStats.potentialIncidents / metrics.userStats.total) * 100).toFixed(2);
      
      // Find major threat type
      let majorThreatType = "None";
      let majorThreatCount = 0;
      
      for (const [type, count] of Object.entries(metrics.threatTypes)) {
        if (count > majorThreatCount) {
          majorThreatCount = count;
          majorThreatType = type;
        }
      }
      
      pdf.text(`Total records analyzed: ${metrics.userStats.total}`, 25, 70);
      pdf.text(`Potential threats detected: ${metrics.dataLeakageStats.potentialIncidents}`, 25, 78);
      pdf.text(`Percentage of data with threats: ${threatPercentage}%`, 25, 86);
      pdf.text(`Major threat identified: ${majorThreatType} (${majorThreatCount} instances)`, 25, 94);
      
      // Threat Breakdown Section
      pdf.setFillColor(240, 240, 240);
      pdf.rect(0, 110, pdf.internal.pageSize.width, 12, 'F');
      pdf.setTextColor(50, 50, 50);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text("THREAT BREAKDOWN", 20, 118);
      
      const threatTypeData = Object.entries(metrics.threatTypes)
        .filter(([_, count]) => count > 0)
        .map(([type, count]) => [type, String(count)]);
      
      if (threatTypeData.length > 0) {
        autoTable(pdf, {
          startY: 125,
          head: [['Threat Type', 'Count']],
          body: threatTypeData,
          theme: 'striped',
          headStyles: { fillColor: [66, 133, 244], textColor: [255, 255, 255] },
          styles: { fontSize: 10 }
        });
      }
      
      // Get current Y position after the table
      const autoTableOutput = autoTable as any;
      let currentY = autoTableOutput.previous ? autoTableOutput.previous.finalY + 15 : 155;
      
      // Add Threat Distribution Pie Chart
      if (metrics.anomalyDistribution && metrics.anomalyDistribution.length > 0) {
        // Add title for the chart
        pdf.setFillColor(240, 240, 240);
        pdf.rect(0, currentY, pdf.internal.pageSize.width, 12, 'F');
        pdf.setTextColor(50, 50, 50);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text("THREAT DISTRIBUTION", 20, currentY + 8);
        
        // Add a canvas element to draw the chart
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 250;
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Draw a simple pie chart
          const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
          const total = metrics.anomalyDistribution.reduce((sum, item) => sum + item.value, 0);
          let currentAngle = 0;
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw pie slices
          metrics.anomalyDistribution.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(150, 125);
            ctx.arc(150, 125, 100, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();
            
            // Add label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelDistance = 130; // Distance from center to label
            const labelX = 150 + Math.cos(labelAngle) * labelDistance;
            const labelY = 125 + Math.sin(labelAngle) * labelDistance;
            
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${item.name} (${Math.round((item.value / total) * 100)}%)`, labelX, labelY);
            
            currentAngle += sliceAngle;
          });
          
          // Add title and legend
          ctx.fillStyle = '#333';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Threat Types Distribution', 300, 50);
          
          // Draw legend in a clearer format
          ctx.textAlign = 'left';
          ctx.font = '12px Arial';
          metrics.anomalyDistribution.forEach((item, index) => {
            const y = 80 + index * 25;
            
            // Color box
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(260, y - 10, 15, 15);
            
            // Legend text with count
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.fillText(`${item.name}: ${item.value}`, 285, y);
          });
          
          // Add the chart to PDF
          const imgData = canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', 20, currentY + 15, 170, 85);
          
          // Clean up
          document.body.removeChild(canvas);
        }
        
        currentY += 110; // Update Y position after chart
      }
      
      // Add Network Traffic Chart
      if (metrics.networkData && metrics.networkData.length > 0) {
        // Check if we need a new page
        if (currentY > 200) {
          pdf.addPage();
          currentY = 20;
        }
        
        // Add title for the chart
        pdf.setFillColor(240, 240, 240);
        pdf.rect(0, currentY, pdf.internal.pageSize.width, 12, 'F');
        pdf.setTextColor(50, 50, 50);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text("NETWORK TRAFFIC & ALERTS", 20, currentY + 8);
        
        // Create a canvas for the chart
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 250;
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Draw a simple line chart
          const maxTraffic = Math.max(...metrics.networkData.map(d => d.Traffic));
          const maxAlerts = Math.max(...metrics.networkData.map(d => d.Alerts));
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw grid
          ctx.strokeStyle = '#ddd';
          ctx.beginPath();
          for (let i = 0; i <= 5; i++) {
            const y = 200 - (i * 40);
            ctx.moveTo(50, y);
            ctx.lineTo(450, y);
          }
          for (let i = 0; i < metrics.networkData.length; i++) {
            const x = 50 + (i * (400 / (metrics.networkData.length - 1)));
            ctx.moveTo(x, 40);
            ctx.lineTo(x, 200);
          }
          ctx.stroke();
          
          // Draw Traffic line
          ctx.strokeStyle = '#8884d8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          
          metrics.networkData.forEach((item, index) => {
            const x = 50 + (index * (400 / (metrics.networkData.length - 1)));
            const y = 200 - ((item.Traffic / maxTraffic) * 160);
            
            if (index === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.stroke();
          
          // Draw Alerts line
          ctx.strokeStyle = '#ff5555';
          ctx.lineWidth = 2;
          ctx.beginPath();
          
          metrics.networkData.forEach((item, index) => {
            const x = 50 + (index * (400 / (metrics.networkData.length - 1)));
            const y = 200 - ((item.Alerts / maxAlerts) * 160);
            
            if (index === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.stroke();
          
          // Add labels
          ctx.fillStyle = '#333';
          ctx.font = '14px Arial';
          ctx.fillText('Network Traffic & Alerts', 180, 25);
          
          ctx.font = '12px Arial';
          metrics.networkData.forEach((item, index) => {
            const x = 50 + (index * (400 / (metrics.networkData.length - 1)));
            ctx.fillText(item.name, x - 10, 220);
          });
          
          // Add legend
          ctx.fillStyle = '#8884d8';
          ctx.fillRect(50, 235, 15, 15);
          ctx.fillStyle = '#333';
          ctx.fillText('Traffic', 70, 245);
          
          ctx.fillStyle = '#ff5555';
          ctx.fillRect(150, 235, 15, 15);
          ctx.fillStyle = '#333';
          ctx.fillText('Alerts', 170, 245);
          
          // Add the chart to PDF
          const imgData = canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', 20, currentY + 15, 170, 85);
          
          // Clean up
          document.body.removeChild(canvas);
        }
        
        currentY += 110; // Update Y position after chart
      }
      
      // Unauthorized Access Section (new page if needed)
      if (currentY > 200) {
        pdf.addPage();
        currentY = 20;
      }
      
      if (metrics.unauthorizedUsers && metrics.unauthorizedUsers.length > 0) {
        pdf.setFillColor(240, 240, 240);
        pdf.rect(0, currentY, pdf.internal.pageSize.width, 12, 'F');
        pdf.setTextColor(50, 50, 50);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text("UNAUTHORIZED ACCESS ATTEMPTS", 20, currentY + 8);
        
        currentY += 15;
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        
        const usersToDisplay = metrics.unauthorizedUsers.slice(0, 10);
        usersToDisplay.forEach((user, index) => {
          pdf.text(`• ${user}`, 25, currentY + (index * 8));
        });
        
        if (metrics.unauthorizedUsers.length > 10) {
          pdf.text(`• ... and ${metrics.unauthorizedUsers.length - 10} more`, 25, currentY + (usersToDisplay.length * 8));
          currentY += (usersToDisplay.length + 1) * 8;
        } else {
          currentY += usersToDisplay.length * 8;
        }
        
        currentY += 15;
      }
      
      // Phishing Attempts Section
      if (currentY > 210) {
        pdf.addPage();
        currentY = 20;
      }
      
      if (metrics.phishingAttempts && metrics.phishingAttempts.length > 0) {
        pdf.setFillColor(240, 240, 240);
        pdf.rect(0, currentY, pdf.internal.pageSize.width, 12, 'F');
        pdf.setTextColor(50, 50, 50);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text("PHISHING ATTEMPTS", 20, currentY + 8);
        
        currentY += 15;
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        
        const phishingToDisplay = metrics.phishingAttempts.slice(0, 10);
        phishingToDisplay.forEach((url, index) => {
          const displayUrl = url.length > 50 ? url.substring(0, 47) + "..." : url;
          pdf.text(`• ${displayUrl}`, 25, currentY + (index * 8));
        });
        
        if (metrics.phishingAttempts.length > 10) {
          pdf.text(`• ... and ${metrics.phishingAttempts.length - 10} more`, 25, currentY + (phishingToDisplay.length * 8));
          currentY += (phishingToDisplay.length + 1) * 8;
        } else {
          currentY += phishingToDisplay.length * 8;
        }
        
        currentY += 15;
      }
      
      // MITIGATION TASKS Section
      if (currentY > 210) {
        pdf.addPage();
        currentY = 20;
      }
      
      pdf.setFillColor(240, 240, 240);
      pdf.rect(0, currentY, pdf.internal.pageSize.width, 12, 'F');
      pdf.setTextColor(50, 50, 50);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text("MITIGATION TASKS", 20, currentY + 8);
      
      currentY += 15;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      
      const tasks = metrics.mitigationTasks || [
        "Implement stricter access controls for sensitive data",
        "Provide additional security training for users",
        "Update phishing detection and prevention systems",
        "Monitor unusual data access patterns",
        "Review and update data leak prevention policies"
      ];
      
      tasks.forEach((task, index) => {
        pdf.text(`${index + 1}. ${task}`, 25, currentY + (index * 8));
      });
      
      // Save and download the PDF
      pdf.save("security-threat-report.pdf");
      
      toast({
        title: "Report downloaded",
        description: "Security threat analysis report has been downloaded as PDF",
      });
    } catch (error) {
      console.error("Error generating PDF report:", error);
      toast({
        title: "Download failed",
        description: "There was an error generating the security report",
        variant: "destructive",
      });
    }
  };

  return { handleDownloadReport };
};

export default usePdfReportGenerator;
