import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomNavigation, BottomNavigationTab} from '@ui-kitten/components';

import ProfileScreen from './ProfileScreen';
import FilesScreen from './FilesScreen';
import Glosary from './Glosary';

const {Navigator, Screen} = createBottomTabNavigator();

const BottomTabBar = ({navigation, state}) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab title="HomeView" />
    <BottomNavigationTab title="Videos" />
    <BottomNavigationTab title="profile" />
  </BottomNavigation>
);

const TabNavigator = () => (
  <Navigator tabBar={props => <BottomTabBar {...props} />}>
    <Screen
      options={{
        title: 'Home',
      }}
      name="HomeView"
      component={Glosary}
    />
    <Screen name="Videos" component={FilesScreen} />
    <Screen name="Profile" component={ProfileScreen} />
  </Navigator>
);

const Home = () => <TabNavigator />;

export default Home;
