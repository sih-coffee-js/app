import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

function Dashboard(props) {
    return (
        <ScrollView className={"pt-4 -mt-2 " + (props.bg ? "bg-[" + props.bg + "]" : "bg-white")}>
            {props.children}
            <View className="p-8"></View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    shadow: {
        backgroundColor: "#fff",
        borderWidth: 7,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderColor: "#ffffff",
        elevation: 7,
        shadowColor: "#000",
        shadowRadius: 7,
        shadowOpacity: .8,
        shadowOffset: { width: 0, height: 10 }
    },
});

export default Dashboard;