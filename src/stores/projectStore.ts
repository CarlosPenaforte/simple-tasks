import { defineStore } from 'pinia';
import { Project } from 'src/models/mainModels';

export const useProjectStore = defineStore('project', {
	state: () => ({
		projects: [
			{
				name: 'MyProject',
				description: '',
				userId: 1,
				projectId: 1,
			},
			{
				name: 'Second',
				description: '',
				userId: 1,
				projectId: 2,
			},
			{
				name: 'Party',
				description: '',
				userId: 1,
				projectId: 3,
			},
		] as Project[],
	}),
	actions: {
		createProject(project : Project) {
			this.projects.push(project);

			this.projects = this.projects.sort((a, b) => a.projectId - b.projectId);
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
	},
});
