import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  useEffect(() => {
    onAuthStateChanged(auth, (cUser) => {
      setUser(cUser);
      setLoading(false);
    });
  });

  const googleSignIn = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const githubSignIn = () => {
    return signInWithPopup(auth, githubProvider);
  };
  const handleLogout = () => {
    return signOut(auth);
  };
  const data = {
    googleSignIn,
    user,
    loading,
    handleLogout,
    githubSignIn
  };

  return <AuthContext value={data}>{children}</AuthContext>;
};

export default AuthProvider;
