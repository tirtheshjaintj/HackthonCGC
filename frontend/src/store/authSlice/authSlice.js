// authStore.js
import { create } from 'zustand';

const createUserAuthSlice = (set) => ({
  user: null,
  accessToken: null,
  isLogged: false,

  logout: () => {
    set(() => ({
      user: null,
      accessToken: null,
      isLogged: false,
    }));
  },

  setUser: ({ user, accessToken }) => {
    set(() => ({
      user,
      accessToken,
      isLogged: true,
    }));
  },
});

const useAuthStore = create((set) => ({
  ...createUserAuthSlice(set),
}));

export default useAuthStore;
