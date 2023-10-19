<template>
	<q-expansion-item
		borderless
		:header-class="`expansion-header-${props.urgency || 'dones'} bg-whity`"
	>
		<template v-slot:header>
			<q-item-section>
				<span class="expansion-header-label text-dark"> {{ props.urgency || 'DONE' }} </span>
			</q-item-section>

			<q-item-section side>
				<span class="text-dark">{{ tasks.length }}</span>
			</q-item-section>
		</template>

		<template v-slot:default>
			<q-list separator
				class="fit"
			>
				<q-item v-for="(task, index) in tasks"
					:key="index"
				>
					<q-item-section>
						<div class="column">
							<div class="row justify-start items-center">
								<span
									class="text-dark fs-14"
								>{{ task.taskTitle }}</span>
								<template v-if="task.dueDate && task.dueDate <= new Date()">
									<q-space />
									<span
										class="text-negative fs-12 q-mr-xs"
									> {{ 'Until ' + formatDateToLocale(task.dueDate, locale) }}</span>
									<q-icon
										name="info"
										color="negative"
										size="15px"
									/>
								</template>
							</div>
							<span
								class="text-secondary fs-12"
							>{{ task.taskDescription }}</span>
						</div>
					</q-item-section>
					<q-item-section side
						no-wrap
					>
						<div class="row items-center">
							<q-icon
								name="more_vert"
								size="28px"
								color="secondary"
							>
								<q-menu
									transition-show="flip-right"
									transition-hide="flip-left"
								>
									<q-list style="min-width: 100px">
										<q-item clickable
											@click="$emit('open-edit-task',task)"
											v-close-popup
										>
											<q-item-section>
												<span
													class="text-dark"
												>Edit</span>
											</q-item-section>
										</q-item>
										<q-item clickable
											@click="$emit('open-delete-task',task)"
											v-close-popup
										>
											<q-item-section>
												<span
													class="text-negative"
												>Delete</span>
											</q-item-section>
										</q-item>
									</q-list>
								</q-menu>
							</q-icon>
							<q-checkbox v-model="task.done"
								@click="checkedTask(task, task.done)"
								color="primary-main"
							/>
						</div>
					</q-item-section>
				</q-item>
			</q-list>
		</template>
	</q-expansion-item>
</template>

<script lang="ts">
  import {
    Task, Urgency,
  } from 'src/models/mainModels';
  import {
    computed,
    defineComponent, PropType,
    ComputedRef,
    inject,
    ref,
  } from 'vue';
  import { useTaskStore } from 'src/stores/taskStore';
  import { QVueGlobals } from 'quasar';
  import { useUserStore } from 'src/stores/userStore';
  import { formatDateToLocale } from 'src/utils/commonFunctions';

  export default defineComponent({
    name: 'TaskList',
  });
</script>

<script setup lang="ts">
  // PROPS AND EMIT

  const props = defineProps({
    urgency: String as PropType<Urgency>,
    showDoneTasks: Boolean,
  });

  // BASICS

  const $q = inject<QVueGlobals>('quasar');

  const taskStore = useTaskStore();
  const userStore = useUserStore();

  // MODELS

  let tasks: ComputedRef<Task[]>;

  if (props.urgency) {
    tasks = computed(() => taskStore.undoneTasks.filter((task) => task.urgency === props.urgency));
  } else if (props.showDoneTasks) {
    tasks = computed(() => taskStore.doneTasks);
  }

  const locale = ref(navigator.language);

  // ACTIONS

  const checkedTask = async(task : Task, done : boolean) => {
    const userId = userStore.$state.user?.userId;
    if (!userId) {
      $q?.notify({
        type: 'negative',
        message: 'User not found',
      });

      return;
    }

    const [ success, message ] = await taskStore.checkTask(
      userId,
      task.taskId,
      done,
    );

    if (success && done) {
      $q?.notify({
        type: 'positive',
        message: `Task ${task.taskTitle} finished`,
      });

      return;
    }

    if (success && !done) {
      $q?.notify({
        type: 'positive',
        message: `Task ${task.taskTitle} returned to undone`,
      });

      return;
    }

    $q?.notify({
      type: 'negative',
      message: message || 'Error checking task',
    });
  };
</script>

<style lang="scss">
  @use "sass:map";

  .expansion-header-common {
    border-left: 20px solid map.get($colors,'positive');
  }

  .expansion-header-important {
    border-left: 20px solid map.get($colors,'warning');
  }

  .expansion-header-urgent {
    border-left: 20px solid map.get($colors,'negative');
  }

  .expansion-header-dones {
    border-left: 20px solid map.get($colors,'secondary');
  }

  .expansion-header-label {
    text-transform: uppercase;
    font-weight: 600;
  }
</style>
