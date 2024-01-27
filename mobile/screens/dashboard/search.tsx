import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { DashBoardScreenProps } from "../../utils/types";

type SearchProps = DashBoardScreenProps<"search">;

const Search: React.FC<SearchProps> = ({route, navigation}) =>{
    return (
        <View style={ styles.root }>
            <Text>Search</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {}
});

export default Search;