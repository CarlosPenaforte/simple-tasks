export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'nonBinary',
  NOT_INFORMED = 'notInformed',
}

export enum Urgency {
  URGENT = 'urgent',
  IMPORTANT = 'important',
  COMMON = 'common',
}

export enum Orientation {
  ASC = 'ascending',
  DESC = 'descending',
}

interface SingleSortBy {
  use: boolean,
  orientation: Orientation,
}

export interface SortBy {
  name: SingleSortBy,
  dueDate: SingleSortBy,
}

export interface SearchFields {
  name: string,
  urgency: Urgency,
  dueDate: string,
}

export interface Plan {
  planId: number;
  title: string;
  taskPermission: boolean;
  sharePermission: boolean;
  coworkPermission: boolean;
  tasksLimit?: number;
  sharesLimit?: number;
}

export interface Task {
  taskId: number;
  userId: number;
  title: string;
  description: string;
  creationDate: Date;
  dueDate?: Date;
  urgency: Urgency;
  cowork?: boolean;
  sharedTaskUsers?: Array<User>;
  done: boolean;
}

export interface User {
  userId: number;
  planId?: number;
  username: string;
  fullName: string;
  email: string;
  sex: Gender;
  birthday?: Date;
}
