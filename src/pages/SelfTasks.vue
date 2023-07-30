<template>
	<q-page class="column items-center justify-start fit">
		<q-list dense
			separator
			class="fit"
		>
			<task-list
				v-model="urgentTasks"
				:urgency="Urgency.URGENT"
				@open-edit-task="(task: Task) => $emit('open-edit-task',task)"
				@open-delete-task="(task: Task) => $emit('open-delete-task',task)"
				@conclude-task="showCongratulations"
			/>

			<task-list
				v-model="importantTasks"
				:urgency="Urgency.IMPORTANT"
				@open-edit-task="(task: Task) => $emit('open-edit-task',task)"
				@open-delete-task="(task: Task) => $emit('open-delete-task',task)"
				@conclude-task="showCongratulations"
			/>

			<task-list
				v-model="commonTasks"
				:urgency="Urgency.COMMON"
				@open-edit-task="(task: Task) => $emit('open-edit-task',task)"
				@open-delete-task="(task: Task) => $emit('open-delete-task',task)"
				@conclude-task="showCongratulations"
			/>
		</q-list>
		<Transition name="congratulations">
			<span
				v-if="shouldShowCongratulations"
				class="fs-22 lh-14 fw-medium text-primary-darker fit flex justify-center items-center column congratulations"
				@click.stop="hideCongratulations"
			>
				Congratulations
				<span class="q-mt-md">Task done!</span>
			</span>
		</Transition>
	</q-page>
</template>

<script lang="ts">
  import {
    PropType, computed, ComputedRef, ref,
  } from 'vue';
  import {
    Task, Urgency,
  } from 'src/models';
  import TaskList from '../components/tasks/TaskList.vue';

  export default {
    name: 'SelfTasks',
    components: {
      TaskList,
    },
  };
</script>

<script setup lang="ts">
  import { filterTasksByUrgency } from '../util/commonFunctions';

  const props = defineProps({
    modelValue: {
      type: Array as PropType<Task[]>,
      required: true,
    },
  });

  // const emit = defineEmits([ 'update:modelValue' ]);

  // const tasks: WritableComputedRef<Task[]> = computed({
  // 	get():Task[] {
  // 		return props.modelValue;
  // 	},
  // 	set(newTasks: Task[]) {
  // 		emit('update:modelValue', newTasks);
  // 	},
  // });

  const shouldShowCongratulations = ref(false);

  const hideCongratulations = () => {
    shouldShowCongratulations.value = false;
  };

  const showCongratulations = () => {
    shouldShowCongratulations.value = true;

    setTimeout(() => {
      hideCongratulations();
    }, 2000);
  };

  const urgentTasks: ComputedRef<Task[]> = computed(
    (): Task[] => filterTasksByUrgency(props.modelValue, Urgency.URGENT),
  );
  const importantTasks: ComputedRef<Task[]> = computed(
    (): Task[] => filterTasksByUrgency(props.modelValue, Urgency.IMPORTANT),
  );
  const commonTasks: ComputedRef<Task[]> = computed(
    (): Task[] => filterTasksByUrgency(props.modelValue, Urgency.COMMON),
  );

</script>

<style scoped lang="scss">
  @use "sass:map";

  .congratulations {
    position:absolute;
    left: 0;
    top: 0;
    z-index: 10;
    background-color: rgba(0,0,0,0.1);
  }

  .fade-enter-active {
    transition: congrats-up 500ms ease-out;
  }

  .fade-leave-active {
    transition: congrats-down 500ms ease-in;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(60vh);
  }

  @keyframes congrats-up {
    0% {
      opacity: 0;
      transform: translateY(60vh);
    }

    100% {
      opacity: 1;
      box-shadow: 4px 4px 0 map.get($colors,'primary-filter');
      transform: translateY(0);
    }
  }

  @keyframes congrats-down {
    0% {
      opacity: 1;
      box-shadow: inset 4px 4px 0 map.get($colors,'primary-filter');
      transform: translateY(0);
    }

    100% {
      opacity: 0;
      transform: translateY(60vh);
    }
  }
</style>
