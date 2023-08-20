import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginBtn() {
  const { data: session } = useSession();
  console.log("LoginBtn() debug:\n", JSON.stringify(session, 0, 2));
  return (
    <>
      {/* Signed in as <b>{session.user.email}</b> */}
      <button className="button-27" onClick={() => signOut()}>
        Log out
      </button>
    </>
  );
}
