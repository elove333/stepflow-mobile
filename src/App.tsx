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
