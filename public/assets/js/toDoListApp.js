$(document).ready(() => {

    // Alter Modal based on Add or Edit
    $('#taskModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        var type = button.data('whatever');
        var modal = $(this);

        
        if (type === 'ADD') {
            modal.find('.modal-title').text('ADD A TASK');
            $('#modal-act-button')
                .text('Add Task')
                .attr('data-method', 'ADD');
            
            // set today's time
            $(".task-due-date").val('2020-07-01')
        } else if (type === 'EDIT') {
            console.log('query time');
            modal.find('.modal-title').text('EDIT TASK');
            var taskID = button.data('taskid');
            
            $('#modal-act-button')
                .text('Edit Task')
                .attr('data-method', 'EDIT')
                .attr('data-id', taskID);
    
            $.get(`/api/find/${taskID}`, todo => {
                console.log(todo[0].due_date);
                let dateFormat = todo[0].due_date.split('T')[0];
                
                modal.find('.task-name').val(todo[0].task_header);
                modal.find('.task-body').val(todo[0].task_details);
                modal.find('.task-due-date').val(dateFormat);
                
                if (todo[0].status) {
                    $('.status-complete').click();
                } else {
                    $('.status-incomplete').click();
                }
            })
        }
    });
    
    // Add or edit a task
    $('#modal-act-button').on('click', function(event) {
        var button = $('#modal-act-button');
    
        // determine if we're adding or editing
        //not sure why, but doing a jquery button.data('method') here locks in the initial value after first click
        var method = button[0].dataset.method
        
        // figure out the status of the task
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
    
            // do a post to the server and then render the page
            $.post('/api/new', newTask)
                .then(() => location.reload());
    
            
        } else if (method === 'EDIT') {
            // edit the post
            const editedTask = {
                id: $('#modal-act-button').data('id'),
                task_header: $(".task-name").val().trim(),
                task_details: $(".task-body").val().trim(),
                status: taskStatus,
                folder: 'Standard',
                due_date: $(".task-due-date").val()
            }
    
            // make a put request
            $.ajax({
                url: '/api/edit',
                method: 'PUT',
                data: editedTask
            }).then(() => {
                console.log('updated task successfully')
                location.reload();
            });
        }
    
        // clear input values
        $('.task-name').val('');
        $('.task-body').val('');
    
    });
    
    // Delete a task
    $('.delete-task-btn').on('click', function(event) {
        console.log('you clicked me');
        let id = $(this).data('taskid');
        $.ajax({
            url: '/api/delete/' + id,
            method: 'DELETE'
        }).then(() => {
            console.log('Successfully deleted object')
            location.reload();
        })
    });
    
    // mark task as complete
    $('.complete-task-btn').on('click', function(event) {
        let taskID = $(this).data('taskid');
    
        let editedTask = {
            id: taskID,
            status: true
        }
    
        $.ajax({
            url: '/api/edit-status',
            method: 'PUT',
            data: editedTask
        }).then(() => {
            console.log('status update successful');
            location.reload();
        })
    })
    
    // mark a task as incomplete
    $('.undo-task-btn').on('click', function(event) {
        let taskID = $(this).data('taskid');
    
        let editedTask = {
            id: taskID,
            status: false
        }
    
        $.ajax({
            url: '/api/edit-status',
            method: 'PUT',
            data: editedTask
        }).then(() => {
            console.log('status update successful');
            location.reload();
        })
    })
    
    // clear all tasks
    $('#clear-all-btn').on('click', function(event) {
        let areYouSure = confirm('Are you sure you want to delete all of your tasks?');
    
        if (areYouSure) {
            $.ajax({
                url: '/api/delete-all',
                method: 'DELETE'
            }).then(() => {
                console.log('All items successfully deleted')
                location.reload();
            })
        } else {
            return;
        }
    })
})
