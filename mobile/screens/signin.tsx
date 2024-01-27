import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RootScreenProps } from "../utils/types";

type SigninProps = RootScreenProps<"signin">;

const Signin: React.FC<SigninProps> = ({ route, navigation }) =>{
    return (
        <View style={ styles.root }>
            <Text>Signin</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {}
});

export default Signin;