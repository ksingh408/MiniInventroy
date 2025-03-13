import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems, addItem, updateItem, deleteItem, setPage } from "./inventorySlice";

const InventoryManager = () => {
  const dispatch = useDispatch();
  const { items, currentPage, totalPages } = useSelector((state) => state.inventory);

  const [formData, setFormData] = useState({ name: "", modelId: "", color: "", quantity: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchItems({ page: currentPage, limit: 5 })); // Fetch items with pagination
  }, [dispatch, currentPage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await dispatch(updateItem({ id: editId, item: formData }));
    } else {
      await dispatch(addItem(formData));
    }
    setFormData({ name: "", modelId: "", color: "", quantity: "" });
    setEditId(null);
    dispatch(fetchItems({ page: currentPage, limit: 5 })); // Refresh data after action
  };

  const handleEdit = (item) => {
    setFormData({ name: item.name, modelId: item.modelId, color: item.color, quantity: item.quantity });
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteItem(id));
    dispatch(fetchItems({ page: currentPage, limit: 5 })); // Refresh data after delete
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-1">
        <input type="text" name="name" placeholder="Item Name" value={formData.name} onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="modelId" placeholder="Model ID" value={formData.modelId} onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="color" placeholder="Color" value={formData.color} onChange={handleChange} className="border p-2 w-full" required />
        <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} className="border p-2 w-full" required />
        <button type="submit" className="bg-black text-white px-5 py-2 rounded">
          {editId ? "Update Item" : "Add Item"}
        </button>
      </form>

      {/* Table Section */}
      <h2 className="text-xl font-semibold mb-2">Inventory Items</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-300">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Model ID</th>
            <th className="border px-4 py-2">Color</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className="border">
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.modelId}</td>
              <td className="border px-4 py-2">{item.color}</td>
              <td className="border px-4 py-2">{item.quantity}</td>
              <td className="border px-4 py-2">{item.status}</td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEdit(item)} className="bg-gray-800 text-white px-4 py-2 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="bg-gray-500 text-white px-4 py-2 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={() => dispatch(setPage(currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-gray-700 text-white rounded disabled:bg-gray-400"
        >
          Previous
        </button>
        <span className="px-4 py-2">{currentPage} / {totalPages}</span>
        <button
          onClick={() => dispatch(setPage(currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-gray-700 text-white rounded disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InventoryManager;
