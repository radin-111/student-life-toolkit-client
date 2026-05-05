import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import Loading from "../../Components/Loading";
import useAuth from "../../hooks/useAuth";
import { AnimatedCard } from "../../utils/animations";

const TransactionList = () => {
  const queryClient = useQueryClient();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const axiosSecure = useAxios();
  const { user } = useAuth();
  // Fetch transactions
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/transactions?email=${user?.providerData[0]?.email}`);
      return res.data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      Swal.fire("Deleted!", "Transaction has been deleted.", "success");
    },
    onError: () => Swal.fire("Error!", "Failed to delete.", "error"),
  });

  // Edit mutation (do NOT include _id in payload)
  const editMutation = useMutation({
    mutationFn: (updated) => {
      const { _id, ...payload } = updated; // remove _id from payload
      return axiosSecure.put(`/transactions/${_id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      Swal.fire("Success!", "Transaction updated.", "success");
      setEditingTransaction(null);
    },
    onError: () => Swal.fire("Error!", "Failed to update.", "error"),
  });

  // Handle delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the transaction.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  // Handle edit submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const updated = {
      ...editingTransaction,
      amount: parseFloat(form.amount.value),
      category: form.category.value,
      type: form.type.value,
      date: form.date.value,
      notes: form.notes.value,
    };

    editMutation.mutate(updated);
  };

  if (isLoading) return <Loading></Loading>;

  return (
    <AnimatedCard className="max-w-4xl mx-auto p-4">
      <motion.h2 
        className="text-2xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Transactions
      </motion.h2>

      {/* Table */}
      <motion.div 
        className="overflow-x-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {transactions.map((t, idx) => (
                <motion.tr
                  key={t._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                >
                  <td>{idx + 1}</td>
                  <td>
                    <motion.span
                      className={`badge ${
                        t.type === "Income" ? "badge-success" : "badge-error"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {t.type}
                    </motion.span>
                  </td>
                  <td>{t.category}</td>
                  <td className="font-semibold">
                    ${t.amount.toFixed(2)}
                  </td>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td>{t.notes || "-"}</td>
                  <td className="flex gap-2">
                    <motion.button
                      className="btn btn-sm btn-warning"
                      onClick={() => setEditingTransaction(t)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(t._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingTransaction && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditingTransaction(null)}
          >
            <motion.div
              className="bg-white p-6 rounded-xl w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.h3 
                className="text-xl font-bold mb-4 text-center"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Edit Transaction
              </motion.h3>
              <motion.form 
                className="flex flex-col gap-3" 
                onSubmit={handleEditSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.input
                  type="text"
                  name="category"
                  defaultValue={editingTransaction.category}
                  className="input input-bordered w-full"
                  required
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                />
                <motion.select
                  name="type"
                  defaultValue={editingTransaction.type}
                  className="select select-bordered w-full"
                  required
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </motion.select>
                <motion.input
                  type="number"
                  name="amount"
                  step="0.01"
                  defaultValue={editingTransaction.amount}
                  className="input input-bordered w-full"
                  required
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                />
                <motion.input
                  type="date"
                  name="date"
                  defaultValue={
                    new Date(editingTransaction.date).toISOString().split("T")[0]
                  }
                  className="input input-bordered w-full"
                  required
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                />
                <motion.textarea
                  name="notes"
                  defaultValue={editingTransaction.notes}
                  className="textarea textarea-bordered w-full"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                ></motion.textarea>
                <motion.div 
                  className="flex justify-end gap-2 mt-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setEditingTransaction(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    type="submit" 
                    className="btn btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Save
                  </motion.button>
                </motion.div>
              </motion.form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatedCard>
  );
};

export default TransactionList;
