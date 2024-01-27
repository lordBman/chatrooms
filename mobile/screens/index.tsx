import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from "./splash";
import Info from "./info";
import Signin from './signin';
import { RootStackParamList } from '../utils/types';
import { SettingsProvider, UserProvider } from '../providers';
import Dashboard from './dashboard';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Screens = () =>{
    return (
        <SettingsProvider>
            <UserProvider>
                <Stack.Navigator initialRouteName="splash" screenOptions={{ headerTintColor: 'grey', headerShadowVisible: false, }}>
                    <Stack.Screen name="dashboard" component={Dashboard} options={{ headerShown: false }} />
                    <Stack.Screen name="splash" component={Splash} options={{ headerShown: false}} />
                    <Stack.Screen name="signin" component={Signin} options={{ headerShown: false}} />
                    <Stack.Screen name="info" component={Info} options={{ title: 'About', headerShown: true, headerBackVisible: true}} />
                </Stack.Navigator>
          </UserProvider>
      </SettingsProvider>  
  );
}

export default Screens;