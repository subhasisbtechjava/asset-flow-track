import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    return children;
  }
  return <Navigate to="/" />;

};

export default AuthGuard;
