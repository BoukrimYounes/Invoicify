/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import logoDark from "../assets/logo_text_white.png";
import logoLight from "../assets/logo_text_black.png";
import { useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { motion } from "framer-motion";

function Navigation() {
  const [showEmail, setShowEmail] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const confirmLogout = () => {
    setTimeout(() => {
      navigate("/");
    }, 300);
  };

  const handleLogout = () => {
    setShowAlert(true);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="flex justify-between items-center px-6 py-3 max-w-6xl mx-auto my-4 
                 bg-white/80 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl 
                 shadow-lg shadow-gray-100/50 dark:shadow-gray-900/30 
                 border border-gray-100 dark:border-gray-700/60
                 hover:shadow-gray-200/60 dark:hover:shadow-gray-900/50 transition-all"
      >
        <motion.img
          whileHover={{ scale: 1.05 }}
          className="w-24 cursor-pointer"
          src={isDarkMode ? logoDark : logoLight}
          alt="logo"
        />

        <div className="relative">
          <motion.div
            className="flex items-center space-x-3 group cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div
              onClick={() => setShowEmail((prev) => !prev)}
              className="h-14 w-14 bg-main rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
            >
              <span className="text-white text-2xl font-semibold ">YB</span>
            </div>
          </motion.div>

          {showEmail && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute py-3 px-4 top-[70px] right-0 bg-white dark:bg-gray-800 z-20 
                       border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl
                       w-64 transition-all"
            >
              <div className="border-b pb-3 border-gray-200 dark:border-gray-600">
                <p className="font-bold text-gray-800 dark:text-white truncate">
                  Younes Boukrim
                </p>
                <small className="font-medium text-gray-500 dark:text-gray-400 text-sm">
                  younesBoukrim@gmail.com
                </small>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-red-500 dark:text-red-400 
                        hover:bg-gray-100 dark:hover:bg-gray-700/50 mt-2 px-2 py-2 
                        rounded-md transition-colors"
              >
                <BiLogOut size={16} className="mt-0.5" />
                <span>Logout</span>
              </button>
            </motion.div>
          )}
        </div>
      </motion.nav>
      {showAlert && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed min-h-screen w-full inset-0 bg-gray-700/50 backdrop-blur-sm flex items-center justify-center z-30"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-xs w-full mx-4">
            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              Confirm Logout
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setShowAlert(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                onClick={confirmLogout}
              >
                Log Out
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default Navigation;
