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

    const getData = async (data, field, defaultvalue) => {
        try {
            var dat = await AsyncStorage.getItem(data);
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
                });
                setData(data);
            } catch (e) {
                console.log(e);
            }
        }
        fetchDetails();
    }, [id]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.shadow} className="px-3 bg-white py-2 m-3 rounded-[12px]">
                <Text style={styles.sectionTitle}>Present Employees</Text>
            </View>
            {presentdata.length > 0 ? (
                <View style={styles.userGrid}>
                    {presentdata.map((user, index) => (
                        <View style={styles.userCard} key={index}>
                            <TouchableOpacity>
                                <Image 
                                    source={{ uri: user.profilePicture }} 
                                    style={styles.userImage} 
                                />
                                <Text style={styles.userName}>{user.fullName}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.noDataContainer}>
                    <LottieView 
                        source={require('../assets/lottie/404.json')} 
                        autoPlay 
                        loop 
                        style={styles.lottieAnimation} 
                    />
                    <Text style={styles.noDataText}>No Users Found</Text>
                </View>
            )}
            
            <View style={styles.shadow} className="px-3 bg-white py-2 m-3 rounded-[10px]">
                <Text style={styles.sectionTitle}>Currently Working Employees</Text>
            </View>
            {data.length > 0 ? (
                <View style={styles.userGrid}>
                    {data.map((user, index) => (
                        <View style={styles.userCard} key={index}>
                            <TouchableOpacity>
                                <Image 
                                    source={{ uri: user.profilePicture }} 
                                    style={styles.userImage} 
                                />
                                <Text style={styles.userName}>{user.fullName}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.noDataContainer}>
                    <LottieView 
                        source={require('../assets/lottie/404.json')} 
                        autoPlay 
                        loop 
                        style={styles.lottieAnimation} 
                    />
                    <Text style={styles.noDataText}>No Users Found</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f9fc',
    },
    sectionTitle: {
        fontSize: 20,
        color: '#343538',
        fontWeight: 'bold',
    },
    userGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    userCard: {
        width: '48%',
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 12,
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    userImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignSelf: 'center',
        marginBottom: 8,
    },
    userName: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        fontWeight: '600',
    },
    noDataContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    lottieAnimation: {
        width: 200,
        height: 200,
    },
    noDataText: {
        fontSize: 18,
        color: '#36454f',
        fontWeight: 'bold',
        marginTop: -24,
    },
    shadow: {
        elevation: 10,
        shadowColor: "rgba(0,0,0,0.6)",
        shadowRadius: 7,
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 10 },
    },
});

export default WorkHistory;
