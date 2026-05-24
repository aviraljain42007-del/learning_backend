// import { createContext, useContext, useEffect, useReducer,} from "react";
// import { getCurrentUser, loginUser, logoutUser, registerUser } from "../services/authService";

// const AuthContext = createContext(null);

// const initialAuthState = {
//   user: null,
//   authLoading: true,
// };

// function authReducer(state, action) {
//   switch (action.type) {
//     case "AUTH_SUCCESS":
//       return {
//         ...state,
//         user: action.payload,
//         authLoading: false,
//       };
    
//     case "AUTH_FAIL":
//       return {
//         ...state,
//         user: null,
//         authLoading: false,
//       };

//     case "LOGOUT":
//       return {
//         ...state,
//         user: null,
//         authLoading: false,
//       };

//     default:
//       return state;
//   }
// }

// export function AuthProvider({ children }) {
//   const [state, dispatch] = useReducer(
//     authReducer,
//     initialAuthState
//   );

//   async function login(formData) {
//     const data = await loginUser(formData);

//     if (data.user) {
//       dispatch({
//         type: "AUTH_SUCCESS",
//         payload: data.user,
//       });
//     } else {
//       const currentUserData = await getCurrentUser();

//       dispatch({
//         type: "AUTH_SUCCESS",
//         payload: currentUserData.user,
//       });
//     }

//     return data;
//   }

//   async function register(formData) {
//     const data = await registerUser(formData);

//     if (data.user) {
//       dispatch({
//         type: "AUTH_SUCCESS",
//         payload: data.user,
//       });
//     } else {
//       const currentUserData = await getCurrentUser();

//       dispatch({
//         type: "AUTH_SUCCESS",
//         payload: currentUserData.user,
//       });
//     }

//     return data;
//   }

//   async function logout() {
//     await logoutUser();

//     dispatch({
//       type: "LOGOUT",
//     });
//   }

//   useEffect(() => {
//     async function loadCurrentUser() {
//       try {
//         const data = await getCurrentUser();

//         dispatch({
//           type: "AUTH_SUCCESS",
//           payload: data.user || null,
//         });
//       } catch (error) {
//         dispatch({
//           type: "AUTH_FAIL",
//         });
//       }
//     }

//     loadCurrentUser();
//   }, []);

//   const value = {
//     user: state.user,
//     authLoading: state.authLoading,
//     login,
//     register,
//     logout,
//     isAuthenticated: Boolean(state.user),
//     isAdmin: state.user?.role === "admin",
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error("useAuth must be used inside AuthProvider");
//   }

//   return context;
// }