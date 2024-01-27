import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RootScreenProps } from "../utils/types";

type InfoProps = RootScreenProps<"info">;

const Info: React.FC<InfoProps> = ({ route, navigation }) =>{
    return (
        <View style={ styles.root }>
            <Text>Info</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {}
});

export default Info;