<template>
	<q-layout id="el-main-layout"
		view="lHh Lpr lFf"
	>
		<q-header
			id="el-tasks-layout-header"
			reveal
			class="bg-primary-main q-px-sm q-py-none header-shadow"
		>
			<q-toolbar class="row no-padding fit">
				<q-btn
					id="btn-toggle-drawer"
					flat
					dense
					round
					icon="menu"
					aria-label="Menu"
					@click="toggleLeftDrawer(!leftDrawerOpen)"
				/>

				<template v-if="isMainTasksRoute">
					<q-select
						v-if="projectStore.hasProjects"
						for="npt-select-project"
						modelValue="currentProject"
						:options="projects"
						borderless
						behavior="menu"
						:label="$t('PROJECT.LABEL')"
						label-color="whity"
						color="primary-main"
						class="q-ml-lg q-px-sm w-200"
						transition-show="jump-down"
						transition-hide="jump-up"
						@update:model-value="projectStore.setCurrentProject"
					>
						<template v-slot:selected>
							<div
								class="text-whity fw-medium"
							>
								{{ currentProject?.name }}
							</div>
						</template>

						<template v-slot:option="scope">
							<q-item v-bind="scope.itemProps">
								<q-item-section :id="`el-project-option-${scope.opt.name.toLowerCase().replace(/ /g, '-')}`">
									<span>{{ scope.opt.name }}</span>
								</q-item-section>
							</q-item>
						</template>
					</q-select>

					<q-btn
						id="btn-create-project"
						flat
						dense
						:round="projectStore.hasProjects"
						icon="add"
						aria-label="Add"
						class="q-ml-xs items-center fs-14 lh-10"
						@click="openCreateProjectDialog"
					>
						{{ projectStore.hasProjects? '' : $t('PROJECT.CLICK_TO_CREATE') }}
					</q-btn>
				</template>
			</q-toolbar>
		</q-header>

		<q-drawer
			v-model="leftDrawerOpen"
			:overlay="!drawerBP"
			:breakpoint="1100"
			show-if-above
			elevated
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
							<q-btn
								icon="close"
								flat
								style="width: 26px; height: 26px;"
								color="secondary"
								@click.stop.prevent="toggleLeftDrawer(false)"
							/>
						</q-card-section>
						<q-card-section
							v-if="!!user"
							horizontal
						>
							<q-btn
								id="btn-user-info"
								flat
								square
								style="text-transform: none;"
								class="flex row justify-start items-start full-width q-px-sm q-py-md q-pt-none no-wrap"
								@click.stop.prevent="goToProfilePage"
							>
								<q-icon
									left
									name="account_circle"
									size="54px"
									color="secondary"
								/>
								<div class="column text-secondary text-left">
									<span
										class="fs-20 q-mb-none q-pb-none lh-18"
									>{{ user.fullName }}</span>
									<span
										class="fs-11 q-mt-none q-pt-none lh-11"
									>{{ user.email }}</span>
								</div>
							</q-btn>
						</q-card-section>
					</q-card>
				</q-item>
				<q-item
					v-for="({ isBelow, title, icon, path, action}, index) in drawerOptions"
					:key="index"
					class="no-padding no-margin"
					:style="isBelow? 'position: fixed; width: 100%; bottom: 28px;' : ''"
				>
					<q-btn
						:id="`btn-route-${path?.replace('/','') || icon}`"
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
			>
				{{ $t('BRAND.NAME') }}
			</span>
		</q-drawer>

		<q-page-container>
			<router-view
				:left-drawer-open="leftDrawerOpen"
				:style="shrinkIfNeeded"
				@open-edit-task="openEditTaskDialog"
				@open-delete-task="openDeleteTaskDialog"
			/>
		</q-page-container>

		<q-footer
			v-if="isNotProfileRoute"
			class="bg-secondary-filter"
		>
			<q-toolbar v-if="isMainTasksRoute"
				class="row no-padding fit"
			>
				<q-btn
					id="btn-sort-tasks"
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
							{{ $t('TASK.SORT') }}
						</div>
					</div>
				</q-btn>
				<q-btn
					id="btn-create-task"
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
							class="fs-14 lh-20 fw-medium text-primary-main"
						>
							{{ $t('TASK.CREATE') }}
						</div>
					</div>
				</q-btn>
				<q-btn
					id="btn-search-tasks"
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
							{{ $t('TASK.SEARCH') }}
						</div>
					</div>
				</q-btn>
			</q-toolbar>
			<q-toolbar v-if="isProjectsRoute"
				class="row no-padding fit justify-center"
			>
				<q-space />
				<q-btn
					flat
					no-caps
					no-wrap
					aria-label="AddCircle"
					class="col-4 q-py-xs"
					@click="openCreateProjectDialog"
				>
					<div class="column items-center justify-center">
						<q-icon name="add_circle_outline"
							size="30px"
							color="primary-main"
						/>
						<div
							class="fs-14 lh-20 fw-medium text-primary-main"
						>
							{{ $t('PROJECT.CREATE') }}
						</div>
					</div>
				</q-btn>
				<q-space />
			</q-toolbar>
		</q-footer>

		<create-project-dialog
			v-model="isCreateProjectOpen"
			:extra-style="shrinkIfNeeded"
		/>

		<task-dialog
			v-model="isCreateTaskOpen"
			:current-task="targettedTask"
			:extra-style="shrinkIfNeeded"
		/>

		<task-dialog
			v-if="targettedTask"
			v-model="isEditTaskOpen"
			:current-task="targettedTask"
			:extra-style="shrinkIfNeeded"
			is-edit
		/>

		<confirm-dialog
			v-if="targettedTask"
			v-model="isDeleteTaskOpen"
			:done-function="deleteTask"
			:confirmQuestion="$t('TASK.CONFIRM_DELETE', {title: targettedTask.taskTitle})"
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
    defineComponent, ref, inject, computed, onBeforeMount, watch,
  } from 'vue';
  import { useProjectStore } from 'src/stores/projectStore';
  import { useTaskStore } from 'src/stores/taskStore';
  import { useUserStore } from 'src/stores/userStore';
  import {
    Task,
  } from 'src/models/mainModels';
  import { storeToRefs } from 'pinia';
  import {
    useRouter, useRoute,
  } from 'vue-router';
  import { useState } from 'src/utils/composables';
  import {
    QVueGlobals, Loading,
  } from 'quasar';
  import { useI18n } from 'vue-i18n';
  import { useWindowSize } from '@vueuse/core';
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
    async beforeRouteEnter(__to, __from, next) {
      const userStore = useUserStore();
      const [ storedId, storedToken ] = [
        window.sessionStorage.getItem('simple-tasks/user_id'),
        window.sessionStorage.getItem('simple-tasks/token'),
      ];

      if (!userStore.$state.user?.userId && storedId && storedToken) {
        try {
          Loading.show();

          const [ success ] = await userStore.getUser(Number(storedId));

          if (!success) {
            await userStore.logout();

            Loading.hide();

            next('/login');
          } else {
            Loading.hide();
            next();
          }
        } catch (e) {
          await userStore.logout();

          next('/login');
        }
      } else if (!userStore.$state.user?.userId) {
        await userStore.logout();

        next('/login');
      } else {
        next();
      }
    },
  });
