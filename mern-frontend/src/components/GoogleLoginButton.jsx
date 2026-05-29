import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function GoogleLoginButton({ onSuccess, onError }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          onSuccess(credentialResponse);
        }}
        onError={() => {
          onError?.();
        }}
        useOneTap={false}
      />
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginButton;