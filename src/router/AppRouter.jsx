/* eslint-disable no-unused-vars */
import { Routes, Route, Outlet } from "react-router-dom";
import { 
  HomeScreen,
  ClothingScreen,
  VegetablesScreen,
  FruitsScreen,
  TechnologyScreen,
  GrainsScreen,
  AlimentsScreen,
  LoginScreen,
  RegisterScreen,
  Dashboard,
  MySettingsScreen,
  UserCartScreen,
  MyPurchaseScreen,
  MyMessageScreen,
  AuthHome,
  InfoHome,
  DetailProductScreen,
  TycScreen,
  PrivacyPolicyScreen,
  TyCmScreen,
  HelpScreen,
  SuggestionsScreen,
  PaymentMethodsScreen,
  SendAddressScreen,
  RefundsScreen,
  ReclamationsScreen,
  ReferralsScreen,
  ProductsDeleted,
  FemaleProductsScreen,
  WishListScreen,
} from "../views/index";

import { 
  
  ProductsScreen,
  HomeScreenAdmin,
  DashboardScreen,
  ComunicationsScreen,
  FinancesScreen,
  PurchasesScreen,
  OrdersComplete,
  OrdersPending,
  MembershipsScreen,
  UsersScreen,
  ReportsScreen,
  ValidationsScreen,
  UserVerifications,
  Discounts,
  SettingsScreen,
  CreateProduct,
  UpdateProduct
 } from '../../index'

import { CheckOut } from "../views/checkout/CheckOut";
import { useDispatch } from "react-redux";


import { useEffect } from "react";
import { startChecking, startCheckingAdmin } from "../actions/authActions";
import { PublicRoute } from "./PublicRouter";
import { UsersOrdersScreen } from "../views/users/orders/UsersOrdersScreen";
// import { startChecking } from "../actions/auth";
// import { useEffect } from "react";
// import { Page404 } from "../components/Page404";


export const AppRouter = () => {

  return (
      <Routes>
        <Route exact path="/*" element={<HomeScreen />} />
        <Route exact path="categories/services" element={<ClothingScreen />} />
        <Route exact path="categories/technology" element={<TechnologyScreen />} />
        <Route exact path="categories/spare-parts" element={<AlimentsScreen />} />
        <Route exact path="categories/grains" element={<GrainsScreen />} />
        <Route exact path="categories/vetetables" element={<VegetablesScreen />} />
        <Route exact path="categories/fruits" element={<FruitsScreen />} />
                        <Route
                          exact
                          path="categories/female"
                          element={<FemaleProductsScreen />}
                        />
      </Routes>
  );
};

export const ProductRouter = () => {
  return (
    <Routes>
      <Route exact path="/*" element={ <ProductsScreen />} />       
      <Route exact path=":productId" element={<DetailProductScreen />} />
      <Route exact path=":productId/checkout" element={<CheckOut />} />
    </Routes>
  );
};
export const AuthRouter = () => {
  const dispatch = useDispatch();
    
  useEffect(() => {
    dispatch(startChecking());
  }, [dispatch]);
  return (
    <Routes>
      <Route exact path="/*" element={ 
          <AuthHome />
    } />
    
      <Route exact path="login" element={<LoginScreen />} />
      <Route exact path="register" element={<RegisterScreen />} />
      
    </Routes>
  );
};

export const DashboardRouter = () => {
  const dispatch = useDispatch();
    
  useEffect(() => {
    dispatch(startChecking());
  }, [dispatch]);


  return (
    <Routes>
        <Route exact path="/*" element={
              <Dashboard/>
          } />

          <Route exact path="settings" element={<MySettingsScreen />} />
          <Route exact path="my-cart" element={<UserCartScreen />} />
          <Route exact path="my-purchases" element={<MyPurchaseScreen />} />
          <Route exact path="my-messages" element={<MyMessageScreen />} />
          <Route exact path="payment-methods" element={<PaymentMethodsScreen />} />
          <Route exact path="refund-&-returns" element={<RefundsScreen />} />
          <Route exact path="valorations" element={<ValidationsScreen />} />  
          <Route exact path="my-address" element={ <SendAddressScreen />} />
          <Route exact path="my-messages" element={<MyMessageScreen />} />
          <Route exact path="helpcenter" element={<HelpScreen />} />
          <Route exact path="reclamations" element={<ReclamationsScreen />} />
          <Route exact path="referrals" element={<ReferralsScreen />} />
          <Route exact path="suggestions" element={<SuggestionsScreen />} />
          <Route exact path="settings" element={<SettingsScreen />} />
          <Route exact path="products-delete" element={<ProductsDeleted />} />
          <Route exact path="my-cart/checkout" element={<CheckOut />} />
          <Route exact path="orders" element={<UsersOrdersScreen />} />
          <Route exact path="wishlist" element={<WishListScreen />} />
     </Routes> 
  );
};

export const RulesRouter = () => {
  return (
    <Routes>
      <Route exact path="/*" element={ <InfoHome />} />
            <Route exact path="tyc" element={<TycScreen />} />
            <Route exact path="tyc-marketplace" element={<TyCmScreen />} />
            <Route exact path="privacy-policy" element={<PrivacyPolicyScreen />} />
    </Routes>
  );
};

// router admin



export const AdminRouter = () => {
    const dispatch = useDispatch();
  useEffect(() => {
    dispatch(startCheckingAdmin());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route exact path="/*" element={<HomeScreenAdmin />} />
      </Routes>
      </>
  );
};


export const DashboardAdminRouter = () => {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(startCheckingAdmin());
  }, [dispatch]);
    
  
  return (
    <>
    <Routes>
      <Route path="/*" element={<DashboardScreen />} />
      <Route exact path="products" element={<ProductsScreen />} />
                <Route exact path="upload-product" element={<CreateProduct />} />
                <Route exact path="update-product" element={<UpdateProduct />} />
                <Route exact path="comunications" element={<ComunicationsScreen />} />
                <Route exact path="finances" element={<FinancesScreen />} />
                <Route exact path="orders" element={<PurchasesScreen />} />
                <Route exact path="orders/complete" element={<OrdersComplete />} />
                <Route exact path="orders/pending" element={<OrdersPending />} />
                <Route exact path="memberships" element={<MembershipsScreen />} />
                <Route exact path="users" element={<UsersScreen />} />
                <Route exact path="reports" element={<ReportsScreen />} />
                <Route exact path="validations" element={<ValidationsScreen />} />
                <Route exact path="verify-profile" element={<UserVerifications/>} />
                <Route exact path="discounts" element={<Discounts/>} />
                <Route exact path="settings" element={<SettingsScreen/>} />
    </Routes>
    </>
  );
};
