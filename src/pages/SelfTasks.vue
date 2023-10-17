<template>
	<q-page class="column items-center justify-start fit">
		<template v-if="projectStore.hasProjects">
			<q-list dense
				separator
				class="fit"
			>
				<task-list
					:urgency="Urgency.URGENT"
					@open-edit-task="(task: Task) => $emit('open-edit-task',task)"
					@open-delete-task="(task: Task) => $emit('open-delete-task',task)"
				/>

				<task-list
					:urgency="Urgency.IMPORTANT"
					@open-edit-task="(task: Task) => $emit('open-edit-task',task)"
					@open-delete-task="(task: Task) => $emit('open-delete-task',task)"
				/>

				<task-list
					:urgency="Urgency.COMMON"
					@open-edit-task="(task: Task) => $emit('open-edit-task',task)"
					@open-delete-task="(task: Task) => $emit('open-delete-task',task)"
				/>

				<task-list
					show-done-tasks
					@open-edit-task="(task: Task) => $emit('open-edit-task',task)"
					@open-delete-task="(task: Task) => $emit('open-delete-task',task)"
				/>
			</q-list>
		</template>
		<p v-else
			class="fs-20 lh-16 fit flex jusitfy-center items-center text-center text-primary-darker"
			style="flex: 1;"
		>
			There is no project created, click in the button above to create a new one
		</p>
	</q-page>
</template>

<script lang="ts">
  import TaskList from 'src/components/tasks/TaskList.vue';
  import {
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

  export default {
    name: 'SelfTasks',
    components: {
      TaskList,
    },
  };
</script>

<script setup lang="ts">
  const $q = inject<QVueGlobals>('quasar');

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  const taskStore = useTaskStore();

  const projectStore = useProjectStore();

  const router = useRouter();

  onBeforeMount(async() => {
    const userId = user.value?.userId;
    if (!userId) {
      await userStore.logout();

      router.push('/login');
    }

    try {
      const [ success, result ] = await taskStore.getTasks(userId as number);

      if (!success) {
        $q?.notify({
          type: 'negative',
          message: result,
        });
      }
    } catch (e) {
      $q?.notify({
        type: 'negative',
        message: 'Error while getting tasks',
      });
    }
  });
</script>

<style scoped lang="scss">
</style>
