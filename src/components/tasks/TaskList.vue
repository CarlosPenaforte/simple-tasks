<template>
	<q-expansion-item
		borderless
		:header-class="`expansion-header-${urgency} bg-whity`"
	>
		<template v-slot:header>
			<q-item-section>
				<span class="expansion-header-label text-dark"
					v-html="urgency"
				/>
			</q-item-section>

			<q-item-section side>
				<span class="text-dark"
					v-html="`(${undoneTasks.length})`"
				/>
			</q-item-section>
		</template>

		<template v-slot:default>
			<q-list separator
				class="fit"
			>
				<q-item v-for="(task, index) in undoneTasks"
					:key="index"
				>
					<q-item-section>
						<div class="column">
							<div class="row justify-start items-center">
								<span v-html="task.title"
									class="text-dark fs-14"
								/>
								<template v-if="task.dueDate && task.dueDate <= new Date()">
									<q-space />
									<span
										v-html="'Until ' + task.dueDate.toLocaleDateString()"
										class="text-negative fs-12 q-mr-xs"
									/>
									<q-icon
										name="info"
										color="negative"
										size="15px"
									/>
								</template>
							</div>
							<span v-html="task.description"
								class="text-secondary fs-12"
							/>
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
												<span v-html="'Edit'"
													class="text-dark"
												/>
											</q-item-section>
										</q-item>
										<q-item clickable
											@click="$emit('open-delete-task',task)"
											v-close-popup
										>
											<q-item-section>
												<span v-html="'Delete'"
													class="text-negative"
												/>
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
    defineComponent, PropType, computed, WritableComputedRef,
  } from 'vue';
  import { isTask } from 'src/util/commonFunctions';

  export default defineComponent({
    name: 'TaskList',
  });
</script>

<script setup lang="ts">
  const props = defineProps({
    modelValue: {
      type: Array as PropType<Task[]>,
      required: true,
    },
    urgency: {
      type: String as PropType<Urgency>,
      required: true,
    },
  });

  const emit = defineEmits([ 'update:modelValue', 'conclude-task' ]);

  const tasks: WritableComputedRef<Task[]> = computed({
    get():Task[] {
      return props.modelValue;
    },
    set(newTasks: Task[]): void {
      emit('update:modelValue', newTasks);
    },
  });

  const undoneTasks = computed({
    get():Task[] {
      return tasks.value.filter((task) => !task.done);
    },
    set(newTasks: Task[]): void {
      tasks.value = tasks.value.map((task) => {
        const maybeTask = newTasks.find(
          (newTask) => newTask.taskId === task.taskId,
        );

        if (isTask(maybeTask)) {
          return maybeTask;
        }

        return task;
      });
    },
  });

  const checkedTask = (task : Task, done : boolean) => {
    if (done) {
      emit('conclude-task', task);
    }
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

  .expansion-header-label {
    text-transform: uppercase;
    font-weight: 600;
  }
</style>
