define(function (require) {

    var d3 = require('d3');
    
    var interact = require('interact');
   
    var colors = d3.scale.category10();

    /* Initialize draggable behavior for draggable class */

    // target elements with the "draggable" class
    var d = interact('.draggable')
        .draggable({
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
                    })
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


    d3.select('.draggable').style("background-color", colors(colors.domain().length));
    

  
    /* Make a selection into a dialog. Very simple since the behavior above applies to the whole class. */  
    function dialog(elem) {
        elem.attr("class", "draggable")
        var d = interact('.draggable')
        elem.selectAll('select, input, button, .container')
            .each(function() {
                this.onmouseover = function() { d.draggable(false) }
                this.onmouseout = function() { d.draggable(true) }
            });
        elem.style("background-color", colors(colors.domain().length));

        elem.append("button")
            .attr("style", "position: absolute; top:0; right:0;")
            .text("x")
            .on("click", function() { elem.remove() } );

    }

    d3.json("modules.json", function(modules) {
        d3.select("#menu").select("div").selectAll("li")
           .data(modules).enter()
            .append("li")
            .append("a")
            .attr("href", "#")
            .text(function(d) { return d.name })
            .on("click", display)
            .append("br")

        var types = d3.set()
        modules.forEach(function(d) {
            d.exports.forEach(function(f) { types.add(f); });
            d.imports.forEach(function(f) { types.add(f); });
        });
        var dispatch = d3.dispatch.apply(this, types.values())

        function display(module) {
            d3.xhr(module.page, "text/html", function(req) {
                var menu = d3.select("#menu").append("div")
                    .html(req.response)
                    .attr("style", "width: 300px; height: 200px;")
                    .attr("name", module.name)
                    .call(dialog)
                

                
                var viz = d3.select("#content").append("div")
                    .attr("style", "width:500px;height:500px")
                    .attr("name", module.name + " viz")
        
                var v = viz.append("div")
                    .attr("class", "container")
                    .attr("style", "width:100%; height:95%;")
                    .style("background-color", 'white')
                    .style("color", "black")
                  
                viz.call(dialog); 

                require(module.deps, function(f) { f(v.node(), dispatch); });
            });
        }
    });

});
