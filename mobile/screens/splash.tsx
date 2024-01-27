import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RootScreenProps } from "../utils/types";

type SplashProps = RootScreenProps<"splash">;

const Splash: React.FC<SplashProps> = ({ route, navigation }) =>{
    return (
        <View style={ styles.root }>
            <Text>Splash</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {}
});

export default Splash;