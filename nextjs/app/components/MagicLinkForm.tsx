"use client";
import Holder from "./Holder";
import {
  // authenticateWithMagicLink,
  signWithMagicLink
} from "../actions/auth";
import { useFormState } from "react-dom";

export default function MagicLinkForm() {
  // this method will be replaced wiht useActionState
  // see https://react.dev/reference/react/useActionState
  const [state, formAction] = useFormState(signWithMagicLink, { message: "" });

  return (
    <form action={formAction} className="space-y-3 mb-8">
      <input
        className="w-full border dark:placeholder:text-gray-900 px-2 py-1 dark:text-gray-900 "
        name="email"
        type="email"
        placeholder="Email"
      />
      <Holder className="w-fit mt-8">
        <button type="submit">Get Magic Link</button>
      </Holder>
      {!!state.message && !state.token && (
        <p className="text-red-500">{state.message}</p>
      )}
      {!!state.token && (
        <Holder className="w-fit">
          {/* <button onClick={() => authenticateWithMagicLink(state.token)}> */}
          {/*   Authenticate with Magic Link */}
          {/* </button> */}
          <a href={`/api/verify-magic-link?token=${state.token}`}>
            Authenticate With Magic Link
          </a>
        </Holder>
      )}
    </form>
  );
}
