import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toast } from '../utils/toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isclicked, setIsClicked] = useState(false);
    const navigation = useNavigation();

    const storeData = async (token, id, currentuser) => {
        try {
            const user = JSON.stringify(currentuser);
            await AsyncStorage.setItem('user', user);
            await AsyncStorage.setItem('id', id);
            await AsyncStorage.setItem('token', token);
            const expo_token = await AsyncStorage.getItem('expo_token');
            if (expo_token && expo_token != '') {
                const { data } = await axios.post('/api/notification/register', { userId: id, token: expo_token })
                if (!data.status) {
                    console.log(data.message);
                }
            }
        } catch (e) {
            toast(String(e));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isclicked) {
            return;
        }
        setIsClicked(true);
        try {
            var { data } = await axios.post('/api/auth/signin', {
                email,
                password
            })
            toast("Hi");
            console.log(data);
            if (!data.success) {
                toast(data.message);
            }
            else {
                toast("User login successful")
                const { success, ...rest } = data;
                await storeData(rest.token, rest._id, { fullName: rest.fullName, email: rest.email, phoneNo: rest.phoneNo, profilePicture: rest.profilePicture, role: rest.role });
                if (rest.role === "User") {
                    navigation.navigate('DashboardHome')
                } else {
                    navigation.navigate('AdminHome')
                }
            }
        } catch (error) {
            console.log(error);
            toast("Please Check Your Internet Connection")
        }
        setIsClicked(false);
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <ScrollView className="h-full bg-white">
            <View className="justify-center px-8 py-16">
                <Text className="text-4xl font-bold mb-2.5">Welcome Back!</Text>
                <Text className="text-xl mb-5">Enter your credentials to access your account</Text>

                <View className="pt-[50px]">
                    <TextInput
                        className="bg-[#0a0a0a0d] text-[#343538] p-4 rounded mb-2.5 w-full font-reg"
                        placeholder="Email"
                        placeholderTextColor="#343538"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        className="bg-[#0a0a0a0d] text-[#343538] p-4 rounded mb-2.5 w-full font-reg"
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#343538"
                    />

                    <TouchableOpacity className="p-4 bg-[#343538] rounded-xl w-full items-center" onPress={handleSubmit}>
                        {isclicked == false ? (<Text className="text-white text-lg">Login</Text>) : <View className="py-1"><ActivityIndicator color="#ffffff" /></View>}
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-2.5 pt-2">
                        <Text className="">Don't have an account? </Text>
                        <TouchableOpacity onPress={handleRegister}>
                            <Text className="text-[#343538] font-bold">Register Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default Login;
