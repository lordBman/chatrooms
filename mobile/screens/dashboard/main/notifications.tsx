import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MainScreenProps } from "../../../utils/types";

type NotificationsProps = MainScreenProps<"notifications">;

const Notifications: React.FC<NotificationsProps> = ({route, navigation}) =>{
    return (
        <View style={ styles.root }>
            <Text>Notifications</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {}
});

export default Notifications;