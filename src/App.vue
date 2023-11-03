<template>
	<router-view />
</template>

<script lang="ts">
  import {
    defineComponent, onBeforeMount, onMounted, provide,
  } from 'vue';
  import {
    useQuasar,
  } from 'quasar';

  export default defineComponent({
    name: 'App',
  });
</script>

<script setup lang="ts">
  const $q = useQuasar();

  onBeforeMount(() => {
    $q?.loading.show({ spinnerColor: 'primary-main' });
  });

  onMounted(() => {
    $q?.loading.hide();
  });

  provide('quasar', useQuasar());

</script>
