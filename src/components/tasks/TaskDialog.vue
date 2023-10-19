<template>
	<big-dialog
		v-model="isCreateTaskOpen"
		:handle-save="saveTask"
	>
		<h1 class="text-secondary fs-20 lh-22 ls-2 text-center text-uppercase fw-medium q-pa-none q-mb-sm q-mt-md">
			<template v-if="isEdit">
				Edit the Task
			</template>
			<template v-else>
				Create a Task
			</template>
		</h1>

		<q-input
			v-model="newTask.task_title"
			bottom-slots
			counter
			clearable
			maxlength="20"
			label="Task title"
			color="primary-main"
			class="q-mb-md text-dark"
		>
			<template v-slot:hint>
				Max of 20 characters
			</template>
		</q-input>

		<q-input
			v-model="newTask.task_description"
			bottom-slots
			counter
			clearable
			maxlength="50"
			label="Description"
			color="primary-main"
			class="q-mb-md text-dark"
		>
			<template v-slot:hint>
				Max of 50 characters
			</template>
		</q-input>

		<span class="q-mt-md q-mb-sm text-secondary fs-12 lh-16">Urgency</span>
		<div class="q-pl-none q-pr-sm text-capitalize fs-13 lh-16 text-dark flex justify-between">
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

		<span class="q-mt-lg q-mb-none text-secondary fs-12 lh-16">Due date</span>
		<q-input
			:modelValue="formattedDueDate"
			@update:modelValue="setDueDate"
			name="dueDate"
			:mask="localeMask"
			:placeholder="localeFormat"
			:rules="[val => val.length == 10 || 'Invalid date']"
			lazy-rules
			color="primary-main"
			class="q-mb-md"
		>
			<template v-slot:append>
				<q-icon name="event"
					class="cursor-pointer"
				>
					<q-popup-proxy>
						<q-date
							:mask="qDateMask"
							color="primary-main"
							title="Due date"
							subtitle="Select a due date to the new task"
							class="text-dark"
							:modelValue="formattedDueDate"
							@update:modelValue="setDueDate"
						>
							<div class="row items-center justify-end">
								<q-btn v-close-popup
									label="Close"
									color="primary"
									flat
								/>
							</div>
						</q-date>
					</q-popup-proxy>
				</q-icon>
			</template>
		</q-input>
	</big-dialog>
</template>

<script lang="ts">
  import {
    defineComponent, computed, PropType, reactive, inject, watch, ref,
  } from 'vue';
  import {
    Urgency, Task,
  } from 'src/models/mainModels';
  import { QVueGlobals } from 'quasar';
  import { DateTime } from 'luxon';
  import { useTaskStore } from 'src/stores/taskStore';
  import { CreateTaskToSend } from 'src/models/apiModels';
  import { useUserStore } from 'src/stores/userStore';
  import { useProjectStore } from 'src/stores/projectStore';
  import {
    dateStrToDate, formatDateToIso, formatDateToLocale, getLocaleFormat, getLocaleMask,
  } from 'src/utils/commonFunctions';
  import BigDialog from '../BigDialog.vue';

  export default defineComponent({
    name: 'CreateTaskDialog',
    components: {
      BigDialog,
    },
  });
</script>

<script setup lang="ts">
  // PROPS AND EMIT

  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    currentTask: {
      type: Object as PropType<Task>,
    },
  });

  const emit = defineEmits([ 'update:modelValue' ]);

  // BASICS

  const $q = inject<QVueGlobals>('quasar');
  const taskStore = useTaskStore();

  const userStore = useUserStore();
  const user = computed(() => userStore.$state.user);

  const projectStore = useProjectStore();
  const currentProject = computed(() => projectStore.$state.currentProject);

  // PARSERS

  const parseDateToUTCString = (date: Date) => DateTime.fromJSDate(date, { zone: 'utc' }).toISODate() || date.toLocaleDateString('utc');

  // MODELS
  const locale = navigator.language;

  const localeFormat = getLocaleFormat(locale);
  const qDateMask = localeFormat.toUpperCase();
  const localeMask = getLocaleMask(locale);

  let newTask = reactive({
    task_title: '',
    task_description: '',
    urgency: Urgency.URGENT,
    creation_date: DateTime.now().setZone('utc').toISODate() || new Date().toISOString(),
    due_date: '',
    done: 0,
  });

  watch(() => props.currentTask, (newValue, oldValue) => {
    if (props.isEdit && newValue && newValue !== oldValue) {
      newTask = reactive({
        task_title: newValue.taskTitle,
        task_description: newValue.taskDescription || '',
        urgency: newValue.urgency,
        creation_date: parseDateToUTCString(newValue.creationDate),
        due_date: newValue.dueDate
          ? formatDateToLocale(newValue.dueDate, locale)
          : '',
        done: +(newValue.done || false),
      });
    }
  }, {
    deep: true, immediate: true,
  });

  const isCreateTaskOpen = computed({
    get():boolean {
      return props.modelValue;
    },
    set(newState: boolean) {
      emit('update:modelValue', newState);
    },
  });

  // DUE DATA SETTER AND GETTER

  const setDueDate = (dueDate: string|number|null) => {
    if (typeof dueDate !== 'string') return;

    console.log(dueDate);

    if (dueDate.length > 10) {
      newTask.due_date = dueDate.slice(0, 10);
      return;
    }

    newTask.due_date = dueDate;
  };

  const formattedDueDate = ref(formatDateToLocale(dateStrToDate(newTask.due_date, localeFormat), locale));

  watch(() => newTask.due_date, (newValue) => {
    if (newValue.length < 10) {
      formattedDueDate.value = newValue;

      return;
    }

    formattedDueDate.value = formatDateToLocale(dateStrToDate(newValue, localeFormat), locale);
  });

  // ACTIONS

  async function saveTask() {
    try {
      const [ userId, projectId ] = [ user.value?.userId, currentProject.value?.projectId ];

      if (!userId || !projectId) {
        $q?.notify({
          type: 'negative',
          message: 'Not possible to find user or project',
        });
        return;
      }

      const parsedDueDate = dateStrToDate(newTask.due_date, localeFormat);

      if (newTask.due_date && !parsedDueDate) {
        $q?.notify({
          type: 'negative',
          message: 'Invalid due date',
        });

        return;
      }

      const taskToSend: CreateTaskToSend = {
        ...newTask,
        due_date: parsedDueDate ? formatDateToIso(parsedDueDate) : undefined,
        user_id: userId,
        project_id: projectId,
      };

      let [ success, result ] = [ false, '' ];

      if (props.isEdit) {
        const taskId = props.currentTask?.taskId;
        if (!taskId) {
          $q?.notify({
            type: 'negative',
            message: 'Task not found',
          });

          return;
        }

        [ success, result ] = await taskStore.updateTask(userId as number, taskId, taskToSend);
      } else {
        [ success, result ] = await taskStore.createTask(userId as number, taskToSend);
      }

      if (!success) {
        $q?.notify({
          type: 'negative',
          message: result,
        });

        return;
      }

      isCreateTaskOpen.value = false;
      newTask = ({
        task_title: '',
        task_description: '',
        urgency: Urgency.URGENT,
        creation_date: DateTime.now().setZone('utc').toISODate() || new Date().toISOString(),
        due_date: '',
        done: 0,
      });
      $q?.notify({
        type: 'positive',
        message: result,
      });
    } catch (e) {
      $q?.notify({
        type: 'negative',
        message: 'Error while creating task',
      });
    }
  }
</script>
