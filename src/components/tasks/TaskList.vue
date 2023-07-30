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
								>{{ task.title }}</span>
								<template v-if="task.dueDate && task.dueDate <= new Date()">
									<q-space />
									<span
										class="text-negative fs-12 q-mr-xs"
									> {{ 'Until ' + task.dueDate.toLocaleDateString() }}</span>
									<q-icon
										name="info"
										color="negative"
										size="15px"
									/>
								</template>
							</div>
							<span
								class="text-secondary fs-12"
							>{{ task.description }}</span>
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
  } from 'src/models';
  import {
    computed,
    defineComponent, PropType,
    ComputedRef,
  } from 'vue';
  import { useTaskStore } from 'src/stores/taskStore';

  export default defineComponent({
    name: 'TaskList',
  });
</script>

<script setup lang="ts">
  const taskStore = useTaskStore();

  const props = defineProps({
    urgency: String as PropType<Urgency>,
    showDoneTasks: Boolean,
  });

  let tasks: ComputedRef<Task[]>;

  if (props.urgency) {
    tasks = computed(() => taskStore.undoneTasks.filter((task) => task.urgency === props.urgency));
  } else if (props.showDoneTasks) {
    tasks = computed(() => taskStore.doneTasks);
  }

  const checkedTask = (task : Task, done : boolean) => {
    taskStore.updateTask({
      ...task,
      done,
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
