import React, { createContext, useState, useEffect, useContext } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export type UserInfo = {
    uid: string;
    name: string;
    email: string;
    avatar?: string;
};

type UserContextType = {
    userInfo: UserInfo | null;
    setUserInfo: (user: UserInfo | null) => void;
};

const UserContext = createContext<UserContextType>({
    userInfo: null,
    setUserInfo: () => { },
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(async user => {
            if (user) {
                try {
                    const doc = await firestore().collection('users').doc(user.uid).get();
                    const firestoreData = doc.exists() ? doc.data() : {};
                    let name = firestoreData?.name ?? user.displayName ?? ''
                    let trimName = name.replace(/ /g, "-")
                    let avartar = firestoreData?.avatar ?? user.photoURL ?? `https://ui-avatars.com/api/?name=${trimName}&background=0D8ABC&color=fff`
                    const combinedUser: UserInfo = {
                        uid: user.uid,
                        email: user.email ?? '',
                        name: name,
                        avatar: avartar
                    };

                    setUserInfo(combinedUser);
                } catch (error) {
                    console.error('🔥 Failed to load user info:', error);
                    // fallback: just use auth info
                    setUserInfo({
                        uid: user.uid,
                        email: user.email ?? '',
                        name: user.displayName ?? '',
                        avatar: user.photoURL ?? ''
                    });
                }

            } else {
                setUserInfo(null);
            }
        });

        return unsubscribe;
    }, []);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);