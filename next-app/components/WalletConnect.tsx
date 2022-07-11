import React from "react";
import Image from "next/image";
import LoadingSpinner from "./UI/LoadingSpinner";
import { useMoralis } from "react-moralis";

function WalletConnect({ cta, logoPath, handleLogin }) {
  const { isAuthenticating } = useMoralis();

  return (
    <div className="mt-6 grid grid-cols-1">
      {isAuthenticating ? (
        <button
          onClick={handleLogin}
          className="btn btn-primary btn-block loading"
        ></button>
      ) : (
        <button onClick={handleLogin} className="btn btn-primary btn-block">
          <Image
            className="pt-2"
            src={logoPath}
            width={30}
            height={30}
            alt={cta}
          />
          <span className="ml-2">{cta}</span>
        </button>
      )}
    </div>
  );
}

export default WalletConnect;
