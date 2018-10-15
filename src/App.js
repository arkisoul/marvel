import React from "react";
import { Root } from "native-base";
import { AsyncStorage } from 'react-native';
import { createStackNavigator, createDrawerNavigator, createSwitchNavigator } from "react-navigation"

import SignIn from './screens/signin/';
import SignUp from './screens/signup/';
import Home from "./screens/Home/";
import SideBar from "./screens/sidebar";
import Company from './screens/company';
import AddCompany from './screens/company/addCompany';
import CompanyDetail from './screens/company/companyDetail';
import AuthLoadingScreen from './screens/auth/';

const Drawer = createDrawerNavigator(
  { Home: Home, Company: Company },
  {
    initialRouteName: "Home", contentOptions: { activeTintColor: "#e91e63" },
    contentComponent: props => <SideBar {...props} />
  }
);
const AppStack = createStackNavigator({ Drawer: Drawer, AddCompany: AddCompany, CompanyDetail: CompanyDetail }, { headerMode: 'none' });
const AuthStack = createStackNavigator({ SignIn: SignIn, SignUp: SignUp }, { headerMode: 'none' });

const SwitchAppNavigation = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

/*
const AppNavigator = createStackNavigator(
  {
    SignIn: { screen: SignIn },
    SignUp: { screen: SignUp },
    AddCompany: { screen: AddCompany },
    Drawer: { screen: Drawer },
  },
  {
    initialRouteName: defaultRoute,
    headerMode: "none"
  }
); */

export default () =>
  <Root>
    <SwitchAppNavigation />
  </Root>;
