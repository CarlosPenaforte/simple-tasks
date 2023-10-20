<template>
	<big-dialog
		v-model="isCreateTaskOpen"
		:handle-save="saveTask"
	>
		<h1 class="text-secondary fs-20 lh-22 ls-1 text-center text-uppercase fw-medium q-pa-none q-mb-sm q-mt-md">
			<template v-if="isEdit">
				{{ $t('TASK.EDIT') }}
			</template>
			<template v-else>
				{{ $t('TASK.CREATE') }}
			</template>
		</h1>

		<q-input
			v-model="newTask.task_title"
			bottom-slots
			counter
			clearable
			maxlength="20"
			:label="$t('TASK.FORM.TITLE')"
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
			:label="$t('TASK.FORM.DESCRIPTION')"
			color="primary-main"
			class="q-mb-md text-dark"
		>
			<template v-slot:hint>
				Max of 50 characters
			</template>
		</q-input>

		<span class="q-mt-md q-mb-sm text-secondary fs-12 lh-16">{{ $t('TASK.FORM.URGENCY') }}</span>
		<div class="q-pl-none q-pr-sm text-capitalize fs-13 lh-16 text-dark flex justify-between">
			<q-radio
				v-model="newTask.urgency"
				:val="Urgency.URGENT"
				:label="urgencyToTranslation($t, Urgency.URGENT)"
				color="negative"
			/>
			<q-radio
				v-model="newTask.urgency"
				:val="Urgency.IMPORTANT"
				:label="urgencyToTranslation($t, Urgency.IMPORTANT)"
				color="warning"
			/>
			<q-radio
				v-model="newTask.urgency"
				:val="Urgency.COMMON"
				:label="urgencyToTranslation($t, Urgency.COMMON)"
				color="positive"
			/>
		</div>

		<span class="q-mt-lg q-mb-none text-secondary fs-12 lh-16">{{ $t('TASK.FORM.DUE_DATE') }}</span>
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
							:title="$t('TASK.FORM.DUE_DATE')"
							:subtitle="$t('TASK.FORM.DUE_DATE_SUBTITLE')"
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
    defineComponent, computed, PropType, inject, watch, ref,
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
    dateStrToDate,
    urgencyToTranslation,
    formatDateToIso,
    formatDateToLocale,
    getLocaleFormat,
    getLocaleMask,
    parseUrgency,
  } from 'src/utils/commonFunctions';
  import { useI18n } from 'vue-i18n';
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

  const $t = useI18n().t;

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

  const newTask = ref({
    task_title: '',
    task_description: '',
    urgency: Urgency.URGENT,
    creation_date: DateTime.now().setZone('utc').toISODate() || new Date().toISOString(),
    due_date: '',
    done: 0,
  });

  watch(() => props.currentTask, (newValue, oldValue) => {
    if (props.isEdit && newValue && newValue !== oldValue) {
      newTask.value = {
        task_title: newValue.taskTitle,
        task_description: newValue.taskDescription || '',
        urgency: newValue.urgency,
        creation_date: parseDateToUTCString(newValue.creationDate),
        due_date: newValue.dueDate
          ? formatDateToLocale(newValue.dueDate, locale)
          : '',
        done: +(newValue.done || false),
      };
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

  // DUE DATE SETTER AND GETTER

  const setDueDate = (dueDate: string|number|null) => {
    if (typeof dueDate !== 'string') return;

    if (dueDate.length > 10) {
      newTask.value.due_date = dueDate.slice(0, 10);
      return;
    }

    newTask.value.due_date = dueDate;
  };

  const formattedDueDate = ref(formatDateToLocale(dateStrToDate(newTask.value.due_date, localeFormat), locale));

  watch(newTask, (newValue) => {
    if (newValue.due_date.length < 10) {
      formattedDueDate.value = newValue.due_date;

      return;
    }

    formattedDueDate.value = formatDateToLocale(dateStrToDate(newValue.due_date, localeFormat), locale);
  });

  // ACTIONS

  async function saveTask() {
    try {
      const [ userId, projectId ] = [ user.value?.userId, currentProject.value?.projectId ];

      if (!userId || !projectId) {
        $q?.notify({
          type: 'negative',
          message: $t('TASK.ERROR.NOT_POSSIBLE_TO_FIND_PROJECT_OR_USER'),
        });
        return;
      }

      const parsedDueDate = dateStrToDate(newTask.value.due_date, localeFormat);

      if (newTask.value.due_date && !parsedDueDate) {
        $q?.notify({
          type: 'negative',
          message: $t('TASK.ERROR.INVALID_DUE_DATE'),
        });

        return;
      }

      const taskToSend: CreateTaskToSend = {
        ...newTask.value,
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
            message: $t('TASK.ERROR.NOT_FOUND'),
          });

          return;
        }
        if (taskToSend.task_title === props.currentTask.taskTitle
          && taskToSend.task_description === props.currentTask.taskDescription
          && parseUrgency(taskToSend.urgency) === props.currentTask.urgency
          && parsedDueDate?.getTime() === props.currentTask.dueDate?.getTime()
          && taskToSend.done === +props.currentTask.done
        ) {
          $q?.notify({
            type: 'negative',
            message: $t('TASK.ERROR.NO_CHANGES'),
          });

          return;
        }

        [ success, result ] = await taskStore.updateTask($t, userId as number, taskId, taskToSend);
      } else {
        [ success, result ] = await taskStore.createTask($t, userId as number, taskToSend);
      }

      if (!success) {
        $q?.notify({
          type: 'negative',
          message: result,
        });

        return;
      }
      isCreateTaskOpen.value = false;

      newTask.value = {
        task_title: '',
        task_description: '',
        urgency: Urgency.URGENT,
        creation_date: DateTime.now().setZone('utc').toISODate() || new Date().toISOString(),
        due_date: '',
        done: 0,
      };

      $q?.notify({
        type: 'positive',
        message: result,
      });
    } catch (e) {
      $q?.notify({
        type: 'negative',
        message: $t('TASK.ERROR.CREATE'),
      });
    }
  }
</script>
