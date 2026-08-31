import { createContext } from "react";
import type { AuthContextType } from "../components/auth/AuthProvider";

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;