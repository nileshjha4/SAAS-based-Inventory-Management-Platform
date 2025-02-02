import { create } from "zustand"

export const useAdminState=create((set)=>({
    admin : {
        isLoggedIn: false,
        token: '',
        name: ''
    },
    setAdmin: (user) => set({ admin: user })
}))