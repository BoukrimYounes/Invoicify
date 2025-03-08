/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useState } from "react";
import { FiChevronDown, FiChevronUp, FiEdit, FiTrash } from "react-icons/fi";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, when: "beforeChildren" },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120 },
  },
};

const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
};

// // Update HomePage component structure
const invoices = [
  {
    id: "#INV001",
    client: "Olivia Martin",
    amount: 2450.5,
    status: "Paid",
    date: "2024-02-15",
  },
  {
    id: "#INV002",
    client: "Sarah Lee",
    amount: 1500.0,
    status: "Pending",
    date: "2024-02-14",
  },
  {
    id: "#INV003",
    client: "Michael Johnson",
    amount: 3200.75,
    status: "Paid",
    date: "2024-02-13",
  },
  {
    id: "#INV004",
    client: "Emily Davis",
    amount: 875.25,
    status: "Unpaid",
    date: "2024-02-12",
  },
  {
    id: "#INV005",
    client: "David Wilson",
    amount: 4200.0,
    status: "Paid",
    date: "2024-02-11",
  },
  {
    id: "#INV006",
    client: "Sophia Brown",
    amount: 950.0,
    status: "Pending",
    date: "2024-02-10",
  },
  {
    id: "#INV007",
    client: "James Miller",
    amount: 1300.5,
    status: "Unpaid",
    date: "2024-02-09",
  },
  {
    id: "#INV008",
    client: "Emma Taylor",
    amount: 2750.0,
    status: "Paid",
    date: "2024-02-08",
  },
  {
    id: "#INV009",
    client: "William Anderson",
    amount: 1800.0,
    status: "Pending",
    date: "2024-02-07",
  },
  {
    id: "#INV010",
    client: "Ava Martinez",
    amount: 500.0,
    status: "Unpaid",
    date: "2024-02-06",
  },
  {
    id: "#INV011",
    client: "Noah Garcia",
    amount: 3200.0,
    status: "Paid",
    date: "2024-02-05",
  },
  {
    id: "#INV012",
    client: "Isabella Rodriguez",
    amount: 1500.0,
    status: "Pending",
    date: "2024-02-04",
  },
  {
    id: "#INV013",
    client: "Liam Hernandez",
    amount: 2200.0,
    status: "Unpaid",
    date: "2024-02-03",
  },
  {
    id: "#INV014",
    client: "Mia Lopez",
    amount: 1800.0,
    status: "Paid",
    date: "2024-02-02",
  },
  {
    id: "#INV015",
    client: "Ethan Gonzalez",
    amount: 950.0,
    status: "Pending",
    date: "2024-02-01",
  },
  {
    id: "#INV016",
    client: "Charlotte Perez",
    amount: 4200.0,
    status: "Unpaid",
    date: "2024-01-31",
  },
  {
    id: "#INV017",
    client: "Alexander Torres",
    amount: 1300.0,
    status: "Paid",
    date: "2024-01-30",
  },
  {
    id: "#INV018",
    client: "Amelia Flores",
    amount: 2750.0,
    status: "Pending",
    date: "2024-01-29",
  },
  {
    id: "#INV019",
    client: "Benjamin Sanchez",
    amount: 500.0,
    status: "Unpaid",
    date: "2024-01-28",
  },
  {
    id: "#INV020",
    client: "Harper Rivera",
    amount: 3200.0,
    status: "Paid",
    date: "2024-01-27",
  },
  {
    id: "#INV021",
    client: "Harper Rivera",
    amount: 3200.0,
    status: "Paid",
    date: "2024-01-27",
  },
];

export default function HomePage() {
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [invoiceList, setInvoiceList] = useState(invoices);
  const navigate = useNavigate();
  const itemsPerPage = 5;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedInvoices = [...invoiceList].sort((a, b) => {
    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    }
    return sortDirection === "asc"
      ? a[sortField] > b[sortField]
        ? 1
        : -1
      : a[sortField] < b[sortField]
      ? 1
      : -1;
  });

  const paginatedInvoices = sortedInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-500/20 text-green-500";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "Unpaid":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  return (
    <div className="px-4">
      <Navigation />
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  Invoices
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {invoiceList.length} total invoices
                </p>
              </div>
              <button
                className="flex justify-between items-center gap-1 text-md font-semibold bg-main text-white px-4 py-2 rounded-md cursor-pointer"
                onClick={() => navigate("/newinvoice")}
              >
                New Invoice
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/30">
                  <tr>
                    {[
                      "ID",
                      "Client",
                      "Amount",
                      "Status",
                      "Date",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={() =>
                          ["ID", "Client", "Date"].includes(header) &&
                          handleSort(header.toLowerCase())
                        }
                      >
                        <div className="flex items-center gap-1">
                          {header}
                          {sortField === header.toLowerCase() &&
                            (sortDirection === "asc" ? (
                              <FiChevronUp />
                            ) : (
                              <FiChevronDown />
                            ))}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <motion.tbody
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="divide-y divide-gray-200 dark:divide-gray-700"
                >
                  {paginatedInvoices.map((invoice) => (
                    <motion.tr
                      key={invoice.id}
                      variants={itemVariants}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                        {invoice.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {invoice.client}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        ${Number(invoice.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`${getStatusColor(
                            invoice.status
                          )} px-3 py-1 rounded-full text-xs font-medium`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 flex gap-3">
                        <motion.button
                          {...hoverScale}
                          className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                        >
                          <FiEdit className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                        >
                          <FiTrash className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400"
                        >
                          <MdOutlineLocalPrintshop className="w-6 h-6" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of{" "}
                {Math.ceil(invoiceList.length / itemsPerPage)}
              </span>
              <div className="flex gap-2">
                <motion.button
                  {...hoverScale}
                  className={`px-4 py-2 text-sm ${
                    currentPage === 1
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  } rounded-md transition-colors`}
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage((p) => p - 1);
                    }
                  }}
                  disabled={currentPage === 1}
                >
                  Previous
                </motion.button>

                <motion.button
                  {...hoverScale}
                  className={`px-4 py-2 text-sm ${
                    currentPage === Math.ceil(invoiceList.length / itemsPerPage)
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  } rounded-md transition-colors`}
                  onClick={() => {
                    if (
                      currentPage < Math.ceil(invoiceList.length / itemsPerPage)
                    ) {
                      setCurrentPage((p) => p + 1);
                    }
                  }}
                  disabled={
                    currentPage === Math.ceil(invoiceList.length / itemsPerPage)
                  }
                >
                  Next
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
