import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AdminDashboard from './AdminDashboard';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

function AdminUsers({ navigation }) {
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
        const { data } = await axios.get('/api/users/');
        console.log(data);
        setData(data);
      } catch (e) {
        console.log(e);
      }
    }

    if (isFocused) {
      fetchDetails();
    }
  }, [isFocused]);

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


  async function DetailedView(user) {
    console.log(user);
    console.log('------')
    await AsyncStorage.setItem('userid', user);
    mainnavigation.navigate('UserHome');
  }
  
  return (
    <AdminDashboard bg="#f5f7fc">
      <LinearGradient colors={['#ffffff', '#ffffff']} style={[styles.shadow, styles.headerContainer]}>
        <Text style={styles.headerText}>Users</Text>
      </LinearGradient>

      {data.length > 0 ? (
        <View style={styles.userListContainer}>
          <View style={styles.userList}>
            {data.map((user, index) => (
              <View style={[styles.shadow, styles.userCard]} key={index}>
                <TouchableOpacity style={styles.userCardContent} activeOpacity={0.9} onPress={()=>{DetailedView(user._id)}}>
                  <Image 
                    source={{ uri: user.profilePicture }} 
                    style={styles.userImage} 
                  />
                  <Text style={styles.userName}>{user.fullName}</Text>
                  <Text style={styles.workingTime}>Working Time: {user.working}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.noUsersContainer}>
          <LottieView 
            source={require('../assets/lottie/404.json')} 
            autoPlay 
            loop 
            style={styles.lottieAnimation} 
          />
          <Text style={styles.noUsersText}>No Users Found</Text>
        </View>
      )}
    </AdminDashboard>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 8,
    elevation: 12,
  },
  headerText: {
    fontSize: 22,
    color: '#343538',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userListContainer: {
    paddingVertical: 20,
    backgroundColor: '#f7f9fc',
    borderRadius: 20,
    marginHorizontal: 10,
  },
  userList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  userCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    overflow: 'hidden',
    elevation: 8,
  },
  userCardContent: {
    alignItems: 'center',
    transform: [{ translateY: 0 }],
    transition: 'transform 0.2s ease-in-out',
  },
  userCardContentHover: {
    transform: [{ translateY: -10 }],
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    borderWidth: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  workingTime: {
    fontSize: 14,
    color: '#808080',
    textAlign: 'center',
  },
  noUsersContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  lottieAnimation: {
    width: 250,
    height: 250,
  },
  noUsersText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#36454f',
    marginTop: -32,
    textAlign: 'center',
  },
  shadow: {
    elevation: 10,
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowRadius: 8,
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 10 },
  },
});

export default AdminUsers;
