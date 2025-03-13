import { useState } from "react";
import { Upload, FileText, CheckCircle, XCircle, Shield, Download, Brain, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDataset } from "@/contexts/DatasetContext";
import { generatePDFReport } from "@/utils/pdfGenerator";

const DatasetUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const { toast } = useToast();
  const { setIsDatasetUploaded, setMetrics, processCSVFile, metrics, generateReport } = useDataset();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        toast({
          title: "Invalid file format",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      setUploadSuccess(false);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV dataset file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setIsTraining(true);
    setUploadError(null);
    
    try {
      const metrics = await processCSVFile(file);
      
      setMetrics(metrics);
      setIsDatasetUploaded(true);
      
      setUploadSuccess(true);
      toast({
        title: "Model training and analysis complete",
        description: `Your dataset has been analyzed with ${metrics.modelTrained ? 'trained model' : 'default detection rules'}`,
      });
      
      setTimeout(() => {
        const dashboardElement = document.getElementById('dashboard');
        if (dashboardElement) {
          dashboardElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1000);
    } catch (error) {
      console.error("Error processing CSV file:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setUploadError(errorMessage);
      toast({
        title: "Upload failed",
        description: "There was an error processing your CSV file. Please check the format and try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setIsTraining(false);
    }
  };

  const handleDownloadReport = () => {
    if (!metrics) {
      toast({
        title: "No data available",
        description: "Please upload and analyze a dataset first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const textReport = generateReport();
      if (textReport) {
        const updatedMetrics = { ...metrics, report: textReport };
        
        const doc = generatePDFReport(updatedMetrics);
        
        doc.save('DataLeakageAnalysisReport.pdf');
        
        toast({
          title: "Report downloaded",
          description: "Comprehensive threat analysis report has been saved to your device",
        });
      } else {
        throw new Error("Failed to generate report content");
      }
    } catch (error) {
      console.error("Error generating PDF report:", error);
      toast({
        title: "Report generation failed",
        description: "Unable to generate the comprehensive report PDF",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (!droppedFile.name.toLowerCase().endsWith('.csv')) {
        toast({
          title: "Invalid file format",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }
      
      setFile(droppedFile);
      setUploadSuccess(false);
      setUploadError(null);
    }
  };

  return (
    <section className="py-16 bg-white relative" id="dataset-upload">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Upload Your CSV Dataset for ML-Powered Threat Analysis
          </h2>
          <p className="text-gray-600">
            Our adaptive data leakage detection system automatically trains on your dataset to identify and predict potential threats
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              file ? (uploadError ? "border-red-400" : "border-primary") : "border-gray-200"
            } hover:border-primary transition-colors`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {uploadSuccess ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-green-700">Model Training & Analysis Complete!</h3>
                <p className="text-gray-600 mt-2 mb-4">
                  {metrics?.modelTrained 
                    ? `Model trained with accuracy: ${metrics.accuracy ? (metrics.accuracy * 100).toFixed(2) : 0}%`
                    : 'Dataset analyzed using default detection rules'}
                </p>
                <div className="flex gap-4 mt-2">
                  <Button
                    onClick={handleDownloadReport}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download PDF Report
                  </Button>
                  <Button
                    onClick={() => {
                      setUploadSuccess(false);
                      setUploadError(null);
                    }}
                    variant="outline"
                  >
                    Upload Another File
                  </Button>
                </div>
              </div>
            ) : uploadError ? (
              <div className="flex flex-col items-center">
                <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-red-700">Upload Failed</h3>
                <p className="text-gray-700 mt-2 mb-4">
                  There was an error processing your CSV file. Please ensure it has the expected format.
                </p>
                <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded mb-4 max-w-full overflow-auto">
                  Make sure your CSV has columns for: activity, user, timestamp, data accessed, location, IP address, device, action, and status.
                </p>
                <Button
                  onClick={() => {
                    setUploadError(null);
                    setFile(null);
                  }}
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  id="datasetFile"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="datasetFile"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold">
                    {file ? file.name : "Drag & Drop your CSV dataset here"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 mb-4">
                    {file
                      ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                      : "Upload any CSV containing user activity, network logs, or file access data"}
                  </p>
                  {!file && (
                    <Button variant="outline" className="mt-2">
                      Browse Files
                    </Button>
                  )}
                </label>

                {file && (
                  <div className="mt-6">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg mb-4">
                      <FileText className="h-6 w-6 text-primary" />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          setFile(null);
                        }}
                      >
                        <XCircle className="h-5 w-5 text-gray-400" />
                      </Button>
                    </div>
                    <Button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="w-full"
                    >
                      {isTraining ? (
                        <div className="flex items-center gap-2">
                          <Brain className="animate-pulse h-4 w-4" />
                          Training Model & Analyzing Threats...
                        </div>
                      ) : (
                        "Train Model & Analyze Dataset"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">ML-Powered Threat Detection System</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Brain className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm text-gray-600">Automatically trains a machine learning model on your dataset to predict threats</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm text-gray-600">Identifies unauthorized access, phishing attempts and data exfiltration</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm text-gray-600">Provides model performance metrics including accuracy, precision, and recall</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DatasetUpload;
