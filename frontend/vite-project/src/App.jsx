import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/items";

const App = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: "", modelId: "", color: "", quantity: "" });
const [editId,setEditId]=useState(null);
 

  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };


  useEffect(() => {
    fetchItems();
  }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
      if (editId) {
     
        await axios.put(`${API_URL}/${editId}`, {...formData});
      } else {
   
        await axios.post(API_URL, formData);
      }
      setFormData({ name: "", modelId: "", color: "", quantity: "" });
      setEditId(null);
      fetchItems();
    } catch (error) {
      console.error("Error adding/updating item", error);
    }
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  const handleEdit = (item) => {
    setFormData({ name: item.name, modelId: item.modelId, color: item.color, quantity: item.quantity });
    setEditId(item._id);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      
      <form onSubmit={handleSubmit} className="mb-4 space-y-1 ">
        <input type="text" name="name" placeholder="Item Name" value={formData.name} onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="modelId" placeholder="Model ID" value={formData.modelId} onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="color" placeholder="Color" value={formData.color} onChange={handleChange} className="border p-2 w-full" required />
        <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} className="border p-2 w-full" required />
        <button type="submit" className="bg-black text-white px-5 py-2 rounded">{editId?"UpdateItem":"AddItem"}</button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Inventory Items</h2>
    <ul>
      <table className="min-w-full border-collapse border border-gray-300">
  <thead>
    <tr className="bg-gray-300">
      <th className="border border-gray-300 px-4 py-2">Name</th>
      <th className="border border-gray-300 px-4 py-2">Model ID</th>
      <th className="border border-gray-300 px-4 py-2">Color</th>
      <th className="border border-gray-300 px-4 py-2">Quantity</th>
      <th className="border border-gray-300 px-4 py-2">Status</th>
      <th className="border border-gray-300 px-4 py-2">Actions</th>
    </tr>
  </thead>
  <tbody>
    {items.map((item) => (
      <tr key={item._id} className="border border-gray-300">
        <td className="border border-gray-300 px-4 py-2">{item.name}</td>
        <td className="border border-gray-300 px-4 py-2">{item.modelId}</td>
        <td className="border border-gray-300 px-4 py-2">{item.color}</td>
        <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
        <td className="border border-gray-300 px-4 py-2">{item.status}</td>
        <td className="border border-gray-300 px-4 py-2">
          <button
            onClick={() => handleDelete(item._id)}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Delete
          </button>
          <button
            onClick={() => handleEdit(item)}
            className="bg-gray-800 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </ul>
   
    </div>
  );
};

export default App;
