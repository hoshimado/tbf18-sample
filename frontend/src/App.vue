<script setup>
import { ref, computed, onMounted } from 'vue';
import { AuthManager } from './utils/auth';
import LoginScreen from './components/LoginScreen.vue';
import Dashboard from './components/Dashboard.vue';
import LoadingScreen from './components/AuthorizingScreen.vue';
import LoginFailedScreen from './components/LoginFailedScreen.vue';
import AuthorizationFailedScreen from './components/AuthorizationFailedScreen.vue';

const authManager = new AuthManager(window);

// 表示画面の管理変数。
// この変数の値を切り替えると、computedプロパティが再評価され、
// それに応じたコンポーネントが表示される。
// 
// 初期画面はログイン画面、とする。
const currentScreen = ref('login');


// 認証状態に応じて表示画面の管理変数を変更する
function applyAuthStatus2Screen() {
  const status = authManager.detectAuthStatus();
  if (status === 'authenticated') {
    currentScreen.value = 'dashboard';
  } else if (status === 'authenticating') {
    currentScreen.value = 'loading';
  } else if (status === 'loginfailed') {
    currentScreen.value = 'loginfailed';
  } else if (status === 'authfailed') {
    currentScreen.value = 'authfailed';
  } else {
    currentScreen.value = 'login';
  }
}

// ログアウト処理を行う（＆表示画面に反映）
function logout() {
  authManager.clearAuthData();
  currentScreen.value = 'login';
}

// 表示画面の管理変数の状態に応じて画面を切り替える
const currentScreenComponent = computed(() => {
  switch (currentScreen.value) {
    case 'login':
      return LoginScreen;
    case 'dashboard':
      return Dashboard;
    case 'loading':
      return LoadingScreen;
    case 'loginfailed':
      return LoginFailedScreen;
    case 'authfailed':
      return AuthorizationFailedScreen;
    default:
      return LoginScreen;
  }
});


// 初回マウント時の処理
onMounted(() => {
    // 認証状態に応じて表示画面の管理変数を変更する
    applyAuthStatus2Screen();
});

// LoadingScreenからのイベントを処理
function handleScreenUpdate(newScreen) {
  currentScreen.value = newScreen;
}
</script>

<template>
  <component :is="currentScreenComponent" @update-screen="handleScreenUpdate" @logout="logout" />
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
