var inp = document.createElement("input");
inp.setAttribute("type", "file")
inp.setAttribute("accept", "text/plain");


function handleFileSelect(evt, callback) {
    var files = evt.target.files; // FileList object
    var f = files[0];

    var reader = new FileReader();
    reader.onload = (function(e) {
        var doc = e.target.result;
        callback(doc);    
    });
    reader.readAsText(f);
}

function filepicker(select, options, callback) {

    select.html("<option selected disabled hidden value=''></option>")
    
    options.forEach(function(d) {
        select.append('option')
            .text(d)
    });


    select.append('option')
        .text('Pick a local file...')
        .attr('value', 'picker');

    select.on("change", function() {
        var v = d3.event.target.value;
        if (v == "picker") {
            inp.onchange = function(e) { handleFileSelect(e, callback); };
            inp.click();
        }
        else {
            var file = "data/" + v;
            d3.text(file, "text/plain", callback);
        }
    });
}

define(function() { return filepicker });


