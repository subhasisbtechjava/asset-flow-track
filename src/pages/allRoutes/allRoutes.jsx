import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../../layouts/AppLayout";
import Dashboard from "../Dashboard";
import StoreDetail from "../stores/StoreDetail";
import StoreAddAssets from "../stores/StoreAddAssets";
import AssetList from "../assets/AssetList";
import AssetForm from "../assets/AssetForm";
import StoreForm from "../stores/StoreForm";
import Login from "../auth/Login";
import NotFound from "../NotFound";
import UserList from "../users/UserList";
import ProfileSettings from "../profile/ProfileSettings";
import AuthGuard from "../../components/ui/privateRoute";
import ChangePassword from "../profile/ChangePassword";
const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/stores" replace />} />
        <Route
          path="stores"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="stores/:id"
          element={
            <AuthGuard>
              <StoreDetail />
            </AuthGuard>
          }
        />
        <Route path="stores/new" element={<StoreForm />} />
        <Route path="/stores/edit/:id" element={<StoreForm />} />
        <Route path="stores/:id/add-assets" element={<StoreAddAssets />} />
        <Route path="assets" element={<AssetList />} />
        <Route path="assets/new" element={<AssetForm />} />
        <Route path="assets/edit/:id" element={<AssetForm />} />
        <Route path="users" element={<UserList />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="/changepassword" element={<ChangePassword/>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
