
// function to get tasks created. This function will change,
// once the real API is created. Instead of setTimeout, make 
// an AJAX call to actual API.
function getPosts(callbackFn) {
    //let token = localStorage.getItem('authToken');
    //console.log(token);
    $.ajax({
        type: 'GET',
        url: '/posts',
        dataType: 'json',
        //headers: {Authorization : `Bearer ${token}`},
        success: function(data) {
            displayPosts(data);
            $('.postSection').prop('hidden', false);
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
            `<li><div class="card-post" data-card-post-id="${data[i]._id}"> ${data[i].text}</div></li>`
        );
    }
// create post button to appear after login
    $('.createButtonSection').prop('hidden', false); 

}

//function for dropdown menu
function dropDown() {
    $('.dropdownButton').on('click', function() {
        $('div.nav-options').prop('hidden', false);
        $('div.nav-options a').toggle();
    })
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
        
        const userLogin = {username: user, password: password};

        $.ajax({
            method: 'POST',
            url: '/auth/login',
            data: JSON.stringify(userLogin),
            dataType: 'json',
            contentType: 'application/json',
            success: function(data) {
                let jwt = data.authToken;
                sessionStorage.setItem('Bearer', jwt);
                $('.loginFormSection').prop('hidden', true);
                getPosts(sessionStorage.getItem('username'));
                $('.menuOptions').prop('hidden', false);
            },
            error: function(request, error) {
                console.log("Request: " + JSON.stringify(request));
            }
        });
        // create post button to appear after loggin in
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

        let signUpInfo = {username: username, password: password, firstName: firstname, lastName: lastname};

        $.ajax({
            method: 'POST', 
            url: '/users',
            dataType: 'json',
            data: signUpInfo,
            success: function() {
                //localStorage.setItem('authToken', response.token);
                //window.initialToken = response.token;
                
                $('.signup-section').html('<div class="signupGreeting">Welcome!</div>');
            },
            error: function(request, error) {
                console.log("Request: " + JSON.stringify(request));
            }
        })
    });
}

function createAPost() {
    $('.create').on('click', function() {
        // open the pop up window to input a new task
        $('.createPostSection').prop('hidden', false);
        $('.postModalBox').toggle();
        $('.createNewPostPopUp').toggle();
    });

    // close window if you don't want to create a post
    $('.closeWindow').on('click', function() {
        $('.createPostSection').prop('hidden', true);
        $('.postModalBox').toggle();
        $('.createNewPostPopUp').toggle();
    })
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
        console.log(clickedPost);
            $('#openPostSection').prop('hidden', false);
            $('#single-post-section').append($(clickedPost));
            $('.postList').toggle();
            $('.imageUploadSection').prop('hidden', false);
    });
}

//function to open post to edit it
function editPost() {
    $('.postList').on('click', 'li', function() {
        $('.update').on('click', function() {
            $('.editPostModalBox').toggle();
            $('.editPopUp').toggle();
        });
    });

    $('.closeEditWindow').on('click', function() {
        $('.editPostModalBox').toggle();
        $('.editPopUp').toggle();
    })
}

//function to submit update post w/ ajax call
function updatedPostSubmit() {
    $('.editPostForm').submit(function(event) {
        event.preventDefault();
        let targetInput = $(event.currentTarget).find('#js-edit-post');
        console.log(event.currentTarget);
        let editedPost = targetInput.val();
        targetInput.val("");
        let postId = $('#openPostSection').find('.card-post');
        postId = $(postId).data("card-post-id");
        let updatedPost = {text: editedPost, id: postId};
        console.log(editedPost);
        console.log(postId);
        $.ajax({
            type: 'PUT',
            url: `/posts/${postId}`,
            data: updatedPost,
            success: function(data) {
                $('#openPostSection').find('.card-post').html(editedPost);
                submitNoteButton(data);
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

    $('.closeNoteWindow').on('click', function() {
        $('.addNoteSection').prop('hidden', true);
        $('.notesModalBox').toggle();
    })
}

function submitNoteButton() {
    $('.js-add-note').submit(function(event) {
        event.preventDefault();
        let targetInput = $(event.currentTarget).find('#js-note-input');
        let newNote = targetInput.val();
        targetInput.val("");
        $('#noteList').append(`<li id="noteListItem">${newNote}</li>`);
        $('.addNoteSection').prop('hidden', true);
        $('.notesModalBox').toggle();
    })
}

//function to add image to a single post
//$('.js-image-upload-form').submit(function(event) {
//    event.preventDefault();
    
//})

// function to make delete button work
function deleteButton() {
    $('.delete').on('click', function() {
        //$(this).toggleClass('deleting');
        //$('li').toggleClass('deleting');
        let deletedPostId = $('#openPostSection').find('.card-post');
        deletedPostId = $(deletedPostId).data("card-post-id");

        $.ajax({
            type: 'DELETE',
            url: `/posts/${deletedPostId}`,
            dataType: 'json',
            success: function() {
                $('#openPostSection').find('.card-post').remove();
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

function logOutButton() {
    $('#logout').on('click', function() {
        event.preventDefault();
        console.log('logout button clicked');
        sessionStorage.setItem('Bearer', "");
        sessionStorage.setItem('user', "");
        sessionStorage.clear();
        location.reload();
    })
}

//function getAndDisplayPosts() {
//    getPosts(displayPosts);
//}

//$(getAndDisplayPosts);
$(dropDown);
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
$(submitSignUp);
$(logOutButton);
