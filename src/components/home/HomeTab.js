import React from "react";
// import { Tab } from "semantic-ui-react";
import ProjectTable from "./ProjectTable";

function HomeTab() {
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
                {/* <div id="projectsContainer">
                        projects
                    </div> */}
                <div id="addProjectForm">
                  <button id="addProjectButton">
                    <span>+</span>Create Project
                  </button>
                  <div className="form-popup" id="myForm">
                    <form data-new-project-form id="newProjectForm" action="">
                      <label id="projectLabel" htmlFor="projectName">
                        {/* <ProjectTable props={props} /> */}
                      </label>
                      <br />
                      <input
                        data-new-project-input
                        type="text"
                        id="projectInput"
                        name="projectInput"
                      />
                      <br />
                      <input id="submitBtn" type="submit" value="Create" />
                      <br />
                    </form>
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <div id="taskList" className="todo-list">
        <div className="todo-header">
          <h2 id="projectTitle" className="list-title">
            Select a Project
          </h2>
        </div>

        <div className="todo-body" id="todoBody">
          <div id="tasksContainer" className="tasks"></div>
          <div id="createTaskContainer">
            <button id="addTaskButton">
              <span>+</span>Create Task
            </button>

            <div id="myTasks" className="new-task-creator">
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
                  <input type="date" name="dueDate" id="dueDate" />
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

            <div className="delete-stuff">
              {/* <button id="clearBtn" className="btn delete">Clear Completed Tasks</button> */}
              <button id="deleteBtn" className="btn delete">
                Delete All Tasks
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeTab;
