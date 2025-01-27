import { create } from 'zustand'
import { createAuthSlice } from "./slices/auth-slice";
import { CreateChatSlice } from './slices/caht-slice';

export const useAuthStore = create((...a) => ({
    ...createAuthSlice(...a),    
    ...CreateChatSlice(...a),    
}));
    