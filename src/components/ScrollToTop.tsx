
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that scrolls to top on route change
 * Add this component at the top level of your app
 */
export function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null; // This component doesn't render anything
}

export default ScrollToTop;
