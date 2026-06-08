import ReactDOM from "react-dom/client";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Contact from "./Contact";
import Order from "./orders";
import Addproducts from "./Addproducts";
import Deliverydetails from "./Deliverydetails";
import Message from "./message";
import "./index.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Manageadmin from "./Manageadmin";

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}></Route>
      <Route path="/home" element={<Home />}></Route>
      <Route path="/signup" element={<Signup/>}></Route>
      <Route path="/contact" element={<Contact/>}></Route>
      <Route path="/delivery" element={<Deliverydetails/>}></Route>
      <Route path="/order" element={<Order/>}></Route>
      <Route path="/addproducts" element={<Addproducts/>}></Route>
      <Route path="/message" element={<Message/>}></Route>
      <Route path="/manageadmin" element={<Manageadmin/>}></Route>
    </Routes>
  </BrowserRouter>
)