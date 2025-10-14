<template>
  <div v-if="authLoading"></div>
  <div v-else-if="auth.isAuthenticated" class="account-dashboard">
    <aside :class="['account-sidebar', { open: sidebarOpen }]">
      <div class="sidebar-toggle" @click="sidebarOpen = !sidebarOpen">
        <span v-if="!sidebarOpen">☰</span>
        <span v-else>✕</span>
      </div>
      <div class="account-user-card">
        <div class="avatar-circle">{{ userInitials }}</div>
        <div class="user-info">
          <div class="user-name">{{ user?.name }}</div>
          <div class="user-email">{{ user?.email }}</div>
        </div>
      </div>
      <nav class="account-nav">
        <ul>
          <li :class="{active: section==='profile'}" @click="setSection('profile')">
            <span class="icon">👤</span> Profile
          </li>
          <li :class="{active: section==='orders'}" @click="setSection('orders')">
            <span class="icon">📦</span> Orders
          </li>
          <li :class="{active: section==='wishlist'}" @click="setSection('wishlist')">
            <span class="icon">❤️</span> Wishlist
          </li>
          <li :class="{active: section==='addresses'}" @click="setSection('addresses')">
            <span class="icon">🏠</span> Addresses
          </li>
          <li @click="logout">
            <span class="icon">🚪</span> Logout
          </li>
        </ul>
      </nav>
    </aside>
    <main class="account-main">
      <section v-if="section==='profile'">
        <h2>My Profile</h2>
        <div class="profile-card">
          <div class="profile-row"><span>Name:</span> <span>{{ user?.name }}</span></div>
          <div class="profile-row"><span>Email:</span> <span>{{ user?.email }}</span></div>
          <div class="profile-row"><span>Phone:</span> <span>{{ user?.phone || '—' }}</span></div>
          <div class="profile-row"><span>Address:</span> <span>{{ user?.address || '—' }}</span></div>
          <button class="edit-btn" @click="editProfile = true">Edit Profile</button>
        </div>
        <div v-if="editProfile" class="edit-profile-modal">
          <div class="modal-content">
            <h3>Edit Profile</h3>
            <form @submit.prevent="updateProfile">
              <label>Name <input v-model="editUser.name" required /></label>
              <label>Email <input v-model="editUser.email" required type="email" /></label>
              <label>Phone <input v-model="editUser.phone" /></label>
              <label>Address <input v-model="editUser.address" /></label>
              <div class="modal-actions">
                <button type="submit" class="primary-btn">Save</button>
                <button type="button" class="secondary-btn" @click="editProfile = false">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <section v-else-if="section==='orders'">
        <h2>My Orders</h2>
        <div v-if="orders.length === 0" class="empty-state">No orders found.</div>
        <table v-else class="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ formatDate(order.created_at) }}</td>
              <td><span :class="['order-status', order.status.toLowerCase()]">{{ order.status }}</span></td>
              <td>₹{{ order.total }}</td>
              <td><button class="primary-btn small" @click="viewOrder(order)">View</button></td>
            </tr>
          </tbody>
        </table>
        <div v-if="selectedOrder" class="order-details-modal">
          <div class="modal-content">
            <h3>Order #{{ selectedOrder.id }}</h3>
            <ul>
              <li v-for="item in selectedOrder.items" :key="item.id">
                {{ item.product_name }} x{{ item.quantity }} — ₹{{ item.price }}
              </li>
            </ul>
            <div class="modal-actions">
              <button class="primary-btn" @click="selectedOrder = null">Close</button>
            </div>
          </div>
        </div>
      </section>
      <section v-else-if="section==='wishlist'">
        <h2>My Wishlist</h2>
        <div v-if="wishlist.length === 0" class="empty-state">No items in wishlist.</div>
        <div v-else class="wishlist-grid">
          <div v-for="item in wishlist" :key="item.id" class="wishlist-card">
            <img :src="item.product?.thumbnail_image" :alt="item.product?.name" />
            <div class="wishlist-info">
              <div class="wishlist-title">{{ item.product?.name }}</div>
              <div class="wishlist-price">₹{{ item.product?.price }}</div>
              <button class="primary-btn small" @click="goToProduct(item.product?.slug)">View</button>
            </div>
          </div>
        </div>
      </section>
      <section v-else-if="section==='addresses'">
        <h2>My Addresses</h2>
        <div v-if="!user?.address" class="empty-state">No address saved.</div>
        <div v-else class="address-card">{{ user.address }}</div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/api/axios';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();
const authLoading = ref(true);
const section = ref('profile');
const sidebarOpen = ref(false);
const user = ref(null);
const orders = ref([]);
const wishlist = ref([]);
const selectedOrder = ref(null);
const editProfile = ref(false);
const editUser = reactive({ name: '', email: '', phone: '', address: '' });

