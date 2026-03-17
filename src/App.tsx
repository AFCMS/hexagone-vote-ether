import "./App.css";
import { useEther } from "./hooks/use_ether";
import { CandidatesIcons } from "./components/CandidatesIcons";

function App() {
  const { candidates, error } = useEther();

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="app">
      <h1>Vote for Your Candidate</h1>
      <CandidatesIcons candidates={candidates} />
    </div>
  );
}

export default App;
