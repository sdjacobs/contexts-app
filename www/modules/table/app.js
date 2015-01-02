define(['d3', 'filepicker'], function(d3, filepicker) {
    return (function(viz, dispatch) {

        d3.select("#t_dataFile").call(filepicker(), ["brown-contexts.json"], main, JSON.parse);


        function main(contexts) {

            var table = d3.select(viz).select("table");

            if (table.empty()) {
                table = d3.select(viz).append("table")
                table.append("thead").html("Shared contexts: <span id=t_wordList>");
            }

            function toggle() {
                var manual = document.querySelector("#t_selectText").checked,
                    textbox =  d3.select("#t_selectedWordsText"),
                    expbox =  d3.select("#t_selectedWordsExported");
              
                textbox.attr("disabled", manual ? null : true);
                expbox.style("color", manual ? "grey" : "black");
                
                var manualWords = textbox.node().value;
                if (manualWords)
                    manualWords = manualWords.split(',')

                var words = manual ? manualWords : expbox.datum();
                if (words)
                    updateTable(words)
            }

            
            d3.selectAll("#t_selectText, #t_selectExported")
                .attr("disabled", null)
                .on("click", toggle);
            
            d3.select("#t_selectedWordsText")
                .on("change", function() {
                    var d = d3.event.target.value;
                    updateTable(d.split(','));
                });

            
            dispatch.on_init("wordlist", function(words) {
                d3.select("#t_selectedWordsExported").text(words).datum(words);
                if (document.querySelector("#t_selectExported").checked)
                    updateTable(words);
            });
            
            /* Intersect lists - must be sorted */
            function intersect(x, y) {
                var i = 0
                var j = 0
                var z = []
                while(i < x.length && j < y.length) {
                    if (x[i] == y[j])
                        z.push(x[i]);
                    if (x[i] < y[j])
                        i++;
                    else
                    j++;
            }
            return z;
            }

            function intersectAll(L) {
                var x = L[0]
                for (i = 1; i < L.length; i++) {
                    x = intersect(x, L[i])
                }
                return x;
            }

            function updateTable(words) {
                table.select("#t_wordList").text(words);
                table.selectAll("tr").remove();
                var contextsLists = words.map(function(d) { return contexts[d] });
                var sharedContexts = intersectAll(contextsLists);
                table.selectAll("tr")
                   .data(sharedContexts).enter()
                   .append("tr")
                   .text(function(d) { return d });
            }

        }
    })

});

