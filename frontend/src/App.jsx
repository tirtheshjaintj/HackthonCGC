import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Outlet />
      <Toaster position="bottom-right" />
    </>
  )
}

export default App;
