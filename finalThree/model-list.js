import { projects } from "./projects.js";

//get all cards
const projectContainer = document.getElementById("projects-container");
const projectCards = Array.from(projectContainer.children);

const templateProjectCard = projectCards[0];

const baseURL = "./model-viewer.html";

for (let project of projects) {
  const newCard = templateProjectCard.cloneNode(true);

  const cardTitle = newCard.querySelector("h2");
  cardTitle.textContent = project.name;

  const button = newCard.querySelector("a");

  button.href = baseURL + `?id=${project.id}`;

  projectContainer.appendChild(newCard);
}

templateProjectCard.remove();

function createCard(project) {
  const base = document.createElement("div");
  base.classList.add("card");

  const logo = document.createElement("svg");
  logo.xmlns = "http://www.w3.org/2000/svg";
  
}

//time stamp for video at:
//https://youtu.be/oI1xdYJ3OCM?t=3084
