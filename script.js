"use strict"

const state = {
    tasks: []
};

const taskContents = document.querySelector('.tasks__contents');
const taskModal = document.querySelector('#showTaskModal .tasks__modal_body');

const htmlTaskContent = ({ id, title, description, tags, url }) => `
    <div class="col-md-6 col-lg-4 mt-3" id="${id}">
        <div class="card shadow-sm tasks__card">
            <div class="card-header d-flex justify-content-end tasks__card_header">
                <div class="card-header d-flex justify-content-end tasks__card_header">
                    <button type="button" class="btn btn-outline-secondary mr-1.5" id="${id}" onclick="editTask.apply(this, arguments)">
                        <i class="fas fa-pencil-alt" id="${id}"></i>
                    </button>
                    <button type="button" class="btn btn-outline-secondary mr-1.5" id="${id}" onclick="deleteTask.apply(this, arguments)">
                        <i class="fas fa-trash-alt" id="${id}"></i>
                    </button>
                </div>
            </div>
            <div class="card-body tasks__card_body">
                ${
                    url 
                    ? `<img width="100%" src="${url}" alt="Card Image" class="card-img-top md-3 rounded-lg" />`
                    : `<img width="100%" src="https://placehold.co/600x400/png" alt="Card Image" class="card-img-top md-3 rounded-lg" />`
                }
                <h4 class="card-title mt-3 tasks__card_title">${title}</h4>
                <hr />
                <p class="card-text time-3-lines text-muted tasks__card_description">${description}</p>
                <div class="tasks__card_tags">
                    <span class="badge bg-primary">${tags}</span>
                </div>
            </div>
            <div class="card-footer tasks__card_footer">
                <button type="button" id="${id}" class="btn btn-primary float-right tasks__card_action" data-bs-toggle="modal" data-bs-target="#showTaskModal" onclick="openTask.apply(this, arguments)">
                    <i class="fas fa-eye" id="${id}"></i> See Task 
                </button>
            </div>
        </div>
    </div>
`;

const htmlModalContent = ({ id, title, description, url }) => { 
    const date = new Date(parseInt(id));  
    return `
    <div id="${id}">
        ${
            url 
            ? `<img width="100%" src="${url}" alt="Card Image" class="card-img-top md-3 rounded-lg" />`
            : `<img width="100%" src="https://placehold.co/600x400/png" alt="Card Image" class="card-img-top md-3 rounded-lg" />`
        }
        <p class="muted text-sm">Created on: ${date.toDateString()}</p>
        <h2 class="my-3">${title}</h2>
        <hr />
        <p class="text-muted">${description}</p>
    </div>
`};

const updateLocalStorage = () => {
    localStorage.setItem(
        "task",
        JSON.stringify({
            tasks: state.tasks
        })
    );
}

const loadInitialData = () => {
    if(localStorage.task !== undefined) {
        const localStorageCopy = JSON.parse(localStorage.task);
        if(localStorageCopy) state.tasks = localStorageCopy.tasks;
        state.tasks.map((date) => {
            taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(date));
        });
    }
}

const handleSubmit = (event) => {
    const id = `${Date.now()}`;
    const request = {
        url: document.getElementById("imageUrl").value,
        title: document.getElementById("taskTitle").value,
        tags: document.getElementById("taskType").value,
        description: document.getElementById("description").value,
    };
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent({...request, id}));
    state.tasks.push({ ...request, id });
    updateLocalStorage();
}

const clearLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
}

const openTask = (event) => {
    if(!event) event = window.event;
    const getTask = state.tasks.find(({id}) => id === event.target.id);
    taskModal.innerHTML = htmlModalContent(getTask);
}

const deleteTask = (event) => {
    if(!event) event = window.event;
    const targetId = event.target.id;
    state.tasks = state.tasks.filter(({id}) => id !== targetId);    
    updateLocalStorage();
    if(event.target.tagName === "BUTTON")
    {
        event.target.parentNode.parentNode.parentNode.parentNode.remove();
        
    }
    else
    {
        event.target.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
    }
}

const editTask = (event) => {
    let card = null;
    if(event.target.tagName === "I") {
        card = event.target.parentNode.parentNode.parentNode.parentNode;
    } else {
        card = event.target.parentNode.parentNode.parentNode;
    }

    const elemTitle = card.querySelector(".tasks__card_title");
    const elemTags = card.querySelector(".tasks__card_tags span");
    const elemDescription = card.querySelector(".tasks__card_description");
    const elemAction = card.querySelector(".tasks__card_action");

    elemTitle.setAttribute("contenteditable", "true");
    elemTags.setAttribute("contenteditable", "true");
    elemDescription.setAttribute("contenteditable", "true");
    elemAction.setAttribute("onclick", "updateTask.apply(this, arguments)")
    elemAction.removeAttribute("data-bs-toggle");
    elemAction.removeAttribute("data-bs-target");
    elemAction.innerHTML = `<i class="fa-solid fa-floppy-disk" id="${event.target.id}"></i> Save Task`
}

const updateTask = (event) => {
    let card = null;
    if(event.target.tagName === "I") {
        card = event.target.parentNode.parentNode.parentNode.parentNode;
    } else {
        card = event.target.parentNode.parentNode.parentNode;
    }
    const elemTitle = card.querySelector(".tasks__card_title");
    const elemTags = card.querySelector(".tasks__card_tags span");
    const elemDescription = card.querySelector(".tasks__card_description");
    const elemAction = card.querySelector(".tasks__card_action");
    state.tasks = state.tasks.map(task => {
        if(task.id === event.target.id) {
            task.id = task.id;
            task.url = task.url;
            task.title = elemTitle.innerText;
            task.tags = elemTags.innerText;
            task.description = elemDescription.innerText;
        }
        return task;
    });    
    console.log(state.tasks);
    updateLocalStorage();    
    elemTitle.removeAttribute("contenteditable", "true");
    elemTags.removeAttribute("contenteditable", "true");
    elemDescription.removeAttribute("contenteditable", "true");
    elemAction.setAttribute("onclick", "openTask.apply(this, arguments)")
    elemAction.setAttribute("data-bs-toggle", "modal");
    elemAction.setAttribute("data-bs-target", "#showTaskModal");
    elemAction.innerHTML = `<i class="fas fa-eye" id="${event.target.id}"></i> See Task`   
}

const searchTask = (event) => {
    while(taskContents.firstChild) {
        taskContents.removeChild(taskContents.firstChild);
    }
    const result = state.tasks.filter(({title}) => {
        title.toLowerCase().includes(event.target.value.toLowerCase());
    });
    result.map((card) => {
        taskContents.insertAdjacentHTML("beforeend", htmlModalContent(card));
    });
}