import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MainScreenProps } from "../../../utils/types";

type ProfileProps = MainScreenProps<"profile">;

const Profile: React.FC<ProfileProps> = ({ route, navigation }) =>{
    return (
        <View style={ styles.root }>
            <Text>Profile</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {}
});

export default Profile;