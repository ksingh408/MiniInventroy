import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/items";

const App = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: "", modelId: "", color: "", quantity: "" });

  // Fetch items from the API
  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, { ...formData, quantity: Number(formData.quantity) });
      setFormData({ name: "", modelId: "", color: "", quantity: "" });
      fetchItems(); // Fetch updated data
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input type="text" name="name" placeholder="Item Name" value={formData.name} onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="modelId" placeholder="Model ID" value={formData.modelId} onChange={handleChange} className="border p-2 w-full" required />
        <input type="text" name="color" placeholder="Color" value={formData.color} onChange={handleChange} className="border p-2 w-full" required />
        <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} className="border p-2 w-full" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Item</button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Inventory Items</h2>
      <ul>
        {items.map((item) => (
          <li key={item._id} className="border p-2 mb-2">
            {item.name} ({item.modelId}) - {item.color}, Quantity: {item.quantity}, Status: {item.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
