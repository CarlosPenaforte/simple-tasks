<template>
	<q-input
		for="npt-task-due-date"
		:modelValue="inputStr"
		@update:modelValue="setDueDate"
		name="dueDate"
		:mask="localeMask"
		:placeholder="localeFormat"
		:label="props.title"
		:rules="[val => val.length == 10 || props.shortMessage, isValidDate || props.invalidMessage]"
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
  } from 'vue';
  import { DateTime } from 'luxon';
  import {
    dateStrToDate, getLocaleFormat, getLocaleMask,
  } from '../../utils/commonFunctions';

  export default defineComponent({
    name: 'DateInput',
  });
</script>

<script setup lang="ts">
  const props = defineProps({
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

  const locale = navigator.language;

  const localeFormat = getLocaleFormat(locale);
  const qDateMask = localeFormat.toUpperCase();
  const localeMask = getLocaleMask(locale);

  const inputStr = computed({
    get():string {
      return props.modelValue;
    },
    set(newState: string) {
      emit('update:modelValue', newState);
    },
  });

  const setDueDate = (dueDate: string|number|null) => {
    if (typeof dueDate !== 'string') return;

    if (dueDate.length > 10) {
      inputStr.value = dueDate.slice(0, 10);
      return;
    }

    inputStr.value = dueDate;
  };

  const isValidDate = (dateStr: string): boolean => {
    const maybeDate = dateStrToDate(dateStr, localeFormat);

    if (!maybeDate) return false;

    if (props.maxDate) {
      const maxDate = DateTime.fromFormat(props.maxDate, 'yyyy-MM-dd').toJSDate();

      return maybeDate.getTime() <= maxDate.getTime() && maybeDate.getFullYear() > 1920;
    }

    return maybeDate.getFullYear() > new Date().getFullYear() && maybeDate.getFullYear() < 2100;
  };

</script>
