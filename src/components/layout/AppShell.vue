<script setup>
import Sidebar from './Sidebar.vue';
import Topbar from './Topbar.vue';
import { useUiStore } from '@/stores/ui';

const ui = useUiStore();
</script>

<template>
  <div class="ag-shell">
    <Sidebar />
    <div class="ag-shell__main" :class="{ 'ag-shell__main--reduite': ui.sidebarReduite }">
      <Topbar />
      <main class="ag-shell__content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.ag-shell__main {
  margin-left: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left var(--ag-duration) var(--ag-ease);
}
@media (min-width: 992px) {
  .ag-shell__main { margin-left: 260px; }
  .ag-shell__main--reduite { margin-left: 76px; }
}
.ag-shell__content {
  flex: 1;
  padding: 1.5rem;
}
@media (min-width: 768px) {
  .ag-shell__content { padding: 2rem; }
}
</style>
