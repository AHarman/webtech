"use strict";

//In the future, this will use a server-side database. This is just to test the page layout for results.
//Missing data and not well researched (e.g hobbit pub. date is for first version, not the revised)

function changeRowBackground(index, color)
{
    var element = null;
    switch(index) {
        case 0:
            element = document.getElementById("titlerow");
            break;
        case 1:
            element = document.getElementById("authorrow");
            break;
        case 2:
            element = document.getElementById("collabrow");
            break;
        case 3:
        case 4:
            element = document.getElementById("tolkienrow");
            break;
        case 5:
        case 6:
            element = document.getElementById("ardarow");
            break;
        case 7:
        case 8:
            element = document.getElementById("metarow");
            break;
        case 9:
        case 10:
            element = document.getElementById("illustrow");
            break;
        case 11:
        case 12:
            element = document.getElementById("posthumousrow");
            break;
    }
    if(element != null)
    {
        element.style.backgroundColor = color;
        if(element.style.opacity !== undefined)
        {

        }
    }
}

function stopEvent(event)
{
    if(event.preventDefault)
     {
         event.preventDefault();
     }
     else
     {
         event.returnValue = false;
     }
     return false;
}

//-1 is don't care, 1 is only include things that match this criteria, 0 is only include things that don't match this criteria
function parseInput(event)
{     
    var inputs1 = [ form.elements["title"].value,
                    form.elements["author"].value,
                    form.elements["collaborator"].value,
                    form.elements["writtenByTolkien"].checked,
                    form.elements["notWrittenByTolkien"].checked,
                    form.elements["setInArda"].checked,
                    form.elements["notSetInArda"].checked,
                    form.elements["meta"].checked,
                    form.elements["notMeta"].checked,
                    form.elements["illustrated"].checked,
                    form.elements["notIllustrated"].checked,
                    form.elements["posthumous"].checked,
                    form.elements["notPosthumous"].checked];
    var inputs2 = [ inputs1[0].trim(),
                    inputs1[1].trim(),
                    inputs1[2].trim()];
    
    for (var i = 3; i < inputs1.length; i += 2) {
            if(inputs1[i] == inputs1[i + 1] && inputs1[i] == true)
            {
                //Both true, need to raise an issue
                changeRowBackground(i, "red");
                return stopEvent(event);
            } 
            changeRowBackground(i, "transparent");
    }
    return true;
}

function requestBook(event) {
    var email = form2.elements["email"].value.toString();
    var checks = [];
    var rows = document.getElementById("results-table").rows;

    if(email == "")
    {
        window.alert("Please enter your email so we can verify your membership");
        return stopEvent(event);
    }

    for(var i = 0; i < form2.elements.length - 2; i++)
    {
        if(form2.elements[i].checked)
        {
            console.log(i + " is checked");
            checks.push(form2.elements[i]);
            if (rows[i + 1].cells[6].innerHTML == "0")
            {
                window.alert("Please only select books that are available");
                return stopEvent(event);
            }
        }
    }
    console.log(checks);
    if(checks.length == 0)
    {
        window.alert("Select at least one book that is available.");
        return stopEvent(event);
    }
    return true;
}

var form = document.getElementById("advanced-search");
form.addEventListener("submit", parseInput);
var form2 = document.getElementById("request-book");
form2.addEventListener("submit", requestBook);
