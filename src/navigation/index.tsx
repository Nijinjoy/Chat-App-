import React, { useState, useEffect } from 'react';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

const RootNavigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <AuthStack initialRoute="SplashScreen" />; 
  }

  return isLoggedIn ? <AppStack /> : <AuthStack />;
};

export default RootNavigation;
