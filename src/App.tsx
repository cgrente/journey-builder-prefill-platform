import './App.css'
import { BlueprintGraphPage } from "./features/blueprintGraph/components/BlueprintGraphPage";
import { NavBar } from './shared/ui/NavBar';

function App() {
  return (
    <>
      <NavBar 
        title="Journey Builder Prefill Platform" 
      />
      <BlueprintGraphPage />
    </>
  )
}

export default App
