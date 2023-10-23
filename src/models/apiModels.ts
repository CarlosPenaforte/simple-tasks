// USER
export type CreateUserToSend = {
    user_password: string;
    full_name: string;
    email: string;
    sex: string;
    birthday: string;
    confirm_password: string;
}

export type UpdateUserToSend = {
    full_name: string;
    sex: string;
    birthday: string;
}

export type ReceivedUser = {
    readonly user_id: number;
    full_name: string;
    email: string;
    sex: string;
    birthday: string;
}

export type RegisterResponse = {
    readonly hasError: boolean;
    message: string;
}

export type UpdateUserResponse = {
    readonly hasError: boolean;
    user?: ReceivedUser;
    message?: string;
}

export type GetUserResponse = {
    readonly hasError: boolean;
    user?: ReceivedUser;
    message?: string;
}

export type DeleteUserResponse = {
    readonly hasError: boolean;
    message: string;
}

// TASK

export type ReceivedTask = {
    task_id: number;
    user_id: number;
    project_id: number;
    task_title: string;
    task_description?: string;
    creation_date: string;
    due_date?: string;
    urgency: string;
    done: number;
}

export type CreateTaskToSend = Omit<ReceivedTask, 'task_id'>;

export type CreateTaskResponse = {
    readonly hasError: boolean;
    tasks?: ReceivedTask[];
    message?: string;
};

export type UpdateTaskResponse = {
    readonly hasError: boolean;
    task?: ReceivedTask;
    message?: string;
};

export type GetTaskResponse = {
    readonly hasError: boolean;
    task?: ReceivedTask;
    message?: string;
};

export type GetAllTasksResponse = {
    readonly hasError: boolean;
    tasks?: ReceivedTask[];
    message?: string;
};

export type DeleteTaskResponse = {
    readonly hasError: boolean;
    message: string;
};

// PROJECT

export type ReceivedProject = {
    project_id: number;
    user_id: number;
    name: string;
    description?: string;
}

export type CreateProjectToSend = Omit<ReceivedProject, 'project_id'>;

export type CreateProjectResponse = {
    readonly hasError: boolean;
    projects?: ReceivedProject[];
    message?: string;
};

export type UpdateProjectResponse = {
    readonly hasError: boolean;
    project?: ReceivedProject;
    message?: string;
};

export type GetProjectResponse = {
    readonly hasError: boolean;
    project?: ReceivedProject;
    message?: string;
};

export type GetAllProjectsResponse = {
    readonly hasError: boolean;
    projects?: ReceivedProject[];
    message?: string;
};

export type DeleteProjectResponse = {
    readonly hasError: boolean;
    message: string;
};

// AUTH

export type LoginResponse = {
    readonly auth: boolean;
    readonly token?: string;
    user?: ReceivedUser;
    message?: string;
}

export type LogoutResponse = {
    readonly hasError : boolean;
    message: string;
}
