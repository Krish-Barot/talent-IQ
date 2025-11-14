// Token manager for Clerk authentication
let getTokenFn = null;

export const setTokenGetter = (fn) => {
  getTokenFn = fn;
};

export const getClerkToken = async () => {
  if (getTokenFn) {
    try {
      // getTokenFn is the getToken function from useAuth, call it to get the token
      const token = await getTokenFn();
      return token;
    } catch (error) {
      console.warn("Error getting Clerk token:", error);
      return null;
    }
  }
  return null;
};

