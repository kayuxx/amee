"use client";

import useSession from "../hooks/useSession";
import { Profile } from "./Profile";
import { ShowDetails } from "./ShowDetails";

export default function ClientSession() {
  const { session, isAuthenticated, isLoading } = useSession();
  if (isLoading) return <h1>Loading...</h1>;

  if (!isAuthenticated)
    return (
      <>
        <h1>You are not authenticated yet</h1>
        <p>Please Signin</p>
      </>
    );

  return (
    <>
      <Profile user={session.user} />
      <ShowDetails rawData={session} />
    </>
  );
}
