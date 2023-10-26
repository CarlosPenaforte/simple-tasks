<template>
	<q-page class="column items-center justify-start fit"
		:style="shrinkIfNeeded"
	>
		<q-list
			v-if="projects.length > 0"
			dense
			class="fit q-mt-md"
		>
			<template v-for="(project, index) in projects"
				:key="project.projectId"
			>
				<q-item
					class="el-project-item"
				>
					<q-item-section>
						<q-btn-dropdown
							:label="`${index + 1} - ${project.name}`"
							color="primary-main"
							unelevated
							align="between"
							content-class="border-primary-main no-shadow q-pb-sm"
							transition-show="fade"
							transition-hide="fade"
						>
							<q-list
								dense
								class="fit q-mt-md text-center"
							>
								<q-item v-for="(keyValueArrays, key) in keyValueProject(project)"
									:key="key"
									style="gap: 8px;"
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
								<q-item class="row justify-around align-center q-mt-sm">
									<q-item-section class="col-5">
										<q-btn
											id="btn-update-project"
											unelevated
											dense
											icon="update"
											color="primary"
											class="fs-12 lh-14 text-capitalize"
											@click.stop.prevent="openUpdateProjectDialog(
												project.projectId,
												project.name,
												project.description
											)"
										>
											{{ $t('PROJECT.UPDATE') }}
										</q-btn>
									</q-item-section>
									<q-item-section class="col-5">
										<q-btn
											id="btn-delete-project"
											outline
											dense
											icon="delete"
											color="negative"
											class="fs-12 lh-14 text-capitalize"
											@click.stop.prevent="openDeleteProjectDialog(project.projectId, project.name)"
										>
											{{ $t('PROJECT.DELETE') }}
										</q-btn>
									</q-item-section>
								</q-item>
							</q-list>
						</q-btn-dropdown>
					</q-item-section>
				</q-item>
			</template>
		</q-list>
		<p v-else
			class="fs-20 lh-16 flex jusitfy-center items-center text-center text-primary-darker"
			style="flex: 1 0 auto;"
		>
			{{ $t('PROJECT.NOTHING') }}
		</p>

		<confirm-dialog
			v-model="isDeleteProjectOpen"
			:done-function="deleteProject"
			:confirmQuestion="$t('PROJECT.CONFIRM_DELETE', {name: projectToDelete.name})"
		/>

		<create-project-dialog
			v-model="isUpdateProjectOpen"
			:base-project="projectToUpdate"
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
  import { useI18n } from 'vue-i18n';
  import { useWindowSize } from '@vueuse/core';
  import ConfirmDialog from '../components/ConfirmDialog.vue';
  import CreateProjectDialog from '../components/project/CreateProjectDialog.vue';

  export default {
    name: 'ProjectsPage',
    components: {
      ConfirmDialog,
      CreateProjectDialog,
    },
  };
</script>

<script setup lang="ts">
  // BASICS

  const $t = useI18n().t;

  const $q = inject<QVueGlobals>('quasar');

  const router = useRouter();

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const projectStore = useProjectStore();
  const projects = computed(() => projectStore.$state.projects);

  // MODELS

  const { width: windowWidth } = useWindowSize();
  const isWideScreen = computed(() => windowWidth.value > 800);
  const shrinkIfNeeded = computed(() => (isWideScreen.value
    ? 'width: 800px !important; margin: 0 auto;'
    : ''));

  const keyValueProject = (project: Project) => [ {
    key: $t('PROJECT.FORM.DESCRIPTION_SHORT'), text: project.description,
  } ];

  const isDeleteProjectOpen = ref<boolean>(false);
  const projectToDelete = ref({
    name: '', id: -1,
  });

  const isUpdateProjectOpen = ref<boolean>(false);
  const projectToUpdate = ref<Project>({
    name: '', description: '', projectId: -1, userId: -1,
  });

  // ACTIONS

  const openDeleteProjectDialog = (projectId: number, projectName: string) => {
    projectToDelete.value = {
      name: projectName,
      id: projectId,
    };
    isDeleteProjectOpen.value = true;
  };

  const openUpdateProjectDialog = (projectId: number, projectName: string, projectDescription?:string) => {
    projectToUpdate.value = {
      description: projectDescription || '',
      name: projectName,
      projectId,
      userId: user.value?.userId || -1,
    };

    isUpdateProjectOpen.value = true;
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
        message: $t('PROJECT.ERROR.NOT_FOUND'),
      });

      return;
    }

    try {
      const [ success, message ] = await projectStore.deleteProject($t, userId, projectToDelete.value.id);

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
        message: $t('PROJECT.ERROR.DELETE'),
      });
    }
  }

</script>

<style scoped lang="scss">
</style>
