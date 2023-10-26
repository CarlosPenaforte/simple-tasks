<template>
	<q-page
		:style="shrinkIfNeeded"
		class="column items-center justify-start fit"
	>
		<template v-if="projectStore.hasProjects">
			<q-list dense
				separator
				class="fit"
			>
				<task-list
					v-for="urgency in urgencyList"
					:key="urgency"
					:urgency="urgency"
					@open-edit-task="(task: Task) => $emit('open-edit-task',task)"
					@open-delete-task="(task: Task) => $emit('open-delete-task',task)"
				/>
				<task-list
					v-if="showDoneTasks"
					show-done-tasks
					@open-edit-task="(task: Task) => $emit('open-edit-task',task)"
					@open-delete-task="(task: Task) => $emit('open-delete-task',task)"
				/>
			</q-list>
			<q-btn
				v-if="hasSearchedTasks"
				id="btn-clear-search"
				flat
				icon-right="close"
				rounded
				class="btn floating-button bg-primary-main text-white fs-12 lh-14 font-semibold text-capitalize"
				@click.stop.prevent="clearSearch"
			>
				{{ $t('SEARCH.DISMISS') }}
			</q-btn>
		</template>
		<p v-else
			id="el-no-project"
			class="fs-20 lh-16 flex jusitfy-center items-center text-center text-primary-darker"
			style="flex: 1 0 auto;"
		>
			{{ $t('PROJECT.NOTHING') }}
		</p>
	</q-page>
</template>

<script lang="ts">
  import TaskList from 'src/components/tasks/TaskList.vue';
  import {
    computed,
    inject, onBeforeMount,
  } from 'vue';
  import {
    Task, Urgency,
  } from 'src/models/mainModels';
  import { useUserStore } from 'src/stores/userStore';
  import { useTaskStore } from 'src/stores/taskStore';
  import { storeToRefs } from 'pinia';
  import { useRouter } from 'vue-router';
  import { QVueGlobals } from 'quasar';
  import { useProjectStore } from 'src/stores/projectStore';
  import { useI18n } from 'vue-i18n';
  import { useWindowSize } from '@vueuse/core';

  export default {
    name: 'SelfTasks',
    components: {
      TaskList,
    },
  };
</script>

<script setup lang="ts">
  // BASICS

  const $t = useI18n().t;

  const $q = inject<QVueGlobals>('quasar');

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  const taskStore = useTaskStore();

  const projectStore = useProjectStore();

  const router = useRouter();

  // HOOKS

  onBeforeMount(async() => {
    const userId = user.value?.userId;
    if (!userId) {
      await userStore.logout();

      router.push('/login');
    }

    try {
      $q?.loading.show({ message: $t('TASK.LOADING') });

      const [ success, result ] = await taskStore.getTasks($t, userId as number);

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
        message: $t('TASK.ERROR.GET_TASKS'),
      });
    }
  });

  // MODELS

  const { width: windowWidth } = useWindowSize();
  const isWideScreen = computed(() => windowWidth.value > 800);
  const shrinkIfNeeded = computed(() => (isWideScreen.value
    ? 'width: 800px !important; margin: 0 auto;'
    : ''));

  const hasSearchedTasks = computed(() => taskStore.$state.searchedTasks.length > 0);
  const searchedUrgency = computed<[boolean, Urgency] | undefined>(() => {
    if (hasSearchedTasks.value && !taskStore.$state.searchedTasks[0]?.taskId) return undefined;

    return (hasSearchedTasks.value
      ? [ taskStore.$state.searchedTasks.every((task) => task.done),
          taskStore.$state.searchedTasks[0]?.urgency as Urgency,
      ]
      : undefined);
  });

  const urgencyList = computed(() => {
    if (!searchedUrgency.value) return [ Urgency.URGENT, Urgency.IMPORTANT, Urgency.COMMON ];

    const [ allDone, urgency ] = searchedUrgency.value;

    if (allDone) return [];

    return hasSearchedTasks.value
      ? [ urgency ]
      : [ Urgency.URGENT, Urgency.IMPORTANT, Urgency.COMMON ];
  });

  const showDoneTasks = computed(() => (hasSearchedTasks.value
    ? taskStore.$state.searchedTasks.some((task) => task.done)
    : true));

  // ACTIONS

  const clearSearch = () => {
    taskStore.clearSearchedTasks();
  };

</script>

<style scoped lang="scss">
  .floating-button {
    position: fixed;
    bottom: 80px;
    z-index: 3;
  }
</style>
