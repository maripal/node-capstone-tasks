// create mock data for api calls, since I haven't built the actual API
const MOCK_TASK_DATA = {
    "tasks" : [
        {
            "id" : "0111111",
            "text" : "Go grocery shopping",
            "userId": "103555",
            "date" : "08-11-18"
        },
        {
            "id" : "0222222",
            "text" : "Work out",
            "userId": "103555",
            "date" : "08-11-18"
        },
        {
            "id" : "0333333",
            "text" : "Study and work on project",
            "userId": "103555",
            "date" : "08-11-18"
        },
        {
            "id" : "0444444",
            "text" : "Cook dinner",
            "userId": "103555",
            "date" : "08-11-18"
        },
        {
            "id" : "0555555",
            "text" : "Read at least two chapters of a book",
            "userId": "103555",
            "date" : "08-11-18"
        }
    ]
};

// function to get tasks created. This function will change,
// once the real API is created. Instead of setTimeout, make 
// an AJAX call to actual API.
function getCreatedTasks(callbackFn) {
    setTimeout(function() {
        callbackFn(MOCK_TASK_DATA)
    }, 100);
}

//function to display tasks. This will not change.
function displayTasks(data) {
    for (index in data.tasks) {
        $('.tasksListSection').append(
            '<p>' + data.tasks[index].text + '</p>'
        );
    };
}

function getAndDisplayTasks() {
    getCreatedTasks(displayTasks);
}

$(getAndDisplayTasks);

