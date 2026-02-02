import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './state/store';
import { AppNavigator } from './navigation';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
src/
  app/
    main.ts
    routes.ts
    config.ts

  features/
    auth/
      ui/
      data/
      types.ts
      index.ts
    dance/
      ui/
      data/
      types.ts
      index.ts

  shared/
    ui/
    lib/
      logger.ts
    types/
      index.ts
src/
  app/
    App.tsx              # root app component
    navigation/
      index.tsx          # NavigationContainer
      RootNavigator.tsx  # stacks/tabs
    providers/
      AppProviders.tsx   # wrappers: theme, query, store, etc.
    config/
      env.ts
      constants.ts

  features/
    auth/
      ui/
        LoginScreen.tsx
      data/
        authApi.ts
      types.ts
      index.ts

    dance/
      ui/
        DanceScreen.tsx
        components/
      logic/
        scoring.ts
        pose.ts
      types.ts
      index.ts

  shared/
    ui/
      Button.tsx
      Text.tsx
    lib/
      logger.ts
      permissions.ts
      storage.ts
    types/
      index.ts

  main.ts               # entry 