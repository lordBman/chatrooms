import React from "react";
import { DashBoardProvider } from "../../providers";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DashBoardStackParamList, RootScreenProps } from "../../utils/types";
import Main from "./main";
import Create from "./create";
import Room from "./room";

const Stack = createNativeStackNavigator<DashBoardStackParamList>();

type DashboardProps = RootScreenProps<"dashboard">;
const Dashboard: React.FC<DashboardProps> = () =>{
    return (
        <DashBoardProvider>
            <Stack.Navigator initialRouteName="main" screenOptions={{ headerTintColor: 'grey', headerShadowVisible: false, }}>
                <Stack.Screen name="main" component={Main} options={{ headerShown: false }} />
                <Stack.Screen name="create" component={Create} options={{ headerShown: false}} />
                <Stack.Screen name="room" component={Room} options={{ headerShown: false }} />
            </Stack.Navigator>
        </DashBoardProvider>
    );
}

export default Dashboard;