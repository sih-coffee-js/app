import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import User from './User';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import LottieView from 'lottie-react-native';

function DashboardHome({ navigation }) {
    const isFocused = useIsFocused();
    const [data, setData] = useState([]);
    const [hour, setHour] = useState('');

    useEffect(() => {
        async function fetchDetails() {
            const id = await getData('userid', null, '');
            console.log(`id: ${id}`);
            const date = new Date();
            try {
                const { data } = await axios.post('/api/record/getdate', {
                    userId: id,
                    date
                })

                console.log(data);
                calculateWorkingHours(data);
                setData(data);
            } catch (e) {
                console.log(e);
            }
        }
        function calculateWorkingHours(data) {
            const checkIns = data.filter(event => event.type === 'CheckIn').sort((a, b) => new Date(a.time) - new Date(b.time));
            const checkOuts = data.filter(event => event.type === 'CheckOut').sort((a, b) => new Date(a.time) - new Date(b.time));

            if (checkIns.length > checkOuts.length) {
                const lastCheckInDate = new Date(checkIns[checkIns.length - 1].time);
                const currentDate = new Date();
                if (
                    lastCheckInDate.getFullYear() !== currentDate.getFullYear() ||
                    lastCheckInDate.getMonth() !== currentDate.getMonth() ||
                    lastCheckInDate.getDate() !== currentDate.getDate()
                ) {
                    const endOfDay = new Date(lastCheckInDate);
                    endOfDay.setHours(23, 59, 59, 999);
                    checkOuts.push({
                        time: endOfDay.toISOString()
                    });
                } else {
                    checkOuts.push({
                        time: currentDate.toISOString()
                    });
                }
            }

            let totalWorkingMilliseconds = 0;

            for (let i = 0; i < checkIns.length && i < checkOuts.length; i++) {
                const checkInTime = new Date(checkIns[i].time).getTime();
                const checkOutTime = new Date(checkOuts[i].time).getTime();

                if (checkOutTime > checkInTime) {
                    totalWorkingMilliseconds += checkOutTime - checkInTime;
                }
            }

            const totalWorkingHours = Math.floor(totalWorkingMilliseconds / (1000 * 60 * 60));
            const totalWorkingMinutes = Math.floor((totalWorkingMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

            setHour(totalWorkingHours.toString() + ' hrs ' + totalWorkingMinutes.toString() + ' mins');
        }
        if (isFocused) {
            fetchDetails();
        }
    }, [isFocused])

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


    return (
        <User bg="#f5f7fc">
            <View style={styles.shadow} className="px-3 bg-white py-2 m-3 rounded-[10px]">
                <Text className="text-[20px] text-[#343538] font-bold">Today's Status</Text>
                <Text className="text-[16px] text-[#0E46A3] font-medium">Working for {hour}</Text>
            </View>

            {data.length > 0 ? <View className="flex-col justify-center pt-2 px-1">
                {data.map((record) => (
                    <View style={styles.shadow} key={record._id} className={`flex-1 flex-row justify-between p-4 mb-2 mx-1 rounded-[10px] ${record.type === 'CheckIn' ? 'bg-[#b7f4d8cd]' : 'bg-[#ff0c0f33]'}`}>
                        <View>
                            <Text className="font-bold">{record.location.name}</Text>
                            <Text>{record.type}</Text>
                        </View>
                        <Text className="font-bold text-[#36454f]">{new Date(record.time).toLocaleTimeString()}</Text>
                    </View>
                ))}
            </View> :
                <View>
                    <LottieView source={require('../assets/lottie/404.json')} autoPlay loop className="w-72 h-72 mx-auto" />
                    <Text className="text-center font-bold text-xl -mt-12 text-[#36454f]">No Resources Found</Text>
                </View>}
        </User>
    );
}

const styles = StyleSheet.create({
    shadow: {
        elevation: 10,
        shadowColor: "rgba(0,0,0,0.2)",
        shadowRadius: 7,
        shadowOpacity: .5,
        shadowOffset: { width: 0, height: 10 }
    },
});

export default DashboardHome;