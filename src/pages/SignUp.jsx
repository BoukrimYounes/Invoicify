// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { RiUserReceived2Line } from "react-icons/ri";
import { HiOutlineMail } from "react-icons/hi";
import { useState } from "react"; // For password visibility toggle
import SignInImage from "../assets/Sign up-cuate.svg";
import { Link, useNavigate } from "react-router-dom";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    acceptedTearms: false,
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: "",
      email: "",
      password: "",
    };

    if (!formData.fullName) {
      newErrors.fullName = "Full Name is required";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else {
      // Check if email format is valid
      if (!formData.email.includes("@")) {
        errors.email = "Please enter a valid email address";
        isValid = false;
      }
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form data: ", formData);
      setIsSubmitting(true);
      setTimeout(() => {
        navigate("/home");
      }, 600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="font-inter container mx-auto w-full min-h-screen flex items-center justify-center px-4 "
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="h-fit my-auto rounded-2xl border border-gray-200 px-6 py-4 shadow-lg dark:bg-gray-800 dark:border-gray-700"
        >
          <form onSubmit={handleSubmit}>
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold mb-2 text-gray-800 dark:text-white"
            >
              Create an account
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mb-3 text-sm text-gray-500 dark:text-gray-400"
            >
              Welcome to our registration page! Get started by creating your
              account.
            </motion.p>

            {/* fullname Input */}
            <motion.div variants={itemVariants} className="mb-2">
              <label
                className="text-base text-gray-700 mb-1 block dark:text-gray-300"
                htmlFor="fullName"
              >
                Full name
                {errors.fullName && (
                  <span className="ml-2 text-red-500 animate-pulse">*</span>
                )}
              </label>
              <div
                className={`flex gap-2 justify-between items-center px-3 py-2 border ${
                  errors.fullName
                    ? "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 hover:border-blue-500 dark:border-gray-600"
                } rounded-lg transition-all duration-300 ease-in-out`}
              >
                <input
                  className="outline-none border-none flex-1 placeholder-gray-400 bg-transparent dark:text-white dark:placeholder-gray-500"
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  aria-invalid={!!errors.fullName}
                  aria-describedby="fullNameError"
                />
                <RiUserReceived2Line
                  className={`text-xl ${
                    errors.fullName
                      ? "text-red-500 dark:text-red-400"
                      : "text-gray-400 dark:text-gray-500"
                  } transition-colors duration-300`}
                />
              </div>
              {errors.fullName && (
                <div
                  id="fullNameError"
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
                    {errors.fullName}
                    <span className="block text-red-500/80 dark:text-red-400/60 text-xs mt-1">
                      (This field is required to continue)
                    </span>
                  </p>
                </div>
              )}
            </motion.div>

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
                  value={formData.email}
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
                    <span className="block text-red-500/80 dark:text-red-400/60 text-xs mt-1">
                      (Please enter a valid email address)
                    </span>
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
                  value={formData.password}
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
                    <span className="block text-red-500/80 dark:text-red-400/60 text-xs mt-1">
                      (Password must be at least 8 characters long)
                    </span>
                  </p>
                </div>
              )}
            </motion.div>

            {/* Remember Me and Forgot Password */}
            <motion.div
              variants={itemVariants}
              className="flex items-center my-4"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="acceptedTearms"
                  name="acceptedTearms"
                  checked={formData.acceptedTearms}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 accent-blue-500/25 dark:border-gray-600 dark:bg-gray-700"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  I accept the
                </label>
              </div>
              <Link
                to="/Terms&Conditions"
                className="text-sm text-blue-500 hover:underline dark:text-blue-400 ml-1"
              >
                Terms and Conditions
              </Link>
            </motion.div>

            {/* Sign In Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-500 hover:bg-blue-600 text-white text-lg w-full py-2 rounded-lg transition-all ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Creating Account..." : "Create an Account"}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <motion.p
            variants={itemVariants}
            className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400"
          >
            Already have an account?{" "}
            <Link
              to="/"
              className="text-blue-500 hover:underline font-medium dark:text-blue-400"
            >
              Login here
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
