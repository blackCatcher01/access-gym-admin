import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { registerClientHandlers } from './api/client';
import { useAuthStore } from './stores/auth';
import { useUiStore } from './stores/ui';
import { useToast } from './composables/useToast';
import './assets/styles/main.css';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);

const auth = useAuthStore();
const ui = useUiStore();
const toast = useToast();

ui.appliquerTheme();

registerClientHandlers({
  unauthorized: () => {
    auth.deconnexion();
    router.push({ name: 'connexion' });
  },
  error: (message) => toast.erreur(message),
});

app.mount('#app');
