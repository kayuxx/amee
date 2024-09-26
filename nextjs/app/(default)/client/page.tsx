"use client";

export default function Page() {
  return <h1>Im on {typeof window === "undefined" ? "server" : "browser"}</h1>;
}
