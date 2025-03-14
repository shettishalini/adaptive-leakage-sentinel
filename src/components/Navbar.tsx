
import { useState, useEffect } from "react";
import { Menu, X, Shield, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "py-2 bg-white/90 backdrop-blur-md shadow-sm"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 font-semibold text-lg"
        >
          {/* Updated Logo */}
          <Shield 
            className="h-7 w-7 text-green-600 fill-green-100" 
          />
          <span className="text-gray-900 font-bold">
            DataGuardAI
          </span>
        </a>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#features"
            className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
          >
            Features
          </a>
          <a
            href="#dashboard"
            className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
          >
            Dashboard
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
          >
            How It Works
          </a>
          <Button
            onClick={() => document.getElementById('dataset-upload')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm font-medium bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            Upload Dataset
          </Button>
        </nav>

        {/* Mobile menu button */}
        <button
          className="block md:hidden text-gray-700"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 bg-white z-40 pt-20 px-6 flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <nav className="flex flex-col gap-6">
          <a
            href="#features"
            className="text-lg font-medium text-gray-900 hover:text-green-600 transition-colors"
            onClick={toggleMobileMenu}
          >
            Features
          </a>
          <a
            href="#dashboard"
            className="text-lg font-medium text-gray-900 hover:text-green-600 transition-colors"
            onClick={toggleMobileMenu}
          >
            Dashboard
          </a>
          <a
            href="#how-it-works"
            className="text-lg font-medium text-gray-900 hover:text-green-600 transition-colors"
            onClick={toggleMobileMenu}
          >
            How It Works
          </a>
          <div className="flex flex-col gap-4 mt-6">
            <Button
              className="w-full justify-center bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                document.getElementById('dataset-upload')?.scrollIntoView({ behavior: 'smooth' });
                toggleMobileMenu();
              }}
            >
              Upload Dataset
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
