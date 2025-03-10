
import { useState, useEffect } from "react";
import { Line, Bar, Pie } from "recharts";
import {
  Shield,
  AlertTriangle,
  Database,
  Network,
  Lock,
  User,
  Search,
} from "lucide-react";

const Dashboard = () => {
  const [isVisible, setIsVisible] = useState(false);

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

  const networkData = [
    { name: "Mon", Traffic: 120, Alerts: 20 },
    { name: "Tue", Traffic: 180, Alerts: 10 },
    { name: "Wed", Traffic: 200, Alerts: 15 },
    { name: "Thu", Traffic: 150, Alerts: 8 },
    { name: "Fri", Traffic: 220, Alerts: 25 },
    { name: "Sat", Traffic: 90, Alerts: 5 },
    { name: "Sun", Traffic: 75, Alerts: 2 },
  ];

  const anomalyDistribution = [
    { name: "Network", value: 45 },
    { name: "File Access", value: 30 },
    { name: "User Behavior", value: 15 },
    { name: "Database", value: 10 },
  ];

  return (
    <section
      id="dashboard"
      className="py-20 bg-gray-50 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-2/3 h-full bg-blue-50 opacity-50 transform -skew-x-12" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-50 border border-blue-100 mb-4">
            <p className="text-xs font-medium text-blue-700">Intelligent Monitoring</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Comprehensive Security Dashboard
          </h2>
          <p className="text-gray-600">
            Visualize your organization's security status with our intuitive dashboard,
            providing real-time insights into potential data leakage threats.
          </p>
        </div>

        <div
          className={`glass rounded-2xl border border-gray-100 shadow-xl p-6 md:p-8 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-20"
          }`}
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium">System Status</h3>
                  <div className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span>Operational</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="text-sm font-medium mb-1">Protection</h4>
                    <p className="text-xs text-green-600">Active</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Database className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="text-sm font-medium mb-1">Database</h4>
                    <p className="text-xs text-green-600">Secure</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Network className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="text-sm font-medium mb-1">Network</h4>
                    <p className="text-xs text-green-600">Monitored</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="text-sm font-medium mb-1">Users</h4>
                    <p className="text-xs text-green-600">Tracked</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-medium mb-6">Recent Alerts</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">Large File Upload</h4>
                        <span className="text-xs text-gray-500">5m ago</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        User john.doe@example.com uploaded a 250MB file to an external service
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Database className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">Database Query</h4>
                        <span className="text-xs text-gray-500">15m ago</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Unusual query pattern accessing customer PII data from Marketing department
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <Network className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <div className="flex justify-between">
                        <h4 className="font-medium text-sm">Suspicious Connection</h4>
                        <span className="text-xs text-gray-500">32m ago</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Connection to unrecognized IP address detected from developer workstation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-white rounded-xl p-6 shadow-sm h-full">
                <h3 className="font-medium mb-6">System Analytics</h3>

                <div className="flex flex-col gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Network Traffic & Alerts</h4>
                    <div className="h-[180px] w-full">
                      {/* This is a placeholder for the chart that would be rendered by recharts */}
                      <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                        <p className="text-sm text-gray-500">Network Traffic Chart</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">Anomaly Distribution</h4>
                    <div className="h-[180px] w-full">
                      {/* This is a placeholder for the chart that would be rendered by recharts */}
                      <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                        <p className="text-sm text-gray-500">Anomaly Distribution Chart</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Threats Detected</h4>
                      <div className="flex items-end gap-2">
                        <p className="text-2xl font-bold">37</p>
                        <p className="text-xs text-red-500">+12% vs prev week</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium mb-2">Threats Mitigated</h4>
                      <div className="flex items-end gap-2">
                        <p className="text-2xl font-bold">35</p>
                        <p className="text-xs text-green-500">94.5% success rate</p>
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
