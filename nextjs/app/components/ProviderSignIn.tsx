import Image from "next/image";
import { signWith } from "../actions/auth";
import Holder from "./Holder";

export default function ProviderSignIn({
  provider,
  invertImage
}: {
  provider: string;
  invertImage?: boolean;
}) {
  return (
    <Holder className="max-w-56 text-center mx-auto flex gap-3">
      <Image
        src={`/social-icons/${provider}.svg`}
        width={20}
        height={20}
        alt="Google"
        className={`${invertImage ? "invert" : ""} w-[20px] h-[20px] aspect-square`}
      />
      <form
        action={async () => {
          "use server";
          await signWith(provider);
        }}
      >
        <button className="capitalize">Continue With {provider}</button>
      </form>
    </Holder>
  );
}
