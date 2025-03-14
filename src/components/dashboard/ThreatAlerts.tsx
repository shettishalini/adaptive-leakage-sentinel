
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Network, Database, File, User, Download } from "lucide-react";

interface Alert {
  type: string;
  title: string;
  description: string;
  time: string;
  severity: "low" | "medium" | "high";
}

interface ThreatAlertsProps {
  alerts?: Array<Alert>;
  handleDownloadReport: () => void;
}

const ThreatAlerts = ({ alerts, handleDownloadReport }: ThreatAlertsProps) => {
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
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium">Recent Threat Alerts</h3>
        {alerts && alerts.length > 0 && (
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
        {alerts && alerts.length > 0 ? (
          alerts.map((alert, index) => (
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
  );
};

export default ThreatAlerts;
