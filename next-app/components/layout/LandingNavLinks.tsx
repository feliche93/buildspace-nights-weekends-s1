import { useRouter } from "next/router";
import Link from "next/dist/client/link";
import { useMoralis } from "react-moralis";

function NavLinks(props) {
  const router = useRouter();
  router.pathname;
  const { isAuthenticated } = useMoralis();

  const { navigation } = props;
  const activeLink = "text-blue-500";
  const nonAcctiveLink = "text-gray-900";
  const mobileStyle =
    "block px-3 py-2 rounded-md text-base font-medium hover:text-blue-500";
  const DesktopStyle = "font-medium  hover:text-blue-500";

  if (isAuthenticated) {
    return (
      <div
        className={
          props.mobile ? "px-2 pt-2 pb-3" : "hidden md:flex md:space-x-10"
        }
      >
        {navigation
          .filter((item) => item.protected)
          .map((item) => (
            <Link href={item.href} key={item.name}>
              <a
                key={item.name}
                href={item.href}
                className={`${props.mobile ? mobileStyle : DesktopStyle} ${
                  item.href === router.pathname ? activeLink : nonAcctiveLink
                }`}
              >
                {item.name}
              </a>
            </Link>
          ))}
      </div>
    );
  } else {
    return (
      <div
        className={
          props.mobile ? "px-2 pt-2 pb-3" : "hidden md:flex md:space-x-10"
        }
      >
        {navigation
          .filter((item) => !item.protected)
          .map((item) => (
            <Link href={item.href} key={item.name}>
              <a
                key={item.name}
                href={item.href}
                className={`${props.mobile ? mobileStyle : DesktopStyle} ${
                  item.href === router.pathname ? activeLink : nonAcctiveLink
                }`}
              >
                {item.name}
              </a>
            </Link>
          ))}
      </div>
    );
  }
}

export default NavLinks;
