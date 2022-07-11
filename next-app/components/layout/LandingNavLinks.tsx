import { useRouter } from "next/router";
import Link from "next/dist/client/link";
import { useMoralis } from "react-moralis";

function NavLinks(props) {
  const router = useRouter();
  router.pathname;
  const { isAuthenticated } = useMoralis();

  const { navigation } = props;
  const activeLink = "btn btn-active btn-link";
  const nonAcctiveLink = "btn btn-link";
  const mobileStyle =
    "block text-left px-3 py-2 rounded-md text-base font-medium hover:text-primary";
  const DesktopStyle = "font-medium  hover:text-primary";

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
