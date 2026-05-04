import { RouterProvider } from "react-router-dom"
import { router } from "./AppRouter"


function App() {
  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App
