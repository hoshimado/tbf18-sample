<template>
  <div class="dashboard container py-4">
    <header class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom bg-light px-3" style="min-height:56px;">
      <span>ログイン中: {{ userEmail }}</span>
      <button 
        class="btn btn-secondary"
        @click="emit('logout')"
      >
        <i class="bi bi-box-arrow-right"></i> ログアウト
      </button>
    </header>
    <main>
      <section class="mb-5">
        <h4 class="mb-3">挨拶を送信</h4>
        <div class="mb-2">
          <input
            type="text"
            class="form-control mb-2"
            placeholder="挨拶メッセージを入力"
            v-model="greetingMessage"
          />
          <button 
            class="btn btn-primary"
            @click="greetingUser"
          >
            <i class="bi bi-hand-thumbs-up"></i> 挨拶する
          </button>
        </div>
        <textarea 
          class="form-control"
          rows="4"
          v-model="greetingUserResultText"
          readonly
        ></textarea>
      </section>
      <section>
        <h4 class="mb-3">ログイン状態の確認</h4>
        <div class="d-flex align-items-center gap-2 mb-2">
          <button 
            class="btn btn-info"
            @click="verifyUser"
          >
            <i class="bi bi-check-circle"></i> ユーザ情報を検証
          </button>
        </div>
        <textarea 
          class="form-control"
          rows="4"
          v-model="verifyUserResultText"
          readonly
        ></textarea>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { AuthManager } from '@/utils/auth';
import { ApiManager } from '@/utils/api';

const emit = defineEmits(['logout']);
const authManager = new AuthManager(window);
const apiManager = new ApiManager(window);
const userEmail = ref('不明');

const verifyUserResultText = ref('');
const verifyUser = () => {
  authManager.verifyAuthorizedUser()
  .then((result) => {
      if (result.success){
          verifyUserResultText.value = JSON.stringify(result.data, null, 2);
      }else{
          verifyUserResultText.value = 'ユーザ情報の検証に失敗しました。';
      }
  })
  .catch((error) => {
      verifyUserResultText.value = error;
  });
}

// 挨拶メッセージ入力用
const greetingMessage = ref('');
const greetingUserResultText = ref('');
const greetingUser = () => {
  apiManager.greetingUser(greetingMessage.value)
  .then((result) => {
      if (result.success){
          greetingUserResultText.value = JSON.stringify(result.data, null, 2);
      }else{
          greetingUserResultText.value = '挨拶に失敗しました。';
      }
  })
  .catch((error) => {
      greetingUserResultText.value = error;
  });
}

onMounted(() => {
  userEmail.value = authManager.getUserEmail();
});
</script>

<style scoped>
.dashboard {
  max-width: 600px;
  margin: 0 auto;
}
</style>
