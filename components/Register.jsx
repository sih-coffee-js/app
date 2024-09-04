import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toast } from '../utils/toast';

const Register = () => {
    const [confPass, setConfPassword] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [isclicked, setIsClicked] = useState(false);
    const [fullName, setFullName] = useState('');
    const navigation = useNavigation();

    const storeData = async (token, id, currentuser, userdetails) => {
        try {
            // console.log(userdetails);
            const user = JSON.stringify(currentuser);
            await AsyncStorage.setItem('user', user);
            await AsyncStorage.setItem('id', id);
            await AsyncStorage.setItem('token', token);
            const expo_token=await AsyncStorage.getItem('expo_token');
            if(expo_token&&expo_token!='') {
                const { data } = await axios.post('/api/notification/register',{userId:id,token:expo_token})
                if(!data.status) {
                    toast(data.message);
                }
            }
        } catch (e) {
            toast(String(e));
        }
    };

    function validatePassword(password) {
        // Check if password length is at least 8 characters
        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }

        // Check if password contains at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter";
        }

        // Check if password contains at least one lowercase letter
        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter";
        }

        // Check if password contains at least one special character
        if (!/[^A-Za-z0-9]/.test(password)) {
            return "Password must contain at least one special character";
        }

        // Check if password contains at least one number
        if (!/\d/.test(password)) {
            return "Password must contain at least one number";
        }

        // If all conditions pass, return null indicating no warning
        return null;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isclicked) {
            return;
        }
        setIsClicked(true);
        const msg = validatePassword(password);
        if (msg) {
            setIsClicked(false);
            return toast(msg);
        }
        if (password !== confPass) {
            setIsClicked(false);
            return toast("Confirm password is not same as password")
        }
        try {

            const { data } = await axios.post('/api/auth/signup', {
                email, password, phoneNo: phone, fullName
            })
            if (!data.success) {
                toast(data.message);
            }
            else {
                toast("User is registered");
                const { success, ...rest } = data;
                await storeData(rest.token, rest._id, { fullName: rest.fullName, email: rest.email, phoneNo: rest.phoneNo, profilePicture: rest.profilePicture, role: rest.role });
                navigation.navigate('DashBoardHome');
            }
        } catch (error) {
            toast("Internal Error");
            console.log(error);
        }
        setIsClicked(false);
    };

    const handleLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <ScrollView className="h-full bg-white">
            <View className="justify-center px-8 py-8">
                <Text className="text-4xl font-bold mb-2.5">Get Started Now!</Text>
                <Text className="text-xl">Enter your details to create your account</Text>

                <View className="pt-[40px]">

                <TextInput
                        className="bg-[#0a0a0a0d] text-[#343538] p-4 rounded mb-2.5 w-full"
                        placeholder="Full Name"
                        placeholderTextColor="#343538"
                        value={fullName}
                        onChangeText={setFullName}
                        autoCapitalize="none"
                    />

                    <TextInput
                        className="bg-[#0a0a0a0d] text-[#343538] p-4 rounded mb-2.5 w-full"
                        placeholder="Email"
                        placeholderTextColor="#343538"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        className="bg-[#0a0a0a0d] text-[#343538] p-4 rounded mb-2.5 w-full"
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#343538"
                    />

                    <TextInput
                        className="bg-[#0a0a0a0d] text-[#343538] p-4 rounded mb-2.5 w-full"
                        placeholder="Confirm Password"
                        placeholderTextColor="#343538"
                        value={confPass}
                        onChangeText={setConfPassword}
                        autoCapitalize="none"
                    />

                    <TextInput
                        className="bg-[#0a0a0a0d] text-[#343538] p-4 rounded mb-2.5 w-full"
                        placeholder="Phone Number"
                        placeholderTextColor="#343538"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity className="p-4 bg-[#343538] mt-2 rounded-xl w-full items-center" onPress={handleSubmit}>
                        {isclicked == false ? (<Text className="text-white text-lg">Register</Text>) : <View className="py-1"><ActivityIndicator color="#ffffff" /></View>}
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-1 pt-2">
                        <Text className="">have an account? </Text>
                        <TouchableOpacity onPress={handleLogin}>
                            <Text className="text-[#343538] font-bold">Login Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default Register;
