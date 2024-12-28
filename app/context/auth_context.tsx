import { User } from "@/redux/models/user.model";
import { createContext, useContext, useState } from "react";

type AuthData = {
    user: User | undefined;
    setUser: (user: User) => void;
};

const AuthContext = createContext<AuthData | undefined>(undefined);

export default function AuthProvider({ children }: React.PropsWithChildren) {
    const [user, setUser] = useState<User | undefined>(undefined);

    const initialValue: AuthData = {
        user,
        setUser,
    };

    return (
        <AuthContext.Provider value={initialValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context;
}
