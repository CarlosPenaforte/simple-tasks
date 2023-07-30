<template>
	<big-dialog
		v-model="isCreateProjectOpen"
		:handle-save="saveProject"
	>
		<q-input
			v-model="newProject.name"
			bottom-slots
			counter
			clearable
			maxlength="20"
			label="Project name"
			color="primary-main"
			class="q-mb-md"
		>
			<template v-slot:hint>
				Max of 20 characters
			</template>
		</q-input>
		<q-input
			v-model="newProject.description"
			bottom-slots
			counter
			clearable
			maxlength="50"
			label="Description"
			color="primary-main"
			class="q-mb-md"
		>
			<template v-slot:hint>
				Max of 50 characters
			</template>
		</q-input>
	</big-dialog>
</template>

<script lang="ts">
  import {
    defineComponent, ref, computed,
  } from 'vue';
  import BigDialog from '../BigDialog.vue';

  function saveProject() {
    return 0;
  }

  export default defineComponent({
    name: 'CreateProjectDialog',
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
  });

  const emit = defineEmits([ 'update:modelValue' ]);

  const newProject = ref({
    name: '',
    description: '',
  });

  const isCreateProjectOpen = computed({
    get():boolean {
      return props.modelValue;
    },
    set(newState: boolean) {
      emit('update:modelValue', newState);
    },
  });
</script>
