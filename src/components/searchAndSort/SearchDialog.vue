<template>
	<mid-dialog
		v-model="isSearchDialogOpen"
		:done-function="searchTasks"
		done-icon="search"
	>
		<q-input
			v-model="searchFields.name"
			bottom-slots
			counter
			clearable
			maxlength="20"
			label="Search by name"
			color="primary-main"
			class="q-mb-md"
		>
			<template v-slot:hint>
				Max of 20 characters
			</template>
		</q-input>

		<span class="q-mt-xs q-mb-xs text-secondary fs-12 lh-16">Search by urgency</span>
		<div class="q-px-none text-capitalize fs-12 lh-14 text-dark full-width">
			<q-radio
				v-model="searchFields.urgency"
				:val="Urgency.URGENT"
				:label="Urgency.URGENT"
				dense
				color="negative"
			/>
			<q-radio
				v-model="searchFields.urgency"
				:val="Urgency.IMPORTANT"
				:label="Urgency.IMPORTANT"
				dense
				color="warning"
				class="q-px-sm"
			/>
			<q-radio
				v-model="searchFields.urgency"
				:val="Urgency.COMMON"
				:label="Urgency.COMMON"
				dense
				color="positive"
			/>
		</div>

		<span class="q-mt-lg q-mb-none text-secondary fs-12 lh-16">Search by due date</span>
		<q-input
			v-model="searchFields.dueDate"
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
							v-model="searchFields.dueDate"
							mask="YYYY-MM-DD"
							color="primary-main"
							title="Due date"
							subtitle="Select a due date to the new task"
							v-close-popup
						/>
					</q-popup-proxy>
				</q-icon>
			</template>
		</q-input>
	</mid-dialog>
</template>

<script lang="ts">
  import {
    defineComponent, computed, WritableComputedRef, reactive,
  } from 'vue';
  import {
    Urgency, SearchFields,
  } from 'src/models';
  import MidDialog from '../MidDialog.vue';

  export default defineComponent({
    name: 'SearchDialog',
    components: {
      MidDialog,
    },
  });
</script>

<script setup lang="ts">
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits([ 'update:modelValue' ]);

  const searchFields : SearchFields = reactive({
    name: '',
    urgency: Urgency.URGENT,
    dueDate: '',
  });

  const isSearchDialogOpen : WritableComputedRef<boolean> = computed({
    get(): boolean {
      return props.modelValue;
    },
    set(newState: boolean) {
      emit('update:modelValue', newState);
    },
  });

  function searchTasks(): void {
    isSearchDialogOpen.value = false;
  }
</script>
