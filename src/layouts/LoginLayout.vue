<template>
	<q-layout>
		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script lang="ts">
  import { storeToRefs } from 'pinia';
  import {
    defineComponent,
  } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from 'src/stores/userStore';

  export default defineComponent({
    name: 'LoginLayout',
  });
</script>
<script setup lang="ts">
  const router = useRouter();

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  if (user && window.sessionStorage.getItem('simple-tasks/token')) {
    router.push('/');
  }
</script>
