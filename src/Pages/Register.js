import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate()

  const passwordRequirements = [
    { label: "Minimum 8 characters", test: (pw) => pw.length >= 8 },
    { label: "At least one uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
    { label: "At least one number", test: (pw) => /[0-9]/.test(pw) },
    { label: "At least one special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
  ];

  // Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!validate()) {
     return alert("please input valid data");
    }  
        try{
          const results = await axios.post("http://localhost:5000/api/auth/register", formData);
          console.log(results.data?.message);

          if(results.data?.message === "User registered"){
          alert("Registration successful!");
                

          navigate("/login"); 
         
          }
          setFormData({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
          });
        }
        catch(err){
          console.log(err);
        }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-black dark:text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white dark:bg-gray-900"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create New Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
            />

            {/* Password requirements list */}
            <ul className="mt-3 space-y-2 text-sm">
              {passwordRequirements.map((req, i) => {
                const passed = req.test(formData.password);
                return (
                  <li key={i} className="flex items-center space-x-2">
                    {passed ? (
                      <CheckCircle className="text-green-500 w-4 h-4" />
                    ) : (
                      <Circle className="text-gray-400 w-4 h-4" />
                    )}
                    <span
                      className={passed ? "text-green-500" : "text-gray-500"}
                    >
                      {req.label}
                    </span>
                  </li>
                );
              })}
            </ul>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-black text-white dark:bg-white dark:text-black py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            Register
          </button>

          {/* Login Link */}
          <p className="text-center text-sm mt-3">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
