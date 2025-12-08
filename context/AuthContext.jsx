
import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import toast from "react-hot-toast";
import { io } from "socket.io-client"

const backendURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.baseURL = backendURL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(null);
    const [socket, setSocket] = useState(null);

    // connect socket function to handle socket conncetion and online users updates
    const connectSocket = (user) => {
        if (!user || socket?.connected) return;
        const newSocket = io(backendURL, {
            query: {
                userId: user._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        })
    }

    //check if the user is authenticated and if so, set the user data and connect to socket
    const checkAuth = async () => {
        try {
            const { data } = await axios.get('/api/auth/check');
            if (data.success) {
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            console.log(error);
        }
    }

    // login function to handle user authetication and socket connection
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                localStorage.setItem("token", data.token);
                setToken(data.token);
                toast.success("Logged in successfully");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
        }
    }

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
        toast.success("Logged out successfully")
    }

    // update profile function to handle user profile updates
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const deleteAccount = async () => {
        try {
            const { data } = await axios.delete("/api/auth/delete");
            if (data.success) {
                logout();
                toast.success("Account deleted successfully");
            }
        } catch (error) {
            toast.error("Failed to delete account");
            console.log(error);
        }
    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;
            checkAuth();
        }
    }, [])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
        deleteAccount
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}