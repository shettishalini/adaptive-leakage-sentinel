
import { useState } from "react";
import { Upload, FileText, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const DatasetUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadSuccess(false);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a dataset file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
      setFile(null);
      
      toast({
        title: "Upload successful",
        description: "Your dataset has been uploaded successfully",
      });
    }, 2000);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setUploadSuccess(false);
    }
  };

  return (
    <section className="py-16 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Upload Your Dataset
          </h2>
          <p className="text-gray-600">
            Securely upload your dataset files for analysis and protection
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
                <h3 className="text-xl font-semibold text-green-700">Upload Complete!</h3>
                <p className="text-gray-600 mt-2 mb-4">Your dataset has been uploaded successfully</p>
                <Button
                  onClick={() => setUploadSuccess(false)}
                  className="mt-2"
                  variant="outline"
                >
                  Upload Another File
                </Button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  id="datasetFile"
                  className="hidden"
                  accept=".csv,.xlsx,.json,.xml"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="datasetFile"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold">
                    {file ? file.name : "Drag & Drop your dataset here"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 mb-4">
                    {file
                      ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                      : "Supported formats: CSV, XLSX, JSON, XML"}
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
                      {uploading ? "Uploading..." : "Upload Dataset"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">How it works</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <p className="text-sm text-gray-600">Upload your dataset in any of the supported formats</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <p className="text-sm text-gray-600">Our system will analyze the data for potential security threats</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <p className="text-sm text-gray-600">View detailed reports and recommendations for protecting your data</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DatasetUpload;
