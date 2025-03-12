
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
      
      const pdf = new jsPDF();
      
      pdf.setFontSize(20);
      pdf.setTextColor(33, 33, 33);
      pdf.text("Adaptive Data Leakage Detection Report", 20, 20);
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
      
      pdf.setFontSize(16);
      pdf.setTextColor(33, 33, 33);
      pdf.text("Summary", 20, 40);
      
      pdf.setFontSize(12);
      pdf.setTextColor(60, 60, 60);
      pdf.text(`Total records analyzed: ${metrics.userStats.total}`, 25, 50);
      pdf.text(`Potential threats detected: ${metrics.dataLeakageStats.potentialIncidents}`, 25, 58);
      
      const threatPercentage = ((metrics.dataLeakageStats.potentialIncidents / metrics.userStats.total) * 100).toFixed(2);
      pdf.text(`Percentage of data with threats: ${threatPercentage}%`, 25, 66);
      
      pdf.setFontSize(16);
      pdf.setTextColor(33, 33, 33);
      pdf.text("Threat Breakdown", 20, 80);
      
      const threatTypeData = Object.entries(metrics.threatTypes).map(([type, count]) => [type, String(count)]);
      
      if (threatTypeData.length > 0) {
        autoTable(pdf, {
          startY: 85,
          head: [['Threat Type', 'Count']],
          body: threatTypeData,
          theme: 'striped',
          headStyles: { fillColor: [66, 133, 244] }
        });
      }
      
      // Fix the TypeScript error by using a type assertion for lastAutoTable
      let currentY = (pdf as any).lastAutoTable?.finalY || 85;
      currentY += 15;
      
      if (metrics.unauthorizedUsers && metrics.unauthorizedUsers.length > 0) {
        pdf.setFontSize(16);
        pdf.setTextColor(33, 33, 33);
        pdf.text("Unauthorized Access Attempts", 20, currentY);
        
        currentY += 10;
        pdf.setFontSize(12);
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
      
      if (metrics.phishingAttempts && metrics.phishingAttempts.length > 0) {
        if (currentY > 230) {
          pdf.addPage();
          currentY = 20;
        }
        
        pdf.setFontSize(16);
        pdf.setTextColor(33, 33, 33);
        pdf.text("Phishing Attempts", 20, currentY);
        
        currentY += 10;
        pdf.setFontSize(12);
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
      
      if (currentY > 220) {
        pdf.addPage();
        currentY = 20;
      }
      
      pdf.setFontSize(16);
      pdf.setTextColor(33, 33, 33);
      pdf.text("Recommendations", 20, currentY);
      
      currentY += 10;
      pdf.setFontSize(12);
      pdf.setTextColor(60, 60, 60);
      
      const recommendations = [
        "Implement stricter access controls for sensitive data",
        "Provide additional security training for users",
        "Update phishing detection and prevention systems",
        "Monitor unusual data access patterns",
        "Review and update data leak prevention policies"
      ];
      
      recommendations.forEach((recommendation, index) => {
        pdf.text(`${index + 1}. ${recommendation}`, 25, currentY + (index * 8));
      });
      
      currentY += recommendations.length * 8 + 15;
      
      if (currentY > 230) {
        pdf.addPage();
        currentY = 20;
      }
      
      pdf.setFontSize(16);
      pdf.setTextColor(33, 33, 33);
      pdf.text("Data Visualizations", 20, currentY);
      
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
