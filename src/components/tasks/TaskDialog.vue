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
			v-model="newTask.name"
			bottom-slots
			counter
			clearable
			maxlength="20"
			label="Task name"
			color="primary-main"
			class="q-mb-md text-dark"
		>
			<template v-slot:hint>
				Max of 20 characters
			</template>
		</q-input>

		<q-input
			v-model="newTask.taskDescription"
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
			v-model="newTask.dueDate"
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
							v-model="newTask.dueDate"
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
  } from 'src/models/mainModels.ts';
  import { QVueGlobals } from 'quasar';
  import BigDialog from '../BigDialog.vue';

  export default defineComponent({
    name: 'CreateTaskDialog',
    components: {
      BigDialog,
    },
  });
</script>

<script setup lang="ts">
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
      required: true,
    },
  });

  const emit = defineEmits([ 'update:modelValue' ]);

  const $q = inject<QVueGlobals>('quasar');

  function saveTask() {
    $q?.notify('Task created successfully');
  }

  let newTask = reactive({
    name: '',
    description: '',
    urgency: Urgency.URGENT,
    dueDate: '',
  });

  if (props.isEdit) {
    newTask = reactive({
      name: props.currentTask.taskTitle,
      description: props.currentTask.taskDescription,
      urgency: props.currentTask.urgency,
      dueDate: props.currentTask.dueDate ? props.currentTask.dueDate.toLocaleDateString('pt-BR') : '',
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
</script>
