import { User } from "@/redux/models/user.model";
import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { authSlice, useRefreshTokenMutation } from "@/redux/auth.slice";
import { api } from "@/redux/api";
import { useDispatch } from "react-redux";

type AuthData = {
    user: User | undefined;
    setUser: (user: User) => void;
    token: string | undefined;
    setToken: (token: string) => void;
    getRefreshTokenStorage: () => Promise<string | undefined>;
    setRefreshTokenStorage: (token: string) => Promise<void>;
    logOut: () => Promise<void>;
    tokenIsExpired: (token: string) => boolean;
};

const AuthContext = createContext<AuthData | undefined>(undefined);

export default function AuthProvider({ children }: React.PropsWithChildren) {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [ getUser, getUserResult ] = authSlice.endpoints.getUser.useLazyQuery();
    const [token, setToken] = useState<string | undefined>(undefined);
    const [_refreshTokens] = useRefreshTokenMutation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user && !token) {
            refreshTokens();
        }
    }, [user]);

    useEffect(() => {
        if (token) {
            getUser(token);
        }
    }, [token]);

    useEffect(() => {
        if (getUserResult.data) {
            setUser(getUserResult.data);
        }
    });

    const tokenIsExpired = (token: string) => {
        const t: { exp: number } = jwtDecode(token);
        const time = Date.now();
        return t.exp < time / 1000;
    };

    async function refreshTokens() {
        await getRefreshTokenStorage().then(async (rt) => {
            if (rt) {
                await _refreshTokens(rt).then((res) => {
                    if (res.data) {
                        setToken(res.data.token);
                        setRefreshTokenStorage(res.data.refresh_token);
                    }
                });
            }
        });
    }

    const getRefreshTokenStorage = async () => {
        try {
            const rt = await AsyncStorage.getItem("refresh_token");
            if (!rt) {
                return undefined;
            }
            if (tokenIsExpired(rt)) {
                return undefined;
            }
            return rt;
        } catch (e) {
            throw new Error("error getting refresh token");
        }
    };

    const setRefreshTokenStorage = async (token: string) => {
        try {
            await AsyncStorage.setItem("refresh_token", token);
        } catch (e) {
            throw new Error("error setting refresh token");
        }
    };

    const logOut = async () => {
        try {
            await AsyncStorage.removeItem("refresh_token").then(() => {
                dispatch(api.util.resetApiState());
                setToken(undefined);
                setUser(undefined);
            });
        } catch {}
    };

    const initialValue: AuthData = {
        user,
        setUser,
        token,
        setToken,
        tokenIsExpired,
        getRefreshTokenStorage,
        setRefreshTokenStorage,
        logOut,
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
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
