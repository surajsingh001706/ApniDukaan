import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all orders
export const fetchAllOrders = createAsyncThunk(
  "/adminOrders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: "Failed to fetch orders" });
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  "/adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data.order; // Assuming backend returns { order: {...} }
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: "Failed to update order" });
    }
  }
);

// Delete an order
export const DeleteOrder = createAsyncThunk(
  "/adminOrders/DeleteOrder",
  async ({ id }, { rejectWithValue }) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error?.response?.data || { message: "Failed to delete order" });
    }
  }
);

// Admin Order Slice
const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
        state.totalSales = action.payload.reduce((acc, order) => acc + order.totalPrice, 0);
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update Order
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const index = state.orders.findIndex((order) => order._id === updatedOrder._id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })

      // Delete Order
      .addCase(DeleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((order) => order._id !== action.payload);
      });
  },
});

export default adminOrderSlice.reducer;
