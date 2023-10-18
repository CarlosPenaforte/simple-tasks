<template>
	<q-page class="column justify-start fit">
		<q-list
			dense
			separator
			class="fit q-mt-md"
		>
			<template v-for="(project) in projects"
				:key="project.projectId"
			>
				<q-item>
					<q-item-section>
						<q-item-label
							class="text-weight-medium"
							@click.stop.prevent="toggleProject(project.projectId)"
						>
							{{ project.name }}
						</q-item-label>
					</q-item-section>
				</q-item>
				<q-item v-if="isOpen(project.projectId)">
					<q-item-section>
						<q-list
							dense
							separator
							class="fit q-mt-md"
						>
							<q-item v-for="(keyValueArrays, key) in keyValueProject(project)"
								:key="key"
							>
								<q-item-section>
									<q-item-label class="text-weight-medium">
										{{ keyValueArrays.key }}
									</q-item-label>
								</q-item-section>
								<q-item-section>
									<q-item-label>
										{{ keyValueArrays.text }}
									</q-item-label>
								</q-item-section>
							</q-item>
							<q-item>
								<q-item-section>
									<q-btn
										flat
										dense
										icon="delete"
										color="negative"
										@click.stop.prevent="openDeleteProjectDialog(project.projectId, project.name)"
									>
										Delete Project
									</q-btn>
								</q-item-section>
							</q-item>
						</q-list>
					</q-item-section>
				</q-item>
			</template>
		</q-list>

		<confirm-dialog
			v-model="isDeleteProjectOpen"
			:done-function="deleteProject"
			:confirmQuestion="`Do you really want to delete ${projectToDelete.name}?`"
		/>
	</q-page>
</template>

<script lang="ts">
  import {
    computed, inject, ref,
  } from 'vue';
  import { useProjectStore } from 'src/stores/projectStore';
  import { Project } from 'src/models/mainModels';
  import { QVueGlobals } from 'quasar';
  import { useUserStore } from 'src/stores/userStore';
  import { storeToRefs } from 'pinia';
  import { useRouter } from 'vue-router';
  import ConfirmDialog from '../components/ConfirmDialog.vue';

  export default {
    name: 'ProjectsPage',
    components: {
      ConfirmDialog,
    },
  };
</script>

<script setup lang="ts">
  // BASICS

  const $q = inject<QVueGlobals>('quasar');

  const router = useRouter();

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const projectStore = useProjectStore();
  const projects = computed(() => projectStore.$state.projects);

  // MODELS
  const openProjects = ref<Record<number, boolean>>({});
  projects.value.forEach(((project) => {
    openProjects.value[project.projectId] = false;
  }));

  const keyValueProject = (project: Project) => [ {
    key: 'description', text: project.description,
  } ];

  const isDeleteProjectOpen = ref<boolean>(false);
  const projectToDelete = ref({
    name: '', id: -1,
  });

  // ACTIONS

  const toggleProject = (projectId: number) => {
    openProjects.value[projectId] = !openProjects.value[projectId];
  };

  const isOpen = (projectId: number) => openProjects.value[projectId];

  const openDeleteProjectDialog = (projectId: number, projectName: string) => {
    projectToDelete.value = {
      name: projectName,
      id: projectId,
    };
    isDeleteProjectOpen.value = true;
  };

  async function deleteProject(): Promise<void> {
    const userId = user.value?.userId;
    if (!userId) {
      await userStore.logout();

      router.push('/login');

      return;
    }

    if (projectToDelete.value.id < 1) {
      $q?.notify({
        type: 'negative',
        message: 'Project not found',
      });

      return;
    }

    try {
      const [ success, message ] = await projectStore.deleteProject(userId, projectToDelete.value.id);

      if (!success) {
        $q?.notify({
          type: 'negative',
          message,
        });

        return;
      }

      $q?.notify(message);
      isDeleteProjectOpen.value = false;
    } catch (e) {
      $q?.notify({
        type: 'negative',
        message: 'Error while deleting project',
      });
    }
  }

</script>

<style scoped lang="scss">
</style>
