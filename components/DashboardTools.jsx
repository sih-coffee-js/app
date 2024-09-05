import React from 'react';
import { View, ScrollView, Text, StyleSheet, TextInput } from 'react-native';
import Dashboard from './Dashboard';
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
        </Dashboard>
    );
}

const styles = StyleSheet.create({
    shadow: {
        elevation: 5,
        shadowColor: "rgba(0,0,255,.4)",
        shadowRadius: 7,
        shadowOpacity: .5,
        shadowOffset: { width: 0, height: 10 }
    },
    map: {
        flex: 1,
        height:"100%",
        width:"100%"
    }
});

export default DashboardTools;