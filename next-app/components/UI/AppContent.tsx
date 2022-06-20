import React from "react";

function AppContent(props) {
  return (
    <main className="relative overflow-hidden min-h-screen">
      {props.children}
    </main>
  );
}

export default AppContent;
