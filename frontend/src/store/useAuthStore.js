import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.post("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));


// prev code
// import { create } from 'zustand';
// import { axiosInstance } from '../lib/axios';
// import { toast } from 'react-hot-toast';
// // import { disconnect } from 'mongoose';
// import {io} from 'socket.io-client';
// // import { disconnect } from 'mongoose';

// const BASE_URL = "http://localhost:3000";

// export const useAuthStore = create((set,get) => ({
//   authUser: null,
//   isSigninUp: false,
//   isLoggingIn: false,
//   isUpdatingProfile: false,
//   isCheckingAuth: true,
//   onlineUsers: [],
//   socket: null,

//   checkAuth: async () => {
//     try {
//       const res = await axiosInstance.get('/auth/check');
//       set({ authUser: res.data });
//       get().connectSocket();
//     } catch (error) {
//       console.log('error in checkAuth', error);
//       set({ authUser: null });
//     } finally {
//       set({ isCheckingAuth: false });
//     }
//   },

//   signup: async (data) => {
//     set({ isSigninUp: true });
//     try {
//       const res = await axiosInstance.post('/auth/signup', data);
//       if (res && res.data) {
//         set({ authUser: res.data });
//         toast.success("Account created successfully");
//       } else {
//         toast.error("Failed to create account");
//       }
//       get().connectSocket();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "An error occurred");
//     } finally {
//       set({ isSigninUp: false });
//     }
//   },

//   login: async (data) => {
//     set({ isLoggingIn: true });
//     try {
//       const res = await axiosInstance.post('/auth/login', data);
//       if (res && res.data) {
//         set({ authUser: res.data });
//         toast.success("Logged in successfully");
//       } else {
//         toast.error("Failed to log in");
//       }
//       get().connectSocket();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "An error occurred");
//     } finally {
//       set({ isLoggingIn: false });
//     }
//   },

//   logout: async () => {
//     try {
//       await axiosInstance.post('/auth/logout');
//       set({ authUser: null });
//       toast.success("Logged out successfully");
//       get().disconnectSocket();
//     } catch (error) {
//       toast.error(error.response?.data?.message || "An error occurred");
//     }
//   },
//   updateProfile: async (data) => {
//     set({ isUpdatingProfile: true });
//     try {
//       const res = await axiosInstance.post('/auth/update-profile', data);
//       if (res && res.data) {
//         set({ authUser: res.data });
//         toast.success("Profile updated successfully");
//       } else {
//         toast.error("Failed to update profile");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "An error occurred");
//     } finally {
//       set({ isUpdatingProfile: false });
//     }
//   },
//   connectSocket: () => {
//     const { authUser } = get();
//     if (!authUser || get().socket?.connected) return;
//     const socket = io(BASE_URL);
//     socket.connect();
//     set({ socket });
//   },

//   disconnectSocket: () => {
//     const { socket } = get();
//     if (socket) {
//       socket.disconnect();
//       set({ socket: null });
//     }
//   },
  // disconnectSocket: () => {
  //   if(get().socket?.connected) get().socket.disconnect();
  // },
// }));
