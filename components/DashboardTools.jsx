import React from 'react';
import { View, ScrollView, Text, StyleSheet, TextInput } from 'react-native';
import Dashboard from './Dashboard';
import { useState, useEffect } from 'react';

function DashboardTools({ navigation }) {
    

    return (
        <Dashboard navigation={navigation} bg="#f5f7fc">
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
});

export default DashboardTools;