const userInitials = computed(() => {
  if (!user.value) return '';
  return user.value.name?.split(' ').map(n => n[0]).join('').toUpperCase();
});

const setSection = (sec) => {
  section.value = sec;
  sidebarOpen.value = false;
};

const fetchUser = async () => {
  try {
    const res = await axios.get('/api/user');
    user.value = res.data;
    Object.assign(editUser, user.value);
  } catch (e) {
    router.push('/login');
  }
};

const fetchOrders = async () => {
  try {
    const res = await axios.get(`/api/users/orders/${user.value.id}`);
    orders.value = res.data;
  } catch (e) {
    orders.value = [];
  }
};

const fetchWishlist = async () => {
  try {
    const sessionId = localStorage.getItem('wishlistSessionId');
    if (!sessionId) return wishlist.value = [];
    const res = await axios.get(`/api/wishlist/${sessionId}`);
    wishlist.value = res.data;
  } catch (e) {
    wishlist.value = [];
  }
};

const updateProfile = async () => {
  try {
    await axios.put(`/api/users/profiles/${user.value.id}`, editUser);
    await fetchUser();
    editProfile.value = false;
  } catch (e) {
    alert('Failed to update profile');
  }
};

const logout = async () => {
  try {
    await axios.get('/api/logout');
    localStorage.removeItem('wishlistSessionId');
    router.push('/login');
  } catch (e) {
    router.push('/login');
  }
};

const viewOrder = async (order) => {
  try {
    const res = await axios.get(`/api/users/orders/${order.id}/items`);
    selectedOrder.value = { ...order, items: res.data };
  } catch (e) {
    selectedOrder.value = { ...order, items: [] };
  }
};

const goToProduct = (slug) => {
  if (slug) router.push(`/product/${slug}`);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString();
};

onMounted(async () => {
  // Wait for auth state to load (replace with your actual method if different)
  if (typeof auth.loadUser === 'function') {
    await auth.loadUser();
  }
  authLoading.value = false;
  if (!auth.isAuthenticated) {
    router.replace('/login');
  } else {
    await fetchUser();
    await fetchOrders();
    await fetchWishlist();
  }
});
</script>

