import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StoreState {
    loading: boolean;
    setLoading: () => void;
    setLoaded: () => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (value?: boolean) => void;
    token?: string;
    setToken: (token: string) => void;
}

// export const useStore = create<StoreState>((set) => {
//     let token = localStorage.getItem('token');
//     let isAuthenticated = false;
//     if (token) {
//         isAuthenticated = true;
//     }

//     return {
//         loading: false,
//         setLoading: () => set({ loading: true }),
//         setLoaded: () => set({ loading: false }),
//         isAuthenticated: isAuthenticated,
//         setIsAuthenticated: (value, token) => {
//             set({ isAuthenticated: value });

//             if (value && token) {
//                 localStorage.setItem('token', token);
//             }
//         },
//     };
// });

const getInitialToken = () => {};

export const useStore = create<StoreState>()(
    persist(
        (set, get) => ({
            loading: false,
            setLoading: () => set({ loading: true }),
            setLoaded: () => set({ loading: false }),
            isAuthenticated: false,
            setIsAuthenticated: (value?) => {
                set({ isAuthenticated: value });
            },
            token: '',
            setToken: (token) => {
                let isAuthenticated = false;
                if (token) {
                    isAuthenticated = true;
                }
                set({
                    token: token,
                    isAuthenticated: isAuthenticated,
                });
            },
        }),
        {
            name: 'auth', // name of the item in the storage (must be unique)
            partialize: (state) =>
                Object.fromEntries(
                    Object.entries(state).filter(([key]) =>
                        ['token', 'redirect'].includes(key),
                    ),
                ),
        },
    ),
);
