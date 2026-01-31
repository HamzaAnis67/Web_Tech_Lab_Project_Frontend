import { useContext, useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const name = formValues.name;
    const email = formValues.email;
    const password = formValues.password;
    if (currentState === "Sign Up") {
      const userData = {
        name,
        email,
        password,
      };

      const response = await fetch("http://localhost:8081/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data.message == "User registered successfully") {
        toast.success(data.message);
        setFormValues({
          name: "",
          email: "",
          password: "",
        });
      } else {
        toast.error(data.message);
      }
    }

    if (currentState === "Login") {
      const userData = {
        email,
        password,
      };

      const response = await fetch("http://localhost:8081/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data.message == "Login Successful") {
        toast.success(data.message);
        setFormValues({
          name: "",
          email: "",
          password: "",
        });
      } else {
        toast.error(data.message);
      }
      sessionStorage.setItem("userId", JSON.stringify(data.user.user_id));
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl"> {currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800 " />
      </div>

      <div className="w-full px-3 py-2 flex flex-col gap-4">
        {currentState === "Sign Up" && (
          <input
            type="text"
            name="name"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Name"
            value={formValues.name}
            onChange={handleChange}
            required
          />
        )}

        <input
          type="email"
          name="email"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Email"
          value={formValues.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Password"
          value={formValues.password}
          onChange={handleChange}
          required
        />

        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p className=" cursor-pointer">Forgot your password?</p>
          {currentState === "Login" ? (
            <p
              onClick={() => setCurrentState("Sign Up")}
              className="cursor-pointer"
            >
              Create Account
            </p>
          ) : (
            <p
              onClick={() => setCurrentState("Login")}
              className="cursor-pointer"
            >
              Login Here
            </p>
          )}
        </div>
        <button className="w-1/2 m-auto bg-black text-white px-8 py-2 mt-4">
          {currentState === "Login" ? "Sign In" : "Sign Up"}
        </button>
      </div>
    </form>
  );
};

export default Login;
