import Image from "next/image";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import hero from "../public/home/hero.svg";

export default function Home() {
  const { isAuthenticated } = useMoralis();

  return (
    <main className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24">
      {/* <div className="relative flex flex-col items-center w-96 h-96 mx-auto">
        <Image src={hero} alt="Hero Image" />
      </div> */}
      <div className="text-center">
        <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
          <span className="block xl:inline">
            Build your positive habits with
          </span>{" "}
          <span className="block text-primary">Commit 2 Earn</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          {`Put your Crypto where your mouth is to reach goals 🎯 faster 💨. Set a
          goal, win money if you meet your goal or loose it if you don't.`}
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link href={isAuthenticated ? "/create-goal" : "/connect-wallet"}>
              <a className="btn sm:btn-lg btn-primary">Set up a goal</a>
            </Link>
          </div>
          {/* <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <a
              target={"_blank"}
              rel={"noopener noreferrer"}
              href="https://blue-500dao.notion.site/blue-500-Wiki-62b4a4453d044653a64ca8c8681d0ac1"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-500 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Learn More
            </a>
          </div> */}
        </div>
      </div>
    </main>
  );
}
