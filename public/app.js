
// function to get tasks created. This function will change,
// once the real API is created. Instead of setTimeout, make 
// an AJAX call to actual API.
function getPosts(callbackFn) {
    $.ajax({
        type: 'GET',
        url: '/posts',
        dataType: 'json',
        success: function(data) {
            displayPosts(data);
        },
        error: function(request, error) {
            console.log("Request: " + JSON.stringify(request));
        }   
    });
}

//function to display posts. This will not change.
function displayPosts(data) {
    for (let i = 0; i < data.length; i++) {
        $('.postList').append(
            '<li><div class="card-post">' + data[i].text + '</div></li>'
        );
    }
}

//function to open login form
function openLoginForm() {
    $('#landing-login-button').on('click', function() {
        $('.loginFormSection').prop('hidden', false);
        $('.landingPageSection').toggle();
    })
}

//function to login
function submitLogin() {
    $('.login-form').submit(function(event) {
        event.preventDefault();
        let userTarget = $(event.currentTarget).find('#username');
        let user = userTarget.val();
        let passTarget = $(event.currentTarget).find('#user-password');
        let password = passTarget.val();
        retrieveUser(user, password);
        $('.login-section').html(`
        <div class="successfulLoginGreeting> Hello ${user}. You are now logged in.</div>`);
        $('.loginFormSection').toggle();
        // create post button to appear after loggin in
    $('.createButtonSection').prop('hidden', false); 
    });
}

//function to retrieve user profile
function retrieveUser(user, password) {
    const userLogin = {username: user, password: password};

    $.ajax({
        type: 'POST',
        url: '/login',
        data: userLogin,
        contentType: 'application/json',
        success: function() {
            let currentUser = parseJwt(res.authToken).sub;
            displayPosts(currentUser);
        },
        error: function(request, error) {
            console.log("Request: " + JSON.stringify(request));
        }
    });
}

// function to open sign up form
function openSignUpForm() {
    $('#landing-signup-button').on('click', function() {
        $('.signupFormSection').prop('hidden', false);
        $('.landingPageSection').toggle();
    })
}

//function to sign up
function submitSignUp() {
    $('.signup-form').submit(function(event) {
        event.preventDefault();
        let firstnameTarget = $(event.currentTarget).find('#user-firstname');
        let firstname = firstnameTarget.val();
        let lastnameTarget = $(event.currentTarget).find('#user-lastname');
        let lastname = lastnameTarget.val();
        let usernameTarget = $(event.currentTarget).find('#user-username');
        let username = usernameTarget.val();
        let passwordTarget = $(event.currentTarget).find('#user-pass');
        let password = passwordTarget.val();
        
        $('.signup-section').html(`<div class="signupGreeting">Welcome!</div>`);
        setTimeout(function() {
            $('.signup-section').dialog('close');
        }, 5000);
    });
}

function createAPost() {
    $('.create').on('click', function() {
        // open the pop up window to input a new task
        $('.postModalBox').toggle();
        $('.createNewPostPopUp').toggle();
    });
}

// function to submit a new post to list w/ ajax call
function submitNewPostButton(data) {
    $('.js-create-new-post').submit(function(event) {
        event.preventDefault();
        let targetInput = $(event.currentTarget).find('#js-new-post-input');
        let newPost = targetInput.val();
        targetInput.val("");

        let postCreated = {text: newPost};
        $.ajax({
            type: 'POST',
            url: '/posts',
            data: postCreated,
            dataType: 'json',
            success: function() {
                $('.postList').append(`<li><div class="card-post"> ${newPost} </div></li>`);
            },
            error: function(request, error) {
                console.log("Request: " + JSON.stringify(request));
            }
        });
        
        // to hide new post input after submitting a new post
        $('.postModalBox').toggle();
        $('.createNewPostPopUp').toggle();
    });
}

//open single post that was clicked on
function openSinglePost() {
    $('.postList').on('click', 'li', function() {
        let clickedPost = $(this);
            $('#openPostSection').prop('hidden', false);
            $('#single-post-section').append($(clickedPost));
            $('.postList').toggle(); 
    });
}

//function to open post to edit it
function editPost() {
    $('.update').on('click', function() {
        $('.editPostModalBox').toggle();
        $('.editPopUp').toggle();
    });
}

//function to submit update post w/ ajax call
function updatedPostSubmit() {
    $('.editPostForm').submit(function(event) {
        event.preventDefault();
        let targetInput = $(event.currentTarget).find('#js-edit-post');
        let editedPost = targetInput.val();
        targetInput.val("");

        let updatedPost = {text: editedPost, id: editedPost.id};
        console.log(editedPost);
        $.ajax({
            type: 'PUT',
            url: `/posts/${editedPost}`,
            data: JSON.stringify(updatedPost),
            headers: {'ContentType': 'application/json'},
            success: function() {
                $('.cardPost').append($(editedPost));
            },
            error: function( request, error) {
                console.log("Request: " + JSON.stringify(request));
            }
        });

        $('.editPostModalBox').toggle();
        $('.editPopUp').toggle();
    });
}

// when you click 'post-addNote' open note modal
function addANote() {
    $('.postAddNote').on('click', function() {
        $('.addNoteSection').prop('hidden', false);
        $('.notesModalBox').toggle();
    });
}

function submitNoteButton() {
    $('.js-add-note').submit(function(event) {
        event.preventDefault();
        let targetInput = $(event.currentTarget).find('#js-note-input');
        let newNote = targetInput.val();
        targetInput.val("");
        $('#noteList').append(`<li>${newNote}</li>`);
        $('.addNoteSection').prop('hidden', true);
        $('.notesModalBox').toggle();
    })
}

// function to make delete button work
function deleteButton() {
    $('.delete').on('click', function() {
        $(this).toggleClass('deleting');
        $('li').toggleClass('deleting');

        // this event handler removes list item clicked on

        $.ajax({
            type: 'DELETE',
            url: '/posts/:id',
            dataType: 'json',
            success: function() {
                $('ul').on('click', 'li', function() {
                    $(this).remove();
                    $('ul').unbind();
                });
            },
            error: function(request, error) {
                console.log("Request: " + JSON.stringify(request));
            }
        });
    });
}

// function to make check-off button work
function checkOffButton() {
    $('.checkOff').on('click', function() {
        $('li').on('click', function() {
            $(this).remove();
        });
    });
}

function getAndDisplayPosts() {
    getPosts(displayPosts);
}

$(getAndDisplayPosts);
$(createAPost);
$(submitNewPostButton);
$(deleteButton);
$(checkOffButton);
$(addANote);
$(submitNoteButton);
$(openSinglePost);
$(editPost);
$(updatedPostSubmit);
$(openLoginForm);
$(submitLogin);
$(openSignUpForm);
