import { ComposerTranslation } from 'vue-i18n';
import {
	create, deleteById, getAll, update,
} from 'src/services/projectService';
import { parseProject } from 'src/utils/commonFunctions';
import { defineStore } from 'pinia';
import { Project } from 'src/models/mainModels';
import { CreateProjectToSend } from 'src/models/apiModels';
import { useTaskStore } from './taskStore';

export const useProjectStore = defineStore('project', {
	state: () => ({
		projects: [] as Project[],
		currentProject: undefined as Project | undefined,
	}),
	actions: {
		async getProjects($t:ComposerTranslation, userId: number): Promise<[boolean, string]> {
			const response = await getAll(userId);

			if (response.data.hasError) {
				if (!response.data.message) {
					return [ false, $t('PROJECT.ERROR.GET_PROJECTS') ];
				}
				return [ false, response.data.message ];
			}

			if (response.data.projects === undefined) {
				return [ false, $t('PROJECT.ERROR.NOTHING_FOUND') ];
			}

			this.projects = response.data.projects.map(parseProject);

			this.projects = this.projects.sort((a, b) => a.projectId - b.projectId);

			return [ true, $t('PROJECT.SUCCESS.GET') ];
		},
		async createProject(
			$t: ComposerTranslation,
			userId: number,
			projectToSend: CreateProjectToSend,
		): Promise<[boolean, string]> {
			const response = await create(userId, projectToSend);

			if (response.data.hasError) {
				if (!response.data?.message) {
					return [ false, $t('PROJECT.ERROR.CREATE') ];
				}
				return [ false, response.data.message ];
			}

			if (response.data.projects === undefined) {
				return [ false, $t('PROJECT.ERROR.NOTHING_FOUND') ];
			}

			this.projects = response.data.projects.map(parseProject);

			this.projects = this.projects.sort((a, b) => a.projectId - b.projectId);

			return [ true, $t('PROJECT.SUCCESS.CREATE') ];
		},
		async updateProject(
			$t: ComposerTranslation,
			userId: number,
			projectId: number,
			newProject : CreateProjectToSend,
		): Promise<[boolean, string]> {
			const response = await update(userId, projectId, newProject);

			if (response.data.hasError) {
				if (!response.data?.message) {
					return [ false, $t('PROJECT.ERROR.UPDATE') ];
				}
				return [ false, response.data.message ];
			}

			if (response.data.project === undefined) {
				return [ false, $t('PROJECT.ERROR.NOTHING_FOUND') ];
			}

			this.projects = this.projects.map((project) => {
				if (project.projectId === response.data.project?.project_id) {
					return parseProject(response.data.project);
				}

				return project;
			});

			this.projects = this.projects.sort((a, b) => a.projectId - b.projectId);

			return [ true, $t('PROJECT.SUCCESS.UPDATE') ];
		},
		setProjects(projects: Project[]) {
			this.projects = projects;
		},
		async deleteProject($t: ComposerTranslation, userId: number, projectId: number): Promise<[boolean, string]> {
			const taskStore = useTaskStore();

			await taskStore.$state.tasks.reduce(async(promise, task) => {
				await promise;
				if (task.projectId === projectId) {
					await taskStore.deleteTask($t, userId, task.taskId);
				}
			}, Promise.resolve());

			const { data } = await deleteById(userId, projectId);

			if (data.hasError) {
				if (!data.message) return [ false, $t('PROJECT.ERROR.DELETE') ];

				return [ false, data.message ];
			}

			this.projects = this.projects.filter((project) => project.projectId !== projectId);

			return [ true, data.message ];
		},
		setCurrentProject(project: Project | undefined) {
			this.currentProject = project;
		},
	},
	getters: {
		hasProjects(): boolean {
			return this.projects.length > 0;
		},
	},
});