</script>

<script setup lang="ts">
  // BASICS
  const $t = useI18n().t;
  const $q = inject<QVueGlobals>('quasar');

  const router = useRouter();
  const route = useRoute();

  const isNotProfileRoute = computed(() => route.path !== '/profile');
  const isMainTasksRoute = computed(() => route.path === '/');
  const isProjectsRoute = computed(() => route.path === '/projects');

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const projectStore = useProjectStore();
  const {
    projects, currentProject,
  } = storeToRefs(projectStore);

  const taskStore = useTaskStore();
  const { tasks } = storeToRefs(taskStore);

  onBeforeMount(async() => {
    const userId = user.value?.userId;
    if (!userId) {
      await userStore.logout();

      router.push('/login');

      return;
    }

    try {
      $q?.loading.show({ message: $t('PROJECT.LOADING') });

      const [ success, result ] = await projectStore.getProjects($t, userId as number);

      $q?.loading.hide();

      if (!success) {
        $q?.notify({
          type: 'negative',
          message: result,
        });
      }
    } catch (e) {
      $q?.notify({
        type: 'negative',
        message: $t('PROJECT.ERROR.GET_PROJECTS'),
      });
    }
  });

  // DRAWER

  const leftDrawerOpen = ref(false);
  const [ selectedDrawerOption, setDrawerOption ] = useState(0);

  // MODELS

  const { width: windowWidth } = useWindowSize();
  const drawerBP = computed(() => windowWidth.value > 1100);
  const isWideScreen = computed(() => windowWidth.value > 800);
  const shrinkIfNeeded = computed(() => (isWideScreen.value
    ? 'width: 800px !important; margin: 0 auto;'
    : ''));

  const isSearchDialogOpen = ref(false);
  const isSortDialogOpen = ref(false);
  const isCreateProjectOpen = ref<boolean>(false);
  const isCreateTaskOpen = ref(false);
  const isEditTaskOpen = ref(false);
  const targettedTask = ref<Task | undefined>(tasks.value[0]);
  const isDeleteTaskOpen = ref(false);

  watch(() => projects.value, (newProjects) => {
    if (!currentProject.value || newProjects.length === 1) {
      projectStore.setCurrentProject(newProjects[0]);
    }
  }, { immediate: true });

  // ACTIONS

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
    if (!currentProject.value) {
      $q?.notify({
        type: 'negative',
        message: $t('PROJECT.ERROR.CREATE_OR_SELECT_FIRST'),
      });

      return;
    }

    isCreateTaskOpen.value = true;
  }

  function openEditTaskDialog(task: Task): void {
    isEditTaskOpen.value = true;
    targettedTask.value = task;
  }

  function openDeleteTaskDialog(task: Task): void {
    isDeleteTaskOpen.value = true;
    targettedTask.value = task;
  }

  async function deleteTask(): Promise<void> {
    const userId = user.value?.userId;
    if (!userId) {
      await userStore.logout();

      router.push('/login');

      return;
    }

    if (!targettedTask.value?.taskId) {
      $q?.notify({
        type: 'negative',
        message: $t('TASK.ERROR.NOT_FOUND'),
      });

      return;
    }

    try {
      const [ success, message ] = await taskStore.deleteTask($t, userId, targettedTask.value.taskId);

      if (!success) {
        $q?.notify({
          type: 'negative',
          message,
        });

        return;
      }

      $q?.notify(message);
      isDeleteTaskOpen.value = false;
    } catch (e) {
      $q?.notify({
        type: 'negative',
        message: $t('TASK.ERROR.DELETE'),
      });
    }
  }

  // ROUTE RELATED

  function goToProfilePage(): void {
    setDrawerOption(-1);
    toggleLeftDrawer(false);

    router.push('/profile');
  }

  async function logout(): Promise<void> {
    $q?.loading.show({ message: $t('COMMON.LOGGING_OUT') });

    const [ loggedOut, message ] = await userStore.logout();

    if (loggedOut) {
      $q?.notify(message);
    } else {
      $q?.notify({
        type: 'negative',
        message,
      });
    }

    setDrawerOption(-1);
    toggleLeftDrawer(false);

    $q?.loading.hide();

    router.push('/login');
  }

  const drawerOptions = [
    {
      isBelow: false,
      title: $t('TASK.YOUR_TASKS'),
      icon: 'checklist',
      path: '/',
    },
    {
      isBelow: false,
      title: $t('PROJECT.TITLE'),
      icon: 'emoji_events',
      path: '/projects',
    },
    {
      isBelow: true,
      title: $t('COMMON.LOGOUT'),
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

  #btn-user-info .q-btn__content {
	flex-wrap: nowrap;
  }
</style>
