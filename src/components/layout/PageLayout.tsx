
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { mockUser } from '../../data/mockData';

interface PageLayoutProps {
  children: React.ReactNode;
  withFooter?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, withFooter = true }) => {
  // For demo purposes, we're using the mock user
  // In a real app, this would come from auth state
  const user = mockUser;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} />
      <main className="flex-1">
        {children}
      </main>
      {withFooter && <Footer />}
    </div>
  );
};

export default PageLayout;
