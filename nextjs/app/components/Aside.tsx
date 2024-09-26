import Link from "next/link";

export function Aside() {
  return (
    <aside className="w-full md:w-1/4 flex-[2]">
      <h2 className="mb-3 text-lg">Examples</h2>
      <ul className="border p-2 w-full">
        <li className="border-b px-1 py-2">
          <Link href="/client-side">Client Side</Link>
        </li>
        <li className="border-b px-1 py-2">
          <Link href="/protected-route">Protected Route</Link>
        </li>

        <li className="border-b px-1 py-2">
          <Link href="/magic-link">Magic Link</Link>
        </li>
      </ul>
    </aside>
  );
}
