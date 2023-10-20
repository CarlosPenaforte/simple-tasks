/* eslint-disable no-unused-vars */
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
  ASC = 'Ascending',
  DESC = 'Descending',
}

type SingleSortBy = {
  use: boolean,
  orientation: Orientation,
}

export type SortBy = {
  name: SingleSortBy,
  dueDate: SingleSortBy,
}

export type SearchFields = {
  name: string,
  urgency: Urgency,
  dueDate: string,
}

export type User = {
  readonly userId: number;
  fullName: string;
  email: string;
  sex: Gender;
  birthday: Date;
}

export type UserPlan = {
  readonly userId: number;
  readonly planId: number;
  readonly startDate: Date;
  endDate?: Date;
}

export type Plan = {
  readonly planId: number;
  planTitle: string;
  taskPermission: boolean;
  sharePermission: boolean;
  coworkPermission: boolean;
  readonly tasksLimit?: number;
  readonly sharesLimit?: number;
}

export type Task = {
  readonly taskId: number;
  readonly userId: number;
  readonly projectId: number;
  taskTitle: string;
  taskDescription?: string;
  readonly creationDate: Date;
  dueDate?: Date;
  readonly urgency: Urgency;
  done: boolean;
}

export type Project = {
  name: string,
  description?: string,
  readonly userId: number,
  projectId: number,
}
