import { useContext, useState } from "react";
import { toast } from "react-toastify";
import CartTotal from "../Components/CartTotal";
import Title from "../Components/Title";
import { ShopContext } from "../Context/ShopContext";

const PlaceOrder = () => {
	const [paymentMethod, setPaymentMethod] = useState("cod");
	const [first_name, setFirst_Name] = useState("");
	const [last_name, setLast_name] = useState("");
	const [email, setEmail] = useState("");
	const [street, setStreet] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [zipcode, setZipcode] = useState("");
	const [country, setCountry] = useState("");
	const [phone, setPhone] = useState("");

	const { navigate, delivery_fee, getCartAmount, setCartItems } =
		useContext(ShopContext);

	const handleSubmit = async () => {
		const user_id = JSON.parse(sessionStorage.getItem("userId"));
		if (user_id) {
			const total_price = getCartAmount() + delivery_fee;
			const orderData = {
				first_name,
				last_name,
				email,
				street,
				city,
				state,
				zipcode,
				country,
				phone,
				user_id,
				total_price,
			};

			const response = await fetch("http://localhost:8081/orders/add-order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(orderData),
			});
			const data = await response.json();

			if (data.message == "Order Posted Successfully") {
				const order_id = data.orderid;
				const cart = JSON.parse(localStorage.getItem("orders"));
				const orderItemsData = { order_id, cart };
				console.log(orderItemsData);
				const sec_response = await fetch(
					"http://localhost:8081/orders/add-orderItems",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(orderItemsData),
					}
				);
				const data1 = await sec_response.json();
				if (data1.message == "Order Items Posted Successfully") {
					toast.success("Ordered Successful");
					setCartItems({});
					localStorage.removeItem("orders");
					navigate("/");
				} else {
					toast.error(data1.message);
				}
			}
		} else {
			toast.warning("Need to login first");
			navigate("/login");
		}
	};

	return (
		<div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
			{/* --------------- Left Side ----------------------- */}

			<div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
				<div className="text-xl sm:text-2xl my-3 ">
					<Title text1={"DELIVERY"} text2={"INFORMATION"} />
				</div>
				<div className="flex flex-col sm:flex-row gap-3">
					<input
						type="text"
						placeholder="First Name"
						value={first_name}
						onChange={(e) => setFirst_Name(e.target.value)}
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
					/>
					<input
						type="text"
						placeholder="Last Name"
						value={last_name}
						onChange={(e) => setLast_name(e.target.value)}
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
					/>
				</div>

				<input
					type="email"
					placeholder="Email Address"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
				/>

				<input
					type="text"
					placeholder="Street"
					value={street}
					onChange={(e) => setStreet(e.target.value)}
					className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
				/>

				<div className="flex flex-col sm:flex-row gap-3">
					<input
						type="text"
						placeholder="City"
						value={city}
						onChange={(e) => setCity(e.target.value)}
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
					/>
					<input
						type="text"
						placeholder="State"
						value={state}
						onChange={(e) => setState(e.target.value)}
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
					/>
				</div>

				<div className="flex flex-col sm:flex-row gap-3">
					<input
						type="text"
						placeholder="Zipcode"
						value={zipcode}
						onChange={(e) => setZipcode(e.target.value)}
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
					/>
					<input
						type="text"
						placeholder="Country"
						value={country}
						onChange={(e) => setCountry(e.target.value)}
						className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
					/>
				</div>

				<input
					type="text"
					placeholder="Phone"
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
					className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
				/>
			</div>

			{/* --------------- Right Side ----------------------- */}

			<div className="mt-8">
				<div className="mt8 min-w-80">
					<CartTotal />
				</div>

				<div className="mt-12">
					<Title text1={"PAYMENT"} text2={"METHOD"} />

					{/* -------------- Payment method selection -------------- */}

					<div className="flex flex-col lg:flex-row gap-4">
						<div
							onClick={() => {
								setPaymentMethod("cod");
							}}
							className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
							<p
								className={` min-w-3.5 h-3.5 border rounded-full ${
									paymentMethod === "cod" ? "bg-green-400" : ""
								}`}></p>
							<p className="text-gray-500 text-sm font-medium mx-4">
								{" "}
								CASH ON DELIVARY
							</p>
						</div>
					</div>

					{/* -------------- Payment method selection -------------- */}

					<div className="w-full text-end mt-8">
						<button
							onClick={() => {
								handleSubmit();
							}}
							className="bg-black text-white px-16 py-3 text-sm">
							PLACE ORDER
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PlaceOrder;
