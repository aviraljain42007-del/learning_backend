import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import MainLayout from "./components/MainLayout";
import ProductsPage from "./pages/ProductsPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import {
  loadCurrentUserThunk,
  selectAuthLoading,
} from "./redux/slices/authSlice";

const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));

const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const AdminProductsPage = lazy(() => import("./pages/AdminProductsPage"));
const AdminCreateProductPage = lazy(() =>
  import("./pages/AdminCreateProductPage")
);
const AdminUpdateProductPage = lazy(() =>
  import("./pages/AdminUpdateProductPage")
);
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"));

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  const dispatch = useDispatch();
  const authLoading = useSelector(selectAuthLoading);

  useEffect(() => {
    dispatch(loadCurrentUserThunk());
  }, [dispatch]);

  if (authLoading) {
    return (
      <main className="page-container">
        <p className="status-text">Checking authentication...</p>
      </main>
    );
  }

  return (
    <Suspense fallback={<main className="page-container"> <p className="status-text">Loading page...</p> </main> } >
      <Routes>

      <Route element={<MainLayout />}>

        <Route path="/" element={<ProductsPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/cart" element={<ProtectedRoute> <CartPage /> </ProtectedRoute> } />

        <Route path="/checkout"element={<ProtectedRoute> <CheckoutPage /> </ProtectedRoute>}/>

        <Route path="/admin" element={ <AdminRoute> <AdminDashboardPage /> </AdminRoute> } />

        <Route path="/products/:productId" element={<ProductDetailsPage />} />

        <Route path="/orders" element={ <ProtectedRoute> <OrdersPage /> </ProtectedRoute> } />

       <Route path="/orders/:orderId" element={ <ProtectedRoute> <OrderDetailsPage /> </ProtectedRoute> } />

       <Route path="/admin/products" element={ <AdminRoute> <AdminProductsPage /> </AdminRoute> } />

       <Route path="/admin/products/create" element={ <AdminRoute> <AdminCreateProductPage /> </AdminRoute> } />

       <Route path="/admin/orders" element={ <AdminRoute> <AdminOrdersPage /> </AdminRoute> } />

       <Route path="/admin/products/edit/:productId" element={ <AdminRoute> <AdminUpdateProductPage /> </AdminRoute> } />

       <Route path="*" element={<NotFoundPage />} />

      </Route>

    </Routes>
    </Suspense>
  );
}

export default App;