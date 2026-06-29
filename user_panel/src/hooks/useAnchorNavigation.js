import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Custom React hook to manage global hash-based smooth scrolling,
 * including cross-page anchor routing, dynamic header offsets,
 * focus/accessibility management, and MutationObserver synchronization.
 */
export function useAnchorNavigation() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (!hash) return;

    const targetId = hash.slice(1);
    let observer;

    const scrollToElement = () => {
      const element = document.getElementById(targetId);
      if (element) {
        // Disconnect immediately to prevent multiple triggers
        if (observer) {
          observer.disconnect();
        }

        // Subtract header height (sticky nav bar height + vertical margins ~120px)
        const offset = 120;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Focus management: Move keyboard focus to the target element for screen readers/A11y
        if (!element.getAttribute("tabindex")) {
          element.setAttribute("tabindex", "-1");
        }
        element.focus({ preventScroll: true });

        return true;
      }
      return false;
    };

    // Attempt immediate scroll (useful for same-page hash changes)
    if (scrollToElement()) return;

    // Set up MutationObserver to detect dynamically rendered elements (useful for tabs/route changes)
    observer = new MutationObserver(() => {
      if (scrollToElement()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup fallback after 3 seconds to avoid memory leaks if element doesn't exist
    const timeoutId = setTimeout(() => {
      if (observer) {
        observer.disconnect();
      }
    }, 3000);

    return () => {
      if (observer) {
        observer.disconnect();
      }
      clearTimeout(timeoutId);
    };
  }, [location]);
}
