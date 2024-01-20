import Pages from "./pages";
import { UserProvider } from "./utils/providers";

const App = () =>{
  return (
    <UserProvider>
      <Pages />
    </UserProvider>
  );
}

export default App;
