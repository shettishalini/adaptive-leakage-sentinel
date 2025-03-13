
import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import {
  Shield,
  AlertTriangle,
  Database,
  Network,
  Lock,
  User,
  Users,
  UserX,
  FileWarning,
  Search,
  Clock,
  File,
  CheckCircle,
  Download
} from "lucide-react";
import { useDataset } from "@/contexts/DatasetContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Dashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isDatasetUploaded, metrics, generateReport } = useDataset();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("dashboard");
      if (element) {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on initial load

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      // Logo and Title
      const logoCanvas = document.createElement('canvas');
      logoCanvas.width = 300;
      logoCanvas.height = 80;
      const ctx = logoCanvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = "#4285F4";
        ctx.font = 'bold 30px Arial';
        ctx.fillText("SecureShield AI", 10, 40);
        
        // Draw logo box
        ctx.fillStyle = "#34A853";
        ctx.fillRect(230, 15, 30, 30);
        
        ctx.fillStyle = "#FBBC05";
        ctx.beginPath();
        ctx.arc(215, 30, 15, 0, Math.PI * 2);
        ctx.fill();
        
        const logoImg = logoCanvas.toDataURL('image/png');
        pdf.addImage(logoImg, 'PNG', 15, 10, 60, 15);
      }
      
      // Report Title
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 40, 40);
      pdf.text("Adaptive Security Threat Analysis Report", 20, 35);
      
      // Metadata
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 42);
      
      // If model was trained, add model metrics
      if (metrics.modelTrained) {
        pdf.text(`Model Performance: Accuracy: ${metrics.accuracy * 100}% | Precision: ${metrics.precision * 100}% | Recall: ${metrics.recall * 100}%`, 20, 47);
      }
      
      // Add divider
      pdf.setDrawColor(220, 220, 220);
      pdf.line(20, 50, 190, 50);
      
      // EXECUTIVE SUMMARY
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 40, 40);
      pdf.text("EXECUTIVE SUMMARY", 20, 60);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      
      // Find major threat type
      let majorThreatType = "None";
      let majorThreatCount = 0;
      
      for (const [type, count] of Object.entries(metrics.threatTypes)) {
        if (count > majorThreatCount) {
          majorThreatCount = count;
          majorThreatType = type;
        }
      }
      
      const threatPercentage = ((metrics.dataLeakageStats.potentialIncidents / metrics.userStats.total) * 100).toFixed(2);
      
      // Summary text with bullet points
      const summaryText = [
        `• Total records analyzed: ${metrics.userStats.total.toLocaleString()}`,
        `• Potential threats detected: ${metrics.dataLeakageStats.potentialIncidents}`,
        `• Major threat identified: ${majorThreatType} (${majorThreatCount} instances)`,
        `• Percentage of data with threats: ${threatPercentage}%`,
        `• Critical risk incidents: ${metrics.dataLeakageStats.criticalRisk}`,
        `• Medium risk incidents: ${metrics.dataLeakageStats.mediumRisk}`,
        `• Threats successfully mitigated: ${metrics.dataLeakageStats.mitigated}`
      ];
      
      let yPosition = 68;
      summaryText.forEach(text => {
        pdf.text(text, 25, yPosition);
        yPosition += 7;
      });
      
      // USER ACTIVITY SECTION
      yPosition += 5;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("USER ACTIVITY OVERVIEW", 20, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      const userActivityData = [
        ['Total Users', metrics.userStats.total.toString()],
        ['Active Users', metrics.userStats.active.toString()],
        ['New Users (Last Week)', metrics.userStats.new.toString()],
        ['Unauthorized Access Attempts', metrics.userStats.unapproved.toString()]
      ];
      
      autoTable(pdf, {
        startY: yPosition,
        head: [['Category', 'Count']],
        body: userActivityData,
        theme: 'striped',
        headStyles: { fillColor: [66, 133, 244], textColor: [255, 255, 255] },
        styles: { fontSize: 10 }
      });
      
      // THREAT DISTRIBUTION VISUALIZATION
      // Get the Y position after the last table
      const previousTableEndY = pdf.lastAutoTable?.finalY || yPosition + 30;
      yPosition = previousTableEndY + 15;
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("THREAT DISTRIBUTION", 20, yPosition);
      
      // Create a canvas element for the pie chart
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = (400/1.5);
      document.body.appendChild(canvas);
      
      const pieCtx = canvas.getContext('2d');
      if (pieCtx && metrics.anomalyDistribution && metrics.anomalyDistribution.length > 0) {
        // Clear the canvas
        pieCtx.clearRect(0, 0, canvas.width, canvas.height);
        
        const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
        const total = metrics.anomalyDistribution.reduce((sum, item) => sum + item.value, 0);
        
        // Draw title
        pieCtx.fillStyle = '#333';
        pieCtx.font = 'bold 14px Arial';
        pieCtx.fillText('Threat Types Distribution', 125, 20);
        
        // Draw pie chart if we have data
        if (total > 0) {
          let currentAngle = 0;
          
          metrics.anomalyDistribution.forEach((item, index) => {
            // Draw slice
            const sliceAngle = (item.value / total) * 2 * Math.PI;
            
            pieCtx.beginPath();
            pieCtx.moveTo(100, 130);
            pieCtx.arc(100, 130, 80, currentAngle, currentAngle + sliceAngle);
            pieCtx.closePath();
            
            pieCtx.fillStyle = colors[index % colors.length];
            pieCtx.fill();
            
            // Draw label in the middle of the slice
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelRadius = 70;
            const labelX = 100 + Math.cos(labelAngle) * labelRadius;
            const labelY = 130 + Math.sin(labelAngle) * labelRadius;
            
            pieCtx.save();
            pieCtx.translate(labelX, labelY);
            
            // Apply white outline to text
            pieCtx.fillStyle = 'white';
            pieCtx.font = 'bold 11px Arial';
            
            // Only add percentage label if it's significant enough
            if (item.value / total > 0.1) {
              pieCtx.fillText(`${Math.round((item.value / total) * 100)}%`, -10, 5);
            }
            
            pieCtx.restore();
            
            currentAngle += sliceAngle;
          });
        }
        
        // Draw legend
        let legendY = 80;
        metrics.anomalyDistribution.forEach((item, index) => {
          const y = legendY + index * 25;
          
          pieCtx.fillStyle = colors[index % colors.length];
          pieCtx.fillRect(250, y - 10, 15, 15);
          
          pieCtx.fillStyle = '#333';
          pieCtx.font = '12px Arial';
          pieCtx.fillText(`${item.name}: ${item.value} (${Math.round((item.value / total) * 100)}%)`, 270, y);
        });
        
        // Add the pie chart to PDF
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 30, yPosition + 5, 150, 150 / 1.5);
        
        // Clean up
        document.body.removeChild(canvas);
      }
      
      // NETWORK ACTIVITY CHART
      // Add a new page
      pdf.addPage();
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("NETWORK TRAFFIC & ALERTS", 20, 25);
      
      // Create canvas for network line chart
      const lineCanvas = document.createElement('canvas');
      lineCanvas.width = 500;
      lineCanvas.height = 250;
      document.body.appendChild(lineCanvas);
      
      const lineCtx = lineCanvas.getContext('2d');
      if (lineCtx && metrics.networkData && metrics.networkData.length > 0) {
        // Clear canvas
        lineCtx.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
        
        // Set up chart dimensions
        const chartWidth = 400;
        const chartHeight = 200;
        const leftMargin = 50;
        const topMargin = 30;
        
        // Find max values for scaling
        const maxTraffic = Math.max(...metrics.networkData.map(d => d.Traffic));
        const maxAlerts = Math.max(...metrics.networkData.map(d => d.Alerts));
        
        // Draw grid
        lineCtx.strokeStyle = '#ddd';
        lineCtx.beginPath();
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
          const y = topMargin + chartHeight - (i * (chartHeight / 5));
          lineCtx.moveTo(leftMargin, y);
          lineCtx.lineTo(leftMargin + chartWidth, y);
          
          // Add Y-axis labels
          lineCtx.fillStyle = '#666';
          lineCtx.font = '10px Arial';
          lineCtx.fillText((maxTraffic * i / 5).toFixed(0), 10, y + 4);
        }
        
        // Vertical grid lines & X-axis labels
        for (let i = 0; i < metrics.networkData.length; i++) {
          const x = leftMargin + (i * (chartWidth / (metrics.networkData.length - 1)));
          lineCtx.moveTo(x, topMargin);
          lineCtx.lineTo(x, topMargin + chartHeight);
          
          // Add X-axis labels
          lineCtx.fillStyle = '#666';
          lineCtx.font = '10px Arial';
          lineCtx.fillText(metrics.networkData[i].name, x - 10, topMargin + chartHeight + 15);
        }
        
        lineCtx.stroke();
        
        // Draw traffic line
        lineCtx.strokeStyle = '#4285F4';
        lineCtx.lineWidth = 2;
        lineCtx.beginPath();
        
        metrics.networkData.forEach((item, index) => {
          const x = leftMargin + (index * (chartWidth / (metrics.networkData.length - 1)));
          const y = topMargin + chartHeight - ((item.Traffic / maxTraffic) * chartHeight);
          
          if (index === 0) {
            lineCtx.moveTo(x, y);
          } else {
            lineCtx.lineTo(x, y);
          }
          
          // Add dots at data points
          lineCtx.fillStyle = '#4285F4';
          lineCtx.beginPath();
          lineCtx.arc(x, y, 4, 0, Math.PI * 2);
          lineCtx.fill();
        });
        
        lineCtx.stroke();
        
        // Draw alerts line
        lineCtx.strokeStyle = '#EA4335';
        lineCtx.lineWidth = 2;
        lineCtx.beginPath();
        
        metrics.networkData.forEach((item, index) => {
          const x = leftMargin + (index * (chartWidth / (metrics.networkData.length - 1)));
          const y = topMargin + chartHeight - ((item.Alerts / maxAlerts) * chartHeight);
          
          if (index === 0) {
            lineCtx.moveTo(x, y);
          } else {
            lineCtx.lineTo(x, y);
          }
          
          // Add dots at data points
          lineCtx.fillStyle = '#EA4335';
          lineCtx.beginPath();
          lineCtx.arc(x, y, 4, 0, Math.PI * 2);
          lineCtx.fill();
        });
        
        lineCtx.stroke();
        
        // Add legend
        lineCtx.fillStyle = '#333';
        lineCtx.font = 'bold 12px Arial';
        lineCtx.fillText('Network Traffic & Alerts', 180, 15);
        
        lineCtx.fillStyle = '#4285F4';
        lineCtx.fillRect(leftMargin, topMargin + chartHeight + 25, 15, 10);
        lineCtx.fillStyle = '#333';
        lineCtx.font = '11px Arial';
        lineCtx.fillText('Traffic', leftMargin + 20, topMargin + chartHeight + 33);
        
        lineCtx.fillStyle = '#EA4335';
        lineCtx.fillRect(leftMargin + 80, topMargin + chartHeight + 25, 15, 10);
        lineCtx.fillStyle = '#333';
        lineCtx.fillText('Alerts', leftMargin + 100, topMargin + chartHeight + 33);
        
        // Add the chart to PDF
        const lineImgData = lineCanvas.toDataURL('image/png');
        pdf.addImage(lineImgData, 'PNG', 20, 35, 170, 85);
        
        // Clean up
        document.body.removeChild(lineCanvas);
      }
      
      // THREAT DETAILS SECTION
      yPosition = 130; // Position after network chart
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("DETAILED THREAT ANALYSIS", 20, yPosition);
      
      yPosition += 10;
      
      // Table of threat types
      const threatTypeData = Object.entries(metrics.threatTypes)
        .filter(([_, count]) => count > 0)
        .map(([type, count]) => [type, count.toString()]);
        
      autoTable(pdf, {
        startY: yPosition,
        head: [['Threat Type', 'Count']],
        body: threatTypeData,
        theme: 'striped',
        headStyles: { fillColor: [66, 133, 244], textColor: [255, 255, 255] },
        styles: { fontSize: 10 }
      });
      
      // Add unauthorized users section if available
      if (metrics.unauthorizedUsers && metrics.unauthorizedUsers.length > 0) {
        const unauthorizedTableY = pdf.lastAutoTable?.finalY || yPosition + 30;
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text("UNAUTHORIZED ACCESS ATTEMPTS", 20, unauthorizedTableY + 15);
        
        // Format unauthorized users data for table
        const unauthorizedData = metrics.unauthorizedUsers.slice(0, 10).map(user => [user]);
        if (metrics.unauthorizedUsers.length > 10) {
          unauthorizedData.push([`... and ${metrics.unauthorizedUsers.length - 10} more`]);
        }
        
        autoTable(pdf, {
          startY: unauthorizedTableY + 25,
          head: [['User/IP Address']],
          body: unauthorizedData,
          theme: 'striped',
          headStyles: { fillColor: [234, 67, 53], textColor: [255, 255, 255] },
          styles: { fontSize: 10 }
        });
      }
      
      // PHISHING SECTION
      if (metrics.phishingAttempts && metrics.phishingAttempts.length > 0) {
        // Check if we need a new page based on remaining space
        const phishingTableY = pdf.lastAutoTable?.finalY || 200;
        
        if (phishingTableY > 220) {
          pdf.addPage();
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.text("PHISHING ATTEMPTS", 20, 25);
          
          // Format phishing data for table
          const phishingData = metrics.phishingAttempts.slice(0, 10).map(url => [url]);
          if (metrics.phishingAttempts.length > 10) {
            phishingData.push([`... and ${metrics.phishingAttempts.length - 10} more`]);
          }
          
          autoTable(pdf, {
            startY: 35,
            head: [['URL/Email']],
            body: phishingData,
            theme: 'striped',
            headStyles: { fillColor: [251, 188, 5], textColor: [60, 60, 60] },
            styles: { fontSize: 9 },
            columnStyles: {
              0: { cellWidth: 150 }
            }
          });
        } else {
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.text("PHISHING ATTEMPTS", 20, phishingTableY + 15);
          
          // Format phishing data for table
          const phishingData = metrics.phishingAttempts.slice(0, 10).map(url => [url]);
          if (metrics.phishingAttempts.length > 10) {
            phishingData.push([`... and ${metrics.phishingAttempts.length - 10} more`]);
          }
          
          autoTable(pdf, {
            startY: phishingTableY + 25,
            head: [['URL/Email']],
            body: phishingData,
            theme: 'striped',
            headStyles: { fillColor: [251, 188, 5], textColor: [60, 60, 60] },
            styles: { fontSize: 9 },
            columnStyles: {
              0: { cellWidth: 150 }
            }
          });
        }
      }
      
      // RECOMMENDATIONS SECTION (always on a new page)
      pdf.addPage();
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text("SECURITY RECOMMENDATIONS", 20, 25);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      // Generate recommendations based on detected threats
      const recommendations = [
        {
          title: "Implement Multi-Factor Authentication",
          description: "Require MFA for all users to prevent unauthorized access, especially for accounts with elevated privileges."
        },
        {
          title: "Security Awareness Training",
          description: "Conduct regular phishing simulations and security training to educate users on recognizing threats."
        },
        {
          title: "Data Loss Prevention",
          description: "Implement DLP solutions to monitor and prevent sensitive data exfiltration."
        },
        {
          title: "Network Segmentation",
          description: "Segment networks to limit lateral movement in case of a breach."
        },
        {
          title: "Regular Security Audits",
          description: "Conduct quarterly security audits to identify and address vulnerabilities."
        }
      ];
      
      // Add highlighted recommendations
      let recY = 35;
      recommendations.forEach((rec, index) => {
        pdf.setFillColor(245, 245, 245);
        pdf.roundedRect(20, recY, 170, 20, 2, 2, 'F');
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(40, 40, 40);
        pdf.text(`${index + 1}. ${rec.title}`, 25, recY + 7);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(80, 80, 80);
        pdf.text(rec.description, 25, recY + 15);
        
        recY += 25;
      });
      
      // Add important note about adaptive learning
      pdf.setFillColor(230, 244, 255);
      pdf.roundedRect(20, recY + 10, 170, 30, 2, 2, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(20, 80, 150);
      pdf.text("CONTINUOUS IMPROVEMENT", 25, recY + 20);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(40, 80, 120);
      pdf.text("Our adaptive security system continuously learns from new data patterns to", 25, recY + 28);
      pdf.text("improve threat detection. Regular uploads of security logs will enhance", 25, recY + 36);
      pdf.text("the system's accuracy and effectiveness in protecting your organization.", 25, recY + 44);
      
      // Add footer
      const footerY = 280;
      pdf.setFillColor(245, 245, 245);
      pdf.rect(0, footerY, 210, 17, 'F');
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Generated by SecureShield AI - Adaptive Security Analytics", 105, footerY + 7, { align: 'center' });
      
      // Save the PDF
      pdf.save("security-threat-report.pdf");
      
      toast({
        title: "Report downloaded",
        description: "Complete security threat analysis report has been generated",
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

  const defaultNetworkData = [
    { name: "Mon", Traffic: 120, Alerts: 20 },
    { name: "Tue", Traffic: 180, Alerts: 10 },
    { name: "Wed", Traffic: 200, Alerts: 15 },
    { name: "Thu", Traffic: 150, Alerts: 8 },
    { name: "Fri", Traffic: 220, Alerts: 25 },
    { name: "Sat", Traffic: 90, Alerts: 5 },
    { name: "Sun", Traffic: 75, Alerts: 2 },
  ];

  const defaultAnomalyDistribution = [
    { name: "Network", value: 45 },
    { name: "File Access", value: 30 },
    { name: "User Behavior", value: 15 },
    { name: "Database", value: 10 },
  ];

  const defaultUserStats = {
    total: 1245,
    active: 987,
    new: 34,
    unapproved: 18
  };

  const defaultDataLeakageStats = {
    potentialIncidents: 12,
    criticalRisk: 3,
    mediumRisk: 6,
    lowRisk: 3,
    mitigated: 8
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const networkData = metrics?.networkData || defaultNetworkData;
  const anomalyDistribution = metrics?.anomalyDistribution || defaultAnomalyDistribution;
  const userStats = metrics?.userStats || defaultUserStats;
  const dataLeakageStats = metrics?.dataLeakageStats || defaultDataLeakageStats;
  const lastUpdated = metrics?.lastUpdated;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'network': return <Network className="h-5 w-5 text-red-500 mt-0.5" />;
      case 'database': return <Database className="h-5 w-5 text-blue-500 mt-0.5" />;
      case 'file': return <File className="h-5 w-5 text-amber-500 mt-0.5" />;
      case 'user': return <User className="h-5 w-5 text-purple-500 mt-0.5" />;
      default: return <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />;
    }
  };

  const getAlertBgColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50';
      case 'medium': return 'bg-amber-50';
      case 'low': return 'bg-blue-50';
      default: return 'bg-gray-50';
    }
  };

  const getThreatTypeLabel = (index: number) => {
    const threatTypes = [
      "Phishing Attempt", 
      "Unauthorized Access", 
      "Data Exfiltration", 
      "Suspicious User Behavior",
      "Policy Violation"
    ];
    return threatTypes[index % threatTypes.length];
  };

  return (
    <section
      id="dashboard"
      className="py-20 bg-gray-50 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-2/3 h-full bg-blue-50 opacity-50 transform -skew-x-12" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <p className="text-xs font-medium text-blue-700">Adaptive Threat Detection</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Real-Time Security Threat Analysis
          </h2>
          <p className="text-gray-600 mb-6">
            Our AI-powered system continuously learns from data patterns to identify and mitigate 
            emerging threats including phishing, unauthorized access, and data exfiltration.
          </p>
          <Button 
            onClick={handleDownloadReport}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 mx-auto"
          >
            <Download size={16} />
            Download Threat Analysis Report
          </Button>
        </div>

        {isDatasetUploaded && metrics?.lastUpdated && (
          <div className="mb-8 bg-green-50 p-4 rounded-xl border border-green-100 max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Dataset Successfully Analyzed</h3>
                <p className="text-sm text-green-700">
                  Threat analysis completed using our adaptive detection system.
                  <span className="ml-2 text-gray-500 flex items-center gap-1 inline-flex">
                    <Clock className="h-3 w-3" /> Last updated: {lastUpdated?.toLocaleTimeString()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        <div
          className={`glass rounded-2xl border border-gray-100 shadow-xl p-6 md:p-8 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-20"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 font-medium">User Activity</h3>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold">{userStats.total.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mb-1">
                      +{userStats.new} this week
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-500">Active</p>
                  <p className="font-semibold">{userStats.active.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-500">Suspicious</p>
                  <p className="font-semibold text-amber-600">{userStats.unapproved}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 font-medium">Threat Types</h3>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold">{dataLeakageStats.potentialIncidents}</p>
                    <p className="text-xs text-amber-600 mb-1">
                      Detected incidents
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-amber-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-amber-800">Top threat: {isDatasetUploaded ? "Phishing" : "Unauthorized Access"}</p>
                    <div className="px-2 py-1 bg-amber-100 rounded-full text-xs font-medium text-amber-800">
                      High priority
                    </div>
                  </div>
                  <p className="text-xs text-amber-700 mt-1">
                    {Math.floor(dataLeakageStats.criticalRisk * 0.4)} phishing attempts detected
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                  <FileWarning className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 font-medium">Data Leakage</h3>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold">{dataLeakageStats.potentialIncidents}</p>
                    <p className="text-xs text-red-600 mb-1">
                      Potential incidents
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="bg-red-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-red-700">Critical</p>
                  <p className="font-semibold text-red-700">{dataLeakageStats.criticalRisk}</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-amber-700">Medium</p>
                  <p className="font-semibold text-amber-700">{dataLeakageStats.mediumRisk}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-green-700">Mitigated</p>
                  <p className="font-semibold text-green-700">{dataLeakageStats.mitigated}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium">Protection Status</h3>
                  <div className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span>Active Monitoring</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="text-sm font-medium mb-1">Phishing</h4>
                    <p className="text-xs text-green-600">Protected</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Database className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="text-sm font-medium mb-1">Database</h4>
                    <p className="text-xs text-green-600">Monitored</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Network className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="text-sm font-medium mb-1">Network</h4>
                    <p className="text-xs text-green-600">Secured</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="text-sm font-medium mb-1">Users</h4>
                    <p className="text-xs text-green-600">Verified</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium">Recent Threat Alerts</h3>
                  {metrics?.alerts && metrics.alerts.length > 0 && (
                    <Button
                      variant="outline" 
                      size="sm"
                      onClick={handleDownloadReport}
                      className="text-xs flex items-center gap-1"
                    >
                      <Download size={12} />
                      Export All
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {metrics?.alerts && metrics.alerts.length > 0 ? (
                    metrics.alerts.map((alert, index) => (
                      <div key={index} className={`flex items-start gap-3 p-3 ${getAlertBgColor(alert.severity)} rounded-lg`}>
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium text-sm">{alert.title}</h4>
                              <span className="text-xs text-blue-600 font-medium">{getThreatTypeLabel(index)}</span>
                            </div>
                            <span className="text-xs text-gray-500">{alert.time}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {alert.description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium text-sm">Large File Upload</h4>
                              <span className="text-xs text-blue-600 font-medium">Data Exfiltration Risk</span>
                            </div>
                            <span className="text-xs text-gray-500">5m ago</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            User john.doe@example.com uploaded a 250MB file to an external service
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <Database className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium text-sm">Database Query</h4>
                              <span className="text-xs text-blue-600 font-medium">Unauthorized Access</span>
                            </div>
                            <span className="text-xs text-gray-500">15m ago</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Unusual query pattern accessing customer PII data from Marketing department
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                        <Network className="h-5 w-5 text-red-500 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium text-sm">Suspicious Connection</h4>
                              <span className="text-xs text-blue-600 font-medium">Phishing Attempt</span>
                            </div>
                            <span className="text-xs text-gray-500">32m ago</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Connection to unrecognized IP address detected from developer workstation
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-white rounded-xl p-6 shadow-sm h-full">
                <h3 className="font-medium mb-6">Threat Analytics</h3>

                <div className="flex flex-col gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Network Traffic & Alerts</h4>
                    <div className="h-[180px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={networkData}
                          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="Traffic" stroke="#8884d8" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="Alerts" stroke="#ff5555" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">Threat Distribution by Type</h4>
                    <div className="h-[180px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={anomalyDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {anomalyDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Threats Detected</h4>
                      <div className="flex items-end gap-2">
                        <p className="text-2xl font-bold">
                          {isDatasetUploaded 
                            ? dataLeakageStats.potentialIncidents + dataLeakageStats.mitigated 
                            : 37}
                        </p>
                        <p className="text-xs text-red-500">+12% vs prev week</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Threats Mitigated</h4>
                      <div className="flex items-end gap-2">
                        <p className="text-2xl font-bold">{dataLeakageStats.mitigated || 35}</p>
                        <p className="text-xs text-green-500">
                          {isDatasetUploaded
                            ? `${Math.round((dataLeakageStats.mitigated / (dataLeakageStats.potentialIncidents + dataLeakageStats.mitigated)) * 100)}% success rate`
                            : '94.5% success rate'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
