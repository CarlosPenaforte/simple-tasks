<template>
	<q-dialog
		v-model="isDialogOpen"
		persistent
		transition-show="slide-up"
		transition-hide="slide-down"
	>
		<q-card class="bg-whity text-dark q-pa-sm full-width">
			<q-bar class="bg-transparent q-px-none q-pt-lg q-pb-xs">
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
					:icon="doneIcon"
					size="20px"
					color="positive"
					@click="doneFunction()"
				/>
			</q-bar>

			<q-card-section class="bg-transparent q-mx-sm q-px-xs q-py-sm column">
				<span class="text-center q-py-md fs-16 lh-28">{{ confirmQuestion }}</span>
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
    name: 'ConfirmDialog',
  });
</script>

<script setup lang="ts">
  const [ props, emit ] = [
    defineProps({
      modelValue: {
        type: Boolean,
        required: true,
      },
      doneFunction: {
        type: Function,
        required: true,
      },
      doneIcon: {
        type: String,
        default: 'done',
      },
      confirmQuestion: {
        type: String,
        required: true,
      },
    }),
    defineEmits([ 'update:modelValue' ]),
  ];

  const isDialogOpen = computed({
    get():boolean {
      return props.modelValue;
    },
    set(newState: boolean) {
      emit('update:modelValue', newState);
    },
  });
</script>
