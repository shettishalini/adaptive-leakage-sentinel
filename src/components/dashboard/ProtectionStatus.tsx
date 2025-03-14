
import React from "react";
import { Shield, Database, Network, User } from "lucide-react";

const ProtectionStatus = () => {
  return (
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
  );
};

export default ProtectionStatus;
