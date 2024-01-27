import { NavigationContainer } from '@react-navigation/native';
import Screens from "./screens";

import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
        <NavigationContainer>
            <Screens />
        </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;