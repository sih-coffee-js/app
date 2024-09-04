import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ellipse from '../assets/Ellipse.png';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import {
    GoogleSignin
} from '@react-native-google-signin/google-signin';
import googleicon from '../assets/google.png';
import axios from 'axios';
import { toast } from '../utils/toast';
import Animated, {
    useSharedValue,
    withTiming,
    Easing,
    useAnimatedStyle,
} from "react-native-reanimated";
import LottieView from 'lottie-react-native';

function FrontPage() {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [isclicked, setIsClicked] = useState(false);
    const fadeInOpacity = useSharedValue(0);


    useEffect(() => {
        setTimeout(() => {
            fadeIn()
        }, 100);
    }, []);

    const fadeIn = () => {
        fadeInOpacity.value = withTiming(1, {
            duration: 100,
            easing: Easing.linear,
        });
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: fadeInOpacity.value,
        };
    });

    const storeData = async (token, id, currentuser) => {
        try {
            console.log(token)
            const user = JSON.stringify(currentuser);
            await AsyncStorage.setItem('user', user);
            await AsyncStorage.setItem('id', id);
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('signin', 'google');
            const expo_token = await AsyncStorage.getItem('expo_token');
            console.log('expo_token: ' + expo_token);
            if (expo_token && expo_token != '') {
                const { data } = await axios.post('/api/notification/register', { userId: id, token: expo_token })
                if (!data.status) {
                    toast(data.message)
                }
            }
        } catch (e) {
            toast(String(e));
        }
    };

    useEffect(() => {
        async function IsLogin() {
            const token = await getData('token', null, false);
            if (token&&token!='') {
                navigation.navigate('DashboardHome');
            }
        }
        IsLogin();
        GoogleSignin.configure({
            webClientId:
                "892503852311-8jru2el4ajpj8ghi1kolf6kpq76hsb16.apps.googleusercontent.com",
        });
    }, [isFocused])

    const signingoogle = async () => {
        if (isclicked) {
            return;
        }
        setIsClicked(true);
        try {
            await GoogleSignin.hasPlayServices();
            const guser = await GoogleSignin.signIn();
            const user=guser.data;
            const res = await axios.post('/api/auth/google',
                {
                    name: user.user.name,
                    email: user.user.email,
                    googlePhotoUrl: user.user.photo,
                    accessToken: user.user.id
                }
            )
            if (res.data.token) {
                toast("Success");
                const { data } = res;
                console.log(data);
                await storeData(data.token, data._id, { fullName: data.fullName, email: data.email, phoneNo: data.phoneNo, profilePicture: data.profilePicture, role: data.role });
                navigation.navigate('DashboardHome')
            } else {
                toast(res.data.message);
            }
        } catch (e) {
            console.log(e);
            toast("Please Check Your Internet Connection")
        }
        setIsClicked(false);
    };

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
        <Animated.ScrollView style={animatedStyle} className="bg-white h-full">
            <View className="items-center pt-8 pb-8">
                <LottieView source={require('../assets/lottie/geo.json')} autoPlay loop style={styles.btnshadow} className="w-72 h-72" />
                {/* <Image source={heroImg} className="w-60 h-60" /> */}
                <Text style={styles.font} className="text-5xl font-bold text-[#343538]">GeoTrack</Text>
                <Text className="text-lg text-center text-gray-600 mb-5">
                    Geolocation-Based Attendance Tracking Mobile Application.
                </Text>
            </View>
            <View className="py-[50px]">
                <Image source={Ellipse} className="absolute w-full h-[312px] bottom-0" />
                <View className="px-8">
                    <TouchableOpacity
                        style={styles.btnshadow}
                        className="bg-white rounded-xl p-4 mb-3"
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text className="text-center text-lg">Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btnshadow}
                        className="bg-white rounded-xl p-4 mb-3"
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text className="text-center text-lg">Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.btnshadow}
                        className="bg-white rounded-xl p-3.5 flex-row items-center justify-center"
                        onPress={() => { signingoogle(); }}
                    >
                        {isclicked == false ? (<View className="flex-row"><Image source={googleicon} className="h-[24px] w-[24px] mr-2" />
                            <Text className="text-[#343538] text-center text-lg">Sign In With Google</Text></View>) : <View className="py-1 flex-row"><Text className="text-[#343538] font-[15px] pl-5">Signing in </Text><ActivityIndicator color="#4169E1" /></View>}
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.ScrollView>
    );
}

const styles = StyleSheet.create({
    shadow: {
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        textShadowColor: '#00000040',
        fontFamily: "PlaywriteCU"
    },
    font: {
        fontFamily: "PlaywriteCU-Regular"
    },
    btnshadow: {
        elevation: 4,
        shadowColor: "rgba(255,255,255,1)",
        shadowRadius: 7,
        shadowOpacity: .5,
        shadowOffset: { width: 0, height: 10 }
    },
});

export default FrontPage;
