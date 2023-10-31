<template>
	<mid-dialog
		v-model="isSearchDialogOpen"
		:done-function="searchTasks"
		done-icon="search"
		done-button-id="btn-apply-search"
	>
		<q-input
			for="npt-search-name"
			v-model="searchFields.name"
			:label="$t('SEARCH.TITLE')"
			bottom-slots
			counter
			clearable
			maxlength="20"
			color="primary-main"
			class="q-mb-md"
		>
			<template v-slot:hint>
				Max of 20 characters
			</template>
		</q-input>

		<span class="q-mt-xs q-mb-xs text-secondary fs-12 lh-16">
			{{ $t('SEARCH.URGENCY') }}
		</span>
		<div class="q-px-none text-capitalize fs-12 lh-14 text-dark full-width">
			<q-radio
				v-model="searchFields.urgency"
				:val="Urgency.URGENT"
				:label="urgencyToTranslation($t, Urgency.URGENT)"
				dense
				color="negative"
			/>
			<q-radio
				v-model="searchFields.urgency"
				:val="Urgency.IMPORTANT"
				:label="urgencyToTranslation($t, Urgency.IMPORTANT)"
				dense
				color="warning"
				class="q-px-sm"
			/>
			<q-radio
				v-model="searchFields.urgency"
				:val="Urgency.COMMON"
				:label="urgencyToTranslation($t, Urgency.COMMON)"
				dense
				color="positive"
			/>
		</div>

		<span class="q-mt-lg q-mb-none text-secondary fs-12 lh-16">
			{{ $t('SEARCH.DUE_DATE') }}
		</span>
		<date-input
			v-model="searchFields.dueDate"
			:title="$t('TASK.FORM.DUE_DATE')"
			:subtitle="$t('TASK.FORM.DUE_DATE_SUBTITLE')"
			:short-message="$t('TASK.ERROR.SHORT_DUE_DATE')"
			:invalid-message="$t('TASK.ERROR.INVALID_DUE_DATE')"
		/>
	</mid-dialog>
</template>

<script lang="ts">
  import {
    defineComponent, computed, WritableComputedRef, reactive, inject,
  } from 'vue';
  import {
    Urgency, SearchFields,
  } from 'src/models/mainModels';
  import { useTaskStore } from 'src/stores/taskStore';
  import {
    urgencyToTranslation,
  } from 'src/utils/commonFunctions';
  import { QVueGlobals } from 'quasar';
  import { useI18n } from 'vue-i18n';
  import MidDialog from '../dialogs/MidDialog.vue';
  import DateInput from '../form/DateInput.vue';
  import { isoStrToDate } from '../../utils/commonFunctions';

  export default defineComponent({
    name: 'SearchDialog',
    components: {
      MidDialog,
      DateInput,
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

  const $t = useI18n().t;

  const $q = inject<QVueGlobals>('quasar');

  const taskStore = useTaskStore();

  // MODELS

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

  // ACTIONS

  function searchTasks(): void {
    const parsedDueDate = isoStrToDate(searchFields.dueDate);

    const success = taskStore.searchTasks(searchFields.name, searchFields.urgency, parsedDueDate);

    if (!success) {
      $q?.notify({
        type: 'negative',
        message: $t('SEARCH.NOTHING_FOUND'),
      });

      return;
    }

    isSearchDialogOpen.value = false;
  }
</script>
