
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import AdminNavigator from './src/navigation/AdminNavigator';
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import NoInternetScreen from './src/screens/NoInternetScreen';
import AuthNavigator from './src/navigation/AuthNavigator';
import PartnerNavigator from './src/navigation/PartnerNavigator';
import { AuthProvider } from './src/context/Authcontext';
import RootNavigator from './src/navigation/RootNavigator';
import { LoaderProvider } from './src/context/LoaderContext';
import Loader from './src/components/Loader';
import { PaperProvider } from 'react-native-paper';

function App() { 

   const [userRole, setUserRole] = useState(null);

  // const [isConnected, setIsConnected] = useState(true);

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     setIsConnected(state.isConnected);
  //   });

  //   return () => unsubscribe();
  // }, []);


  /*const MainApp = () => {
  const { isDarkMode, theme } = useContext(ThemeContext);

  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={theme}>
        <AdminNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

function App() {

 return (
   <ThemeProvider>
      <MainApp />
    </ThemeProvider>
    
  );
}*/
 return (
 <PaperProvider>
      <AuthProvider>
        <LoaderProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            <Loader />
            <RootNavigator />
            {/* <AdminNavigator /> */}
            {/* <PartnerNavigator /> */}
          </NavigationContainer>
        </LoaderProvider>
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;
