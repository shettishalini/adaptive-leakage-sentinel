
import React from "react";
import { Shield, FileWarning, Users } from "lucide-react";

interface StatCardsProps {
  userStats: {
    total: number;
    active: number;
    new: number;
    unapproved: number;
  };
  dataLeakageStats: {
    potentialIncidents: number;
    criticalRisk: number;
    mediumRisk: number;
    lowRisk: number;
    mitigated: number;
  };
}

const StatCards = ({ userStats, dataLeakageStats }: StatCardsProps) => {
  return (
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
              <p className="text-xs font-medium text-amber-800">Top threat: Phishing</p>
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
  );
};

export default StatCards;
