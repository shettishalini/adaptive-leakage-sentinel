
import { useState } from "react";
import { Upload, FileText, CheckCircle, XCircle, Shield, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDataset } from "@/contexts/DatasetContext";

const DatasetUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { toast } = useToast();
  const { setIsDatasetUploaded, setMetrics, processCSVFile, metrics, generateReport } = useDataset();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if it's a CSV file
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
    
    try {
      // Process the CSV file
      const metrics = await processCSVFile(file);
      
      // Update context with the processed metrics
      setMetrics(metrics);
      setIsDatasetUploaded(true);
      
      setUploadSuccess(true);
      toast({
        title: "Upload successful",
        description: "Your CSV dataset has been analyzed for potential data leaks and threats",
      });
      
      // Scroll to dashboard after successful upload
      setTimeout(() => {
        const dashboardElement = document.getElementById('dashboard');
        if (dashboardElement) {
          dashboardElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1000);
    } catch (error) {
      console.error("Error processing CSV file:", error);
      toast({
        title: "Upload failed",
        description: "There was an error processing your CSV file. Please ensure it's a valid CSV format.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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
    
    // Generate report
    const report = generateReport();
    if (!report) {
      toast({
        title: "Report generation failed",
        description: "Unable to generate a threat analysis report",
        variant: "destructive",
      });
      return;
    }
    
    // Create download
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DataLeakageReport.txt';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Report downloaded",
      description: "Threat analysis report has been saved to your device",
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      // Check if it's a CSV file
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
    }
  };

  return (
    <section className="py-16 bg-white relative" id="dataset-upload">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Upload Your CSV Dataset for Threat Analysis
          </h2>
          <p className="text-gray-600">
            Our adaptive data leakage detection system uses continuous learning to dynamically identify and mitigate threats in real-time
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              file ? "border-primary" : "border-gray-200"
            } hover:border-primary transition-colors`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {uploadSuccess ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-green-700">Threat Analysis Complete!</h3>
                <p className="text-gray-600 mt-2 mb-4">Your dataset has been analyzed for potential data leakage threats</p>
                <div className="flex gap-4 mt-2">
                  <Button
                    onClick={handleDownloadReport}
                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download Report
                  </Button>
                  <Button
                    onClick={() => setUploadSuccess(false)}
                    variant="outline"
                  >
                    Upload Another File
                  </Button>
                </div>
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
                      {uploading ? "Analyzing Threats..." : "Analyze Dataset for Threats"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Advanced Threat Detection System</h3>
            <ul className="space-y-3">
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
                <p className="text-sm text-gray-600">Uses AI to continually learn from new data patterns for improved threat detection</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="h-3 w-3 text-primary" />
                </div>
                <p className="text-sm text-gray-600">Generates comprehensive reports with actionable threat mitigation recommendations</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DatasetUpload;
