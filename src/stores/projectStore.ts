import {
	create, getAll,
} from 'src/services/projectService';
import { parseProject } from 'src/utils/commonFunctions';
import { defineStore } from 'pinia';
import { Project } from 'src/models/mainModels';
import { CreateProjectToSend } from 'src/models/apiModels';

export const useProjectStore = defineStore('project', {
	state: () => ({
		projects: [] as Project[],
		currentProject: undefined as Project | undefined,
	}),
	actions: {
		async getProjects(userId: number): Promise<[boolean, string]> {
			const response = await getAll(userId);

			if (response.data.hasError) {
				if (!response.data.message) {
					return [ false, 'Error while getting projects' ];
				}
				return [ false, response.data.message ];
			}

			if (response.data.projects === undefined) {
				return [ false, 'No projects found' ];
			}

			this.projects = response.data.projects.map(parseProject);

			this.projects = this.projects.sort((a, b) => a.projectId - b.projectId);

			return [ true, 'Success getting projects' ];
		},
		async createProject(userId: number, projectToSend: CreateProjectToSend): Promise<[boolean, string]> {
			const response = await create(userId, projectToSend);

			if (response.data.hasError) {
				if (!response.data?.message) {
					return [ false, 'Error while creating project' ];
				}
				return [ false, response.data.message ];
			}

			if (response.data.projects === undefined) {
				return [ false, 'No projects found' ];
			}

			this.projects = response.data.projects.map(parseProject);

			this.projects = this.projects.sort((a, b) => a.projectId - b.projectId);

			return [ true, 'Success creating project' ];
		},
		updateProject(newProject : Project) {
			this.projects = this.projects.map((project) => {
				if (project.projectId === newProject.projectId) {
					return newProject;
				}
				return project;
			});
		},
		setProjects(projects: Project[]) {
			this.projects = projects;
		},
		removeProject(projectId: number) {
			this.projects = this.projects.filter((project) => !(project.projectId === projectId));
		},
		setCurrentProject(project: Project | undefined) {
			this.currentProject = project;
			console.log(this.currentProject);
		},
	},
	getters: {
		hasProjects(): boolean {
			return this.projects.length > 0;
		},
	},
});
