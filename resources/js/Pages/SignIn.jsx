// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from "react"; // For password visibility toggle
import { HiOutlineMail } from "react-icons/hi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import SignInImage from "../assets/Sign in-pana.svg";
import toast ,{ Toaster } from "react-hot-toast";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const floatVariants = {
  float: {
    y: [-10, 10],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    },
  },
};

function SignIn() {
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const { flash } = usePage().props;

  useEffect(() => {
     if (flash?.success) toast.success(flash.success);
     if (flash?.error) toast.error(flash.error);
  }, [flash]);
  
  const {data, setData, post, errors ,processing} = useForm({
    email: "",
    password: "",
    remember: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login');
    }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="font-inter container mx-auto w-full min-h-screen flex items-center justify-center px-4 "
    >
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="h-fit mx-4 my-auto rounded-2xl border border-gray-200 px-6 py-4 shadow-lg dark:bg-gray-800 dark:border-gray-700"
        >
          <form onSubmit={handleSubmit}>
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold mb-2 text-gray-800 dark:text-white"
            >
              Sign in
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mb-3 text-sm text-gray-500 dark:text-gray-400"
            >
              Sign in to your account and explore a world of possibilities. Your
              journey begins here.
            </motion.p>

            {/* Email Input */}
            <motion.div variants={itemVariants} className="mb-2">
              <label
                className="text-base text-gray-700 mb-1 block dark:text-gray-300"
                htmlFor="email"
              >
                Email
                {errors.email && (
                  <span className="ml-2 text-red-500 animate-pulse">*</span>
                )}
              </label>
              <div
                className={`flex gap-2 justify-between items-center px-3 py-2 border ${
                  errors.email
                    ? "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 hover:border-blue-500 dark:border-gray-600"
                } rounded-lg transition-all duration-300 ease-in-out`}
              >
                <input
                  className="outline-none border-none flex-1 placeholder-gray-400 bg-transparent dark:text-white dark:placeholder-gray-500"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={data.email}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.email}
                  aria-describedby="emailError"
                />
                <HiOutlineMail
                  className={`text-xl ${
                    errors.email
                      ? "text-red-500 dark:text-red-400"
                      : "text-gray-400 dark:text-gray-500"
                  } transition-colors duration-300`}
                />
              </div>
              {errors.email && (
                <div
                  id="emailError"
                  className="flex items-center mt-2 animate-fade-in"
                  role="alert"
                >
                  <svg
                    className="w-5 h-5 mr-2 text-red-500 dark:text-red-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                    {errors.email}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="mb-2">
              <label
                className="text-base text-gray-700 mb-1 block dark:text-gray-300"
                htmlFor="password"
              >
                Password
                {errors.password && (
                  <span className="ml-2 text-red-500 animate-pulse">*</span>
                )}
              </label>
              <div
                className={`flex gap-2 justify-between items-center px-3 py-2 border ${
                  errors.password
                    ? "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 hover:border-blue-500 dark:border-gray-600"
                } rounded-lg transition-all duration-300 ease-in-out`}
              >
                <input
                  className="outline-none border-none flex-1 placeholder-gray-400 bg-transparent dark:text-white dark:placeholder-gray-500"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={data.password}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.password}
                  aria-describedby="passwordError"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`text-gray-400 hover:text-gray-600 transition-colors dark:text-gray-500 dark:hover:text-gray-400 ${
                    errors.password ? "text-red-500 dark:text-red-400" : ""
                  }`}
                >
                  {showPassword ? (
                    <FaRegEyeSlash className="text-xl" />
                  ) : (
                    <FaRegEye className="text-xl" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div
                  id="passwordError"
                  className="flex items-center mt-2 animate-fade-in"
                  role="alert"
                >
                  <svg
                    className="w-5 h-5 mr-2 text-red-500 dark:text-red-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                    {errors.password}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Remember Me and Forgot Password */}
            <motion.div
              variants={itemVariants}
              className="flex justify-between items-center my-4"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  name="remember"
                  checked={data.remember}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 accent-blue-500/25 dark:border-gray-600 dark:bg-gray-700"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>
              <Link
                href={route('password.request')} 
                className="text-sm text-blue-500 hover:underline dark:text-blue-400"
              >
                Forgot your password?
              </Link>
            </motion.div>

            {/* Sign In Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={processing}
              className={`bg-blue-500 hover:bg-blue-600 text-white text-lg w-full py-2 rounded-lg transition-all ${
                processing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {processing ? "Signing In..." : "Sign In"}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <motion.p
            variants={itemVariants}
            className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400"
          >
            Don't have an account?{" "}
            <Link
               href={route('signup')} 
              className="text-blue-500 hover:underline font-medium dark:text-blue-400"
            >
              Sign Up
            </Link>
          </motion.p>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:block"
        >
          <motion.img
            variants={floatVariants}
            animate="float"
            className="w-full h-full object-cover"
            src={SignInImage}
            alt="Sign In"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SignIn;
