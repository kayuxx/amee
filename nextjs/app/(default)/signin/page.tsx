import CredentialSignIn from "@/app/components/CredentialSignIn";
import ProviderSignIn from "@/app/components/ProviderSignIn";
import Holder from "@/app/components/Holder";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex items-center flex-col">
      <div className="max-w-[450px]">
        <h1 className="mb-2">Signin using email and password</h1>
        <CredentialSignIn />
        <div className="space-y-2">
          <ProviderSignIn provider="google" />
          <ProviderSignIn provider="github" invertImage />
          <span className="relative mx-auto !my-4 text-center block before:w-[30%] before:h-[1px] before:bg-gray-400 before:absolute before:left-[10%] before:top-1/2  after:w-[30%] after:h-[1px] after:bg-gray-400 after:absolute after:right-[10%] after:top-1/2">
            or
          </span>
          <Holder className="w-fit text-center mx-auto">
            <Link href="/magic-link">🪄 Continue With Magic Link</Link>
          </Holder>
        </div>
      </div>
    </div>
  );
}
