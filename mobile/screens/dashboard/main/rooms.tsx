import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MainScreenProps } from "../../../utils/types";

type RoomsProps = MainScreenProps<"rooms">;

const Rooms: React.FC<RoomsProps> = ({route, navigation}) =>{
    return (
        <View style={ styles.root }>
            <Text>Rooms</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {}
});

export default Rooms;