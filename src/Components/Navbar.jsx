import { assets } from "../assets/assets";
import { ShopContext } from "../Context/ShopContext";
import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount } = useContext(ShopContext);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = JSON.parse(sessionStorage.getItem("userId"));
    setUserId(storedId);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    setUserId(null);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium relative">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="w-36" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <li>
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <p>HOME</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/collection"
            className="flex flex-col items-center gap-1"
          >
            <p>COLLECTION</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className="flex flex-col items-center gap-1">
            <p>ABOUT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className="flex flex-col items-center gap-1">
            <p>CONTACT</p>
            <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </li>
        {userId && (
          <li>
            <NavLink to="/orders" className="flex flex-col items-center gap-1">
              <p>ORDERS</p>
              <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
            </NavLink>
          </li>
        )}
        <button
          onClick={() => (window.location.href = "http://localhost:5173")}
          className="px-4 font-xs py-2 border border-gray-300 rounded-full"
        >
          Admin Panel
        </button>
      </ul>

      <div className="flex items-center gap-6">
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          alt="Search"
          className="w-5 cursor-pointer"
        />

        {userId ? (
          <button onClick={handleLogout} className="text-sm text-gray-700">
            Logout
          </button>
        ) : (
          <Link to="/login">
            <img
              src={assets.profile_icon}
              alt="Profile"
              className="w-5 cursor-pointer"
            />
          </Link>
        )}

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} alt="Cart" className="w-5 min-w-5" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>

        <img
          src={assets.menu_icon}
          alt="Menu"
          className="w-5 cursor-pointer sm:hidden"
          onClick={() => setVisible(!visible)}
        />
      </div>

      {/* Sidebar menu for small screens */}
      <div
        className={`absolute top-0 right-0 bottom-0  bg-white ease-in duration-300 z-50
        ${visible ? "w-full" : "w-0 overflow-hidden"}`}
      >
        <div className="flex flex-col text-gray-600 bg-white">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img
              src={assets.dropdown_icon}
              alt="Back"
              className="h-4 rotate-180"
            />
            <p className="font-semibold">Back</p>
          </div>

          <NavLink
            to="/"
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
          >
            HOME
          </NavLink>
          <NavLink
            to="/collection"
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
          >
            COLLECTION
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
          >
            ABOUT
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
          >
            CONTACT
          </NavLink>
          {userId && (
            <NavLink
              to="/orders"
              onClick={() => setVisible(false)}
              className="py-2 pl-6 border"
            >
              ORDERS
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
