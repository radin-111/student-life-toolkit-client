import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import Loading from "../../Components/Loading";
import useAuth from "../../hooks/useAuth";

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
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Transactions</h2>

      {/* Table */}
      <div className="overflow-x-auto">
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
            {transactions.map((t, idx) => (
              <tr key={t._id}>
                <td>{idx + 1}</td>
                <td>{t.type}</td>
                <td>{t.category}</td>
                <td>${t.amount.toFixed(2)}</td>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.notes || "-"}</td>
                <td className="flex gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => setEditingTransaction(t)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => handleDelete(t._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-center">
              Edit Transaction
            </h3>
            <form className="flex flex-col gap-3" onSubmit={handleEditSubmit}>
              <input
                type="text"
                name="category"
                defaultValue={editingTransaction.category}
                className="input input-bordered w-full"
                required
              />
              <select
                name="type"
                defaultValue={editingTransaction.type}
                className="select select-bordered w-full"
                required
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
              <input
                type="number"
                name="amount"
                step="0.01"
                defaultValue={editingTransaction.amount}
                className="input input-bordered w-full"
                required
              />
              <input
                type="date"
                name="date"
                defaultValue={
                  new Date(editingTransaction.date).toISOString().split("T")[0]
                }
                className="input input-bordered w-full"
                required
              />
              <textarea
                name="notes"
                defaultValue={editingTransaction.notes}
                className="textarea textarea-bordered w-full"
              ></textarea>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditingTransaction(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
