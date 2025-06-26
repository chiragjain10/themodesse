<template>
  <div class="container my-5">
    <h2 class="mb-4">My Orders</h2>
    <div v-if="loading" class="text-center py-4">
      <span class="spinner-border"></span> Loading orders...
    </div>
    <div v-else-if="orders.length === 0" class="alert alert-info">
      You have no orders yet.
    </div>
    <div v-else>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ formatDate(order.created_at) }}</td>
            <td>{{ order.status }}</td>
            <td>₹{{ order.total }}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary" @click="selectOrder(order)">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Order Details Modal -->
    <div v-if="selectedOrder" class="modal fade show d-block" tabindex="-1" style="background:rgba(0,0,0,0.3)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Order #{{ selectedOrder.id }} Details</h5>
            <button type="button" class="btn-close" @click="selectedOrder = null"></button>
          </div>
          <div class="modal-body">
            <p><b>Date:</b> {{ formatDate(selectedOrder.created_at) }}</p>
            <p><b>Status:</b> {{ selectedOrder.status }}</p>
            <p><b>Total:</b> ₹{{ selectedOrder.total }}</p>
            <h6>Items:</h6>
            <ul>
              <li v-for="item in selectedOrder.items" :key="item.id">
                {{ item.product_name }} (x{{ item.quantity }}) - ₹{{ item.price }}
              </li>
            </ul>
            <h6>Billing Details:</h6>
            <p>{{ selectedOrder.billing_details?.address || 'N/A' }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="selectedOrder = null">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const orders = ref([]);
const loading = ref(true);
const selectedOrder = ref(null);

const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/api/users/orders');
    orders.value = response.data;
  } catch (e) {
    orders.value = [];
  } finally {
    loading.value = false;
  }
};

const selectOrder = (order) => {
  selectedOrder.value = order;
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.modal {
  display: block;
}
</style>
