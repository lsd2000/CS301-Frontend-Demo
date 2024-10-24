import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      // No code in the URL, navigate the user elsewhere, e.g., back to login
      navigate("/login");
      return;
    }

    const exchangeCodeForToken = async (code: string) => {
      const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID as string;
      const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI_PROD;
      const userPoolId = import.meta.env.VITE_COGNITO_USERPOOLID as string;

      const params = new URLSearchParams();
      params.append("grant_type", "authorization_code");
      params.append("client_id", clientId);
      params.append("redirect_uri", redirectUri);
      params.append("code", code);

      try {
        const response = await fetch(
          `https://${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to exchange code for tokens");
        }

        const data = await response.json();

        //Verify the tokens

        console.log(data);

        // Verifier that expects valid access tokens:
        const verifier = CognitoJwtVerifier.create({
          userPoolId: userPoolId,
          tokenUse: "id",
          clientId: clientId,
        });

        try {
          const payload = await verifier.verify(data.id_token);
          const customRole = payload["custom:role"];
          console.log("Token is valid. Payload:", payload);
          console.log(customRole);

          const userHeaders = {
            id: payload["custom:id"],
            role: payload["custom:role"],
            bank: payload["custom:bank"],
          };
          sessionStorage.setItem("user_headers", JSON.stringify(userHeaders));
        } catch {
          console.log("Token not valid!");
        }

        // Store the tokens in sessionStorage or localStorage
        sessionStorage.setItem("id_token", data.id_token);
        sessionStorage.setItem("access_token", data.access_token);

        // Set a cookie to indicate authentication
        // You might want to adjust the max-age/Expires, Secure, and HttpOnly flags as necessary
        // For example, setting a cookie valid for 1 day
        document.cookie =
          "authenticated=true; max-age=86400; path=/; Secure; SameSite=Strict";
        // Redirect the user to the homepage or dashboard
        navigate("/");
      } catch (error) {
        console.error("Error exchanging code for tokens:", error);
        navigate("/login");
      }
    };

    exchangeCodeForToken(code);
  }, [navigate]);

  return <div>Logging you in...</div>;
};

export default AuthCallbackPage;
