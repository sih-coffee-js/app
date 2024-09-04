import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Dashboard from './Dashboard';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";

function DashboardHome({ navigation }) {
    const mainnavigation = useNavigation();

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
        <Dashboard navigation={navigation} bg="#f5f7fc">
        </Dashboard>
    );
}

const styles = StyleSheet.create({
    shadow: {
        elevation: 5,
        shadowColor: "rgba(0,0,0,.3)",
        shadowRadius: 7,
        shadowOpacity: .5,
        shadowOffset: { width: 0, height: 10 }
    },
});

export default DashboardHome;