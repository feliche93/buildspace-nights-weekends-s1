import React, { useEffect } from "react";
import WalletLogin from "../components/WalletLogin";
import Link from "next/link";
import Image from "next/image";
// import LimeDaoLogo from '../public/limeDaoLogo.png';
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";

export default function ConnectWallet() {
  const { isAuthenticated } = useMoralis();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/#");
    }
  }, [router, isAuthenticated]);

  return (
    <>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="relative mx-auto h-12 w-12">
            {/* <Image src={LimeDaoLogo} alt='Lime Dao Logo' /> */}
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold ">
            Connect your Wallet
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-base-300 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <WalletLogin />
          </div>
        </div>
      </div>
    </>
  );
}
