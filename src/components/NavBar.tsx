import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import SvgGroupyLogo from "public/SvgGroupyLogo";

type PageType = "signin" | "home" | "chat" | "profile" | "signup";

export const pageStates = {
  SIGNIN: "signin",
  SIGNUP: "signup",
  HOME: "home",
  CHAT: "chat",
  PROFILE: "profile",
} as const;

const NavBar = () => {
  const router = useRouter();
  const currentUrl = router.asPath;
  const { data: sessionData } = useSession();

  let selectedPage: PageType = pageStates.SIGNIN;
  let onlyLogo = false;

  // This code block is just to handle states for css changes
  switch (currentUrl) {
    case "/":
      selectedPage = pageStates.SIGNIN;
      onlyLogo = true;
      break;
    case "/sign-up":
      selectedPage = pageStates.SIGNUP;
      onlyLogo = true;
      break;
    case "/home":
      selectedPage = pageStates.HOME;
      break;
    case `/${sessionData?.user.atTag as string}/edit-profile`:
      selectedPage = pageStates.PROFILE;
      break;
    case "/chat":
      selectedPage = pageStates.CHAT;
      break;
    default:
      // Handle any other URLs
      break;
  }

  return (
    <nav
      className={`absolute z-50 flex h-20 w-full items-center justify-between ${
        onlyLogo ? "bg-transparent" : "bg-white"
      }`}
    >
      <div>
        <Link className="relative ml-5 flex font-teko text-[29px]" href="/">
          <div className="relative top-[3px] flex">
            <div className="relative top-[-2px] mx-5 h-10 w-10">
              <SvgGroupyLogo />
            </div>
            <span className="relative">GROUPY</span>
          </div>
        </Link>
      </div>
      {sessionData?.user && !onlyLogo && (
        <ul className="mr-5 flex gap-8 font-poppins font-normal text-grey">
          <li>
            <Link
              className={`decoration-4 underline-offset-8 transition duration-300 hover:text-black hover:ease-in-out ${
                selectedPage === pageStates.HOME ? `underline` : ``
              }`}
              href="/home"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              className={`decoration-4 underline-offset-8 transition duration-300 hover:text-black hover:ease-in-out ${
                selectedPage === pageStates.CHAT ? `underline` : ``
              }`}
              href="#"
            >
              Chat
            </Link>
          </li>

          <li>
            <Link
              className={`decoration-4 underline-offset-8 transition duration-300 hover:text-black hover:ease-in-out ${
                selectedPage === pageStates.PROFILE ? `underline` : ``
              }`}
              href={{
                pathname: '/[atTag]/edit-profile',
                query: { atTag: sessionData.user.atTag },
              }}
            >
              Profile
            </Link>
          </li>

          <li>
            <Link
              className={`decoration-4 underline-offset-8 transition duration-300 hover:text-black hover:ease-in-out`}
              href="#"
              onClick={() => void signOut()}
            >
              Logout
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
