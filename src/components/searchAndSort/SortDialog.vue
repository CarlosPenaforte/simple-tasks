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
					Name
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
							<div v-html="sortBy.name.orientation"
								class="text-dark fw-medium text-capitalize"
							/>
						</template>
					</q-select>
				</q-item-section>
			</q-item>
			<q-item>
				<q-item-section class="text-dark">
					Due date
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
							<div v-html="sortBy.dueDate.orientation"
								class="text-dark fw-medium text-capitalize"
							/>
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
} from 'src/models';
import MidDialog from '../MidDialog.vue';

const sortBy: SortBy = reactive({
	name: {
		use: false,
		orientation: Orientation.ASC,
	},
	dueDate: {
		use: false,
		orientation: Orientation.ASC,
	},
});

const orientationOptions: Orientation[] = [
	Orientation.ASC, Orientation.DESC,
];

export default defineComponent({
	name: 'SortDialog',
	components: {
		MidDialog,
	},
	props: {
		modelValue: {
			type: Boolean,
			required: true,
		},
	},
	setup(props, { emit }) {
		const isSortDialogOpen : WritableComputedRef<boolean> = computed({
			get(): boolean {
				return props.modelValue;
			},
			set(newState: boolean) {
				emit('update:modelValue', newState);
			},
		});

		function sortTasks(): void {
			isSortDialogOpen.value = false;
		}

		return {
			isSortDialogOpen,
			sortTasks,
			Orientation,
			sortBy,
			orientationOptions,
		};
	},
});
</script>

<style scoped>

.border-box {
  box-sizing: border-box;
}
</style>
