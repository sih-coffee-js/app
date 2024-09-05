import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Dashboard from './Dashboard';
import LinearGradient from 'react-native-linear-gradient';
import { useState, useEffect } from 'react';
import axios from 'axios';

function DashboardTools({ navigation }) {
    // const users = [
    //     {
    //         name: "Kaveri Kitchen",
    //         latitude: 15.4589,  
    //         longitude: 75.0078,
    //     },
    //     {
    //         name: "Rohan Sharma",
    //         latitude: 28.6315,  
    //         longitude: 77.2167,
    //     },
    //     {
    //         name: "Meera Patel",
    //         latitude: 22.3072,  
    //         longitude: 73.1812,
    //     },
    //     {
    //         name: "Amit Singh",
    //         latitude: 19.0760,  
    //         longitude: 72.8777,
    //     },
    //     {
    //         name: "Pooja Desai",
    //         latitude: 20.2961,  
    //         longitude: 85.8245,
    //     },
    //     {
    //         name: "Suresh Kumar",
    //         latitude: 12.9716,  
    //         longitude: 77.5946,
    //     },
    // ];

    const [users, setUsers] = useState([]);

    useEffect(()=>{
        async function fetchlocations() {
            try {
                const { data } = await axios.get('/api/location/getall')
                setUsers(data);
            } catch(e) {
                console.log(e);
            }
        }
        fetchlocations();
    },[])

    const openMapWithDirections = (latitude, longitude) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
        Linking.openURL(url);
    };

    return (
        <Dashboard navigation={navigation} bg="#f5f7fc">
            <View style={styles.container}>
                {users.map((user, index) => (
                    <LinearGradient 
                        key={index}
                        colors={['#ffffff', '#ffffff']} 
                        style={[styles.card, styles.shadow]}
                        className={`${index===users.length-1?'mb-8':''}`}>
                        <TouchableOpacity  onPress={() => openMapWithDirections(user.latitude, user.longitude)}>
                            <Text style={styles.title}>{user.name}</Text>
                            <Text style={styles.directionText}>Tap to Get Directions</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                ))}
            </View>
        </Dashboard>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
        flex: 1,
        justifyContent: 'center',
        
    },
    card: {
        borderRadius: 12,
        padding: 6,
        marginVertical: 6,
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#2a2a2a',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#343538',
        textAlign: 'center',
        marginBottom: 12,
    },
    directionText: {
        textAlign: 'center',
        color: '#0E46A3',
        fontWeight: '600',
        fontSize: 16,
    },
    shadow: {
        elevation: 12,
        shadowColor: "rgba(0, 0, 0, 0.9)",
        shadowRadius: 20,
        shadowOpacity: 0.8,
        shadowOffset: { width: 0, height: 20 },
    },
});

export default DashboardTools;
