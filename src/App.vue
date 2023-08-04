<template>
	<router-view />
</template>

<script lang="ts">
  import {
    defineComponent, provide,
  } from 'vue';
  import {
    useQuasar,
  } from 'quasar';

  export default defineComponent({
    name: 'App',
  });
</script>

<script setup lang="ts">

  provide('quasar', useQuasar());

</script>
