import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SupportButton from './SupportButton';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <SupportButton />
    </div>
  );
}
