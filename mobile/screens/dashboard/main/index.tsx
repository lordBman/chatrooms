import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Notifications from "./notifications";
import Profile from "./profile";
import React from "react";
import IconIcon from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/Entypo";
import { DashBoardScreenProps, MainBottomParamList } from "../../../utils/types";
import Rooms from "./rooms";
import Settings from "./settings";

const Tab = createBottomTabNavigator<MainBottomParamList>();

const Main: React.FC<DashBoardScreenProps<"main">> = () =>{
    return (
        <Tab.Navigator initialRouteName="rooms" screenOptions={{ headerShown: false }}>
            <Tab.Screen name="rooms" component={Rooms} options={{ tabBarIcon: (props) => <IconIcon name="compass" color={props.color} size={props.size} /> }}/>
            <Tab.Screen name="notifications" component={Notifications} options={{ headerShown: true, headerTitle: "Notification", headerTitleAlign: "center", tabBarIcon: (props) => <Icon name="bell" color={props.color} size={props.size} /> }}/>
            <Tab.Screen name="profile" component={Profile} options={{ tabBarIcon: (props) => <Icon name="user" color={props.color} size={props.size} /> }}/>
            <Tab.Screen name="settings" component={Settings} options={{ tabBarIcon: (props) => <Icon name="cogs" color={props.color} size={props.size} /> }}/>
        </Tab.Navigator>
    );
}

export default Main;