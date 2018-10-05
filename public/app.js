
// function to get tasks created. This function will change,
// once the real API is created. Instead of setTimeout, make 
// an AJAX call to actual API.
function getPosts(callbackFn) {
    let token = sessionStorage.Bearer;
    $.ajax({
        type: 'GET',
        url: '/posts',
        dataType: 'json',
        headers: {Authorization : `Bearer ${token}`},
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
        if (data.length === 0) {
            $('.postSection').prop('hidden', false);
        }  else {
        $('.postList').append(
            `<li><div class="card-post" data-card-post-id="${data[i]._id}"> ${data[i].text}</div></li>`
        );
    }
    // why does this select all of the posts????
    if (data[i].completed === true) {
        $('.postList').find(`.card-post[data-card-post-id=${data[i]._id}]`).addClass('completedCardPost');
    } 
// create post button to appear after login
    $('.createButtonSection').prop('hidden', false); 
    }
}

//function for dropdown menu
function dropDown() {
    $('.dropdownButton').on('click', function() {
        $('div.nav-options').prop('hidden', false);
        $('div.nav-options').toggle();
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
                //getPosts(sessionStorage.getItem('username'));
                getPosts(jwt);
                $('.usernameGreetingHeader').append(`Hello, ${user}!`);
                $('.menuOptions').prop('hidden', false);
                $('#home').hide();
            },
            error: function(request, error) {
                alert('Oops, username/password is incorrect.');
            }
        });
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
                if (request.responseJSON.location === username) {
                    alert("username already exists");
                }
            }
        })
    });
}

// redirect back to home page
function homepageRedirect() {
    $('#home').on('click', function() {
        let token = sessionStorage.Bearer;
        console.log('home button was clicked')
        $.ajax({
            type: 'POST',
            url: '/auth/refresh/',
            headers: {Authorization: `Bearer ${token}`},
            success: function(data) {
                $('.postSection').prop('hidden', false);
                $('#openPostSection').prop('hidden', true);
                $('.postList').toggle();
                //location.reload();
                sessionStorage.Bearer = data.authToken;
                //getPosts(displayPosts);
                console.log(data);
            }, 
            error: function(request, error) {
                console.log("Request: " + JSON.stringify(request));
            }
        });
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

        let token = sessionStorage.Bearer;

        let postCreated = {text: newPost};
        $.ajax({
            type: 'POST',
            url: '/posts',
            data: postCreated,
            dataType: 'json',
            headers: {Authorization: `Bearer ${token}`},
            success: function(data) {
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
    $('.postList').on('click', '.card-post', function() {
        let token = sessionStorage.Bearer;
        let clickedPost = $(this);
        let postId = clickedPost;
        postId = $(postId).data("card-post-id");
    
            //$('.imageUploadSection').prop('hidden', false);
            $.ajax({
                type: 'GET',
                url:`/posts/${postId}`,
                dataType: 'json',
                headers: {Authorization: `Bearer ${token}`},
                success: function(data) {
                    $('#openPostSection').prop('hidden', false);
                    //$('#single-post-section').append($(clickedPost));
                    $(clickedPost).clone().appendTo('#single-post-section');
                    $('.postList').toggle();
                    
                    //to add notes to single post
                    for (let i = 0; i < data.notes.length; i++) {
                    $('#noteList').append(`<li>${data.notes[i]}</li>`);
                    }
                    //add this class if post is checked off (completed)
                    if (data.completed === true) {
                        $('#openPostSection').find('.card-post').addClass('completedCardPost');
                    }

                    //hide username greeting
                    $('.usernameGreetingHeader').hide();

                    $('#home').show();
                },
                error: function(request, error) {
                    console.log("Request: " + JSON.stringify(request));
                }
            })
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
        let token = sessionStorage.Bearer;
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
            headers: {Authorization: `Bearer ${token}`},
            success: function(data) {
                $('#openPostSection').find('.card-post').html(editedPost);
                
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

function submitNoteButton(data) {
    $('.js-add-note').submit(function(event) {
        event.preventDefault();
        let token = sessionStorage.Bearer;
        let targetInput = $(event.currentTarget).find('#js-note-input');
        let newNote = targetInput.val();
        targetInput.val("");
        let postId = $('#openPostSection').find('.card-post');
        postId = $(postId).data('card-post-id');
        let postText = $('#openPostSection').find('.card-post').html();
        let updatedPost = {text: postText, id: postId, notes: newNote};
        $.ajax({
            type: 'PUT',
            url: `/posts/${postId}`,
            data: updatedPost,
            headers: {Authorization: `Bearer ${token}`},
            success: function(data) {
                $('#noteList').append(`<li id="noteListItem">${newNote}</li>`);
                $('.addNoteSection').prop('hidden', true);
                $('.notesModalBox').toggle();
            },
            error: function(request, error) {
                console.log("Request: " + JSON.stringify(request));
            }
        });
    });
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
        let token = sessionStorage.Bearer;
        let deletedPostId = $('#openPostSection').find('.card-post');
        deletedPostId = $(deletedPostId).data("card-post-id");

        $.ajax({
            type: 'DELETE',
            url: `/posts/${deletedPostId}`,
            dataType: 'json',
            headers: {Authorization: `Bearer ${token}`},
            success: function() {
                $('#openPostSection').find('.card-post').remove();
                $('#noteList').remove();
                $('#noteListSection').toggle();

                //display message to show post has been deleted
                $('.postSection').html('<div class="deletedPostMessage"><h2>Post has been deleted.</h2></div>');
            },
            error: function(request, error) {
                console.log("Request: " + JSON.stringify(request));
            }
        });
    });
}

function checkOffButton() {
    $('.checkOff').on('click', function() {
        let token = sessionStorage.Bearer;
        let postId = $('#openPostSection').find('.card-post');
        postId = $(postId).data('card-post-id');
        let postText = $('#openPostSection').find('.card-post').html();
        let updatedPost = {text: postText, id: postId, completed: true};
        console.log(updatedPost);
        $.ajax({
            type: 'PUT',
            url: `/posts/${postId}`,
            data: updatedPost,
            headers: {Authorization: `Bearer ${token}`},
            success: function() {
                if (updatedPost.completed === true) {
                postId = $('#openPostSection').find('.card-post').addClass('completedCardPost');
                }
        },
            error: function(request, error) {
                console.log("Request: " + JSON.stringify(request));
            }
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
$(homepageRedirect);
