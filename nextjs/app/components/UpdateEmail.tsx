"use client";
import Holder from "./Holder";
import { updateEmail } from "../actions/auth";
import { useFormState } from "react-dom";

export default function UpdateEmail({ email }: { email: string }) {
  // this method will be replaced wiht useActionState
  // see https://react.dev/reference/react/useActionState
  const [state, formAction] = useFormState(updateEmail, {
    message: ""
  });

  return (
    <div>
      <form action={formAction}>
        <label htmlFor="user-email">Email:</label>
        <input
          id="user-email"
          className="w-full border dark:placeholder:text-gray-900 px-2 py-1 dark:text-gray-900 "
          name="email"
          type="email"
          defaultValue={email}
          placeholder="Email"
        />
        <Holder className="w-fit mt-4 mb-2">
          <button type="submit">Update</button>
        </Holder>
      </form>
      {!!state.message && <p className="text-green-500">{state.message}</p>}
    </div>
  );
}