<style scoped>
.account-dashboard {
  display: flex;
  min-height: 80vh;
  background: linear-gradient(135deg, #f7f7f9 60%, #fffbe6 100%);
  font-family: 'Inter', Arial, sans-serif;
  position: relative;
}
.account-sidebar {
  width: 260px;
  background: #fff;
  border-right: 1px solid #eee;
  padding: 32px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 2px 0 16px #f1c40f11;
  z-index: 10;
  transition: left 0.3s;
}
.sidebar-toggle {
  display: none;
  position: absolute;
  top: 18px;
  left: 18px;
  font-size: 2rem;
  background: #fffbe6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px #f1c40f22;
  cursor: pointer;
  z-index: 20;
}
.account-user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}
.avatar-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f1c40f 60%, #f39c12 100%);
  color: #fff;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  font-weight: bold;
  box-shadow: 0 2px 8px #f1c40f44;
}
.user-info {
  text-align: center;
}
.user-name {
  font-weight: 600;
  font-size: 1.1rem;
}
.user-email {
  font-size: 0.95rem;
  color: #888;
}
.account-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}
.account-nav li {
  padding: 14px 32px;
  cursor: pointer;
  font-size: 1rem;
  color: #333;
  display: flex;
  align-items: center;
  border-left: 4px solid transparent;
  transition: background 0.2s, border-color 0.2s;
  border-radius: 0 20px 20px 0;
  margin-bottom: 6px;
}
.account-nav li.active, .account-nav li:hover {
  background: linear-gradient(90deg, #fffbe6 60%, #f1c40f22 100%);
  border-left: 4px solid #f1c40f;
  color: #222;
  font-weight: 600;
}
.account-nav .icon {
  margin-right: 12px;
  font-size: 1.2em;
}
.account-main {
  flex: 1;
  padding: 40px 48px;
  min-width: 0;
}
.profile-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px #f1c40f11;
  padding: 32px;
  max-width: 480px;
  margin-bottom: 32px;
  border: 1px solid #f1c40f22;
}
.profile-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 1.05rem;
}
.edit-btn {
  background: linear-gradient(90deg, #f1c40f 60%, #f39c12 100%);
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
  box-shadow: 0 2px 8px #f1c40f33;
  transition: background 0.2s;
}
.edit-btn:hover {
  background: linear-gradient(90deg, #f39c12 60%, #f1c40f 100%);
}
.primary-btn {
  background: linear-gradient(90deg, #f1c40f 60%, #f39c12 100%);
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px #f1c40f33;
  transition: background 0.2s;
}
.primary-btn.small {
  padding: 6px 14px;
  font-size: 0.95em;
}
.primary-btn:hover {
  background: linear-gradient(90deg, #f39c12 60%, #f1c40f 100%);
}
.secondary-btn {
  background: #fff;
  color: #f1c40f;
  border: 1px solid #f1c40f;
  padding: 8px 20px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 8px;
  transition: background 0.2s, color 0.2s;
}
.secondary-btn:hover {
  background: #f1c40f;
  color: #fff;
}
.edit-profile-modal, .order-details-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #0006;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 4px 24px #f1c40f22;
  border: 1px solid #f1c40f33;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}
.orders-table {
  width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px #f1c40f11;
  margin-bottom: 32px;
  border-collapse: collapse;
  border: 1px solid #f1c40f22;
}
.orders-table th, .orders-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #eee;
  text-align: left;
}
.orders-table th {
  background: #fafafa;
  font-weight: 600;
}
.orders-table tr:last-child td {
  border-bottom: none;
}
.order-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.98em;
  background: #f7f7f9;
  color: #f39c12;
  border: 1px solid #f1c40f33;
}
.order-status.delivered { color: #27ae60; border-color: #27ae60; background: #eafaf1; }
.order-status.cancelled { color: #e74c3c; border-color: #e74c3c; background: #faeaea; }
.order-status.pending { color: #f39c12; border-color: #f39c12; background: #fffbe6; }
.empty-state {
  color: #888;
  font-size: 1.1rem;
  margin: 32px 0;
  text-align: center;
}
.wishlist-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: flex-start;
}
.wishlist-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px #f1c40f11;
  padding: 16px;
  width: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #f1c40f22;
  transition: box-shadow 0.2s, transform 0.2s;
}
.wishlist-card:hover {
  box-shadow: 0 8px 32px #f1c40f33;
  transform: translateY(-2px) scale(1.03);
}
.wishlist-card img {
  width: 100px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px #f1c40f22;
}
.wishlist-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 4px;
  text-align: center;
}
.wishlist-price {
  color: #f1c40f;
  font-weight: 600;
  margin-bottom: 8px;
}
.wishlist-info button {
  background: linear-gradient(90deg, #f1c40f 60%, #f39c12 100%);
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px #f1c40f33;
  transition: background 0.2s;
}
.wishlist-info button:hover {
  background: linear-gradient(90deg, #f39c12 60%, #f1c40f 100%);
}
.address-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px #f1c40f11;
  padding: 24px;
  max-width: 480px;
  border: 1px solid #f1c40f22;
}
@media (max-width: 1100px) {
  .account-main {
    padding: 24px 8px;
  }
}
@media (max-width: 900px) {
  .account-dashboard {
    flex-direction: column;
  }
  .account-sidebar {
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    border-right: none;
    border-bottom: 1px solid #eee;
    padding: 0;
    min-height: 60px;
    box-shadow: 0 2px 8px #f1c40f11;
    position: relative;
  }
  .account-user-card {
    display: none;
  }
  .account-nav ul {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
  }
  .account-nav li {
    border-left: none;
    border-bottom: 4px solid transparent;
    border-radius: 0 0 20px 20px;
    margin-bottom: 0;
    padding: 12px 10px;
    font-size: 0.98em;
  }
  .account-nav li.active, .account-nav li:hover {
    background: linear-gradient(180deg, #fffbe6 60%, #f1c40f22 100%);
    border-bottom: 4px solid #f1c40f;
    border-left: none;
  }
  .sidebar-toggle {
    display: flex;
  }
  .account-sidebar {
    position: fixed;
    left: -100vw;
    top: 0;
    height: 100vh;
    width: 220px;
    flex-direction: column;
    background: #fff;
    box-shadow: 2px 0 16px #f1c40f22;
    transition: left 0.3s;
    z-index: 1001;
  }
  .account-sidebar.open {
    left: 0;
  }
  .account-main {
    margin-top: 60px;
    padding: 16px 2vw;
  }
}
@media (max-width: 600px) {
  .account-main {
    padding: 8px 1vw;
  }
  .profile-card, .address-card {
    padding: 12px;
  }
  .modal-content {
    padding: 12px;
  }
  .wishlist-card {
    width: 100%;
    flex-direction: row;
    gap: 16px;
    align-items: flex-start;
  }
  .wishlist-card img {
    width: 60px;
    height: 70px;
  }
  .orders-table th, .orders-table td {
    padding: 8px 4px;
    font-size: 0.95em;
  }
}
</style>