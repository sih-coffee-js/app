import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AdminDashboard from './AdminDashboard';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import LottieView from 'lottie-react-native';

function AdminLocations({ navigation }) {
  const mainnavigation = useNavigation();
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [hour, setHour] = useState('');

  useEffect(() => {
    async function fetchDetails() {
      const id = await getData('id', null, '');
      console.log(`id: ${id}`);
      const date = new Date();
      try {
        const { data } = await axios.get('/api/location/get')
        console.log(data);
        setData(data);
      } catch (e) {
        console.log(e);
      }
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

  async function Detailed(user, id) {
    mainnavigation.navigate('WorkLocation', { presentdata: user, id });
  }

  return (
    <AdminDashboard bg="#f5f7fc">
      <View style={[styles.shadow, styles.headerContainer]}>
        <Text style={styles.headerText}>Locations</Text>
      </View>

      {data.length > 0 ? (
        <View style={styles.locationList}>
          {data.map((dat, index) => (
            <View key={index} style={[styles.shadow, styles.locationCard]}>
              <TouchableOpacity onPress={() => { Detailed(dat.users, dat.location._id) }} style={styles.touchableCard}>
                <Text style={styles.locationName}>{dat.location.name}</Text>
                <Text style={styles.attendanceText}>Today's Attendance: {dat.users.length}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.noUsersContainer}>
          <LottieView source={require('../assets/lottie/404.json')} autoPlay loop style={styles.lottieAnimation} />
          <Text style={styles.noUsersText}>No Users Found</Text>
        </View>
      )}
    </AdminDashboard>
  );
}

const styles = StyleSheet.create({
  shadow: {
    elevation: 12,
    shadowColor: "rgba(0,0,0,0.9)",
    shadowRadius: 20,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 10 },
  },
  headerContainer: {
    padding: 15,
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343538',
  },
  locationList: {
    padding: 10,
    marginTop: -15,
  },
  locationCard: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  touchableCard: {
    width: '100%',
    height: 'auto',
  },
  locationName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  attendanceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0E46A3',
  },
  noUsersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noUsersText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#36454f',
    marginTop: -32,
    textAlign: 'center',
  },
  lottieAnimation: {
    width: 250,
    height: 250,
  },
});

export default AdminLocations;
