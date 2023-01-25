<template>
  <q-page class="column items-center justify-start fit">
    <q-list dense separator class="fit">
      <task-list
        v-model="urgentTasks"
        :urgency="Urgency.URGENT"
      />

      <task-list
        v-model="importantTasks"
        :urgency="Urgency.IMPORTANT"
      />

      <task-list
        v-model="commonTasks"
        :urgency="Urgency.COMMON"
      />
    </q-list>
  </q-page>
</template>

<script lang="ts">
  import {
    Task, Urgency,
  } from 'components/models';
  import { filterTasksByUrgency } from '../util/commonFunctions';
  import {
    defineComponent, PropType, computed, WritableComputedRef, ComputedRef,
  } from 'vue';
  import TaskList from '../components/tasks/TaskList.vue';

  export default defineComponent({
    name: 'SelfTasks',
    components: {
      TaskList,
    },
    props: {
      modelValue: {
        type: Array as PropType<Task[]>,
        required: true,
      },
    },
    setup (props, { emit }) {
      const tasks: WritableComputedRef<Task[]> = computed({
        get():Task[] {
          return props.modelValue;
        },
        set(newTasks: Task[]) {
          emit('update:modelValue', newTasks);
        },
      });

      const urgentTasks: ComputedRef<Task[]> = computed((): Task[] => filterTasksByUrgency(props.modelValue, Urgency.URGENT));
      const importantTasks: ComputedRef<Task[]> = computed((): Task[] => filterTasksByUrgency(props.modelValue, Urgency.IMPORTANT));
      const commonTasks: ComputedRef<Task[]> = computed((): Task[] => filterTasksByUrgency(props.modelValue, Urgency.COMMON));

      return {
        tasks,
        urgentTasks,
        importantTasks,
        commonTasks,
        Urgency,
      };
    },
  });
</script>
