import { useContext, useEffect, useState } from "react";
import Title from "../Components/Title";
import { ShopContext } from "../Context/ShopContext";

const Orders = () => {
	// const { orders, products, currency } = useContext(ShopContext);
	const [orders, setOrders] = useState([]);
	const [userId, setUserId] = useState();
	const currency = "$";

	useEffect(() => {
		setUserId(JSON.parse(sessionStorage.getItem("userId")));
	}, []);

	useEffect(() => {
		if (!userId) return; // Wait until userId is available

		const fetchData = async () => {
			try {
				const [ordersRes, itemsRes] = await Promise.all([
					fetch("http://localhost:8081/orders/allorders"),
					fetch("http://localhost:8081/orders/allorderitems"),
				]);

				const ordersData = await ordersRes.json();
				const itemsData = await itemsRes.json();

				const normalizedOrders = ordersData.map((order) => ({ ...order }));
				const normalizedItems = itemsData.map((item) => ({ ...item }));

				const uniqueProductIds = [
					...new Set(normalizedItems.map((item) => item.product_id)),
				];

				const productMap = {};
				await Promise.all(
					uniqueProductIds.map(async (id) => {
						const res = await fetch(
							`http://localhost:8081/products/specificproduct?id=${id}`
						);
						const data = await res.json();
						productMap[id] = data; // save full product object
					})
				);

				// Add full product object instead of just name
				const itemsWithProductInfo = normalizedItems.map((item) => ({
					...item,
					product: productMap[item.product_id] || null, // attach full product details
				}));

				const merged = normalizedOrders
					.filter((order) => order.user_id === userId) // ✅ filter orders by current user
					.map((order) => ({
						...order,
						items: itemsWithProductInfo.filter(
							(item) => item.order_id === order.order_id
						),
					}));

				setOrders(merged);
			} catch (error) {
				console.error("Failed to fetch full order data:", error);
			}
		};

		fetchData();
	}, [userId]);

	return (
		<div className="pt-16 border-t">
			<div className="mb-3 text-2xl">
				<Title text1={"MY"} text2={"ORDERS"} />
			</div>

			{orders.length === 0 ? (
				<p className="text-gray-500">You have no orders.</p>
			) : (
				<div>
					{orders.map((order, index) =>
						order.items.map((item, i) => (
							<div
								key={`${order.order_id}-${i}`}
								className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between g4">
								<div className="flex items-start gap-6">
									<img
										src={item.product?.image?.[0]}
										alt=""
										className="w-16 sm:w-20"
									/>

									<div>
										<p className="sm:text-base font-medium">
											{item.product?.name}
										</p>

										<div className="flex items-center gap-5 mt-2 text-base text-gray-700">
											<p>
												{currency}
												{item.product?.price}
											</p>
											<p>Quantity: {item.quantity}</p>
											<p>Size: {item.size}</p>
										</div>
										<p className="mt-2">
											Date:{" "}
											<span className="text-gray-400">
												{order.created_At?.slice(0, 10)}
											</span>
										</p>
									</div>
								</div>

								<div className="flex justify-between md:w-1/2">
									<div className="flex items-center gap-2">
										<p className="min-w-2 h-2 rounded-full bg-green-400"></p>
										<p className="text-sm md:text-base">
											{order.shipping_status.toUpperCase()}
										</p>
									</div>
									<button className="border px-4 py-2 text-sm font-medium rounded-sm text-gray-700">
										Track Order
									</button>
								</div>
							</div>
						))
					)}
				</div>
			)}
		</div>
	);
};

export default Orders;
