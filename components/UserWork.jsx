import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import User from './User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';

function DashboardWork({ navigation }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calendarKey, setCalendarKey] = useState(0);
  const [dataCalendar, setData] = useState({});
  const isFocused = useIsFocused();
  const mainnavigation = useNavigation();

  const currentDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;

  const handleMonthChange = (itemValue) => {
    setSelectedMonth(itemValue);
    setCalendarKey(prevKey => prevKey + 1);
  };

  const handleYearChange = (itemValue) => {
    setSelectedYear(itemValue);
    setCalendarKey(prevKey => prevKey + 1);
  };

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

    return totalWorkingHours.toString() + ':' + (totalWorkingMinutes <= 9 ? `0${totalWorkingMinutes.toString()}` : totalWorkingMinutes.toString())
  }

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

  async function fetchDetails() {
    const id = await getData('userid', null, '');
    console.log(`id: ${id}`);
    try {
      const { data } = await axios.post('/api/record/get', {
        userId: id,
      })

      //console.log(data);
      let cal = {};
      for (let day of data) {
        const dt = new Date(day.time);
        const dat = dt.toLocaleDateString('fr-CA');
        if (cal[dat]) {
          cal[dat].push(day);
        } else {
          let kk = []
          kk.push(day);
          cal[dat] = kk;
        }
      }
      let working = {};
      for (let i in cal) {
        working[i] = calculateWorkingHours(cal[i]);
      }
      setData(working);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (isFocused) {
      fetchDetails();
    }
  }, [isFocused])

  const navigateDetails =  async (date) => {
    if (dataCalendar[date.dateString]) {
      const id = await getData('userid', null, '');
      mainnavigation.navigate('WorkHistory', { date, id });
    }
  }

  const renderDay = (date) => {
    return (
      <TouchableOpacity className="w-[40px] -mb-1.5" onPress={() => { navigateDetails(date) }} style={styles.dayContainer}>
        <Text style={styles.dayText}>{date.day}</Text>
        <Text className={`${dataCalendar[date.dateString] ? 'text-green-500' : 'text-[#a0a4b8]'}`} style={styles.extraText}>{dataCalendar[date.dateString] ? dataCalendar[date.dateString] : "None"}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <User navigation={navigation} bg="#f0f4f8">
      <View style={styles.container}>
        <Text style={styles.title}>Work Tracker</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedMonth}
            style={styles.picker}
            onValueChange={handleMonthChange}
          >
            {Array.from({ length: 12 }, (v, k) => (
              <Picker.Item label={`${k + 1}`} value={k + 1} key={k} />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedYear}
            style={styles.picker}
            onValueChange={handleYearChange}
          >
            {Array.from({ length: 100 }, (v, k) => (
              <Picker.Item label={`${k + 1950}`} value={k + 1950} key={k} />
            ))}
          </Picker>
        </View>
        <Calendar
          key={calendarKey}
          current={currentDate}
          minDate={'1950-01-01'}
          maxDate={'2024-12-31'}
          monthFormat={'MM-yyyy'}
          hideArrows={false}
          disabledDaysIndexes={[0, 6]}
          markedDates={{
            '2024-09-04': { selected: true, marked: true, dotColor: '#ff6347' },
            '2024-09-08': { marked: true, dotColor: '#4682b4' },
          }}
          dayComponent={({ date, state }) => renderDay(date)}
          style={styles.calendar}
        />
      </View>
    </User>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0E46A3',
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 40,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  picker: {
    height: 50,
    width: (width - 60) / 2,
    backgroundColor: '#f5f5f5',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
  },
  calendar: {
    width: width - 40,
    height: height * 0.58,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 15,
    padding: 15,
    backgroundColor: '#ffffff',
    elevation: 5,
    shadowColor: '#0000005F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dayContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#f5f7fa',
  },
  dayText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#36454f',
  },
  extraText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default DashboardWork;
