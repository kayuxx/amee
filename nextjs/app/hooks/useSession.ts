import { useEffect, useState } from "react";
import { AmeeSession, getSession } from "../actions/session";

type State = {
  session: AmeeSession | null;
  isLoading: boolean;
};

type AuthState<S> = S extends null
  ? { session: null; isAuthenticated: false }
  : { session: S; isAuthenticated: true };

export default function useSession() {
  const [state, setState] = useState<State>({
    session: null,
    isLoading: true
  });

  async function refreshSession() {
    const session = await getSession();
    if (session) {
      setState({ session: session, isLoading: false });
    } else {
      setState(() => ({ session: null, isLoading: false }));
    }
  }

  useEffect(() => {
    refreshSession();
  }, []);

  const auth = {
    isAuthenticated: !!state.session,
    session: state.session
  } as AuthState<AmeeSession | null>;

  return {
    ...auth,
    isLoading: state.isLoading,
    refreshSession
  };
}
