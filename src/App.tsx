import "./App.css";
import { useEther } from "./hooks/use_ether";

function App() {
  const { candidates, error } = useEther();

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <>{JSON.stringify(candidates)}</>;
}

export default App;
