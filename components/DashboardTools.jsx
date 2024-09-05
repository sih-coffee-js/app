import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Dashboard from './Dashboard';
<<<<<<< HEAD
import LinearGradient from 'react-native-linear-gradient';

function DashboardTools({ navigation }) {
    const users = [
        {
            name: "Kaveri Kitchen",
            latitude: 15.4589,  
            longitude: 75.0078,
        },
        {
            name: "Rohan Sharma",
            latitude: 28.6315,  
            longitude: 77.2167,
        },
        {
            name: "Meera Patel",
            latitude: 22.3072,  
            longitude: 73.1812,
        },
        {
            name: "Amit Singh",
            latitude: 19.0760,  
            longitude: 72.8777,
        },
        {
            name: "Pooja Desai",
            latitude: 20.2961,  
            longitude: 85.8245,
        },
        {
            name: "Suresh Kumar",
            latitude: 12.9716,  
            longitude: 77.5946,
        },
    ];

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
                        colors={['#1b1b1b', '#364F6B']} // Shades of black
                        style={[styles.card, styles.shadow]}>
                        <TouchableOpacity onPress={() => openMapWithDirections(user.latitude, user.longitude)}>
                            <Text style={styles.title}>{user.name}</Text>
                            <Text style={styles.directionText}>Tap to Get Directions</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                ))}
            </View>
=======
import { useState, useEffect } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

function DashboardTools({ navigation }) {
    return (
        <Dashboard navigation={navigation} bg="#f5f7fc">
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                region={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
            >
            </MapView>
>>>>>>> 527e2c8d7437d73a552c08a62bd2378067a67597
        </Dashboard>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
    },
    card: {
        borderRadius: 20,
        padding: 18,
        marginVertical: 12,
        width: '85%',
        alignSelf: 'center',
        backgroundColor: '#2a2a2a',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#e0e0e0',
        textAlign: 'center',
        marginBottom: 12,
    },
    directionText: {
        textAlign: 'center',
        color: '#bfbfbf',
        fontWeight: '600',
        fontSize: 18,
    },
    shadow: {
        elevation: 12,
        shadowColor: "rgba(0, 0, 0, 0.9)",
        shadowRadius: 20,
        shadowOpacity: 0.8,
        shadowOffset: { width: 0, height: 15 },
    },
    map: {
        flex: 1,
        height:"100%",
        width:"100%"
    }
});

export default DashboardTools;
