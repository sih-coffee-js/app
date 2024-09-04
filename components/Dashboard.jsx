import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Logout from '../assets/logout1.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import {
    GoogleSignin,
} from '@react-native-google-signin/google-signin';
import axios from 'axios';
import { toast } from '../utils/toast';
import { useNavigation } from '@react-navigation/native';

function Dashboard(props) {
    const [name, setName] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        async function fetchname() {
            const fullname = await getData('user', 'fullName', '');
            const ininame = fullname.split(' ')[0];
            setName(ininame);
        }
        fetchname();
    }, [])

    async function logout() {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('phone');
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userdetail');
        await AsyncStorage.removeItem('id');
        const isgoogle = await getData('signin', null, '');
        if (isgoogle === 'google') {
            GoogleSignin.revokeAccess();
            GoogleSignin.signOut();
        }
        const expo_token = await AsyncStorage.getItem('expo_token');
        if (expo_token && expo_token != '') {
            console.log('UNREgister')
            const { data } = await axios.post('/api/notification/unregister', { token: expo_token })
            if (!data.status) {
                toast("Unable to unregister device on server!!");
            }
        }
        navigation.navigate('FrontPage');
    }

    const getData = async (data, field, defaultvalue) => {
        try {
            //const user = JSON.stringify(currentuser);
            var dat = await AsyncStorage.getItem(data);
            console.log(dat);
            if (field != null && dat != null) {
                dat = JSON.parse(dat);
                if (dat.hasOwnProperty(field)) {
                    return dat[field];
                }
                return defaultvalue;
            }
            if (dat != null) {
                return dat;
            }
            return defaultvalue;
        } catch (e) {
            console.log(e);
            return defaultvalue;
        }
    };

    return (
        <ScrollView className={"pt-11 -mt-2 " + (props.bg ? "bg-[" + props.bg + "]" : "bg-white")}>
            <View style={styles.shadow} className="flex-row px-4 border-b-2 pb-2 mb-2 border-[#343538]">
                <View className="flex-1 flex-row gax-x-4 my-auto">
                    <Text className="text-[24px] text-center font-bold text-white bg-[#343538] p-1 rounded-[10px]">Hi,</Text>
                    <Text className="text-[24px] text-center font-bold text-[#0E46A3] my-auto"> {name}</Text>
                </View>
                <TouchableOpacity onPress={logout} className="ml-auto">
                    <View className="flex-1 flex-row rounded-[5px] pl-2 m-auto border border-[#343538]">
                        <Text className="text-center font-bold text-gray-800 my-auto text-[#343538]">Logout</Text>
                        <View className="rounded-[100px] h-[36px] w-[36px] m-auto bg-white">
                            <Image className="h-[24px] w-[24px] m-auto " source={Logout} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            {props.children}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    shadow: {
        backgroundColor: "#fff",
        borderWidth: 7,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderColor: "#ffffff",
        elevation: 7,
        shadowColor: "#000",
        shadowRadius: 7,
        shadowOpacity: .8,
        shadowOffset: { width: 0, height: 10 }
    },
});

export default Dashboard;