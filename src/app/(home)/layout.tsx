import React from "react";

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      {children}
    </div>
  );
}

export default HomeLayout;
