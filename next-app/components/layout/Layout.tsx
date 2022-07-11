import React from "react";
import Meta from "./Meta";
import LandingNavBar from "./LandingNavbar";
import AppContent from "../UI/AppContent";
import Footer from "./Footer";
import Container from "../UI/Container";

const Layout = ({ children }) => {
  return (
    <>
      <Meta />
      <AppContent>
        <LandingNavBar />
        <Container>{children}</Container>
      </AppContent>
      <Footer />
    </>
  );
};

export default Layout;
