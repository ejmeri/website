// magic.js
$(document).ready(function () {


    $('#btnlogin').click(function () {
        $('form').submit(function (event) {

            // get the form data
            // there are many ways to get this data using jQuery (you can use the class or id also)
            var formData = {
                'email': $('input[name=email]').val(),
                'password': $('input[name=password]').val()
            };

            // process the form
            $.ajax({
                    type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
                    url: '/login', // the url where we want to POST
                    data: formData, // our data object
                    dataType: 'json', // what type of data do we expect back from the server
                    encode: true
                })
                // using the done promise callback
                .done(function (data) {
                    // log data to the console so we can see
                    // console.log(data);
                    window.location = 'http://localhost:8080';

                    // $('#retorno').text(`User logged, ${data.user.name}`);
                    // here we will handle errors and validation messages
                }).fail(function (data) {
                    console.log(data);

                    $('#retorno').text(data.responseJSON.error || data.responseText);
                });

            // stop the form from submitting the normal way and refreshing the page
            event.preventDefault();
        });
    });

    $('#btncad').click(function () {
        // process the form
        $('form').submit(function (event) {
            // get the form data
            // there are many ways to get this data using jQuery (you can use the class or id also)
            var formData = {
                'name': $('input[name=name]').val(),
                'email': $('input[name=email]').val(),
                'password': $('input[name=password]').val()
            };

            // process the form
            $.ajax({
                    type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
                    url: 'new-user', // the url where we want to POST
                    data: formData, // our data object
                    dataType: 'json', // what type of data do we expect back from the server
                    encode: true
                })
                // using the done promise callback
                .done(function (data) {
                    // log data to the console so we can see
                    console.log(data);
                    $('#retorno').text(data.status);
                    // here we will handle errors and validation messages
                }).fail(function (data) {
                    console.log(data);
                    $('#retorno').text(data.responseJSON.error);
                });

            // stop the form from submitting the normal way and refreshing the page
            event.preventDefault();
        });

    });

    $('#btnactivity').click(function () {
        // process the form
        $('form').submit(function (event) {
            // get the form data
            // there are many ways to get this data using jQuery (you can use the class or id also)
            var formData = {
                'name': $('input[name=name]').val(),
                'description': $('textarea[name=description]').val()
            };

            // process the form
            $.ajax({
                    type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
                    url: '/activity', // the url where we want to POST
                    data: formData, // our data object
                    dataType: 'json', // what type of data do we expect back from the server
                    encode: true
                })
                // using the done promise callback
                .done(function (data) {
                    // log data to the console so we can see
                    $("#retorno").addClass("alert-success");
                    $('#retorno').text(`School supply save: ${data.status.name}`);
                    // here we will handle errors and valid ation messages
                }).fail(function (data) {
                    $('#retorno').text(data.responseJSON.error);
                });

            // stop the form from submitting the normal way and refreshing the page
            event.preventDefault();
        });
    });


    
    $('#btnupdateactivity').click(function () {
        // process the form
        $('form').submit(function (event) {
            // get the form data
            // there are many ways to get this data using jQuery (you can use the class or id also)
            const activityId = $('input[name=id]').val();

            var formData = {
                'name': $('input[name=name]').val(),
                'description': $('textarea[name=description]').val()
            };

            // process the form
            $.ajax({
                    type: 'PUT', // define the type of HTTP verb we want to use (POST for our form)
                    url: `${activityId}` , // the url where we want to POST
                    data: formData, // our data object
                    dataType: 'json', // what type of data do we expect back from the server
                    encode: true
                })
                // using the done promise callback
                .done(function (data) {
                    // log data to the console so we can see
                    // $("#retorno").addClass("alert-success");
                    // $('#retorno').text(`School supply save: ${data.status.name}`);

                    window.location = '/';
                    // here we will handle errors and valid ation messages
                }).fail(function (data) {
                    $('#retorno').text(data.responseJSON.error);
                });

            // stop the form from submitting the normal way and refreshing the page
            event.preventDefault();
        });
    });


    $('#btntask').click(function () {
        // process the form
        $('form').submit(function (event) {
            // get the form data
            // there are many ways to get this data using jQuery (you can use the class or id also)

            var formData = {
                'title': $('input[name=title]').val(),
                'weight': $('input[name=weight]').val(),
                'grade': $('input[name=grade]').val(),
                'activity_id': $('input[name=activityId]').val()
            };

            // process the form
            $.ajax({
                    type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
                    url: '/activity/tasks' , // the url where we want to POST
                    data: formData, // our data object
                    dataType: 'json', // what type of data do we expect back from the server
                    encode: true
                })
                // using the done promise callback
                .done(function (data) {
                    window.location = '/';
                }).fail(function (data) {
                    console.log(data);

                    $('#retorno').addClass('alert-danger');
                    $('#retorno').text(data.responseJSON);
                });

            // stop the form from submitting the normal way and refreshing the page
            event.preventDefault();
        });
    });

});