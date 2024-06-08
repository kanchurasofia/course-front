import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import parseISO from "date-fns/parseISO";
import {
  Statistic,
  Icon,
  Grid,
  Container,
  Image,
  Segment,
  Dimmer,
  Loader,
} from "semantic-ui-react";

import { projectManagementApi } from "../misc/ProjectManagementApi";
import { handleLogError } from "../misc/Helpers";
import projectImgIcon from "../../images/svg/list.svg";

// import DOMInterface from './DOMInterface.js';
// import createProjects from './createProjects.js';
// import deleteProjects from './deleteProjects.js';
// import renderProjects from './renderProjects.js';
// import createTasks from './createTasks.js';
// import deleteTasks from './deleteTasks.js';
// import projectImgIcon from "../../images/svg/list.svg";
// import HomeTab from "./HomeTab";

function ProjectTable({
  projects,
  activeProject,
  setActiveProject,
  deleteAction,
}) {
  let projectsList;
  let className;

  projectsList = projects.map((project) => {
    if (project.id === activeProject) {
      className = "button-class-selected";
    } else {
      className = "button-class";
    }
    return (
      <div className={className} onClick={() => setActiveProject(project.id)}>
        <li className="list-name" data-project={project.title} id={project.id}>
          <img className="list-img" src={projectImgIcon} alt="list"></img>
          {project.title}
          <button
            className="deleteProjectBtn"
            onClick={() => deleteAction(project.id)}
          >
            X
          </button>
        </li>
      </div>
    );
  });
  return <div id="projectsContainer">{projectsList}</div>;
}

function CreateProjectButton({ show, action }) {
  if (!show) {
    return (
      <button id="addProjectButton" onClick={action}>
        <span>+</span>Create Project
      </button>
    );
  }
}

function CreateProjectForm({ show, handleSubmit }) {
  if (show) {
    return (
      <form data-new-project-form id="newProjectForm" onSubmit={handleSubmit}>
        <label id="projectLabel" htmlFor="projectName">
          Project Name
        </label>
        <br />
        <input
          data-new-project-input
          type="text"
          id="projectInput"
          name="projectInput"
        />
        <br />
        <input
          data-new-project-input
          type="text"
          id="projectDescriptionInput"
          name="projectDescriptionInput"
        />
        <br />
        <input id="submitBtn" type="submit" value="Create" />
        <br />
      </form>
    );
  } else {
    return;
  }
}

function CreateTaskButton({ show, action }) {
  if (show) {
    return (
      <button id="addTaskButton" onClick={action}>
        <span>+</span>Create Task
      </button>
    );
  }
}

function CreateTaskForm({ show, handleSubmit }) {
  if (show) {
    return (
      <div id="myTasks" className="new-task-creator" onSubmit={handleSubmit}>
        <form data-new-task-form id="newTaskForm" action="">
          <label id="taskLabel" htmlFor="taskName">
            Task Name
          </label>
          <br />
          <input
            type="text"
            className="new-task"
            id="taskInput"
            name="taskName"
          />
          <br />
          <div id="priorityDiv">
            <label htmlFor="priority">Priority:</label>
            <select name="priority" id="priorities">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <br />
            <br />
          </div>
          <div id="dueDateDiv">
            <label htmlFor="dueDate">Due Date:</label>
            <input type="datetime-local" name="dueDate" id="dueDate" />
            <br />
            <br />
          </div>
          <input
            id="taskSubmitButton"
            className="new-task"
            type="submit"
            value="Create"
          />
          <br />
        </form>
      </div>
    );
  } else {
    return;
  }
}

function Task({ task }) {
  var dueDateFromNow;
  if (task.deadline) {
    let dueDateConverted = parseISO(task.deadline);
    dueDateFromNow =
      "Due " + formatDistanceToNow(dueDateConverted, { addSuffix: true });
  }
  var priority_style = null;
  if (task.description === "High") {
    priority_style = "high-priority";
  } else if (task.description === "Medium") {
    priority_style = "medium-priority";
  } else {
    priority_style = "low-priority";
  }

  return (
    <div
      className={"task " + priority_style}
      data-task={task.title}
      data-project-name={task.project.title}
      // style="display: flex;"
    >
      <input
        type="checkbox"
        id={task.title}
        data-task={task.title}
        className="task-input"
      />
      <label
        htmlFor={task.title}
        className="task-label"
        data-content={task.title}
      >
        {task.title}
        <span className="task-label-span">
          {" "}
          {" ( " + dueDateFromNow + " )"}
        </span>
      </label>
    </div>
  );
}

function ListTasks({ tasks }) {
  let tasksList = tasks.map((task) => {
    return <Task task={task} />;
  });
  return tasksList;
}

