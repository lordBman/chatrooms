import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { DashBoardScreenProps } from "../../utils/types";

type CreateProps = DashBoardScreenProps<"create">;

const Create: React.FC<CreateProps> = ({route, navigation}) =>{
    return (
        <View style={ styles.root }>
            <Text>Create</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {}
});

export default Create;