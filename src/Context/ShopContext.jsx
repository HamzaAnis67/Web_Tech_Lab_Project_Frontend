import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";
// import { products } from '../assets/assets';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
	const [products, setProducts] = useState([]);
	const currency = "$";
	const delivery_fee = 10;

	const [search, setSearch] = useState("");
	const [showSearch, setShowSearch] = useState(false);
	const [cartItems, setCartItems] = useState({});
	const [orders, setOrders] = useState([]); // New state to hold orders
	const navigate = useNavigate(); // to navigate to different pages

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await fetch(
					"http://localhost:8081/products/allproducts"
				);
				const data = await response.json();

				// Normalize the data (rename subcategory to subCategory)
				const normalizedData = data.map((item) => ({
					...item,
					subCategory: item.subcategory, // Rename subcategory to subCategory
				}));

				// Now set the normalized data to products state
				setProducts(normalizedData);
			} catch (error) {
				console.error("Failed to fetch products:", error);
			}
		};

		fetchProducts();
	}, []);

	const addToCart = async (itemId, size) => {
		if (!size) {
			toast.error("Please select a size");
			return;
		}

		let cartData = structuredClone(cartItems);

		if (cartData[itemId]) {
			cartData[itemId][size]
				? (cartData[itemId][size] += 1)
				: (cartData[itemId][size] = 1);
		} else {
			cartData[itemId] = {};
			cartData[itemId][size] = 1;
		}

		setCartItems(cartData);
	};

	const addOrder = () => {
		let newOrder = [];

		for (const item in cartItems) {
			for (const size in cartItems[item]) {
				if (cartItems[item][size] > 0) {
					newOrder.push({
						id: item,
						size,
						quantity: cartItems[item][size],
					});
				}
			}
		}

		const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
		const updatedOrders = [...existingOrders, ...newOrder];
		localStorage.setItem("orders", JSON.stringify(updatedOrders));
	};
	const getCartCount = () => {
		let totalCount = 0;
		for (const item in cartItems) {
			for (const size in cartItems[item]) {
				if (cartItems[item][size] > 0) {
					totalCount += cartItems[item][size];
				}
			}
		}
		return totalCount;
	};

	const updateQuantity = async (itemId, size, quantity) => {
		let cartData = structuredClone(cartItems);
		cartData[itemId][size] = quantity;
		setCartItems(cartData);
	};

	const getCartAmount = () => {
		let total = 0;

		for (const itemId in cartItems) {
			for (const size in cartItems[itemId]) {
				const quantity = cartItems[itemId][size];
				const product = products.find((p) => String(p.id) === String(itemId));

				if (product && quantity > 0) {
					total += product.price * quantity;
				} else {
					console.warn(`Product with id ${itemId} not found`);
				}
			}
		}

		return total;
	};

	const value = {
		products,
		currency,
		delivery_fee,
		search,
		setSearch,
		showSearch,
		setShowSearch,
		cartItems,
		addToCart,
		getCartCount,
		updateQuantity,
		getCartAmount,
		addOrder,
		orders,
		navigate,
		setCartItems,
	};

	return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

ShopContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
export default ShopContextProvider;
