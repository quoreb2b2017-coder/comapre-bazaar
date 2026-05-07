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
    <div className="fixed bottom-8 right-[5.5rem] sm:right-24 z-40">
      <button
        onClick={handleScroll}
        aria-label={isAtBottom ? "Scroll to top" : "Scroll to bottom"}
        className="p-3 rounded-full cursor-pointer bg-gradient-to-r from-[#1d4fd7] to-[#295fdd] hover:from-[#1948c7] hover:to-[#2455ca] transition-all duration-200 shadow-[0_14px_28px_-14px_rgba(37,99,235,0.85)]"
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
