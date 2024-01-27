import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MainScreenProps } from "../../../utils/types";

type SettingssProps = MainScreenProps<"settings">;

const Settings: React.FC<SettingssProps> = ({route, navigation}) =>{
    return (
        <View style={ styles.root }>
            <Text>Settings</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {}
});

export default Settings;