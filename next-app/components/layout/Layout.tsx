import React from "react";
import Meta from "./Meta";
import LandingNavBar from "./LandingNavbar";
import AppContent from "../UI/AppContent";
import Footer from "./Footer";
import Container from "../UI/Container";

const Layout = ({ children }) => {
  return (
    <div className="bg-gray-100">
      <Meta />
      <AppContent>
        <LandingNavBar />
        <Container>{children}</Container>
      </AppContent>
      <Footer />
    </div>
  );
};

export default Layout;
