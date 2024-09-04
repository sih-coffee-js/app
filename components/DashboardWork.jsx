import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Dashboard from './Dashboard';

function DashboardWork({ navigation }) {

    return (
        <Dashboard navigation={navigation} bg="#f5f7fc">
        </Dashboard>
    );
}

const styles = StyleSheet.create({
    shadow: {
        elevation: 5,
        shadowColor: "rgba(0,0,0,.4)",
        shadowRadius: 7,
        shadowOpacity: .5,
        shadowOffset: { width: 0, height: 10 }
    },
});


export default DashboardWork;