<template>
	<q-expansion-item
		:id="`el-expansion-${props.urgency || 'done'}`"
		borderless
		:header-class="`expansion-header-${props.urgency || 'done'} bg-whity`"
	>
		<template v-slot:header>
			<q-item-section>
				<span class="expansion-header-label text-dark">
					{{ props.urgency ? urgencyToTranslation($t, props.urgency) : $t('TASK.DONE') }}
				</span>
			</q-item-section>

			<q-item-section side>
				<span
					:id="`el-number-${props.urgency || 'done'}`"
					class="text-dark"
				>{{ tasks.length }}</span>
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
									> {{ $t('TASK.UNTIL', { dateStr: formatDateToLocale(task.dueDate, locale) }) }}</span>
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
							<q-btn
								:id="`btn-options-${task.taskTitle.toLowerCase().replace(/ /g, '-')}`"
								flat
								dense
								icon="more_vert"
								color="secondary"
								style="width: 28px; height: 28px;"
							>
								<q-menu
									transition-show="flip-right"
									transition-hide="flip-left"
								>
									<q-list style="min-width: 100px">
										<q-item
											:id="`btn-edit-${task.taskTitle.toLowerCase().replace(/ /g, '-')}`"
											clickable
											@click="$emit('open-edit-task',task)"
											v-close-popup
										>
											<q-item-section>
												<span
													class="text-dark"
												> {{ $t('COMMON.EDIT') }}</span>
											</q-item-section>
										</q-item>
										<q-item
											:id="`btn-delete-${task.taskTitle.toLowerCase().replace(/ /g, '-')}`"
											clickable
											@click="$emit('open-delete-task',task)"
											v-close-popup
										>
											<q-item-section>
												<span
													class="text-negative"
												> {{ $t('COMMON.DELETE') }} </span>
											</q-item-section>
										</q-item>
									</q-list>
								</q-menu>
							</q-btn>
							<q-btn
								:id="`btn-check-${task.taskTitle.toLowerCase().replace(/ /g, '-')}`"
								:loading="isChecking[task.taskId]"
								:icon="checkIcon(task.done)"
								flat
								dense
								@click="checkedTask(task)"
								color="primary-main"
								style="width: 28px; height: 28px;"
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
  import {
    formatDateToLocale, urgencyToTranslation,
  } from 'src/utils/commonFunctions';
  import { useI18n } from 'vue-i18n';

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

  const $t = useI18n().t;

  const $q = inject<QVueGlobals>('quasar');

  const taskStore = useTaskStore();
  const userStore = useUserStore();

  // MODELS

  let tasks: ComputedRef<Task[]>;

  if (props.urgency) {
    tasks = computed(() => taskStore.undoneTasks.filter((task: Task) => task.urgency === props.urgency));
  } else if (props.showDoneTasks) {
    tasks = computed(() => taskStore.doneTasks);
  }

  const locale = ref(navigator.language);

  const checkIcon = (isDone: boolean) => (isDone ? 'check' : 'check_box_outline_blank');

  const isChecking = ref<Record<number, boolean>>({});

  // ACTIONS

  const checkedTask = async(task: Task) => {
    const userId = userStore.$state.user?.userId;
    if (!userId) {
      $q?.notify({
        type: 'negative',
        message: $t('USER.ERROR.NOT_FOUND'),
      });

      return;
    }

    isChecking.value = {
      ...isChecking.value, [task.taskId]: true,
    };

    console.log(isChecking.value);

    const [ success, message ] = await taskStore.checkTask(
      $t,
      userId,
      task.taskId,
      !task.done,
    );

    isChecking.value = {
      ...isChecking.value, [task.taskId]: false,
    };

    if (success && !task.done) {
      $q?.notify({
        type: 'positive',
        message: $t('TASK.FINISHED', { title: task.taskTitle }),
      });

      return;
    }

    if (success && task.done) {
      $q?.notify({
        type: 'positive',
        message: $t('TASK.UNDONE', { title: task.taskTitle }),
      });

      return;
    }

    $q?.notify({
      type: 'negative',
      message: message || $t('TASK.ERROR.CHECK'),
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

  .expansion-header-done {
    border-left: 20px solid map.get($colors,'secondary');
  }

  .expansion-header-label {
    text-transform: uppercase;
    font-weight: 600;
  }
</style>
