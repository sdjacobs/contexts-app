var filepicker=function(){function t(e,t){var n=e.target.files,r=n[0],i=new FileReader;i.onload=function(e){var n=e.target.result;t(n)},i.readAsText(r)}function n(n,r,i,s){if(s)var o=function(e){return i(s(e))};else var o=i;n.html("<option selected disabled hidden value=''></option>"),r.forEach(function(e){n.append("option").text(e)}),n.append("option").text("Pick a local file...").attr("value","picker"),n.on("change",function(){var n=d3.event.target.value;if(n=="picker")e.onchange=function(e){t(e,o)},e.click();else{var r="data/"+n;d3.text(r,"text/plain",o)}})}var e=document.createElement("input");return e.setAttribute("type","file"),e.setAttribute("accept","text/plain"),n};define([],function(){return filepicker});