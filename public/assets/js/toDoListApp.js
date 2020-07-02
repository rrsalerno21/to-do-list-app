$(document).ready(() => {

    // Alter color of date due's if the task is active and past due
    alterDueDateColors();

    // Alter Modal Content based on Add or Edit
    $('#taskModal').on('show.bs.modal', function (event) {
        // define which button is being clicked and the type of modal we're opening
        let button = $(event.relatedTarget);
        let type = button.data('whatever');
        let modal = $(this);

        // if we're adding a task
        if (type === 'ADD') {
            // Update the modal's header and button text
            modal.find('.modal-title').text('ADD A TASK');
            $('#modal-act-button')
                .text('Add Task')
                .attr('data-method', 'ADD');

            // autoset the date input with today's time
            let today = getTodaysDate().fullDate;
            $(".task-due-date").val(today)
        
        // if we're editing a task
        } else if (type === 'EDIT') {
            // grab the taskID stored in the button
            var taskID = button.data('taskid');
            
            // Update the modal's header and button text
            modal.find('.modal-title').text('EDIT TASK');
            $('#modal-act-button')
                .text('Edit Task')
                .attr('data-method', 'EDIT')
                .attr('data-id', taskID);

            // Run a get to get that ID's info
            $.get(`/api/find/${taskID}`, todo => {
                // Grab the first part of the API result's due_date (YYYY-MM-DD)
                let dateFormat = todo[0].due_date.split('T')[0];

                // Auto set the values of the modal based on the API result
                modal.find('.task-name').val(todo[0].task_header);
                modal.find('.task-body').val(todo[0].task_details);
                modal.find('.task-due-date').val(dateFormat);

                // Select the status radio button based on the API result
                if (todo[0].status) {
                    $('.status-complete').click();
                } else {
                    $('.status-incomplete').click();
                }
            }).catch(() => {
                throw new Error('Sorry, something went wrong with loading that to do...');
            })
        }
    });

    // Add or edit a task
    $('#modal-act-button').on('click', function (event) {
        // validate inputs on submit
        if (validateInputs())
            return;
        
        // Define the modal-act-button
        var button = $('#modal-act-button');

        // Determine if we're adding or editing
        // Not sure why, but doing a jquery button.data('method') here locks in the initial value after first click
        var method = button[0].dataset.method

        // Figure out the status of the task
        let taskStatus;
        if ($('.status-incomplete').is(':checked')) {
            taskStatus = false;
        } else if ($('.status-complete').is(':checked')) {
            taskStatus = true
        }

        // if adding
        if (method === 'ADD') {
            // create the new task as an object
            const newTask = {
                task_header: $(".task-name").val().trim(),
                task_details: $(".task-body").val().trim(),
                status: taskStatus,
                folder: 'Standard',
                due_date: $(".task-due-date").val()
            }

            // do a post to the server and then reload the page
            $.post('/api/new', newTask)
                .then(() => location.reload())
                .catch(() => alert('Something went wrong when trying to post'));

        // if we're editing
        } else if (method === 'EDIT') {
            // create a new object to edit that includes the id
            const editedTask = {
                id: button.data('id'),
                task_header: $(".task-name").val().trim(),
                task_details: $(".task-body").val().trim(),
                status: taskStatus,
                folder: 'Standard',
                due_date: $(".task-due-date").val()
            }

            // make a put request, then reload the page
            $.ajax({
                url: '/api/edit',
                method: 'PUT',
                data: editedTask
            }).then(() => {
                console.log('updated task successfully')
                location.reload();
            }).catch((err) => {
                alert('Something went wrong when trying to update this task')
                console.log(err)
            })
        }

        // finally, clear input values
        clearInputs();
    });

    // Delete a task
    $('.delete-task-btn').on('click', function (event) {
        // Define the task id from the delete button selected
        let id = $(this).data('taskid');

        // Make a delete request, then reload the page
        $.ajax({
            url: '/api/delete/' + id,
            method: 'DELETE'
        }).then(() => {
            console.log('Successfully deleted object')
            location.reload();
        }).catch((err) => {
            console.log(err)
            alert('Something went wrong when trying to delete this task')
        })
    });

    // Mark task as complete
    $('.complete-task-btn').on('click', function (event) {
        // Define taskID based on button clicked
        let taskID = $(this).data('taskid');

        // Create object to pass on request
        let editedTask = {
            id: taskID,
            status: true
        }

        // Make a put request, then reload the page
        $.ajax({
            url: '/api/edit-status',
            method: 'PUT',
            data: editedTask
        }).then(() => {
            console.log('status update successful');
            location.reload();
        }).catch((err) => {
            console.log(err)
            alert('Something went wrong when trying to mark this task as complete')
        })
    })

    // Mark a task as incomplete
    $('.undo-task-btn').on('click', function (event) {
        // Define taskID based on button clicked
        let taskID = $(this).data('taskid');

        // Create object to pass on request
        let editedTask = {
            id: taskID,
            status: false
        }

        // Make a put request, then reload the page
        $.ajax({
            url: '/api/edit-status',
            method: 'PUT',
            data: editedTask
        }).then(() => {
            console.log('status update successful');
            location.reload();
        }).catch((err) => {
            console.log(err)
            alert('Something went wrong when trying to mark this task as incomplete')
        })
    })

    // Clear all tasks
    $('#clear-all-btn').on('click', function (event) {
        // First, confirm the user wants to delete everything
        let areYouSure = confirm('Are you sure you want to delete all of your tasks?');

        // If yes,
        if (areYouSure) {
            // Make a delete request, then reload the page
            $.ajax({
                url: '/api/delete-all',
                method: 'DELETE'
            }).then(() => {
                console.log('All items successfully deleted')
                location.reload();
            }).catch((err) => {
                console.log(err)
                alert('Something went wrong when trying to delete all of your tasks')
            })
        // Otherwise, return
        } else {
            return;
        }
    })

    //=============================
    // Helper functions
    // ============================
    
    // Function to get today's full date, including date, month, and full year
    function getTodaysDate() {
        // Define a new Date object, then get the date, month, and full year
        let time = new Date(),
            date = time.getDate(),
            month = time.getMonth() + 1,
            year = time.getFullYear();

        // Format month to include a 0 if less than 10 (01, 02, ..., 09, 10, 11...)
        if (month < 10) {
            month = '0' + month;
        }

        // Do the same for date as we did for month
        if (date < 10) {
            date = '0' + date;
        }

        // Return an object with all the details we want
        return {
            'fullDate': `${year}-${month}-${date}`,
            'date': date,
            'month': month,
            'year': year
        }
    }

    // function to alter the color of the due date if past due
    function alterDueDateColors() {
        // Select all due dates currently displayed, then run a cb fn to affect each of their font color
        $('.display-due-date').css('color', function () {
            // Check the task's status so we only apply our code to active tasks
            if (!$(this).data('status')) {
                // Define the item's date, along with the user's current date
                let itemToday = ($(this).data('date')),
                    // Split the string to isolate the date, month, and year
                    itemSplit = itemToday.split('-'),
                    // itemDate needs a second split to isolate itself
                    itemDate = parseInt(itemSplit[2].split('T')[0]),
                    itemMonth = parseInt(itemSplit[1]),
                    itemYear = parseInt(itemSplit[0]),
                    curDate = parseInt(getTodaysDate().date),
                    curMonth = parseInt(getTodaysDate().month),
                    curYear = parseInt(getTodaysDate().year);

                // Run conditionals and return the color red if true
                if (itemYear < curYear) {
                    return '#dc3545' // red
                } else if (itemMonth < curMonth || ((itemMonth === curMonth) && itemDate < curDate)) {
                    return '#dc3545' // red
                }
            }
        })
    }

    // Function to validate user inputs
    function validateInputs() {
        // Grab the user's inputs and define acceptable input criteria for text and date formats
        const taskName = $(".task-name").val().trim(),
            taskBody = $(".task-body").val().trim(),
            taskDate = $(".task-due-date").val(),
            acceptableCharacters = /[^A-Za-z0-9 .'?!,@$#\-_\n\r]/,
            acceptableDatePattern = /^\d{4}\-\d{1,2}\-\d{1,2}$/

        // If empty string in task header, alert message, clear inputs, focus on task name, and return true
        if (taskName === '') {
            alert('Please include at least a task name');
            clearInputs();
            $(".task-name").focus();
            return true
        // If invalid characters in task header, alert message, clear inputs, focus on task name, and return true
        } else if ((acceptableCharacters.test(taskName))) {
            alert(`Invalid characters included it your task name. \n (Only accepts alphanumeric and .'?!,@$#-_ characters)`)
            clearInputs();
            
        // If invalid characters in task body, alert message, clear inputs, focus on task name, and return true
        } else if (acceptableCharacters.test(taskBody)) {
            alert(`Invalid characters included it your task details. \n (Only accepts alphanumeric and .'?!,@$#-_ characters)`)
            clearInputs();

            return true
        // If ever invalid date format, alert message,
        } else if (!acceptableDatePattern.test(taskDate)) {
            alert('Date format is invalid. \n (Only accepts YYYY-MM-DD)');

            return true
        }
        
        return false;
    }

    function clearInputs() {
        $(".task-name").empty();
        $(".task-body").empty();
    }
})
