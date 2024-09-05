import React, { useState, useEffect } from 'react';
import { Keyboard, View, Text, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { enableScreens } from 'react-native-screens';
import AdminHome from './AdminHome';
import AdminLocations from './AdminLocations';
import AdminUsers from './AdminUsers';
import Ionicons from 'react-native-vector-icons/Ionicons';

enableScreens();

const Tab = createMaterialTopTabNavigator();

function AdminNavigation() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarHideOnKeyboard: true,
                backgroundColor: '#fff',
                tabBarStyle: {
                    position: 'absolute',
                    elevation: 0,
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    height: 100,
                },
            }}
            tabBarPosition="bottom"
            tabBar={(props) => <CustomTabBar {...props} />}
        >
            <Tab.Screen
                name="Current Status"
                component={AdminHome}
                options={{
                    tabBarIcon: {
                        name: "home",
                    }
                }}
            />
            <Tab.Screen
                name="Users"
                component={AdminUsers}
                options={{
                    tabBarIcon: {
                        name: "newspaper",
                    }
                }}
            />
            <Tab.Screen
                name="Buildings"
                component={AdminLocations}
                options={{
                    tabBarIcon: {
                        name: "construct",
                    }
                }}
            />
        </Tab.Navigator>
    );
}

function CustomTabBar({ state, descriptors, navigation }) {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardVisible(true);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return isKeyboardVisible ? null : (
        <View style={{ flexDirection: 'row', paddingLeft: 3, paddingRight: 3, paddingBottom: 3, backgroundColor: "#fff", paddingTop: 5, borderTopLeftRadius: 15, borderTopRightRadius: 15, elevation: 5 }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const iconName = options.tabBarIcon.name;

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{
                            flex: 1,
                            height: 55,
                            backgroundColor: isFocused ? '#0E46A3' : '#FFFFFF',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 10,
                        }}
                    >
                        <Ionicons
                            name={iconName}
                            size={24}
                            color={isFocused ? '#FFFFFF' : '#1E0342'}
                        />
                        <Text style={{ color: isFocused ? '#FFFFFF' : '#1E0342' }}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

export default AdminNavigation;
