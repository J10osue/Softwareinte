import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import * as eva from '@eva-design/eva';
import {ApplicationProvider} from '@ui-kitten/components';
import {IconRegistry} from '@ui-kitten/components/ui';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import Login from './src/views/Login';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';
import {persistor, store} from './src/store/store';
import Home from './src/views/Home';
import {PersistGate} from 'redux-persist/integration/react';
const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider {...eva} theme={eva.light}>
            <Stack.Navigator>
              <Stack.Screen
                options={{headerShown: false}}
                name="Login"
                component={Login}
              />
              <Stack.Screen name="Home" component={Home} />
            </Stack.Navigator>
          </ApplicationProvider>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginHorizontal: 8,
  },
});

export default App;
