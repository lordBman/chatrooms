import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type MainBottomParamList = {
    rooms: undefined,
    notifications: undefined,
    profile: undefined,
    settings: undefined
}

export type DashBoardStackParamList = {
    main: NavigatorScreenParams<MainBottomParamList>;
    create: undefined;
    search: undefined;
    room: { id: number };
}

export type RootStackParamList = {
    splash: undefined;
    signin: undefined;
    dashboard: NativeStackScreenProps<DashBoardStackParamList>,
    info: undefined;
}

export type RootScreenProps<RouteName extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, RouteName>
export type DashBoardScreenProps<RouteName extends keyof DashBoardStackParamList> = CompositeScreenProps<NativeStackScreenProps<DashBoardStackParamList, RouteName>, NativeStackScreenProps<RootStackParamList>>;
export type MainScreenProps<RouteName extends keyof MainBottomParamList> = CompositeScreenProps<BottomTabScreenProps<MainBottomParamList, RouteName>, CompositeScreenProps<NativeStackScreenProps<DashBoardStackParamList>, NativeStackScreenProps<RootStackParamList>>>;