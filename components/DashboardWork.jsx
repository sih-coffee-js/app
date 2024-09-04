import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';  
import { Picker } from '@react-native-picker/picker';
import Dashboard from './Dashboard';

function DashboardWork({ navigation }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calendarKey, setCalendarKey] = useState(0);

  const currentDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;

  const handleMonthChange = (itemValue) => {
    setSelectedMonth(itemValue);
    setCalendarKey(prevKey => prevKey + 1); 
  };

  const handleYearChange = (itemValue) => {
    setSelectedYear(itemValue);
    setCalendarKey(prevKey => prevKey + 1); 
  };

  const renderDay = (date) => {
    const textBelowDate = `Notes`;
    return (
      <View style={styles.dayContainer}>
        <Text style={styles.dayText}>{date.day}</Text>
        <Text style={styles.extraText}>{textBelowDate}</Text>
      </View>
    );
  };

  return (
    <Dashboard navigation={navigation} bg="#f0f4f8">
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
          monthFormat={'yyyy MM'}
          hideArrows={false}
          disabledDaysIndexes={[0, 6]}  
          markedDates={{
            '2024-09-04': { selected: true, marked: true, dotColor: '#ff6347' },
            '2024-09-08': { marked: true, dotColor: '#4682b4' },
          }}
          dayComponent={({ date, state }) => renderDay(date)}
          style={styles.calendar}
          theme={{
            calendarBackground: '#f0f4f8',
            textSectionTitleColor: '#b6c1cd',
            todayTextColor: '#ff6347',
            dayTextColor: '#2d4150',
            arrowColor: '#4682b4',
            selectedDayBackgroundColor: '#ff6347',
            selectedDayTextColor: '#ffffff',
          }}
        />
      </View>
    </Dashboard>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#36454f',
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
    height: height * 0.65,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#ffffff',
    elevation: 5,
    shadowColor: '#000',
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
    color: '#a0a4b8',
    fontWeight: '500',
    marginTop: 4,
  },
});

export default DashboardWork;
