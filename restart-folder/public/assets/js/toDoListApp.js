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

    } else if (type === 'EDIT') {
        console.log('query time');
        modal.find('.modal-title').text('EDIT TASK');
        var taskID = button.data('taskid');
        
        $('#modal-act-button')
            .text('Edit Task')
            .attr('data-method', 'EDIT');

        $.get(`/api/find/${taskID}`, todo => {
            
            modal.find('.task-name').val(todo[0].task_header);
            modal.find('.task-body').val(todo[0].task_details);
            
            if (todo[0].status) {
                $('.status-complete').click();
            } else {
                $('.status-incomplete').click();
            }
        })
    }
});

// $('.delete-task-btn').on('click', function(event) {
//     console.log('you clicked me');
//     console.log(event.relatedTarget)
//     $.ajax({
//         url: '/api/delete/' + id,
//         method: 'DELETE'
//     }).then(data => {
//         console.log(data)
//     })
// })

