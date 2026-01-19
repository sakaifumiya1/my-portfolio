'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNavigation = pathname !== '/login';

  return (
    <>
      {showNavigation && <Navigation />}
      {children}
    </>
  );
}
