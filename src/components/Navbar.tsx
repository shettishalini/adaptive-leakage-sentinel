
import { useState, useEffect } from "react";
import { Shield, Menu, X } from "lucide-react";
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
          ? "py-2 bg-white/80 backdrop-blur-md shadow-sm"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 font-semibold text-lg"
        >
          <Shield className="h-6 w-6 text-primary" />
          <span className={`${isScrolled ? "text-gray-900" : "text-gray-900"}`}>
            SentinelAI
          </span>
        </a>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            Features
          </a>
          <a
            href="#dashboard"
            className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            Dashboard
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            How It Works
          </a>
          <Button
            variant="ghost"
            className="text-sm font-medium hover:bg-primary/10 hover:text-primary"
          >
            Log In
          </Button>
          <Button
            className="text-sm font-medium bg-primary hover:bg-primary/90"
            size="sm"
          >
            Request Demo
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
            className="text-lg font-medium text-gray-900 hover:text-primary transition-colors"
            onClick={toggleMobileMenu}
          >
            Features
          </a>
          <a
            href="#dashboard"
            className="text-lg font-medium text-gray-900 hover:text-primary transition-colors"
            onClick={toggleMobileMenu}
          >
            Dashboard
          </a>
          <a
            href="#how-it-works"
            className="text-lg font-medium text-gray-900 hover:text-primary transition-colors"
            onClick={toggleMobileMenu}
          >
            How It Works
          </a>
          <div className="flex flex-col gap-4 mt-6">
            <Button
              variant="ghost"
              className="w-full justify-center"
              onClick={toggleMobileMenu}
            >
              Log In
            </Button>
            <Button
              className="w-full justify-center"
              onClick={toggleMobileMenu}
            >
              Request Demo
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
