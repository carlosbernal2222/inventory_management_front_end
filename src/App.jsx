
import './App.css'
import {Route, Routes} from "react-router-dom";
import Layout from "./pages/Layout.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import InventoryPage from "./pages/InventoryPage/InventoryPage.jsx";
import ProductsPage from "./pages/ProductPage/ProductsPage.jsx";
import WarehousePage from "./pages/WarehousePage/WarehousePage.jsx";

function App() {


  return (
      <div className="App">
          <Routes>

              {/*Main Routes */}
              <Route path="/" element={<Layout/>}>
                  <Route index element={<HomePage/>}/>
                  <Route path="products" element={<ProductsPage/>}/>
                  <Route path="warehouses" element={<WarehousePage/>}/>
                  <Route path="warehouses/:warehouseId/inventory" element={<InventoryPage/>}/>

              </Route>
          </Routes>
      </div>
  )
}

export default App
