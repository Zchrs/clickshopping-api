/* eslint-disable no-unused-vars */
import { HashRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { Provider } from "react-redux";
import { store } from "./store/store";
import {
  ClothingScreen,
  TechnologyScreen,
  AlimentsScreen,
  GrainsScreen,
  VegetablesScreen,
  FruitsScreen,
  LoginScreen,
  RegisterScreen,
  MySettingsScreen,
  MyPurchaseScreen,
  MyMessageScreen,
  TyCmScreen,
  TycScreen,
  PrivacyPolicyScreen,
  UserCartScreen,
  PaymentMethodsScreen,
  RefundsScreen,
  SendAddressScreen,
  HelpScreen,
  ReclamationsScreen,
  ReferralsScreen,
  SuggestionsScreen,
  ProductsDeleted,
  FemaleProductsScreen,
  WishListScreen,
} from "./views/index";
import {
  ProductsScreen,
  UpdateProduct,
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
  AdminLayout,
  AdminDashboardLayout,
  CreateProduct,
  ImageKitProvider,
} from "../index";
import { MenuProvider } from "./layouts/MenuContext";
import { ProductsLayout } from "./layouts/ProductsLayout";
import { DetailProductScreen } from "./components/globals/DetailProductScreen";
import { PagesInfoLayout } from "./layouts/PagesInfoLayout";
import { CheckOut } from "./views/checkout/CheckOut";
import { changeLang } from "./actions/userActions";
import { PrivateRoute, PrivateRouteAdmin } from "./router/PrivateRouter";
import { PublicRoute, PublicRouteAdmin } from "./router/PublicRouter";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import { De } from "react-country-flags-select";
import { UsersOrdersScreen } from "./views/users/orders/UsersOrdersScreen";

function App() {
  const storedLang = localStorage.getItem("lang");

  // Despacha la acción para establecer el idioma en Redux solo si hay un idioma almacenado en localStorage
  if (storedLang) {
    store.dispatch(changeLang({ lang: storedLang }));
  }

  return (
    <>
        <Provider store={store}>
          <HashRouter>
            <Routes>
              <Route exact path="/*" element={<AppLayout />}>
                <Route
                  exact
                  path="categories/services"
                  element={<ClothingScreen />}
                />
                <Route
                  exact
                  path="categories/technology"
                  element={<TechnologyScreen />}
                />
                <Route
                  exact
                  path="categories/spare-parts"
                  element={<AlimentsScreen />}
                />
                <Route
                  exact
                  path="categories/grains"
                  element={<GrainsScreen />}
                />
                <Route
                  exact
                  path="categories/vetetables"
                  element={<VegetablesScreen />}
                />
                <Route
                  exact
                  path="categories/fruits"
                  element={<FruitsScreen />}
                />
                <Route
                  exact
                  path="categories/female"
                  element={<FemaleProductsScreen />}
                />
              </Route>
              <Route exact path="/products/*" element={<ProductsLayout />}>
                <Route
                  exact
                  path=":productId"
                  element={<DetailProductScreen />}
                />
                <Route
                  exact
                  path=":productId:/checkout"
                  element={<CheckOut />}
                />
              </Route>

              {/* <Route> */}

              <Route
                exact
                path="/dashboard/*"
                element={
                  <PrivateRoute>
                    <MenuProvider>
                      <DashboardLayout />
                    </MenuProvider>
                  </PrivateRoute>
                }>
                <Route exact path="settings" element={<MySettingsScreen />} />
                <Route exact path="my-cart" element={<UserCartScreen />} />
                <Route
                  exact
                  path="my-purchases"
                  element={<MyPurchaseScreen />}
                />
                <Route exact path="my-messages" element={<MyMessageScreen />} />
                <Route
                  exact
                  path="payment-methods"
                  element={<PaymentMethodsScreen />}
                />
                <Route
                  exact
                  path="refund-&-returns"
                  element={<RefundsScreen />}
                />
                <Route
                  exact
                  path="valorations"
                  element={<ValidationsScreen />}
                />
                <Route
                  exact
                  path="my-address"
                  element={<SendAddressScreen />}
                />
                <Route exact path="my-messages" element={<MyMessageScreen />} />
                <Route exact path="helpcenter" element={<HelpScreen />} />
                <Route
                  exact
                  path="reclamations"
                  element={<ReclamationsScreen />}
                />
                <Route exact path="referrals" element={<ReferralsScreen />} />
                <Route
                  exact
                  path="suggestions"
                  element={<SuggestionsScreen />}
                />
                <Route exact path="settings" element={<SettingsScreen />} />
                <Route
                  exact
                  path="products-delete"
                  element={<ProductsDeleted />}
                />
                <Route exact path="my-cart/checkout" element={<CheckOut />} />
                <Route exact path="orders" element={<UsersOrdersScreen />} />
                <Route exact path="wishlist" element={<WishListScreen />} />
              </Route>

              <Route
                exact
                path="/auth/*"
                element={
                  <PublicRoute>
                    <AuthLayout />
                  </PublicRoute>
                }>
                <Route exact path="login" element={<LoginScreen />} />
                <Route exact path="register" element={<RegisterScreen />} />
              </Route>

              <Route
                exact
                path="/legal-docs/*"
                element={
                  <MenuProvider>
                    <PagesInfoLayout />
                  </MenuProvider>
                }>
                <Route exact path="tyc" element={<TycScreen />} />
                <Route exact path="tyc-marketplace" element={<TyCmScreen />} />
                <Route
                  exact
                  path="privacy-policy"
                  element={<PrivacyPolicyScreen />}
                />
              </Route>
              <Route
                exact
                path="/admin/auth/*"
                element={
                  <PublicRouteAdmin>
                    <AdminLayout />
                  </PublicRouteAdmin>
                }
              />
              <Route
                exact
                path="/admin/dashboard/*"
                element={
                  <PrivateRouteAdmin>
                    <AdminDashboardLayout />
                  </PrivateRouteAdmin>
                }>
                <Route exact path="products" element={<ProductsScreen />} />
                <Route
                  exact
                  path="upload-product"
                  element={<CreateProduct />}
                />
                <Route
                  exact
                  path="update-product"
                  element={<UpdateProduct />}
                />
                <Route
                  exact
                  path="comunications"
                  element={<ComunicationsScreen />}
                />
                <Route exact path="finances" element={<FinancesScreen />} />
                <Route exact path="orders" element={<PurchasesScreen />} />
                <Route
                  exact
                  path="orders/complete"
                  element={<OrdersComplete />}
                />
                <Route
                  exact
                  path="orders/pending"
                  element={<OrdersPending />}
                />
                <Route
                  exact
                  path="memberships"
                  element={<MembershipsScreen />}
                />
                <Route exact path="users" element={<UsersScreen />} />
                <Route exact path="reports" element={<ReportsScreen />} />
                <Route
                  exact
                  path="validations"
                  element={<ValidationsScreen />}
                />
                <Route
                  exact
                  path="verify-profile"
                  element={<UserVerifications />}
                />
                <Route exact path="discounts" element={<Discounts />} />
                <Route exact path="settings" element={<SettingsScreen />} />
              </Route>
            </Routes>
          </HashRouter>
        </Provider>

    </>
  );
}

export default App;
