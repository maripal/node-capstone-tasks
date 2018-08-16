// create mock data for api calls, since I haven't built the actual API
const MOCK_POST_DATA = {
    "posts" : [
        {
            "id" : "0111111",
            "text" : "Go skydiving",
            "userId": "103555",
            "date" : "08-11-18",
            "checkedOff_date" : true
        },
        {
            "id" : "0222222",
            "text" : "Travel around Europe",
            "userId": "103555",
            "date" : "08-11-18",
            "checkedOff_date" : true
        },
        {
            "id" : "0333333",
            "text" : "Get a job as a software developer",
            "userId": "103555",
            "date" : "08-11-18",
            "checkedOff_date" : true
        },
        {
            "id" : "0444444",
            "text" : "Visit the Grand Canyon",
            "userId": "103555",
            "date" : "08-11-18",
            "checkedOff_date" : false
        },
        {
            "id" : "0555555",
            "text" : "Read one book",
            "userId": "103555",
            "date" : "08-11-18",
            "checkedOff_date" : false
        }
    ]
};

// function to get tasks created. This function will change,
// once the real API is created. Instead of setTimeout, make 
// an AJAX call to actual API.
function getPosts(callbackFn) {
    setTimeout(function() {
        callbackFn(MOCK_POST_DATA)
    }, 100);
}

//function to display posts. This will not change.
function displayPosts(data) {
    for (index in data.posts) {
        $('.postList').append(
            '<li>' + data.posts[index].text + '</li>'
        );
            // if the post is checked off
            //if (data.posts[index].checkedOff_date) {
            //    $('li').css({'text-decoration': 'line-through'});
            //}
    };
    
}

function createAPost() {
    $('.create').on('click', function() {
        // open the pop up window to input a new task
        $('.createNewPostPopUp').toggle();
    });
}

// function to submit a new post to list
function submitNewPostButton() {
    $('.js-create-new-post').submit(function(event) {
        event.preventDefault();
        let targetInput = $(event.currentTarget).find('#js-new-post-input');
        let newPost = targetInput.val();
        targetInput.val("");
        console.log(newPost);
        $('.postList').append(` <li> ${newPost} </li>`);
        // to hide new post input after submitting a new post
        $('.createNewPostPopUp').toggle();
    });
}

function deleteButton() {
    $('.delete').on('click', function() {
        $(this).toggleClass('deleting');
        $('li').toggleClass('deleting');
    });
}

function deletePost() {
    $('ul').on('click', 'li', function() {
        $(this).remove();
    });
}

function getAndDisplayPosts() {
    getPosts(displayPosts);
}

$(getAndDisplayPosts);
$(createAPost);
$(submitNewPostButton);
$(deleteButton);
$(deletePost);

