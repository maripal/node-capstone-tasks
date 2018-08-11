// create mock data for api calls, since I haven't built the actual API
const MOCK_TASK_DATA = {
    "tasks" : [
        {
            "id" : "0111111",
            "text" : "Go grocery shopping",
            "userId": "103555",
            "date" : "08-11-18",
            "checkedOff_date" : true
        },
        {
            "id" : "0222222",
            "text" : "Work out",
            "userId": "103555",
            "date" : "08-11-18",
            "checkedOff_date" : true
        },
        {
            "id" : "0333333",
            "text" : "Study and work on project",
            "userId": "103555",
            "date" : "08-11-18",
            "checkedOff_date" : true
        },
        {
            "id" : "0444444",
            "text" : "Cook dinner",
            "userId": "103555",
            "date" : "08-11-18",
            "checkedOff_date" : false
        },
        {
            "id" : "0555555",
            "text" : "Read at least two chapters of a book",
            "userId": "103555",
            "date" : "08-11-18",
            "checkedOff_date" : false
        }
    ]
};

// function to get tasks created. This function will change,
// once the real API is created. Instead of setTimeout, make 
// an AJAX call to actual API.
function getTasks(callbackFn) {
    setTimeout(function() {
        callbackFn(MOCK_TASK_DATA)
    }, 100);
}

//function to display tasks. This will not change.
function displayTasks(data) {
    for (index in data.tasks) {
        $('.taskList').append(
            '<li>' + data.tasks[index].text + '</li>'
        );
            // if the task is checked off
            //if (data.tasks[index].checkedOff_date) {
            //    $('li').css({'text-decoration': 'line-through'});
            //}
    };
    
}

function createATask() {
    $('.create').on('click', function() {
        // open the pop up window to input a new task
        $('.createNewTaskPopUp').toggle();
    });
}

// function to submit a new task to list
function submitNewTaskButton() {
    $('.js-create-new-task').submit(function(event) {
        event.preventDefault();
        let targetInput = $(event.currentTarget).find('#js-new-task-input');
        let newTask = targetInput.val();
        targetInput.val("");
        console.log(newTask);
        $('.taskList').append(` <li> ${newTask} </li>`);
        // to hide new task input after submitting a new task
        $('.createNewTaskPopUp').toggle();
    });
}

//function deleteTask(data) {
//    for (index in data.tasks) {
//        if (data.tasks[index].id !== "0111111") {
//        $('.deletedTask').append(
//            '<p>' + data.tasks[index].text + '</p>'
//        );
//    }
//    };
//}

function getAndDisplayTasks() {
    getTasks(displayTasks);
    //getTasks(deleteTask);
}

$(getAndDisplayTasks);
$(createATask);
$(submitNewTaskButton);
//$(deleteTask);

