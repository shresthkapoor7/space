'use client';

import { useEffect, useRef } from 'react';

interface FlashcardGridProps {
  children?: React.ReactNode;
  dangerouslySetInnerHTML?: { __html: string };
}

export default function FlashcardGrid({ children, dangerouslySetInnerHTML }: FlashcardGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const detailsElements = containerRef.current.querySelectorAll('details');
      const cleanupFunctions: (() => void)[] = [];

      detailsElements.forEach((details) => {
        const handleCardClick = (e: Event) => {
          // Prevent the click from bubbling if it's on the summary
          if ((e.target as Element).tagName === 'SUMMARY') {
            return;
          }

          // Toggle the details element
          details.toggleAttribute('open');
          e.preventDefault();
          e.stopPropagation();
        };

        details.addEventListener('click', handleCardClick);

        // Store cleanup function
        cleanupFunctions.push(() => {
          details.removeEventListener('click', handleCardClick);
        });
      });

      // Return cleanup function that removes all event listeners
      return () => {
        cleanupFunctions.forEach(cleanup => cleanup());
      };
    }
  }, [dangerouslySetInnerHTML]);

  return (
    <div
      ref={containerRef}
      className="glossary-grid"
      key={dangerouslySetInnerHTML ? 'with-html' : 'without-html'}
      {...(dangerouslySetInnerHTML ? { dangerouslySetInnerHTML } : {})}
    >
      {children}
    </div>
  );
}