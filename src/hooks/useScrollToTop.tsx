
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook that scrolls the page to the top on route change
 * with options for smooth scrolling
 */
export function useScrollToTop(options = { smooth: false }) {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Ensure window exists (for SSR compatibility)
    if (typeof window !== 'undefined') {
      if (options.smooth) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, options.smooth]);
}

export default useScrollToTop;
