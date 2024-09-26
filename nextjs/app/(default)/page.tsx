import { Aside } from "@/components/Aside";
import { Profile } from "@/components/Profile";
import { getSession } from "../actions/session";
import { ShowDetails } from "../components/ShowDetails";

export default async function Home() {
  const session = await getSession();
  const isAuthenticated = !!session?.user;
  return (
    <>
      <div className="w-full mb-4">
        <h1 className="text-lg">
          This website highlights verious utilizations of the{" "}
          <a className="dark:text-gray-400" href="https://amee-auth.vercel.app">
            Amee
          </a>{" "}
          library.
        </h1>
        <p>
          Note that the navbar uses cookies, which means it will result to a
          dymanic rendering. All pages are server-rendered, except for the
          client-side page example.
        </p>
        <br />
        <p>
          Public routes such as <code>/signin</code> or <code>/magic-link</code>{" "}
          is accessible only if you&apos;re not authenticated.
        </p>
      </div>
      <main className="flex gap-8 row-start-2 items-center sm:items-start flex-col md:flex-row">
        <Aside />
        <div className="mt-9 w-full md:flex-[5]">
          {isAuthenticated ? (
            <>
              <Profile user={session.user} />
              <ShowDetails rawData={session} />
            </>
          ) : (
            <>
              <h1>You are not authenticated yet</h1>
              <p>Please Signin</p>
            </>
          )}
        </div>
      </main>
    </>
  );
}
