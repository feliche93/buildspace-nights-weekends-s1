import React from "react";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import SectionContent from "../UI/SectionContent";
import { useMoralis } from "react-moralis";
// import blue-500DaoLogo from '../../public/blue-500DaoLogo.png';
import Link from "next/link";
import LandingNavLinks from "./LandingNavLinks";
import Image from "next/image";

const navigation = [
  { name: "Home", href: "/", protected: false },
  // { name: "Mint Member NFT", href: "/nft/member/mint", protected: true },
];

const actions = [
  {
    name: "Connect Wallet",
    href: "/connect-wallet",
    style: "primary",
    protected: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const LandingNavBar = () => {
  const { user, logout, isAuthenticated } = useMoralis();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <Popover>
      {/* Deskto Menu */}
      <SectionContent>
        <nav
          className="relative flex items-center justify-between sm:h-10 md:justify-center"
          aria-label="Global"
        >
          <div className="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
            <div className="flex items-center justify-between w-full md:w-auto">
              <Link href="/">
                <a href="#">
                  {/* <span className='sr-only'>Commit 2 Earn</span>
                  <Image
                    className='rounded shadow'
                    src={blue-500DaoLogo}
                    alt='Commit 2 Earn Logo'
                    width={50}
                    height={50}
                  /> */}
                </a>
              </Link>
              <div className="-mr-2 flex items-center md:hidden">
                <Popover.Button className="bg-gray-800 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                  <span className="sr-only">Open main menu</span>
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
          </div>
          <LandingNavLinks
            navigation={navigation}
            // user={user}
          />

          <div className="hidden md:absolute md:flex md:items-center md:justify-end md:inset-y-0 md:right-0">
            {!isAuthenticated ? (
              <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                {actions.map((action) => (
                  <Link href={action.href} key={action.name}>
                    <a className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-blue-600/90">
                      {action.name}
                    </a>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                <button
                  onClick={handleLogout}
                  className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-blue-600/90"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </SectionContent>

      <Transition
        as={Fragment}
        enter="duration-150 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
        >
          <div className="rounded-lg shadow-md bg-gray-800 ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="px-5 pt-4 flex items-center justify-between">
              <div>
                {/* <Image
                  className='rounded shadow'
                  src={blue-500DaoLogo}
                  alt='Commit 2 Earn Logo'
                  width={50}
                  height={50}
                /> */}
              </div>
              <div className="-mr-2">
                <Popover.Button className="bg-gray-500 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-500">
                  <span className="sr-only">Close menu</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
            <LandingNavLinks
              navigation={navigation}
              // user={user}
              mobile="true"
            />
            {!isAuthenticated ? (
              <>
                {actions.map((action) => (
                  <Link href="/connect-wallet" key={action.name}>
                    <a className="block w-full px-5 py-3 text-center font-medium text-white bg-blue-500 hover:bg-blue-600/90">
                      {action.name}
                    </a>
                  </Link>
                ))}
                {/* <Link href='/login'>
                  <a className='block w-full px-5 py-3 text-center font-medium text-violet-600 bg-gray-50 hover:bg-gray-100'>
                    Sign in
                  </a>
                </Link>
                <Link href='/register'>
                  <a className='block w-full px-5 py-3 text-center font-medium text-white bg-violet-600 hover:bg-violet-700'>
                    Sign up
                  </a>
                </Link> */}
              </>
            ) : (
              <div>
                <button
                  onClick={handleLogout}
                  className="block w-full px-5 py-3 text-center font-medium text-white bg-blue-500 hover:bg-blue-600/90"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default LandingNavBar;
