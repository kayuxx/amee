import Holder from "./Holder";
import { signWithCredentials } from "../actions/auth";

export default function CredentialSignIn() {
  return (
    <form action={signWithCredentials} className="space-y-3 mb-8">
      <input
        className="w-full border dark:placeholder:text-gray-900 px-2 py-1 dark:text-gray-900 "
        name="email"
        type="email"
        placeholder="Email"
        required
      />
      <input
        required
        className="w-full border dark:placeholder:text-gray-900 px-2 py-1 dark:text-gray-900 "
        minLength={8}
        maxLength={16}
        name="password"
        type="password"
        placeholder="Password"
      />
      <Holder className="w-fit mt-8">
        <button type="submit">Submit</button>
      </Holder>
    </form>
  );
}
