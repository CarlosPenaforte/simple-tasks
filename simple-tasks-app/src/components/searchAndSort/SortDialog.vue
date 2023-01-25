<template>
  <mid-dialog
    v-model="isSearchDialogOpen"
    :done-function="searchTasks"
    done-icon="search"
  >
  </mid-dialog>
</template>

<script lang="ts">
  import {
    defineComponent, ref, Ref, computed,
  } from 'vue';
  import {
    Orientation, SortBy,
  } from '../models';
  import MidDialog from '../MidDialog.vue';

  export default defineComponent ({
    name: 'SortDialog',
    components: {
      MidDialog,
    },
    props: {
      modelValue: {
        type: Boolean,
        required: true,
      },
    },
    setup (props, { emit }) {
      const sortBy: Ref<SortBy> = ref({
        name: {
          use: false,
          orientation: Orientation.ASC,
        },
        dueDate: {
          use: false,
          orientation: Orientation.ASC,
        },
      });

      const isSearchDialogOpen = computed({
        get(): boolean {
          return props.modelValue;
        },
        set(newState: boolean) {
          emit('update:modelValue', newState);
        },
      });

      function searchTasks() {
        isSearchDialogOpen.value = false;
      }

      return {
        isSearchDialogOpen,
        searchTasks,
        Orientation,
        sortBy,
      };
    },
  });
</script>
