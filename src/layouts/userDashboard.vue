<template>
  <div>
    <h1>User Dashboard</h1>
    <div v-if="loggedInUser">
      <p>Welcome, {{ loggedInUser.name }}!</p>
      <p>Email: {{ loggedInUser.email }}</p>
    </div>
    <div v-else>
      <p>Loading user information...</p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    onMounted(() => {
      if (!authStore.isAuthenticated) {
        router.push('/login');
      }
    });

    return {
      authStore,
      router,
    };
  },
  computed: {
    loggedInUser() {
      return this.authStore.user;
    },
  },
};
</script>

<style scoped>
/* Aapke component ki styling */
</style>