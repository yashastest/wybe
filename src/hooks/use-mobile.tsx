
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false)

  React.useEffect(() => {
    function checkMobile() {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobile)
      if (!isInitialized) {
        setIsInitialized(true)
      }
    }
    
    // Initial check
    checkMobile()
    
    // Set up listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Modern approach with addEventListener
    if (mql.addEventListener) {
      mql.addEventListener("change", checkMobile)
      return () => mql.removeEventListener("change", checkMobile)
    } 
    // Fallback for older browsers
    else {
      // @ts-ignore - older browsers support
      mql.addListener(checkMobile)
      return () => {
        // @ts-ignore - older browsers support
        mql.removeListener(checkMobile)
      }
    }
  }, [isInitialized])

  return isMobile
}

// This ensures client-side CSS is added for scrollbar hiding
if (typeof window !== 'undefined') {
  if (!document.getElementById('mobile-styles')) {
    const style = document.createElement('style')
    style.id = 'mobile-styles'
    style.textContent = `
      /* Hide scrollbar for Chrome, Safari and Opera */
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      
      /* Hide scrollbar for IE, Edge and Firefox */
      .hide-scrollbar {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
      }
      
      /* Extra small font size */
      .text-xxs {
        font-size: 0.65rem;
        line-height: 0.9rem;
      }
      
      /* Mobile-friendly focus states */
      @media (max-width: 767px) {
        button:focus, a:focus, input:focus, select:focus, textarea:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.5);
        }
      }
    `
    document.head.appendChild(style)
  }
}
