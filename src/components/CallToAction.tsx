
import { useState, useEffect } from "react";
import { ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("cta");
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

  return (
    <section id="cta" className="py-20 bg-green-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-100/50 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div
          className={`glass rounded-2xl border border-green-100/30 shadow-xl p-8 md:p-12 max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-20"
          }`}
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Analyzing Your Data?
              </h2>
              <p className="text-gray-600 mb-6">
                Our adaptive system evolves as it learns from your data, providing increasingly accurate
                insights over time. Upload your dataset now to begin exploring patterns and trends.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 h-auto rounded-md shadow-md shadow-green-200"
                  onClick={() => document.getElementById('dataset-upload')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Upload Dataset
                </Button>
                <Button
                  variant="outline"
                  className="bg-white border-gray-200 hover:bg-gray-50 px-8 py-6 h-auto rounded-md"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn How It Works
                </Button>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4">Supported File Types</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">.csv</span>
                    </div>
                    <span>CSV files (Comma Separated Values)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                      <span className="text-green-600 font-medium">.xlsx</span>
                    </div>
                    <span>Excel spreadsheets</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                      <span className="text-amber-600 font-medium">.json</span>
                    </div>
                    <span>JSON data files</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                      <span className="text-purple-600 font-medium">.txt</span>
                    </div>
                    <span>Plain text files</span>
                  </li>
                  <li className="flex items-center gap-3 text-center">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 h-auto rounded-md flex items-center justify-center gap-2"
                      onClick={() => document.getElementById('dataset-upload')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Start Uploading <ArrowRight className="h-4 w-4" />
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
