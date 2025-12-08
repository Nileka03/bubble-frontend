import { createContext, useEffect, useState } from "react";
import { axiosInstance } from "../src/lib/axios"; // ✅ Import your new file
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const AuthContext = createContext();

// Dynamic URL for Socket.io (Localhost in dev, Root in prod)
const SOCKET_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    
    // ✅ CRITICAL FIX: Start as empty array [], NOT null
    const [onlineUsers, setOnlineUsers] = useState([]); 
    
    const [socket, setSocket] = useState(null);

    const connectSocket = (user) => {
        if (!user || socket?.connected) return;

        const newSocket = io(SOCKET_URL, {
            query: { userId: user._id },
        });
        
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });
    };

    const checkAuth = async () => {
        try {
            const { data } = await axiosInstance.get('/auth/check');
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            console.log("Not authenticated");
            setAuthUser(null);
        }
    };

    const login = async (state, credentials) => {
        try {
            const { data } = await axiosInstance.post(`/auth/${state}`, credentials);
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                localStorage.setItem("token", data.token);
                setToken(data.token);
                toast.success("Logged in successfully");
            }
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            toast.error(msg);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]); // Reset to empty array
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
        toast.success("Logged out successfully");
    };

    const updateProfile = async (body) => {
        try {
            const { data } = await axiosInstance.put("/auth/update-profile", body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteAccount = async () => {
        try {
            const { data } = await axiosInstance.delete("/auth/delete");
            if (data.success) {
                logout();
                toast.success("Account deleted successfully");
            }
        } catch (error) {
            toast.error("Failed to delete account");
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const value = {
        axiosInstance,
        authUser,
        onlineUsers, // This is now safe (always an array)
        socket,
        login,
        logout,
        updateProfile,
        deleteAccount
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};