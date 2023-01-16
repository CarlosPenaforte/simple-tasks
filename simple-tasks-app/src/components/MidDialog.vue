<template>
  <div v-if="isDialogOpen">
    <div v-for="(task, index) in filteredTasks" :key="index" v-html="task.taskId" />
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    PropType,
    computed,
  } from 'vue';
  import {
    Task,
  } from './models';

  function useTasks(tasks: Task[], emit: (event: string, args: Task[]) => void) {
    const filteredTasks = computed({
      get():Task[] {
        return tasks;
      },
      set(newTasks: Task[]) {
        emit('update:modelValue', newTasks);
      },
    });
    return { filteredTasks };
  }

  export default defineComponent({
    name: 'MidDialog',
    props: {
      isDialogOpen: {
        type: Boolean,
        default: false,
      },
      modelValue: {
        type: Array as PropType<Task[]>,
        default: () => [],
      },
    },
    setup(props, { emit }) {
      return {
        ...useTasks(props.modelValue, emit),
      };
    },
  });
</script>
