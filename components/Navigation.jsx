import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut, signIn } from "next-auth/react";

const Navigation = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleClose = (e) => {
      if (!isMenuOpen) return;
      setIsMenuOpen(false);
    };

    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, [isMenuOpen]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white text-black shadow-lg">
      <div className="container xl:px-4 lg:px-2  px-2 mx-auto">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center gap-8 sm:justify-between justify-end">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <button className="text-gray-800 font-bold text-xl">
                  <div className="xl:w-[200px] lg:w-[150px] w-[130px]">
                    <Image
                      className="w-full"
                      width={200}
                      height={150}
                      src={"/images/logo.png"}
                    />
                  </div>
                </button>
              </Link>
            </div>
            <div
              className={`${
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
              } sm:hidden sm:translate-x-0 fixed sm:static top-0 left-0 h-screen bg-gray-800 w-64 pt-16 px-6 transition-transform duration-200 ease-in-out z-10`}
            >
              <button
                onClick={toggleMenu}
                className="absolute top-4 right-4 text-gray-300 hover:text-white lg:hidden"
              >
                X
              </button>
              <div className="flex flex-col space-y-4">
                <Link href="/">
                  <div className="text-gray-300 text-center hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    Home
                  </div>
                </Link>

                <Link href="/videos2">
                  <div className="text-gray-400 nav-link-wrapper text-base duration-200 px-3 py-2 rounded-md  font-medium">
                    Videos
                  </div>
                </Link>
                <Link href="/favorites">
                  <div className="text-gray-400 nav-link-wrapper text-base duration-200 px-3 py-2 rounded-md  font-medium ">
                    Favorites
                  </div>
                </Link>
                <Link href="/toplist">
                  <div className="text-gray-400 nav-link-wrapper text-base duration-200 px-3 py-2 rounded-md  font-medium ">
                    Top List
                  </div>
                </Link>
                {!session ? null : (
                  <Link href="/profile">
                    <div className="text-gray-400 nav-link-wrapper text-base duration-200 px-3 py-2 rounded-md  font-medium">
                      Profile
                    </div>
                  </Link>
                )}
                <Link href="/payment">
                  <div className="text-gray-400 nav-link-wrapper text-base duration-200 px-3 py-2 rounded-md  font-medium">
                    Payment
                  </div>
                </Link>
                {!session ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => signIn("magiclink")}
                      className="text-gray-400 nav-link-wrapper text-base duration-200 px-3 py-2 rounded-md  font-medium whitespace-nowrap"
                    >
                      Log in
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => signOut()}
                      className="text-gray-400 nav-link-wrapper text-base duration-200 px-3 py-2 rounded-md  font-medium whitespace-nowrap"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* to be worked */}
            <div className="hidden sm:flex  sm:items-center ">
              <Link href="/">
                <div className="text-gray-700  nav-link-wrapper text-base duration-200 lg:px-3 px-1  rounded-md  font-medium">
                  <span className="nav-link-child px-1">Home</span>
                </div>
              </Link>

              <Link href="/videos2">
                <div className="text-gray-700 nav-link-wrapper text-base duration-200 lg:px-3 px-1 rounded-md  font-medium">
                  <span className="nav-link-child px-1">Videos</span>
                </div>
              </Link>
              <Link href="/favorites">
                <div className="text-gray-700 nav-link-wrapper text-base duration-200 lg:px-3 px-1   rounded-md  font-medium">
                  <span className="nav-link-child px-1">Favorites</span>
                </div>
              </Link>
              <Link href="/toplist">
                <div className="text-gray-700 nav-link-wrapper text-base duration-200 lg:px-3 px-1  rounded-md  font-medium whitespace-nowrap">
                  <span className="nav-link-child px-1">Top List</span>
                </div>
              </Link>
              {!session ? null : (
                <Link href="/profile">
                  <div className="text-gray-700 nav-link-wrapper text-base duration-200 lg:px-3 px-1 py-2 rounded-md  font-medium">
                    <span className="nav-link-child px-1">Profile</span>
                  </div>
                </Link>
              )}
              <Link href="/payment">
                <div className="text-gray-700 nav-link-wrapper text-base duration-200 lg:px-3 px-1 py-2 rounded-md  font-medium">
                  <span className="nav-link-child px-1">Payment</span>
                </div>
              </Link>
              {!session ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => signIn("magiclink")}
                    className="text-gray-700 nav-link-wrapper text-base duration-200 px-3 py-2 rounded-md  font-medium whitespace-nowrap"
                  >
                    <span className="nav-link-child px-1">Log in</span>
                  </button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={() => signOut()}
                    className="text-gray-700 nav-link-wrapper text-base duration-200 px-3 py-2 rounded-md  font-medium whitespace-nowrap"
                  >
                    <span className="nav-link-child px-1">Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useSession, signOut, signIn } from "next-auth/react";
