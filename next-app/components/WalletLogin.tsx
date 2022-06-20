import React from "react";
import { useMoralis } from "react-moralis";
import WalletConnect from "./WalletConnect";
import { ExclamationIcon } from "@heroicons/react/outline";
import SectionContent from "./UI/SectionContent";

function WalletLogin() {
  const { isAuthenticating, authenticate } = useMoralis();

  const handleMetamaskConnect = async () => {
    await authenticate({
      signingMessage: "Log in to your Commit 2 Earn Account",
    });
  };

  const handleWalletConnect = async () => {
    console.log("Test");
    await authenticate({
      signingMessage: "Log in to your Commit 2 Earn Account",
      provider: "walletconnect",
      chainId: 137,
      mobileLinks: [
        "rainbow",
        "metamask",
        "argent",
        "trust",
        "imtoken",
        "pillar",
      ],
    });
  };

  return (
    <>
      <WalletConnect
        handleLogin={handleMetamaskConnect}
        cta="MetaMask"
        logoPath="/wallet-connect/MetamaskConnectLogo.webp"
      />
      <WalletConnect
        handleLogin={handleWalletConnect}
        cta="WalletConnect"
        logoPath="/wallet-connect/walletConnectLogo.png"
      />
    </>
  );
}

export default WalletLogin;
