'use client';

import { useState, useEffect } from "react";

const ArrowNavigation = () => {
  const [isAtBottom, setIsAtBottom] = useState(false);

  const checkScrollPosition = () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 100);
  };

  const handleScroll = () => {
    window.scrollTo({
      top: isAtBottom ? 0 : document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollPosition);
    checkScrollPosition(); // initial check in case page loads scrolled

    return () => window.removeEventListener("scroll", checkScrollPosition);
  }, []);

  return (
    <div className="fixed bottom-20 right-8 z-50">
      <button
        onClick={handleScroll}
        aria-label={isAtBottom ? "Scroll to top" : "Scroll to bottom"}
        className="p-3 bg-[#000e54] rounded-full cursor-pointer hover:bg-[#000e54]/90 transition-all duration-200 shadow-lg"
        type="button"
      >
        {isAtBottom ? (
          <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m18 15-6-6-6 6" />
          </svg>
        ) : (
          <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ArrowNavigation;
