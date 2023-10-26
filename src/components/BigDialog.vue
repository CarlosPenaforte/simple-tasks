import { usePropsAndEmit } from '../util/composables';
<template>
	<q-dialog
		v-model="isDialogOpen"
		persistent
		maximized
		transition-show="slide-up"
		transition-hide="slide-down"
	>
		<q-card class="bg-lighter-common text-dark q-pa-sm "
			:style="props.extraStyle"
		>
			<q-bar class="bg-transparent q-px-none q-py-lg">
				<q-btn
					dense
					flat
					icon="close"
					size="20px"
					color="negative"
					@click="isDialogOpen = false"
				/>

				<q-space />

				<q-btn
					:id="props.saveButtonId"
					:loading="isLoading"
					dense
					flat
					icon="done"
					size="20px"
					color="positive"
					@click="save"
				/>
			</q-bar>

			<q-card-section class="bg-white q-mx-sm q-px-md q-py-sm column">
				<slot />
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script lang="ts">
  import {
    defineComponent,
    computed,
  } from 'vue';
  import { useState } from '../utils/composables';

  export default defineComponent({
    name: 'BigDialog',
  });
</script>

<script setup lang="ts">
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    saveButtonId: {
      type: String,
      default: 'btn-save',
    },
    handleSave: {
      type: Function,
      required: true,
    },
    extraStyle: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits([ 'update:modelValue' ]);

  const isDialogOpen = computed({
    get():boolean {
      return props.modelValue;
    },
    set(newTasks: boolean) {
      emit('update:modelValue', newTasks);
    },
  });

  const [ isLoading, setIsLoading ] = useState(false);

  async function save(): Promise<void> {
    setIsLoading(true);

    await props.handleSave();

    setIsLoading(false);

    isDialogOpen.value = false;
  }
</script>
