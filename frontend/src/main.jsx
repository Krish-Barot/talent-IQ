import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setTokenGetter } from "./lib/clerkToken.js";


// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const queryClient = new QueryClient()

// Component to set up token getter
function ClerkTokenSetup() {
  const { getToken } = useAuth();
  
  // Set the token getter function - getToken is already a function, so we pass it directly
  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);
  
  return null;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <ClerkTokenSetup />
          <App />
        </ClerkProvider>
      </QueryClientProvider>

    </BrowserRouter>

  </StrictMode>,
)
