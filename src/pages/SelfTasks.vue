<template>
	<q-page class="column items-center justify-start fit">
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
	</q-page>
</template>

<script lang="ts">
  import TaskList from 'src/components/tasks/TaskList.vue';

  export default {
    name: 'SelfTasks',
    components: {
      TaskList,
    },
  };
</script>

<script setup lang="ts">
  import {
    Task, Urgency,
  } from 'src/models/mainModels';
</script>

<style scoped lang="scss">
</style>
