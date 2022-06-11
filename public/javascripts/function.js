function test(test){
    $.ajax({
        url: "/test",
        type: 'GET',
        data: 'test=' + test,
        success: function(data) {
            console.log("data envoyé");
        },
        error: function(err, Status){
            console.log("Status", Status);
            console.log("ERR", err);
        }
    });
}