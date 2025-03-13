import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/items";

// Async Thunks
export const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async ({ page, limit }) => {
    const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
    return response.data;
  }
);

export const addItem = createAsyncThunk("inventory/addItem", async (item) => {
  const response = await axios.post(API_URL, item);
  return response.data;
});

export const updateItem = createAsyncThunk(
  "inventory/updateItem",
  async ({ id, item }) => {
    const response = await axios.put(`${API_URL}/${id}`, item);
    return response.data;
  }
);

export const deleteItem = createAsyncThunk("inventory/deleteItem", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

// Inventory Slice
const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    status: "idle",
    error: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

// Export Reducer & Actions
export const { setPage } = inventorySlice.actions;
export default inventorySlice.reducer;
