import React from 'react';
import {
    SectionList,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';

import auth from '@react-native-firebase/auth';

import { useUser } from '../../contexts/UserContext';

const SettingsScreen = ({ navigation }: any) => {

    const settingsData = [
        {
            title: 'Account',
            data: [
                { label: 'Profile', onPress: (navigation: any) => navigation.navigate('EditProfile'), },
            ],
        },
        {
            title: 'Stock',
            data: [
                { label: 'List', onPress: (navigation: any) => navigation.navigate('StockList'), },
                { label: 'Import CSV', onPress: (navigation: any) => navigation.navigate('ImportCSVScreen'), },
            ],
        },
        {
            title: 'Other',
            data: [
                { label: 'About', onPress: () => console.log('About') },
                { label: 'Logout', onPress: () => handleLogout(), },
            ],
        },
    ];

    const handleLogout = async () => {
        try {
            await auth().signOut();
            setUserInfo(null); // clear user context
            console.log('✅ Logged out');
            // Optional: navigate to login screen if not using auth listener
        } catch (err) {
            console.error('❌ Logout error:', err);
        }
    };

    const { userInfo, setUserInfo } = useUser();

    return (
        <View style={styles.container}>
            <SectionList
                sections={settingsData.map(section => ({
                    ...section,
                    data: section.data.map(item => ({
                        ...item,
                        onPress: () => item.onPress(navigation),
                    })),
                }))}
                keyExtractor={(item, index) => item.label + index}

                ListHeaderComponent={
                    <View style={styles.profileContainer}>
                        <Image source={{ uri: userInfo?.avatar ?? 'https://ui-avatars.com/api/?name=Haoyi+Thong&background=0D8ABC&color=fff' }} style={styles.avatar} />
                        <Text style={styles.name}>{userInfo?.name ?? 'User'}</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={item.onPress} style={styles.item}>
                        <Text style={styles.label}>{item.label}</Text>
                    </TouchableOpacity>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.header}>{title}</Text>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.container}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 16,
        backgroundColor: '#f9f9f9',
    },
    profileContainer: {
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: 24,
        marginBottom: 10,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        marginBottom: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    header: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 4,
    },
    item: {
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    label: {
        fontSize: 16,
        color: '#000',
    },
    separator: {
        height: 1,
        backgroundColor: '#eaeaea',
        marginLeft: 16,
    },
});

export default SettingsScreen;