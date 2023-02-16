<template>
  <mid-dialog
    v-model="isSortDialogOpen"
    :done-function="sortTasks"
    done-icon="sort"
  >
  <q-list separator class="fit">
    <q-item>
      <q-item-section>
        Name
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="sortBy.name.orientation"
          :options="orientationOptions"
          borderless
          behavior="menu"
          label="Project"
          label-color="whity"
          color="primary-main"
          class="q-ml-lg q-px-sm w-200"
          transition-show="jump-down"
          transition-hide="jump-up"
        >
          <template v-slot:selected>
            <div v-html="sortBy.name.orientation" class="text-whity fw-medium text-capitalize"/>
          </template>
        </q-select>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        Due date
      </q-item-section>
      <q-item-section>
        <q-select
          v-model="sortBy.dueDate.orientation"
          :options="orientationOptions"
          borderless
          behavior="menu"
          label="Project"
          label-color="whity"
          color="primary-main"
          class="q-ml-lg q-px-sm w-200"
          transition-show="jump-down"
          transition-hide="jump-up"
        >
          <template v-slot:selected>
            <div v-html="sortBy.dueDate.orientation" class="text-whity fw-medium text-capitalize"/>
          </template>
        </q-select>
      </q-item-section>
    </q-item>
  </q-list>
  </mid-dialog>
</template>

<script lang="ts">
  import {
    defineComponent, reactive, computed, WritableComputedRef,
  } from 'vue';
  import {
    Orientation, SortBy,
  } from '../models';
  import MidDialog from '../MidDialog.vue';

  const sortBy: SortBy = reactive({
    name: {
      use: false,
      orientation: Orientation.ASC,
    },
    dueDate: {
      use: false,
      orientation: Orientation.ASC,
    },
  });

  const orientationOptions: Orientation[] = [
    Orientation.ASC, Orientation.DESC,
  ];

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
      const isSortDialogOpen : WritableComputedRef<boolean> = computed({
        get(): boolean {
          return props.modelValue;
        },
        set(newState: boolean) {
          emit('update:modelValue', newState);
        },
      });

      function sortTasks(): void {
        isSortDialogOpen.value = false;
      }

      return {
        isSortDialogOpen,
        sortTasks,
        Orientation,
        sortBy,
        orientationOptions,
      };
    },
  });
</script>
