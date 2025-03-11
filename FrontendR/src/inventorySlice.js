import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/items";

// Thunks for API calls
export const fetchItems = createAsyncThunk("inventory/fetchItems", async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const addItem = createAsyncThunk("inventory/addItem", async (item) => {
  const response = await axios.post(API_URL,item);
  return response.data;
});

export const updateItem = createAsyncThunk("inventory/updateItem", async ({ id, item }) => {
  const updateData=await axios.put(`${API_URL}/${id}`, item);
  return updateData.data;
});

export const deleteItem = createAsyncThunk("inventory/deleteItem", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

// Inventory slice
const inventorySlice = createSlice({
  name: "inventory",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload.item;
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default inventorySlice.reducer;
