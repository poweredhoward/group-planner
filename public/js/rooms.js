$(document).ready(function() {
    /* global moment */
  
    // blogContainer holds all of our posts
    var partyContainer = $(".party-container");
   // var postCategorySelect = $("#category");
    // Click events for the edit and delete buttons
    $(document).on("click", "button.delete", handlePostDelete);
    $(document).on("click", "button.edit", handlePostEdit);
    // Variable to hold our posts
    var rooms;
  
    // The code below handles the case where we want to get blog posts for a specific author
    // Looks for a query param in the url for author_id 
    // ??? CHANGE authorId to UserId and getPosts to getRooms for API route referencing or do we 
    // already have that?
    var url = window.location.search;
    var authorId;
    if (url.indexOf("?author_id=") !== -1) {
      authorId = url.split("=")[1];
      getPosts(authorId);
    }
    // If there's no authorId we just get all posts as usual
    else {
      getPosts();
    }
  
  
    // This function grabs posts from the database and updates the view
    function getPosts(author) {
      authorId = author || "";
      if (authorId) {
        authorId = "/?author_id=" + authorId;
      }
      $.get("/api/posts" + authorId, function(data) {
        console.log("Posts", data);
        posts = data;
        if (!posts || !posts.length) {
          displayEmpty(author);
        }
        else {
          initializeRows();
        }
      });
    }
  
    // This function does an API call to delete posts
    function deletePost(id) {
      $.ajax({
        method: "DELETE",
        url: "/api/posts/" + id
      })
        .then(function() {
          getPosts(postCategorySelect.val());
        });
    }
  
    // InitializeRows handles appending all of our constructed post HTML inside blogContainer
    function initializeRows() {
      roomContainer.empty();
      var roomsToAdd = [];
      for (var i = 0; i < rooms.length; i++) {
        roomsToAdd.push(createNewRow(rooms[i]));
      }
      roomContainer.append(roomsToAdd);
    }
  
    // This function constructs a post's HTML
    function createNewRow(room) {
      var formattedDate = new Date(post.createdAt);
      formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
      var newRoomCard = $("<div>");
      newRoomCard.addClass("room");
      var newRoomCardHeading = $("<div>");
      newRoomCardHeading.addClass("room-header");
      var deleteBtn = $("<button>");
      deleteBtn.text("party Pooper");
      deleteBtn.addClass("delete btn btn-danger");
      var editBtn = $("<button>");
      editBtn.text("CHANG OF PLANS");
      editBtn.addClass("edit btn btn-info");
      var newRoomTitle = $("<h2>");
      var newRoomDate = $("<small>");
      var newRoomUser = $("<h5>");
      newRoomUser.text("Started by: " + room.User.name);
      newRoomUser.css({
        float: "right",
        color: "blue",
        "margin-top":
        "-10px"
      });
      var newRoomCardBody = $("<div>");
      newRoomCardBody.addClass("card-body");
      var newRoomBody = $("<p>");
      newRoomName.text(room.name + " ");
      newRoomBody.text(Room.body);
      newRoomDate.text(formattedDate);
      newRoomTitle.append(newRoomDate);
      newRoomCardHeading.append(deleteBtn);
      newRoomCardHeading.append(editBtn);
      newRoomCardHeading.append(newRoomTitle);
      newRoomCardHeading.append(newRoomAuthor);
      newRoomCardBody.append(newRoomBody);
      newRoomCard.append(newRoomCardHeading);
      newRoomCard.append(newRoomCardBody);
      newRoomCard.data("Room", Room);
      return newRoomCard;
    }
  
    // This function figures out which post we want to delete and then calls deletePost
    function handleRoomDelete() {
      var currentPost = $(this)
        .parent()
        .parent()
        .data("post");
      deleteRoom(currentRoom.id);
    }
  
    // This function figures out which post we want to edit and takes it to the appropriate url
    function handlePostEdit() {
      var currentPost = $(this)
        .parent()
        .parent()
        .data("post");
      window.location.href = "/cms?post_id=" + currentPost.id;
    }
  
    // This function displays a message when there are no posts
    function displayEmpty(id) {
      var query = window.location.search;
      var partial = "";
      if (id) {
        partial = " for Author #" + id;
      }
      blogContainer.empty();
      var messageH2 = $("<h2>");
      messageH2.css({ "text-align": "center", "margin-top": "50px" });
      messageH2.html("No posts yet" + partial + ", navigate <a href='/cms" + query +
      "'>here</a> in order to get started.");
      blogContainer.append(messageH2);
    }
  
  });
  