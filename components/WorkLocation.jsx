import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";

function WorkHistory({ route }) {
    const { presentdata, id } = route.params;
    const isFocused = useIsFocused();
    const [data, setData] = useState([]);
    const [hour, setHour] = useState('');

    console.log(presentdata);

    useEffect(() => {
        async function fetchDetails() {
            try {
                const { data } = await axios.post('/api/record/getdate', {
                    userId: id,
                    date: date.dateString
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
        <View className="flex-1">
            <View style={styles.shadow} className="px-3 bg-white py-2 m-3 rounded-[10px]">
                <Text className="text-[20px] text-[#343538] font-bold">Present Employees</Text>
            </View>
            <View className="flex-col justify-center pt-2 px-1">
                {presentdata.map((user,index) => (
                    <View style={styles.shadow} key={index} className="p-4 bg-white mb-2 mx-1 rounded-[10px] w-[46%]">
                    <TouchableOpacity className="h-auto w-full">
                      <Image source={{ uri: user.profilePicture }} img="h-12 w-12 rounded-[100px]" className="h-12 w-12 mx-auto pr-2 mb-1 rounded-full" />
                      <Text className="text-center font-medium">{user.fullName}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
        </View>
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