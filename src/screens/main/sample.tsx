const handleGoogleLogin = async () => {
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'wechat',
        path: 'auth-callback',
      });          
  
      console.log('Redirect URI:', redirectUri);
  
      // Start OAuth login with Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUri },
      });
  
      if (error) {
        console.error('Supabase OAuth error:', error.message);
        Alert.alert('Login Failed', error.message || 'Google login failed');
        return;
      }
  
      console.log('Supabase OAuth URL:', data.url);
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
      console.log('WebBrowser AuthSession result:', result);
  
      if (result.type === 'success') {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
        if (sessionError) {
          console.error('Session retrieval error:', sessionError.message);
          Alert.alert('Login Failed', sessionError.message || 'Could not get session');
          return;
        }
  
        console.log('✅ Session:', sessionData.session);
        console.log('✅ User:', sessionData.session?.user);
  
        Alert.alert('Login Success', 'Welcome ' + sessionData.session?.user?.email);
  
        // Optional: navigate to App
        navigation.reset({
          index: 0,
          routes: [{ name: 'App' }],
        });
      } else if (result.type === 'cancel' || result.type === 'dismiss') {
        console.log('Google login cancelled by user');
        Alert.alert('Login Cancelled', 'Google login was cancelled');
      } else {
        console.warn('Unexpected result type:', result.type);
        Alert.alert('Login Error', 'Unexpected login result: ' + result.type);
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      Alert.alert('Login Error', err.message || 'Something went wrong during Google login');
    }
  };