function TasksTab({ selected_project, projects }) {
  const [tasks, setTasks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const createTaskButtonPressed = () => {
    setShowCreateForm(true);
  };

  const handleGetTasks = async (projectId) => {
    if (!projectId) {
      return;
    }
    try {
      const response = await projectManagementApi.listTasks(projectId);
      setTasks(response.data);
    } catch (error) {
      handleLogError(error);
    }
  };
  const handleDeleteAllTasks = async () => {
    try {
      await projectManagementApi.deleteTasks(selected_project);
    } catch (error) {
      handleLogError(error);
    } finally {
      handleGetTasks(selected_project);
    }
  };
  const handleCreateTask = async (projectId, title, priority, dueDate) => {
    try {
      await projectManagementApi.createTask(
        projectId,
        title,
        priority,
        dueDate
      );
    } catch (error) {
      handleLogError(error);
    } finally {
      await handleGetTasks(projectId);
    }
  };

  useEffect(() => {
    handleGetTasks(selected_project);
  }, [selected_project]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    var taskInput = event.target.taskInput.value;
    var prority = event.target.priorities.value;
    var dueDate = event.target.dueDate.value;

    handleCreateTask(selected_project, taskInput, prority, dueDate);
    setShowCreateForm(false);
  };

  let project;
  projects.forEach((element) => {
    if (element.id == selected_project) {
      project = element;
    }
  });
  return (
    <div id="taskList" className="todo-list">
      <div className="todo-header">
        <h2 id="projectTitle" className="list-title">
          {project ? project.title : "Select a project"}
        </h2>
      </div>

      {(() => {
        if (project) {
          return (
            <div className="todo-header">
              <h3 id="projectDescription" className="list-title">
                {project.description}
              </h3>
            </div>
          );
        }
        return null;
      })()}

      <div className="todo-body" id="todoBody">
        <div id="tasksContainer" className="tasks"></div>
        <ListTasks tasks={tasks} />
        <div id="createTaskContainer">
          <CreateTaskButton
            show={selected_project && !showCreateForm}
            action={createTaskButtonPressed}
          />
          <CreateTaskForm
            show={selected_project && showCreateForm}
            handleSubmit={handleSubmit}
          />
          <div className="delete-stuff">
            {/* <button id="clearBtn" className="btn delete">Clear Completed Tasks</button> */}
            <button
              id="deleteBtn"
              className="btn delete"
              onClick={handleDeleteAllTasks}
            >
              Delete All Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const onCLickAddButton = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleSetActivateProject = (projectId) => {
    setActiveProject(projectId);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await projectManagementApi.deleteProject(projectId);
    } catch (error) {
      handleLogError(error);
    } finally {
      handleGetProjects();
    }
  };

  const handleGetProjects = async () => {
    try {
      setIsLoading(true);
      const response = await projectManagementApi.getProjects();
      setProjects(response.data);
    } catch (error) {
      handleLogError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (title, projectDescription) => {
    try {
      await projectManagementApi.createProject(title, projectDescription);
    } catch (error) {
      handleLogError(error);
    } finally {
      await handleGetProjects();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    var projectTitle = event.target.projectInput.value;
    var projectDescription = event.target.projectDescriptionInput.value;
    if (!projectTitle) {
      return;
    }
    handleCreateProject(projectTitle, projectDescription);
    setShowCreateForm(false);
  };

  useEffect(() => {
    handleGetProjects();
  }, []);

  if (isLoading) {
    return (
      <Segment basic style={{ marginTop: window.innerHeight / 2 }}>
        <Dimmer active inverted>
          <Loader inverted size="huge">
            Loading
          </Loader>
        </Dimmer>
      </Segment>
    );
  }
  return (
    <div id="container">
      <div id="navContainer">
        <nav role="navigation">
          <div id="menuToggle">
            <div>
              <input id="inputMenu" name="toggle" type="checkbox" />
              <h1 className="projects-list-title">Projects</h1>
              <label id="labelMenu" htmlFor="toggle">
                <span>menu</span>
                <div></div>
                <div></div>
                <div></div>
              </label>
              <ul id="menu" data-projects>
                <ProjectTable
                  projects={projects}
                  deleteAction={handleDeleteProject}
                  setActiveProject={handleSetActivateProject}
                  activeProject={activeProject}
                />
                <CreateProjectButton
                  show={showCreateForm}
                  action={setShowCreateForm}
                />
                <CreateProjectForm
                  show={showCreateForm}
                  action={onCLickAddButton}
                  handleSubmit={handleSubmit}
                />
              </ul>
            </div>
          </div>
        </nav>
      </div>
      <TasksTab selected_project={activeProject} projects={projects} />
    </div>
  );
}
export default Home;
