import React from "react";
import Header from "./Header";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  // For demo purposes, we're using the mock user
  // In a real app, this would come from auth state

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1">{children}</main>
      </div>
    </>
  );
};

export default PageLayout;
