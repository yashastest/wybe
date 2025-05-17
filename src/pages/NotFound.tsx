
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  // Use our scroll to top hook
  useScrollToTop();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <motion.div 
        className="flex-grow flex items-center justify-center p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-indigo-400 to-blue-500 bg-clip-text text-transparent">404</h1>
          <p className="text-2xl text-gray-300 mb-6">Oops! Page not found</p>
          <p className="text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="bg-wybe-primary hover:bg-wybe-primary/90">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default NotFound;
