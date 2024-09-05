import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import LottieView from 'lottie-react-native';

function WorkHistory({ route }) {
    const { presentdata, id } = route.params;
    const isFocused = useIsFocused();
    const [data, setData] = useState([]);
    const [hour, setHour] = useState('');

    console.log(presentdata);

    const getData = async (data, field, defaultvalue) => {
        try {
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

    useEffect(() => {
        async function fetchDetails() {
            try {
                const { data } = await axios.post('/api/location/present', {
                    locationId: id,
                })

                console.log(data);
                setData(data);
            } catch (e) {
                console.log(e);
            }
        }
        fetchDetails();
    }, [])

    return (
        <ScrollView className="flex-1">
            <View style={styles.shadow} className="px-3 bg-white py-2 m-3 rounded-[10px]">
                <Text className="text-[20px] text-[#343538] font-bold">Present Employees</Text>
            </View>
            {presentdata.length > 0 ? <View className="flex-wrap flex-row justify-center px-1">
                {presentdata.map((user, index) => (
                    <View style={styles.shadow} key={index} className="p-4 bg-white mb-2 mx-1 rounded-[10px] w-[46%]">
                        <TouchableOpacity className="h-auto w-full">
                            <Image source={{ uri: user.profilePicture }} img="h-12 w-12 rounded-[100px]" className="h-12 w-12 mx-auto pr-2 mb-1 rounded-full" />
                            <Text className="text-center font-medium">{user.fullName}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View> :
                <View>
                    <LottieView source={require('../assets/lottie/404.json')} autoPlay loop className="w-72 h-72 mx-auto" />
                    <Text className="text-center font-bold text-xl -mt-12 text-[#36454f]">No Users Found</Text>
                </View>}
            <View style={styles.shadow} className="px-3 bg-white py-2 m-3 rounded-[10px]">
                <Text className="text-[20px] text-[#343538] font-bold">Currently Working Employees</Text>
            </View>
            {data.length > 0 ? <View className="flex-wrap flex-row justify-center px-1">
                {data.map((user, index) => (
                    <View style={styles.shadow} key={index} className="p-4 bg-white mb-2 mx-1 rounded-[10px] w-[46%]">
                        <TouchableOpacity className="h-auto w-full">
                            <Image source={{ uri: user.profilePicture }} img="h-12 w-12 rounded-[100px]" className="h-12 w-12 mx-auto pr-2 mb-1 rounded-full" />
                            <Text className="text-center font-medium">{user.fullName}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View> :
                <View>
                    <LottieView source={require('../assets/lottie/404.json')} autoPlay loop className="w-72 h-72 mx-auto" />
                    <Text className="text-center font-bold text-xl -mt-12 text-[#36454f]">No Users Found</Text>
                </View>}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    shadow: {
        elevation: 10,
        shadowColor: "rgba(0,0,0,0.1)",
        shadowRadius: 7,
        shadowOpacity: .5,
        shadowOffset: { width: 0, height: 10 }
    },
});

export default WorkHistory;