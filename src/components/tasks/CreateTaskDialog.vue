<template>
  <big-dialog
      v-model="isCreateTaskOpen"
      :handle-save="saveTask"
    >
      <q-input
        v-model="newTask.name"
        bottom-slots
        counter
        clearable
        maxlength="20"
        label="Task name"
        color="primary-main"
        class="q-mb-md"
      >
        <template v-slot:hint>
          Max of 20 characters
        </template>
      </q-input>

      <q-input
        v-model="newTask.description"
        bottom-slots
        counter
        clearable
        maxlength="50"
        label="Description"
        color="primary-main"
        class="q-mb-md"
      >
        <template v-slot:hint>
          Max of 50 characters
        </template>
      </q-input>

      <span class="q-mt-md q-mb-sm text-secondary fs-12 lh-16" v-html="'Urgency'"/>
      <div class="q-px-none text-capitalize fs-13 lh-16 text-dark">
        <q-radio
          v-model="newTask.urgency"
          :val="Urgency.URGENT"
          :label="Urgency.URGENT"
          color="negative"
        />
        <q-radio
          v-model="newTask.urgency"
          :val="Urgency.IMPORTANT"
          :label="Urgency.IMPORTANT"
          color="warning"
        />
        <q-radio
          v-model="newTask.urgency"
          :val="Urgency.COMMON"
          :label="Urgency.COMMON"
          color="positive"
        />
      </div>

      <span class="q-mt-lg q-mb-none text-secondary fs-12 lh-16" v-html="'Due date'"/>
      <q-input
        v-model="newTask.dueDate"
        mask="####-##-##"
        placeholder="YYYY-MM-DD"
        color="primary-main"
        class="q-mb-md"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy>
              <q-date
                v-model="newTask.dueDate"
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
    </big-dialog>
</template>

<script lang="ts">
  import {
    defineComponent, ref, computed,
  } from 'vue';
  import {
    Urgency,
  } from 'components/models';
  import BigDialog from '../BigDialog.vue';

  function saveTask(): void {
    1+1;
  }

  export default defineComponent({
    name: 'CreateTaskDialog',
    components: {
      BigDialog,
    },
    props: {
      modelValue: {
        type: Boolean,
        required: true,
      },
    },
    setup (props, { emit }) {
      const newTask = ref({
        name: '',
        description: '',
        urgency: Urgency.URGENT,
        dueDate: '',
      });

      const isCreateTaskOpen = computed({
        get():boolean {
          return props.modelValue;
        },
        set(newState: boolean) {
          emit('update:modelValue', newState);
        },
      });

      return {
        newTask,
        saveTask,
        isCreateTaskOpen,
        Urgency,
      };
    },
  });
</script>
