import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { DashBoardScreenProps } from "../../utils/types";

type RoomProps = DashBoardScreenProps<"room">;

const Room: React.FC<RoomProps> = ({ route, navigation }) =>{
    return (
        <View style={ styles.root }>
            <Text>Room</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {}
});

export default Room;