<template>
  <div class="login-failed-screen">
    <p>ログインに失敗しました。</p>
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
