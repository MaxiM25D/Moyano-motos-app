import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import Inicio from "./components/pages/Inicio/Inicio.jsx";
import Contacto from "./components/pages/Contacto/Contacto.jsx";
import Cart from "./components/pages/Cart/Cart.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import ItemDetailContainer from "./components/ItemDetailContainer/ItemDetailContainer";
import ItemListContainer from "./components/ItemListContainer/ItemListContainer";
<<<<<<< HEAD
import AdminLayout   from "./components/Admin/AdminLayaout/AdminLayout.jsx";
import AdminProducts from "./components/Admin/pages/AdminProducts/AdminProducts.jsx";
import AdminUsers    from "./components/Admin/pages/Users/AdminUsers.jsx";
import ProductForm   from "./components/Admin/ProductForm/ProductForm.jsx";
=======
import "./App.css";



>>>>>>> 1d41361186b3b67662fda3e163815ae28950ff3f

function App() {

  return (
    <>
      <NavBar />
        <main className="main-content">
        <Routes>
            {/* Rutas panel Admin */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="products"          element={<AdminProducts />} />
              <Route path="products/new"      element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              <Route path="users"             element={<AdminUsers />} />
            </Route>

            {/* Ruta para inicio */}
            <Route path="/" element={<Inicio greeting="PRODUCTOS DESTACADOS" />} />

            {/* Ruta para listado general de productos */}
            <Route path="/productos" element={<ItemListContainer />} />

            {/* Categorías */}
            <Route path="/productos/:category" element={<ItemListContainer />} />

            {/* Subcategorías */}
            <Route path="/productos/:category/:subcategory" element={<ItemListContainer />} />

            {/* Tipo */}
            <Route path="/productos/:category/:subcategory/:type" element={<ItemListContainer />} />

            {/* Detalle */}
            <Route path="/producto/:id" element={<ItemDetailContainer />} />

            {/* Rutas de contacto*/}
            <Route path="/contacto" element={<Contacto greeting="CONTACTANOS" />} />
            {/* Ruta para carrito de compras */}
            <Route path="/cart" element={<Cart/>} />
            
            {/* Rutas de autenticación */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="*" element={<h2>404 - Página no encontrada</h2>} />

        </Routes>
      </main>  
      <Footer className="footer"/>
    </>
  );
}

export default App;