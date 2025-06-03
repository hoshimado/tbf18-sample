<template>
  <div class="login-screen">
    <h1>ログイン</h1>
    <button
      class="btn btn-primary" 
      @click="redirectToLogin"
    >
      ログイン
    </button>
  </div>
</template>

<script setup>
import { AuthManager } from '../utils/auth';

const authManager = new AuthManager(window);

function redirectToLogin() {
  authManager.authenticateUser();
}
</script>

<style scoped>
/* ...スタイル定義... */
</style>
