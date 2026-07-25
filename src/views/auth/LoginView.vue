<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';
import PulseMark from '@/components/ui/PulseMark.vue';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const toast = useToast();

const etape = ref('telephone'); // telephone | code
const telephone = ref('');
const code = ref('');
const chargement = ref(false);

const telephoneValide = computed(() => /^\+?[0-9]{8,15}$/.test(telephone.value.trim()));
const codeValide = computed(() => /^[0-9]{6}$/.test(code.value.trim()));

async function envoyerCode() {
  if (!telephoneValide.value) return;
  chargement.value = true;
  try {
    await auth.demanderCode(telephone.value.trim());
    etape.value = 'code';
    toast.succes('Code envoyé par SMS.');
  } catch {
    // Le toast d'erreur générique est déjà déclenché par l'intercepteur API.
  } finally {
    chargement.value = false;
  }
}

async function confirmerCode() {
  if (!codeValide.value) return;
  chargement.value = true;
  try {
    await auth.verifierCode(telephone.value.trim(), code.value.trim());
    toast.succes(`Bon retour, ${auth.utilisateur?.nom} !`);
    router.push(route.query.redirect || { name: 'tableau-de-bord' });
  } catch {
    code.value = '';
  } finally {
    chargement.value = false;
  }
}
</script>

<template>
  <div class="ag-login">
    <div class="ag-login__panel">
      <div class="d-flex align-items-center gap-2 mb-5">
        <PulseMark :size="34" />
        <span class="ag-display fw-semibold fs-5">Access Gym</span>
      </div>

      <Transition name="page-fade" mode="out-in">
        <form v-if="etape === 'telephone'" key="telephone" @submit.prevent="envoyerCode">
          <h1 class="h4 mb-1">Connexion à l'administration</h1>
          <p class="ag-text-muted mb-4">Réservée au personnel (coach, gérant, administrateur).</p>

          <label class="form-label small fw-medium" for="telephone">Numéro de téléphone</label>
          <input
            id="telephone"
            v-model="telephone"
            type="tel"
            class="form-control form-control-lg mb-1"
            placeholder="+225 07 00 00 00 00"
            autocomplete="tel"
            autofocus
          />
          <p v-if="telephone && !telephoneValide" class="text-danger small mt-1">
            Entrez un numéro valide, au format international si possible.
          </p>

          <button type="submit" class="btn btn-primary btn-lg w-100 mt-4" :disabled="!telephoneValide || chargement">
            <span v-if="chargement" class="spinner-border spinner-border-sm me-2"></span>
            Recevoir le code
          </button>
        </form>

        <form v-else key="code" @submit.prevent="confirmerCode">
          <button type="button" class="btn btn-sm btn-link ps-0 mb-2 ag-text-muted" @click="etape = 'telephone'">
            <i class="bi bi-arrow-left"></i> Modifier le numéro
          </button>
          <h1 class="h4 mb-1">Entrez le code reçu</h1>
          <p class="ag-text-muted mb-4">Un code à 6 chiffres a été envoyé au {{ telephone }}.</p>

          <label class="form-label small fw-medium" for="code">Code de vérification</label>
          <input
            id="code"
            v-model="code"
            type="text"
            inputmode="numeric"
            maxlength="6"
            class="form-control form-control-lg mb-1 ag-mono text-center"
            style="letter-spacing: 0.5em; font-size: 1.4rem"
            placeholder="••••••"
            autocomplete="one-time-code"
            autofocus
          />
          <p v-if="code && !codeValide" class="text-danger small mt-1">Le code contient 6 chiffres.</p>

          <button type="submit" class="btn btn-primary btn-lg w-100 mt-4" :disabled="!codeValide || chargement">
            <span v-if="chargement" class="spinner-border spinner-border-sm me-2"></span>
            Vérifier et me connecter
          </button>
          <button type="button" class="btn btn-link btn-sm w-100 mt-2" @click="envoyerCode" :disabled="chargement">
            Renvoyer le code
          </button>
        </form>
      </Transition>
    </div>

    <div class="ag-login__showcase d-none d-lg-flex">
      <div class="ag-login__showcase-content">
        <p class="ag-pill ag-pill--success mb-3">Système en ligne</p>
        <h2 class="ag-display fw-semibold" style="font-size: 2rem">
          Le pouls de votre salle,<br />en un coup d'œil.
        </h2>
        <p class="ag-text-muted" style="max-width: 380px">
          Adhérents, abonnements, paiements et présences réunis dans un seul tableau de bord.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ag-login {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
}
@media (min-width: 992px) {
  .ag-login { grid-template-columns: 480px 1fr; }
}
.ag-login__panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  max-width: 400px;
  margin-inline: auto;
  width: 100%;
}
.ag-login__showcase {
  background: linear-gradient(160deg, var(--ag-primary) 0%, #0a6f65 100%);
  align-items: center;
  justify-content: center;
  padding: 3rem;
  position: relative;
  overflow: hidden;
}
.ag-login__showcase-content { color: #fff; position: relative; z-index: 1; }
.ag-login__showcase-content h2 { color: #fff; }
.ag-login__showcase::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  top: -150px;
  right: -150px;
}
</style>
