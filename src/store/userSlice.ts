import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export interface UserInfo {
    uid: string;
    email: string;
    name: string;
    avatar: string;
}

interface UserState {
    userInfo: UserInfo | null;
    loading: boolean;
}

const initialState: UserState = {
    userInfo: null,
    loading: true,
};

export const fetchUserInfo = createAsyncThunk(
    'user/fetchUserInfo',
    async (): Promise<UserInfo | null> => {
        const user = auth().currentUser;
        if (!user) return null;

        try {
            const doc = await firestore().collection('users').doc(user.uid).get();
            const firestoreData = doc.exists() ? doc.data() : {};
            const name = firestoreData?.name ?? user.displayName ?? '';
            const trimName = name.replace(/ /g, '-');
            const avatar =
                firestoreData?.avatar ??
                user.photoURL ??
                `https://ui-avatars.com/api/?name=${trimName}&background=0D8ABC&color=fff`;

            return {
                uid: user.uid,
                email: user.email ?? '',
                name,
                avatar,
            };
        } catch (err) {
            console.error('🔥 Failed to load user info:', err);
            return {
                uid: user.uid,
                email: user.email ?? '',
                name: user.displayName ?? '',
                avatar: user.photoURL ?? '',
            };
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload;
            state.loading = false;
        },
        clearUser(state) {
            state.userInfo = null;
            state.loading = false;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchUserInfo.pending, state => {
                state.loading = true;
            })
            .addCase(fetchUserInfo.fulfilled, (state, action: PayloadAction<UserInfo | null>) => {
                state.userInfo = action.payload;
                state.loading = false;
            })
            .addCase(fetchUserInfo.rejected, state => {
                state.userInfo = null;
                state.loading = false;
            });
    },
});

export const { setUserInfo, clearUser } = userSlice.actions;
export default userSlice.reducer;