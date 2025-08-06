'use client';

import { useEffect, useState } from 'react';

interface BodyWrapperProps {
  children: React.ReactNode;
}

export default function BodyWrapper({ children }: BodyWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render children after mounting to avoid hydration mismatches
  // caused by browser extensions adding attributes
  if (!mounted) {
    return <div style={{ display: 'none' }} />;
  }

  return <>{children}</>;
}