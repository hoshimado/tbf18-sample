<template>
  <div class="auth-failed-screen">
    <p>認可に失敗しました。</p>
    <button @click="retryLogin">戻る</button>
  </div>
</template>

<script setup>
function retryLogin() {
  window.location.href = './';
}
</script>

<style scoped>
/* ...スタイル定義... */
</style>
