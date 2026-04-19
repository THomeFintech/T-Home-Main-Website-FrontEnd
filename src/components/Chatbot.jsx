import React, { useEffect, useState } from "react";

export default function Chatbot({ onClick }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.body.offsetHeight;

      // hide near footer (last 150px)
      if (scrollPosition >= pageHeight - 150) {
        setShow(false);
      } else {
        setShow(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onClick}
        className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-xl flex items-center justify-center"
      >
        <img
          src="/home/bot (1).png"
          alt="Chatbot"
          className="w-full h-full object-contain"
        />
      </button>
    </div>
  );
}