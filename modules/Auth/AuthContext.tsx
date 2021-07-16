import nookies from "nookies";
import { createContext, useContext, useEffect, useState } from "react";
import firebaseSDK from "../../services/firebase";

const AuthContext = createContext<{ user: firebase.default.User | null }>(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return firebaseSDK.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        //Save cookie token only if the user is verified
        if (user.emailVerified) {
          const token = await user.getIdToken();
          nookies.set(undefined, "token", token, { path: "/" });
        }
      }
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const user = firebaseSDK.auth().currentUser;
      if (user && user.emailVerified) await user.getIdToken(true);
    }, 30 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(interval);
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
