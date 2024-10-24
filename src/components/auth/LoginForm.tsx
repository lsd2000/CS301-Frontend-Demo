// loginForm.tsx
"use client";

import "./LoginForm.css";
import AscendaTitle from "../../assets/ascenda-title.png";
import React from "react";
import { Button } from "@/components/ui/button";

const LoginForm: React.FC = () => {
  const constructCognitoLoginUrl = () => {
    const state =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("oauthState", state);

    const domain = import.meta.env.VITE_COGNITO_DOMAIN;
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    // Ensure the redirectUri matches exactly what's registered in Cognito, including the protocol (http/https).
    const redirectUri = encodeURIComponent(
      import.meta.env.VITE_COGNITO_REDIRECT_URI_PROD
    );
    // Use only the scopes needed for your application.
    const scope = encodeURIComponent("email openid phone profile");

    return `https://${domain}/login?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
  };

  return (
    <div className="login-container">
      <img
        src={AscendaTitle}
        style={{ width: "70%", margin: "0 auto" }}
        alt="CompanyTitle"
      />
      <h2 style={{ margin: "10px" }}>Administrative Portal</h2>
      <Button
        onClick={() => (window.location.href = constructCognitoLoginUrl())}
      >
        Sign in
      </Button>
    </div>
  );
};

export default LoginForm;