// import Image from "next/image";
// const Navigation = () => {
//   const { data: session, status } = useSession();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleClose = (e) => {
//       if (!isMenuOpen) return;
//       setIsMenuOpen(false);
//     };

//     window.addEventListener("click", handleClose);
//     return () => window.removeEventListener("click", handleClose);
//   }, [isMenuOpen]);

//   const toggleMenu = (e) => {
//     e.stopPropagation();
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <nav id="nav-bar" className="bg-white text-black shadow-sm ">
//       <div className="container xl:px-4 lg:px-2 px-4 mx-auto">
//         <div className="relative flex items-center justify-between h-16">
//           <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
//             <button
//               onClick={toggleMenu}
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
//             >
//               <span className="sr-only">Open main menu</span>
//               <svg
//                 className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 aria-hidden="true"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 6h16M4 12h16M4 18h16"
//                 />
//               </svg>
//               <svg
//                 className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 aria-hidden="true"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>
//           <div className="flex-1 z-10 flex items-center lg:justify-between justify-end ">
//             <div className="flex-shrink-0 flex items-center">
//               <Link href="/">
//                 <button className="text-gray-700 font-bold text-xl">
//                   <div className='xl:w-[200px] lg:w-[150px] w-[130px]'>
//                     <Image className="w-full" width={200} height={150} src={'/images/logo.png'} />
//                   </div>
//                 </button>
//               </Link>
//             </div>
//             <div
//               className={`${isMenuOpen ? "translate-x-0" : "-translate-x-full"
//                 } sm:hidden sm:translate-x-0 fixed sm:static top-0 left-0 h-screen bg-gray-800 w-64 pt-16 px-6 transition-transform duration-200 ease-in-out z-10`}
//             >
//               <button
//                 onClick={toggleMenu}
//                 className="absolute top-4 right-4 text-gray-300 hover:text-white lg:hidden"
//               >
//                 X
//               </button>
//               <div className="flex flex-col space-y-4">
//                 <Link href="/">
//                   <div className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
//                     Home
//                   </div>
//                 </Link>

//                 <Link href="/videos2">
//                   <div className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
//                     Videos
//                   </div>
//                 </Link>
//                 <Link href="/favorites">
//                   <div className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
//                     Favorites
//                   </div>
//                 </Link>
//                 <Link href="/toplist">
//                   <div className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
//                     Top List
//                   </div>
//                 </Link>
//                 {!session ? null : (
//                   <Link href="/profile">
//                     <div className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
//                       Profile
//                     </div>
//                   </Link>
//                 )}
//                 <Link href="/payment">
//                   <div className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
//                     Payment
//                   </div>
//                 </Link>
//               </div>
//             </div>
//             <div className="hidden lg:flex sm:items-center sm:ml-6">
//               <Link href="/">
//                 <div className="text-gray-700 nav-link-wrapper text-base duration-200 px-3 py-2 rounded-md  font-medium">
//                   <span className="nav-link-child px-1">
//                     Home
//                   </span>
//                 </div>
//               </Link>

//               <Link href="/videos2">
//                 <div className="text-gray-700 nav-link-wrapper text-base duration-200 px-3 py-2 rounded-md  font-medium">
//                   <span className="nav-link-child px-1">
//                     Videos
//                   </span>
//                 </div>
//               </Link>
//               <Link href="/favorites">
//                 <div className="text-gray-700 nav-link-wrapper text-base duration-200 px-3 py-2 rounded-md  font-medium">
//                   <span className="nav-link-child px-1">
//                     Favorites
//                   </span>
//                 </div>
//               </Link>
//               <Link href="/toplist">
//                 <div className="text-gray-700 nav-link-wrapper text-base duration-200 px-3 py-2 rounded-md  font-medium">
//                   <span className="nav-link-child px-1">
//                     Top List
//                   </span>
//                 </div>
//               </Link>

//               {!session ? null : (
//                 <Link href="/profile">
//                   <div className="text-gray-700 nav-link-wrapper text-base duration-200 px-3 py-2 rounded-md  font-medium">
//                     <span className="nav-link-child px-1">
//                       Profile
//                     </span>
//                   </div>
//                 </Link>
//               )}
//               <Link href="/payment">
//                 <div className="text-gray-700 nav-link-wrapper text-base duration-200 px-3 py-2 rounded-md  font-medium">
//                   <span className="nav-link-child px-2">
//                     Payment
//                   </span>
//                 </div>
//               </Link>
//               {!session ? (
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => signIn("magiclink")}
//                     className="text-gray-700 nav-link-wrapper  text-base duration-200 px-3 py-2 rounded-md  font-medium"
//                   >
//                     <span className="nav-link-child px-1">
//                       Log in
//                     </span>
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => signOut()}
//                     className="text-gray-300 nav-link-wrapper  hover:text-white px-3 py-2 rounded-md text-sm font-medium"
//                   >
//                     <span className="nav-link-child px-1">
//                       Log out
//                     </span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"></div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navigation;
