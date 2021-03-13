(function(glob, document){
    'use strict'
    const TASKS_KEY = "tasks"

    class TaskManager {
        
        constructor(){
            this.tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || []
        }

        get getTasks(){
            return this.tasks
        }

        addTask(task){
            let id = this.tasks.length <= 0 ? 0 : this.tasks[this.tasks.length-1].id + 1 
            this.tasks.push({id, task})
        }

        removeTask(taskID){
            this.tasks = this.tasks.filter((task) => task.id != taskID)
        }

        updateTask(newTask){
            let targetTask = this.tasks.find((task) => task.id == newTask.id) 
            targetTask.task = newTask.task
        }
    }

    const taskManager = new TaskManager()

    let btnAdd = document.getElementById("btnAdd")
    let formContainer = document.getElementById("form-container")
    let btnClosePopup = document.getElementById("btnClosePopup")
    let btnSubmit = document.getElementById("btnSubmit")
    let txtTaskName = document.getElementById("ipTaskName")
    let hdfTask = document.getElementById("hdfTask")
    let tBody = document.getElementById("tbody")

    function validate(taskName){
        return taskName.trim() !== "" && taskName !== undefined && taskName !== null
    }

    function handleSubmit(){
        const taskName = txtTaskName.value
        if(!validate(taskName)){ 
            alert("Task must be filled")
            return
        }
        
        if(hdfTask.value !== null && hdfTask.value !== undefined && hdfTask.value !== ""){
            taskManager.updateTask({task: txtTaskName.value, id: JSON.parse(hdfTask.value).id})
        }else{
            taskManager.addTask(taskName)
        }

        localStorage.setItem(TASKS_KEY, JSON.stringify(taskManager.getTasks))
        populateTable()
        btnClosePopup.click()
    }

    function populateTable(){
        resetTable()
        const tasks = JSON.parse(localStorage.getItem(TASKS_KEY)) || []
        if(tasks.length <= 0){
            var newRow = tBody.insertRow(tBody.rows.length)
            newRow.innerHTML = `<tr><td colspan="3" style="text-align: center">NO DATA</td></tr>`
            return 
        }
        
        let count = 0
        tasks.forEach(task => {
            let newRow = tBody.insertRow(tBody.rows.length)
            newRow.innerHTML = `<tr>
            <td>${++count}</td>
            <td>${task.task}</td>
            <td>
                <button class="btn btn-primary" id="btnEdit-${task.id}">EDIT</button>
                <button class="btn btn-danger" id="btnDelete-${task.id}">DELETE</button>
            </td>
            </tr>`
        });
    }

    function deleteTask(id){
        taskManager.removeTask(id)
        localStorage.setItem(TASKS_KEY, JSON.stringify(taskManager.getTasks))
        populateTable()
    }

    function editTask(id){
        hdfTask.value = JSON.stringify(taskManager.getTasks.find((task) => task.id == id))
        btnAdd.click()
    }

    function resetForm(){
        txtTaskName.value = ""
    }

    function resetTable(){
        tBody.innerHTML = ""
    }

    function init(){
        populateTable()
    }

    init()

    btnAdd.addEventListener('click', function(){
        formContainer.style.display = 'block'
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        setTimeout(() => {
            formContainer.style.transform = 'translateY(0)'
            document.body.style.overflow = 'hidden';
        }, 100);

        if(hdfTask.value !== "" && hdfTask.value !== undefined && hdfTask.value !== null){
            txtTaskName.value = JSON.parse(hdfTask.value).task
            btnSubmit.innerHTML = "EDIT TASK"
        } else {
            btnSubmit.innerHTML = "ADD TASK"
        }
    })

    btnClosePopup.addEventListener('click', function(e){
        e.preventDefault()
        resetForm()
        formContainer.style.transform = 'translateY(100vh)'
        setTimeout(() => {
            formContainer.style.display = 'none'
            document.body.style.overflow = 'scroll';
        }, 100)
        hdfTask.value = ""
    })

    btnSubmit.addEventListener('click', function(e){
        e.preventDefault()
        handleSubmit()
    })

    document.addEventListener('click', function(e){
        if(e.target && e.target.id.match("^btnEdit")){
            let targetID = e.target.id.split('-')[1]
            editTask(targetID)
        }

        if(e.target && e.target.id.match("^btnDelete")){
            let targetID = e.target.id.split('-')[1]
            deleteTask(targetID)
        }
    })
})(window, document)    