import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

const loadingSpinnerStyles = `
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
`;

export default function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  //const { data: session } = useSession();
  //console.log("LoginBtn component debug:\n", JSON.stringify(session, 0, 2));
  // if (session) {
  //   return (
  //     <>
  //       <br />
  //       Signed in as <b>{session.user.email}</b>
  //       <br />
  //       <button className="button-27" onClick={() => signOut()}>
  //         Sign out
  //       </button>
  //     </>
  //   );
  // }
  return (
    <>
      {isLoading ? (
        <div style={{ loadingSpinnerStyles, color: "white" }}>Loading...</div>
      ) : (
        <Link
          href="/login"
          style={{ textDecoration: "none", color: "#0070f3" }}
          onClick={() => setIsLoading(true)}
        >
          <button
            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            onClick={() => signIn()}
          >
            Login
          </button>
        </Link>
      )}
    </>
  );
}
