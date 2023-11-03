<template>
	<q-input
		ref="dateInput"
		:for="inputId"
		:modelValue="inputStr"
		@update:modelValue="setDueDate"
		name="dueDate"
		maxlength="10"
		:mask="localeMask"
		:placeholder="localeFormat"
		:label="props.title"
		:rules="[val => val.length == 10 || props.shortMessage, val => isValidDate(val) || props.invalidMessage]"
		lazy-rules
		color="primary-main"
		class="q-mb-md"
	>
		<template v-slot:append>
			<q-icon name="event"
				class="cursor-pointer"
			>
				<q-popup-proxy ref="datePopup">
					<q-date
						:mask="qDateMask"
						color="primary-main"
						:title="props.title"
						:subtitle="props.subtitle"
						class="text-dark"
						:modelValue="inputStr"
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
</template>

<script lang="ts">
  import {
    defineComponent,
    computed,
    ref,
  } from 'vue';
  import { DateTime } from 'luxon';
  import {
    QInput, QPopupProxy,
  } from 'quasar';
  import {
    getLocaleFormat, getLocaleMask, isoStrToLocale, localeStrToIso,
  } from '../../utils/commonFunctions';

  export default defineComponent({
    name: 'DateInput',
  });
</script>

<script setup lang="ts">
  // PROPS AND EMITS
  const props = defineProps({
    inputId: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
    maxDate: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    shortMessage: {
      type: String,
      required: true,
    },
    invalidMessage: {
      type: String,
      required: true,
    },
  });

  const emit = defineEmits([ 'update:modelValue' ]);

  // UTILS
  const locale = navigator.language;

  const localeFormat = getLocaleFormat(locale);
  const qDateMask = localeFormat.toUpperCase();
  const localeMask = getLocaleMask(locale);

  // MODELS

  const dateInput = ref<QInput|null>(null);
  const datePopup = ref<QPopupProxy|null>(null);

  const inputStr = computed({
    get():string {
      return isoStrToLocale(props.modelValue, locale) || props.modelValue;
    },
    set(newState: string) {
      emit('update:modelValue', localeStrToIso(newState, localeFormat) || newState);
    },
  });

  // EXPOSE
  const hasError = computed(() => dateInput.value?.hasError);
  const errorMessage = computed(() => dateInput.value?.errorMessage);
  const validate = () => dateInput.value?.validate();
  defineExpose({
    hasError, errorMessage, validate,
  });

  // ACTIONS

  const setDueDate = (dueDate: string|number|null) => {
    if (typeof dueDate !== 'string') return;

    if (dueDate.length > 10) {
      inputStr.value = dueDate.slice(0, 10);
      return;
    }

    inputStr.value = dueDate;

    if (dueDate.length === 10) {
      datePopup.value?.hide();
    }
  };

  const isValidDate = (dateStr: string): boolean => {
    const maybeDate = DateTime.fromFormat(dateStr, localeFormat, { zone: 'utc' });

    if (!maybeDate) return false;

    if (props.maxDate) {
      const maxDate = DateTime.fromISO(props.maxDate, { zone: 'utc' });

      return maybeDate.diff(maxDate).toMillis() < 0 && maybeDate.year > 1920;
    }

    return maybeDate.diff(DateTime.now()).toMillis() > 0 && maybeDate.year < 2100;
  };

</script>
