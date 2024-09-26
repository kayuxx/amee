import Link from "next/link";
import Holder from "./Holder";
import { Logout } from "./Logout";
import { getSession } from "../actions/session";

export async function Nav() {
  const session = await getSession();
  const isAuthenticated = !!session?.user;
  return (
    <nav>
      <ul className="flex justify-start gap-8 mb-16">
        <li>
          <Holder>
            <Link href="/">Home</Link>
          </Holder>
        </li>
        <li className="mr-auto">
          <Holder>
            <a href="https://amee-auth.vercel.app">🔐 Amee</a>
          </Holder>
        </li>
        <li className="ml-auto">
          <Holder className="">
            {isAuthenticated ? <Logout /> : <Link href="/signin">Signin</Link>}
          </Holder>
        </li>
      </ul>
    </nav>
  );
}
