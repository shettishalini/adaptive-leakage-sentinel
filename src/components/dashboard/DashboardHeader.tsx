
import React from "react";
import { CheckCircle, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDataset } from "@/contexts/DatasetContext";

interface DashboardHeaderProps {
  handleDownloadReport: () => void;
  isDatasetUploaded: boolean;
  lastUpdated: Date | null;
}

const DashboardHeader = ({ handleDownloadReport, isDatasetUploaded, lastUpdated }: DashboardHeaderProps) => {
  return (
    <>
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

      {isDatasetUploaded && lastUpdated && (
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
    </>
  );
};

export default DashboardHeader;
