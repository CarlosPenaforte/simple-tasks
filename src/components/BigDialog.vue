<template>
	<q-dialog
		v-model="isDialogOpen"
		persistent
		maximized
		transition-show="slide-up"
		transition-hide="slide-down"
	>
		<q-card class="bg-lighter-common text-dark q-pa-sm">
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
    handleSave: {
      type: Function,
      required: true,
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

  function save(): void {
    props.handleSave();
    isDialogOpen.value = false;
  }
</script>
