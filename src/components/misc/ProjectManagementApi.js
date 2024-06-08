import axios from "axios";
import { config } from "../../Constants";

export const projectManagementApi = {
  getProjects,
  createProject,
  deleteProject,
  createTask,
  listTasks,
  deleteTasks,
};

function getProjects(user) {
  const url = `/api/projects/`;
  return instance.get(url);
}

function createProject(projectTitle, projectDescription) {
  return instance.post("/api/projects/", {
    title: projectTitle,
    description: projectDescription,
  });
}

function deleteProject(projectId) {
  return instance.delete(`/api/projects/${projectId}/`);
}

function listTasks(projectId) {
  return instance.get(`/api/tasks/${projectId}/`);
}

function deleteTasks(projectId) {
  return instance.delete(`/api/tasks/${projectId}/`);
}

function createTask(projectId, title, priority, dueDate) {
  console.log(dueDate);
  return instance.post("/api/tasks/", {
    title: title,
    description: priority,
    project: {
      id: projectId,
    },
    deadline: dueDate,
  });
}

// -- Axios

const instance = axios.create({
  baseURL: config.url.API_BASE_URL,
});
