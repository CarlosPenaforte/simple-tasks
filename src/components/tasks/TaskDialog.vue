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
			v-model="newTask.due_date"
			mask="####-##-##"
			placeholder="YYYY-MM-DD"
			color="primary-main"
			class="q-mb-md"
		>
			<template v-slot:append>
				<q-icon name="event"
					class="cursor-pointer"
				>
					<q-popup-proxy>
						<q-date
							v-model="newTask.due_date"
							mask="YYYY-MM-DD"
							color="primary-main"
							title="Due date"
							subtitle="Select a due date to the new task"
							class="text-dark"
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
    defineComponent, computed, PropType, reactive, inject,
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

  // MODELS

  let newTask = reactive({
    task_title: '',
    task_description: '',
    urgency: Urgency.URGENT,
    creation_date: DateTime.now().setZone('utc').toISODate() || new Date().toISOString(),
    due_date: '',
    done: 0,
  });

  if (props.isEdit) {
    newTask = reactive({
      task_title: props.currentTask?.taskTitle || '',
      task_description: props.currentTask?.taskDescription || '',
      urgency: props.currentTask?.urgency || Urgency.COMMON,
      creation_date: props.currentTask?.creationDate ? props.currentTask.creationDate.toLocaleDateString('pt-BR') : '',
      due_date: props.currentTask?.dueDate ? props.currentTask.dueDate.toLocaleDateString('pt-BR') : '',
      done: +(props.currentTask?.done || false),
    });
  }

  const isCreateTaskOpen = computed({
    get():boolean {
      return props.modelValue;
    },
    set(newState: boolean) {
      emit('update:modelValue', newState);
    },
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

      const taskToSend: CreateTaskToSend = {
        ...newTask,
        user_id: userId,
        project_id: projectId,
      };
      const [ success, result ] = await taskStore.createTask(userId as number, taskToSend);

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
