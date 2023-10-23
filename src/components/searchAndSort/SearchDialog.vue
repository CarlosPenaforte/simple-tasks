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
		<q-input
			for="npt-search-due-date"
			:modelValue="formattedDueDate"
			:mask="localeMask"
			:placeholder="localeFormat"
			:rules="[val => val.length == 10 || $t('TASK.ERROR.INVALID_DUE_DATE')]"
			name="dueDate"
			lazy-rules
			color="primary-main"
			class="q-mb-md"
			@update:modelValue="setDueDate"
		>
			<template v-slot:append>
				<q-icon name="event"
					class="cursor-pointer"
				>
					<q-popup-proxy>
						<q-date
							:modelValue="formattedDueDate"
							:mask="qDateMask"
							:title="$t('TASK.FORM.DUE_DATE')"
							:subtitle="$t('TASK.FORM.DUE_DATE_SUBTITLE')"
							color="primary-main"
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
    dateStrToDate, urgencyToTranslation, formatDateToLocale, getLocaleFormat, getLocaleMask,
  } from 'src/utils/commonFunctions';
  import { QVueGlobals } from 'quasar';
  import { useI18n } from 'vue-i18n';
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

  const $t = useI18n().t;

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
        message: $t('SEARCH.NOTHING_FOUND'),
      });

      return;
    }

    isSearchDialogOpen.value = false;
  }
</script>
