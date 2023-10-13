<template>
	<q-layout view="lHh Lpr lFf">
		<q-header
			id="el-tasks-layout-header"
			reveal
			class="bg-primary-main q-px-sm q-py-none header-shadow"
		>
			<q-toolbar class="row no-padding fit">
				<q-btn
					flat
					dense
					round
					icon="menu"
					aria-label="Menu"
					@click="toggleLeftDrawer(true)"
				/>

				<q-select
					v-model="projectSelected"
					:options="projectOptions"
					borderless
					behavior="menu"
					label="Project"
					label-color="whity"
					color="primary-main"
					class="q-ml-lg q-px-sm w-200"
					transition-show="jump-down"
					transition-hide="jump-up"
				>
					<template v-slot:selected>
						<div
							class="text-whity fw-medium"
						>
							{{ projectSelected?.name }}
						</div>
					</template>

					<template v-slot:option="scope">
						<q-item v-bind="scope.itemProps">
							<q-item-section>
								<span>{{ scope.opt.name }}</span>
							</q-item-section>
						</q-item>
					</template>
				</q-select>

				<q-btn
					flat
					dense
					round
					icon="add"
					aria-label="Add"
					class="q-ml-xs"
					@click="openCreateProjectDialog"
				/>
			</q-toolbar>
		</q-header>

		<q-drawer
			v-model="leftDrawerOpen"
			show-if-above
			bordered
			class="column"
		>
			<q-list>
				<q-item
					class="justify-center items-center full-width no-padding"
				>
					<q-card
						flat
						class="full-width bg-secondary-filter"
					>
						<q-card-section
							horizontal
							class="justify-end q-pa-md q-pb-sm"
						>
							<q-icon
								name="close"
								size="26px"
								color="secondary"
								@click="toggleLeftDrawer(false)"
							/>
						</q-card-section>
						<q-card-section
							v-if="!!user"
							horizontal
							class="justify-start items-center q-px-sm q-pb-lg q-pt-none"
						>
							<q-icon
								name="circle"
								size="54px"
								color="secondary"
								class="q-pr-lg"
							/>
							<div class="column q-pl-xs">
								<span
									class="fs-22 q-mb-none q-pb-none lh-20 text-secondary"
								>{{ user.fullName }}</span>
								<span
									class="fs-11 q-mt-none q-pt-none lh-11 text-secondary"
								>{{ user.email }}</span>
							</div>
						</q-card-section>
					</q-card>
				</q-item>
				<q-item
					v-for="({ title, icon, path, action}, index) in drawerOptions"
					:key="index"
					class="no-padding no-margin"
				>
					<q-btn
						flat
						no-caps
						:class="`full-width justify-center items-start q-pl-md ${
							isSelectedDrawerOption(index)
								? 'text-primary-main bg-primary-filter'
								: 'text-secondary bg-white'
						}`"
						@click="changeSelectedDrawerOption(index, path, action)"
					>
						<div>
							<q-icon
								:name="icon"
								:color="isSelectedDrawerOption(index) ? 'primary-main' : 'secondary'"
								class="q-pr-md q-pl-xs"
							/>
							<span
								class="q-pl-xs fw-medium fs-16 lh-18"
							>{{ title }}</span>
						</div>
					</q-btn>
				</q-item>
			</q-list>
			<q-space />
			<span
				class="no-margin full-width text-right q-pr-md q-pb-sm text-dark fs-11 lh-12"
			>Simple Tasks v0.1.0</span>
		</q-drawer>

		<q-page-container>
			<router-view
				v-model="reactiveTasks"
				@open-edit-task="openEditTaskDialog"
				@open-delete-task="openDeleteTaskDialog"
			/>
		</q-page-container>

		<q-footer class="bg-secondary-filter">
			<q-toolbar class="row no-padding fit">
				<q-btn
					flat
					no-caps
					no-wrap
					aria-label="Sort"
					class="col-4 q-pt-sm"
					@click="openSortDialog"
				>
					<div class="column items-center justify-center">
						<q-icon name="sort"
							size="24px"
							color="dark-common"
						/>
						<div
							class="fs-12 lh-20 fw-regular text-secondary"
						>
							Sort
						</div>
					</div>
				</q-btn>
				<q-btn
					flat
					no-caps
					no-wrap
					aria-label="AddCircle"
					class="col-4 q-py-xs"
					@click="openCreateTaskDialog"
				>
					<div class="column items-center justify-center">
						<q-icon name="add_circle_outline"
							size="30px"
							color="primary-main"
						/>
						<div
							class="fs-14 lh-20 fw-medium text-primary-lighter"
						>
							Create Task
						</div>
					</div>
				</q-btn>
				<q-btn
					flat
					no-caps
					aria-label="Search"
					class="col-4 q-pt-sm"
					@click="openSearchDialog"
				>
					<div class="column items-center justify-center">
						<q-icon name="search"
							size="24px"
							color="dark-common"
						/>
						<div
							class="fs-12 lh-20 fw-regular text-secondary"
						>
							search
						</div>
					</div>
				</q-btn>
			</q-toolbar>
		</q-footer>

		<create-project-dialog
			v-model="isCreateProjectOpen"
		/>

		<task-dialog
			:current-task="targettedTask"
			v-model="isCreateTaskOpen"
		/>

		<task-dialog is-edit
			:current-task="targettedTask"
			v-model="isEditTaskOpen"
		/>

		<confirm-dialog
			v-model="isDeleteTaskOpen"
			:done-function="deleteTask"
			:confirmQuestion="`Do you really want to delete ${targettedTask.taskTitle}?`"
		/>

		<search-dialog
			v-model="isSearchDialogOpen"
		/>

		<sort-dialog
			v-model="isSortDialogOpen"
		/>
	</q-layout>
</template>

<script lang="ts">
  import {
    defineComponent, ref, reactive, UnwrapNestedRefs, inject,
  } from 'vue';
  import { useProjectStore } from 'src/stores/projectStore';
  import { useTaskStore } from 'src/stores/taskStore';
  import { useUserStore } from 'src/stores/userStore';
  import {
    Task, Urgency,
  } from 'src/models/mainModels';
  import { storeToRefs } from 'pinia';
  import {
    useRouter, useRoute,
  } from 'vue-router';
  import { useState } from 'src/utils/composables';
  import { QVueGlobals } from 'quasar';
  import CreateProjectDialog from '../components/project/CreateProjectDialog.vue';
  import TaskDialog from '../components/tasks/TaskDialog.vue';
  import SearchDialog from '../components/searchAndSort/SearchDialog.vue';
  import SortDialog from '../components/searchAndSort/SortDialog.vue';
  import ConfirmDialog from '../components/ConfirmDialog.vue';

  export default defineComponent({
    name: 'MainLayout',
    components: {
      CreateProjectDialog,
      TaskDialog,
      SearchDialog,
      SortDialog,
      ConfirmDialog,
    },
  });
</script>

<script setup lang="ts">
  const $q = inject<QVueGlobals>('quasar');

  const router = useRouter();
  const route = useRoute();

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  if (!user || !window.sessionStorage.getItem('simple-tasks/token')) {
    window.sessionStorage.removeItem('simple-tasks/token');

    router.push('/login');
  }

  const taskStore = useTaskStore();
  const projectStore = useProjectStore();

  const projectOptions = storeToRefs(projectStore).projects;
  const { tasks } = storeToRefs(taskStore);

  const leftDrawerOpen = ref(false);
  const [ selectedDrawerOption, setDrawerOption ] = useState(0);
  const isSearchDialogOpen = ref(false);
  const isSortDialogOpen = ref(false);
  const projectSelected = ref(projectOptions.value[0]);
  const reactiveTasks = reactive(tasks);
  const isCreateProjectOpen = ref(false);
  const isCreateTaskOpen = ref(false);
  const isEditTaskOpen = ref(false);
  let targettedTask : UnwrapNestedRefs<Task> = reactive({
    taskId: 1,
    userId: 1,
    projectId: 1,
    taskTitle: 'ct1',
    taskDescription: 'ok',
    creationDate: new Date(),
    urgency: Urgency.URGENT,
    done: false,
  });
  const isDeleteTaskOpen = ref(false);

  function toggleLeftDrawer(shouldOpen: boolean) {
    leftDrawerOpen.value = shouldOpen;
  }

  function openSearchDialog() {
    isSearchDialogOpen.value = true;
  }

  function openSortDialog() {
    isSortDialogOpen.value = true;
  }

  function changeSelectedDrawerOption(optionIndex: number, pathToGo?: string, action?: () => void) {
    setDrawerOption(optionIndex);
    if (pathToGo && route.path !== pathToGo) {
      router.push(pathToGo);
    }
    if (action) action();

    toggleLeftDrawer(false);
  }

  function isSelectedDrawerOption(optionIndex: number): boolean {
    return selectedDrawerOption.value === optionIndex;
  }

  function openCreateProjectDialog(): void {
    isCreateProjectOpen.value = true;
  }

  function openCreateTaskDialog(): void {
    isCreateTaskOpen.value = true;
  }

  function openEditTaskDialog(task: Task): void {
    isEditTaskOpen.value = true;
    targettedTask = task;
  }

  function openDeleteTaskDialog(task: Task): void {
    isDeleteTaskOpen.value = true;
    targettedTask = task;
  }

  function deleteTask(): void {
    isDeleteTaskOpen.value = false;
  }

  async function logout(): Promise<void> {
    const [ loggedOut, message ] = await userStore.logout();

    if (loggedOut) {
      $q?.notify(message);
    } else {
      $q?.notify({
        type: 'negative',
        message,
      });
    }

    router.push('/login');
  }

  const drawerOptions = [
    {
      title: 'Your Tasks',
      icon: 'checklist',
      path: '/',
    },
    {
      title: 'Logout',
      icon: 'logout',
      action: logout,
    },
  ];
</script>

<style>
  #el-tasks-layout-header .q-select__dropdown-icon {
    color: rgb(250,250,250) !important;
  }

  .width-110 {
    width: 110px;
  }

  .header-shadow {
    box-shadow: 0 4px 4px rgba(0,0,0,0.1);
  }
</style>
