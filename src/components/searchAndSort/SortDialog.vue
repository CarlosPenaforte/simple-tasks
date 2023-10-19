<template>
	<mid-dialog
		v-model="isSortDialogOpen"
		:done-function="sortTasks"
		done-icon="sort"
	>
		<q-list separator
			class="full-width q-px-none q-mx-none"
		>
			<q-item class="border-box">
				<q-item-section class="text-dark q-px-none">
					<q-checkbox
						v-model="sortBy.dueDate.use"
						color="primary-main"
						label="Due date"
					/>
				</q-item-section>
				<q-item-section>
					<q-select
						v-model="sortBy.dueDate.orientation"
						:options="orientationOptions"
						borderless
						behavior="menu"
						color="primary-main"
						class="q-ml-sm fit"
						transition-show="jump-down"
						transition-hide="jump-up"
					>
						<template v-slot:selected>
							<div
								class="text-dark fw-medium text-capitalize"
							>
								{{ sortBy.dueDate.orientation }}
							</div>
						</template>
					</q-select>
				</q-item-section>
			</q-item>
			<q-item class="border-box">
				<q-item-section class="row no-wrap text-dark q-px-none">
					<q-checkbox
						v-model="sortBy.name.use"
						color="primary-main"
						label="Name"
					/>
				</q-item-section>
				<q-item-section>
					<q-select
						v-model="sortBy.name.orientation"
						:options="orientationOptions"
						borderless
						behavior="menu"
						color="primary-main"
						class="q-ml-sm fit"
						transition-show="jump-down"
						transition-hide="jump-up"
					>
						<template v-slot:selected>
							<div
								class="text-dark fw-medium text-capitalize"
							>
								{{ sortBy.name.orientation }}
							</div>
						</template>
					</q-select>
				</q-item-section>
			</q-item>
		</q-list>
	</mid-dialog>
</template>

<script lang="ts">
  import {
    defineComponent, reactive, computed, WritableComputedRef,
  } from 'vue';
  import {
    Orientation, SortBy,
  } from 'src/models/mainModels';
  import { useTaskStore } from 'src/stores/taskStore';
  import MidDialog from '../MidDialog.vue';

  export default defineComponent({
    name: 'SortDialog',
    components: {
      MidDialog,
    },
  });
</script>

<script setup lang="ts">
  // PROPS AND EMITS
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits([ 'update:modelValue' ]);

  // BASICS

  const taskStore = useTaskStore();

  // MODELS

  const sortBy: SortBy = reactive({
    dueDate: {
      use: false,
      orientation: Orientation.ASC,
    },
    name: {
      use: false,
      orientation: Orientation.ASC,
    },

  });

  const orientationOptions: Orientation[] = [
    Orientation.ASC, Orientation.DESC,
  ];

  const isSortDialogOpen : WritableComputedRef<boolean> = computed({
    get(): boolean {
      return props.modelValue;
    },
    set(newState: boolean) {
      emit('update:modelValue', newState);
    },
  });

  // ACTIONS

  function sortTasks(): void {
    taskStore.sortTasks(sortBy);

    isSortDialogOpen.value = false;
  }
</script>

<style scoped>

.border-box {
  box-sizing: border-box;
}
</style>
