define(function (require) {

    var d3 = require('d3');
    
    var interact = require('interact');
   
    var colors = d3.scale.category10();
    function dialog(node) { 


        var obj = {
            // call this function on every dragmove event
            onmove: function (event) {
                var target = event.target,
                    // keep the dragged position in the data-x/data-y attributes
                    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                // translate the element
                target.style.webkitTransform =
                target.style.transform =
                    'translate(' + x + 'px, ' + y + 'px)';

                // update the posiion attributes
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        };

        // target elements with the "draggable" class
        var d = interact('.draggable')
            .draggable(obj)
            .resizable(true)
            .on('resizemove', function (event) {
                var target = event.target;

                // add the change in coords to the previous width of the target element
                var
                  newWidth  = parseFloat(target.style.width ) + event.dx,
                  newHeight = parseFloat(target.style.height) + event.dy;

                // update the element's style
                target.style.width  = newWidth + 'px';
                target.style.height = newHeight + 'px';
            });


        d3.select(node).style("background-color", colors(colors.domain().length));
        
        var y = document.querySelectorAll('select, input, button, .container')
        for (var i = 0; i < y.length; i++){
            y[i].onmouseover = function() { d.draggable(false) }
            y[i].onmouseout = function() { d.draggable(true) }
        }
    }
   
    dialog('.draggable')

    d3.json("modules.json", function(modules) {
        d3.select("#menu").selectAll("li")
           .data(modules).enter()
            .append("li")
            .append("a")
            .attr("href", "#")
            .text(function(d) { return d.name })
            .on("click", display)
            .append("br")
        
    });


    function display(module) {
        
        d3.xhr(module.page, "text/html", function(req) {
            var div = document.createElement("div")
            div.innerHTML = req.response;
            
            div.setAttribute("class", "draggable");
            
            div.setAttribute("style", "width: 300px; height: 200px;")
            document.body.appendChild(div);
            dialog(div)
            
            var viz = d3.select("body")
                        .append("div")
                        .attr("class", "draggable")
                        .attr("style", "width:500px;height:500px")
            
            var v = viz
                        .append("div")
                        .attr("class", "container")
                        .attr("style", "width:100%; height:100%;")
                        .style("background-color", 'white')
                        
            dialog(viz.node());

            require(module.deps, function(f) { f(v.node()); });
        });
    }
});
