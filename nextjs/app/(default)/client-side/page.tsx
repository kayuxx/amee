import ClientSession from "@/app/components/ClientSession";

export default function Page() {
  return (
    <div className="flex items-center flex-col">
      <p className="mb-5">
        This page retrieves session data in a client component using{" "}
        <code>useSession</code> (a custom hook)
      </p>
      <ClientSession />
    </div>
  );
}
