<template>
  <mid-dialog
    v-model="isSearchDialogOpen"
    :done-function="searchTasks"
    done-icon="search"
  >
    <q-input
      v-model="searchFields.name"
      bottom-slots
      counter
      clearable
      maxlength="20"
      label="Search by name"
      color="primary-main"
      class="q-mb-md"
    >
      <template v-slot:hint>
        Max of 20 characters
      </template>
    </q-input>

    <span class="q-mt-xs q-mb-xs text-secondary fs-12 lh-16" v-html="'Search by urgency'"/>
    <div class="q-px-none text-capitalize fs-12 lh-14 text-dark full-width">
      <q-radio
        v-model="searchFields.urgency"
        :val="Urgency.URGENT"
        :label="Urgency.URGENT"
        dense
        color="negative"
      />
      <q-radio
        v-model="searchFields.urgency"
        :val="Urgency.IMPORTANT"
        :label="Urgency.IMPORTANT"
        dense
        color="warning"
        class="q-px-sm"
      />
      <q-radio
        v-model="searchFields.urgency"
        :val="Urgency.COMMON"
        :label="Urgency.COMMON"
        dense
        color="positive"
      />
    </div>

    <span class="q-mt-lg q-mb-none text-secondary fs-12 lh-16" v-html="'Search by due date'"/>
    <q-input
      v-model="searchFields.dueDate"
      mask="####-##-##"
      placeholder="YYYY-MM-DD"
      color="primary-main"
      class="q-mb-md"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy>
            <q-date
              v-model="searchFields.dueDate"
              mask="YYYY-MM-DD"
              color="primary-main"
              title="Due date"
              subtitle="Select a due date to the new task"
              v-close-popup
            />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </mid-dialog>
</template>

<script lang="ts">
  import {
    defineComponent, ref, computed,
  } from 'vue';
  import { Urgency } from '../models';
  import MidDialog from '../MidDialog.vue';

  export default defineComponent ({
    name: 'SearchDialog',
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
      const searchFields = ref({
        name: '',
        urgency: Urgency.URGENT,
        dueDate: '',
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
        Urgency,
        searchFields,
      };
    },
  });
</script>
