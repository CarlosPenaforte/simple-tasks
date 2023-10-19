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
	</mid-dialog>
</template>

<script lang="ts">
  import {
    defineComponent, computed, WritableComputedRef, reactive, watch, ref, inject,
  } from 'vue';
  import {
    Urgency, SearchFields,
  } from 'src/models/mainModels';
  import { useTaskStore } from 'src/stores/taskStore';
  import {
    dateStrToDate, formatDateToLocale, getLocaleFormat, getLocaleMask,
  } from 'src/utils/commonFunctions';
  import { QVueGlobals } from 'quasar';
  import MidDialog from '../MidDialog.vue';

  export default defineComponent({
    name: 'SearchDialog',
    components: {
      MidDialog,
    },
  });
</script>

<script setup lang="ts">
  // PROPS AND EMIT
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits([ 'update:modelValue' ]);

  // BASICS

  const $q = inject<QVueGlobals>('quasar');

  const taskStore = useTaskStore();

  // MODELS

  const locale = navigator.language;

  const localeFormat = getLocaleFormat(locale);
  const qDateMask = localeFormat.toUpperCase();
  const localeMask = getLocaleMask(locale);

  const searchFields: SearchFields = reactive({
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

  // DUE DATE SETTER AND GETTER

  const setDueDate = (dueDate: string|number|null) => {
    if (typeof dueDate !== 'string') return;

    if (dueDate.length > 10) {
      searchFields.dueDate = dueDate.slice(0, 10);
      return;
    }

    searchFields.dueDate = dueDate;
  };

  const formattedDueDate = ref(formatDateToLocale(dateStrToDate(searchFields.dueDate, localeFormat), locale));

  watch(() => searchFields.dueDate, (newValue) => {
    if (newValue.length < 10) {
      formattedDueDate.value = newValue;

      return;
    }

    formattedDueDate.value = formatDateToLocale(dateStrToDate(newValue, localeFormat), locale);
  });

  // ACTIONS

  function searchTasks(): void {
    const parsedDueDate = dateStrToDate(searchFields.dueDate, localeFormat);

    const success = taskStore.searchTasks(searchFields.name, searchFields.urgency, parsedDueDate);

    if (!success) {
      $q?.notify({
        type: 'negative',
        message: 'Nothing found',
      });

      return;
    }

    isSearchDialogOpen.value = false;
  }
</script>
