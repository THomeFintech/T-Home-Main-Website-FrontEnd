import { useState } from "react";

export default function FaqAccordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.q ?? index}
            className="rounded-xl border border-white/20 bg-white/[0.07] backdrop-blur-2xl p-0 shadow-[0_10px_28px_rgba(5,16,38,0.25)] overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full text-left px-4 py-4 text-sm font-medium cursor-pointer text-white/90 hover:bg-white/[0.05] transition"
              aria-expanded={isOpen}
            >
              {item.q}
            </button>

            {isOpen && (
              <div className="px-4 pb-5 pt-1">
                <div className="border-t border-white/10 pt-4">
                  <p className="text-gray-200 text-xs leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

