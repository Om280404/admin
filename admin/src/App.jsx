import { BrowserRouter, Routes, Route } from "react-router-dom";

/* User */
import Users from "./components/user/Users";
import UserDetails from "./components/user/UserDetails";

/* Seller */
import Sellers from "./components/seller/Sellers";
import SellerDetails from "./components/seller/SellerDetails";

/* Designer */
import Designers from "./components/designer/Designers";
import DesignerWorks from "./components/designer/DesignerWorks";

/* Orders */
import Orders from "./components/orders/Orders";

/* Returns */
import Returns from "./components/returns/Returns";

import Dashboard from "./components/dashboard/Dashboard";

/* Contact */
import ContactMessages from "./components/contact/ContactMessages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Users */}
        <Route path="/" element={<Users />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetails />} />

        {/* Sellers */}
        <Route path="/sellers" element={<Sellers />} />
        <Route path="/sellerdetails" element={<SellerDetails />} />

        {/* Designers */}
        <Route path="/designers" element={<Designers />} />
        <Route path="/designer-works" element={<DesignerWorks />} />

        {/* Orders */}
        <Route path="/orders" element={<Orders />} />

        {/* Returns */}
        <Route path="/returns" element={<Returns />} />

        <Route path="/dashboard" element={<Dashboard />} />

        {/* Contacts */}
        <Route path="/contactmessages" element={<ContactMessages/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
