<template>
  <div class="loading-screen">
    <p>{{ loadingMessage }}</p>
    <div class="spinner-border" role="status"></div>
  </div>
</template>

<script setup>
import { AuthManager } from '../utils/auth';
import { ref, onMounted } from 'vue';
const emit = defineEmits(['update-screen']);

const authManager = new AuthManager(window);
const loadingMessage = ref('ログイン処理中です...');

onMounted(async () => {
  const result = await authManager.authorizeUser();
  if (result.success) {
    // 認証成功時は、画面を再ロード（して認可状態の取得などを再試行することで画面遷移に代える）
    window.location.href = './';
  } else if (result.error === 'unauthorized') {
    // ToDo: これは、とりあえずの実装。→画面切り替えは「親コンポーネントへ発火＆引数にマジックナンバー（文字列)」の設計とする。
    // 認証失敗時に親コンポーネントへ通知
    emit('update-screen', 'loginfailed');
  } else {
    // 認可失敗時に親コンポーネントへ通知
    emit('update-screen', 'authfailed');
  }
});
</script>

<style scoped>
.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

.spinner-border {
  margin-top: 20px;
  width: 3rem;
  height: 3rem;
  border: 0.4em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner 0.75s linear infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>
