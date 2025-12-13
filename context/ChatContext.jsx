import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { useEffect } from "react";

export const ChatContext = createContext();


export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setselectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});


    const [isMotionEnabled, setIsMotionEnabled] = useState(() => {
        const saved = localStorage.getItem("isMotionEnabled");

        return saved !== null ? JSON.parse(saved) : true;
    });

    // current mood defaults to neutral
    const [currentMood, setCurrentMood] = useState({ emotion: "neutral", intensity: 1 });

    const { socket, axios } = useContext(AuthContext);

    // toggle function
    const toggleMotion = () => {
        setIsMotionEnabled((prev) => {
            const newValue = !prev;
            localStorage.setItem("isMotionEnabled", JSON.stringify(newValue));
            return newValue;
        });
    };

    //function to get all users to sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to get messages for selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    //function to send messages for the selected user
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage])
                setUsers(prevUsers => {
                    const updatedUsers = prevUsers.map(user => {
                        if (user._id === selectedUser._id) {
                            return { ...user, lastMessage: data.newMessage.text || "Photo", lastMessageTime: data.newMessage.createdAt };
                        }
                        return user;
                    });
                    return updatedUsers;
                });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //function to subscribe to messages for selected user
    const subscribeToMessages = async () => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages, [newMessage.senderId]:
                        prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages
                        [newMessage.senderId] + 1 : 1
                }))
            }
            setUsers(prevUsers => {
                const updatedUsers = prevUsers.map(user => {
                    if (user._id === newMessage.senderId) {
                        return { ...user, lastMessage: newMessage.text || "Photo", lastMessageTime: newMessage.createdAt };
                    }
                    return user;
                });
                return updatedUsers;
            });
        })


        socket.on("moodUpdate", ({ userId, ...newMood }) => {
            if (selectedUser && userId === selectedUser._id) {
                setCurrentMood(newMood);
            }
        });
    }


    //function to unsubscribe from messages
    const unsubscribeFromMessages = () => {
        if (socket) {
            socket.off("newMessage");
            socket.off("moodUpdate");
        }
    }

    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser])

    // reset mood when switching users
    useEffect(() => {
        if (selectedUser) {

            setCurrentMood({ emotion: "neutral", intensity: 1 });
        }
    }, [selectedUser]);


    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setselectedUser,
        unseenMessages,
        setUnseenMessages,

        isMotionEnabled,
        toggleMotion,
        currentMood,
        setCurrentMood
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}