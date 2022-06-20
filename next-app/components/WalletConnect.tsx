import React from "react";
import Image from "next/image";
import LoadingSpinner from "./UI/LoadingSpinner";
import { useMoralis } from "react-moralis";

function WalletConnect({ cta, logoPath, handleLogin }) {
  const { isAuthenticating } = useMoralis();

  return (
    <div className="mt-6 grid grid-cols-1">
      <div>
        <button
          onClick={handleLogin}
          className="w-full h-full inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-900 "
        >
          {isAuthenticating ? (
            <LoadingSpinner size="6" />
          ) : (
            <>
              <Image src={logoPath} width={30} height={30} alt={cta} />
              <span className="pl-4 uppercase">{cta}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default WalletConnect;
