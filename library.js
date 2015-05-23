"use strict"

//In the future, this will use a server-side database. This is just to test the page layout for results.
//Missing data and not well researched (e.g hobbit pub. date is for first version, not the revised)
var books = [];
books[0] = {    title:          "The Hobbit",
                published:      new Date(1937, 9, 21),
                inArda:         true,
                meta:           false,
                author:         "J. R. R. Tolkien",
                others:         "",
                illustrated:    true,
                illustrators:   "J. R. R. Tolkien",
                posthumous:     false,
                image:          "",
                description:    "The story of Bilbo Baggins as he helps a troup of dwarves reclaim their home.",
                totalCopies:    3,
                copiesFree:     3};

books[1] = {    title:          "The Fellowship of the Ring",
                published:      new Date(1954, 7, 29),
                inArda:         true,
                meta:           false,
                author:         "J. R. R. Tolkien",
                others:         "",
                illustrated:    false,
                illustrators:   "",
                posthumous:     false,
                image:          "",
                description:    "The first volume of The Lord of The Rings.",
                totalCopies:    5,
                copiesFree:     5};

books[2] = {    title:          "The Two Towers",
                published:      new Date(1954, 11, 11),
                inArda:         true,
                meta:           false,
                author:         "J. R. R. Tolkien",
                others:         "",
                illustrated:    false,
                illustrators:   "",
                posthumous:     false,
                image:          "",
                description:    "The second volume of The Lord of The Rings.",
                totalCopies:    4,
                copiesFree:     4};

books[3] = {    title:          "The Return of the King",
                published:      new Date(1955, 10, 20),
                inArda:         true,
                meta:           false,
                author:         "J. R. R. Tolkien",
                others:         "",
                illustrated:    false,
                illustrators:   "",
                posthumous:     false,
                image:          "",
                description:    "The third volume of The Lord of The Rings.",
                totalCopies:    4,
                copiesFree:     4};

books[4] = {    title:          "The Silmarillion",
                published:      new Date(1977, 9, 15),
                inArda:         true,
                meta:           false,
                author:         "J. R. R. Tolkien",
                others:         "Christopher Tolkien,Guy Gavriel Kay",
                illustrated:    true,
                illustrators:   "Christopher Tolkien",
                posthumous:     true,
                image:          "",
                description:    "An account of the history of Middle-earth, edited by Christopher Tolkien.",
                totalCopies:    4,
                copiesFree:     4};

books[5] = {    title:          "Sir Gawain and the Green Knight: with Pearl and Sir Orfeo",
                published:      new Date(1975, 9, 1),
                inArda:         false,
                meta:           false,
                author:         "Unknown",
                others:         "J. R. R. Tolkien",
                illustrated:    false,
                illustrators:   "",
                posthumous:     false,
                image:          "",
                description:    "A Middle-English Arthurian poem about Sir Gawain as translated by J. R. R. Tolkien.",
                totalCopies:    1,
                copiesFree:     1};

books[6] = {    title:          "A Guide to Tolkien",
                published:      new Date(2001, 10, 10),
                inArda:         true,
                meta:           true,
                author:         "David Day",
                others:         "J. R. R. Tolkien",
                illustrated:    false,
                illustrators:   "",
                posthumous:     true,
                image:          "",
                description:    "An A-Z guide to Middle-earth and the Undying Lands.",
                totalCopies:    1,
                copiesFree:     1};

books[7] = {    title:          "Roverandom",
                published:      new Date(1998, 1, 5),
                inArda:         false,
                meta:           false,
                author:         "J. R. R. Tolkien",
                others:         "",
                illustrated:    true,
                illustrators:   "J. R. R. Tolkien",
                posthumous:     true,
                image:          "",
                description:    "A child's story about a dog, Rover, written for Michael Tolkien.",
                totalCopies:    1,
                copiesFree:     1};

function createRow(book)
{
    row += "<td><input type=\"submit\" name=\"submit\" id=\"submitrequest\"/>"
    row += "<td>" + book.author + "</td>"
    row += "<td>" + book.published.toString() + "</td>"
    row += "<td>" + book.illustrated + "</td>"
    row += "</tr>"
}

//Have to use DOM rather than innerHTML for old IE problems with tables.
function addResultsToPage(results)
{
    var checkbox;
    var day;
    var month;
    var date;
    var icon;
    var row;
    var cell;
    var table = document.getElementById("results-table");
    var length = table.getElementsByTagName("tr").length;

    //Clear the table
    while(table.hasChildNodes())
    {
        table.removeChild(table.firstChild);
    }

    row  = table.insertRow(0);
    row.className = "results-header";
    cell = row.insertCell(0);
    cell = row.insertCell(1);
    cell.className = "title leftalign"
    cell.appendChild(document.createTextNode("Title:"));
    cell = row.insertCell(2);
    cell.appendChild(document.createTextNode("Author:"));
    cell = row.insertCell(3);
    cell.appendChild(document.createTextNode("Published:"));
    cell = row.insertCell(4);
    cell.appendChild(document.createTextNode("Illustrated:"));
    cell = row.insertCell(5);
    cell.appendChild(document.createTextNode("Total Copies:"));
    cell = row.insertCell(6);
    cell.appendChild(document.createTextNode("Available:"));
    
    for(var i = 0; i < results.length; i++)
    {
        row = table.insertRow(i + 1);
        row.className = "results-row parity" + (i % 2);
        
        cell = row.insertCell(0);
        cell.className = "checkcell";
        checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "check" + i;
        checkbox.id = "check" + i;
        cell.appendChild(checkbox);

        cell = row.insertCell(1);
        cell.className = "leftalign";
        cell.appendChild(document.createTextNode(results[i].title.substring(0, 40)));

        cell = row.insertCell(2);
        cell.className = "authorcell";
        cell.className = "leftalign";
        cell.appendChild(document.createTextNode(results[i].author.substring(0, 40)));

        cell = row.insertCell(3);
        cell.className = "datecell";
        day  =  results[i].published.getDate().toString() + "/";
        month = results[i].published.getMonth().toString() + "/";
        if(day.length == 2)
        {
            day = 0 + day;
        }
        if(month.length == 2)
        {
            month = 0 + month;
        }
        date = day + month +  results[i].published.getFullYear().toString();
        cell.appendChild(document.createTextNode(date));

        cell = row.insertCell(4);
        cell.className = "illustratedcell";
        icon = document.createElement("img");
        icon.className = "icon";
        if(results[i].illustrated)
        {
            icon.src = "./tick.png";
            icon.alt = "true";
        }
        else
        {
            icon.src = "./cross.png";
            icon.alt = "false";
        }
        cell.appendChild(icon);

        cell = row.insertCell(5);
        cell.className = "copiescell";
        cell.appendChild(document.createTextNode(results[i].totalCopies));

        cell = row.insertCell(6);
        cell.className = "freecell";
        cell.appendChild(document.createTextNode(results[i].copiesFree));
    }

    //Add submission at bottom
    row = table.insertRow(results.length + 1);
    row.className = "submitrow";
    cell = row.insertCell();
    cell.colSpan = 7;
    var textInput = document.createElement("input");
    textInput.type = "text";
    textInput.name = "email"
    textInput.id = "email";
    var submitForm = document.createElement("input");
    submitForm.type = "submit";
    submitForm.name = "submit";
    submitForm.id = "submit-request";

    cell.appendChild(document.createTextNode("Email address:"));
    cell.appendChild(textInput);
    cell.appendChild(submitForm);

}


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

//In the future this will be server side as a database query.
//Search is only to demonstrate page functionality, as such it is rather crude
function performQuery(inputs)
{
    //Clone the books array
    var myBooks = books.slice(0);
    //Remove books that don't match search from MyBooks.
    for(var i = 0; i < myBooks.length; i++)
    {
        if( (inputs[0] != "" && (myBooks[i].title.search(inputs[0])  == -1))                                                    ||
            (inputs[1] != "" && (myBooks[i].author.search(inputs[1]) == -1))                                                    ||
            (inputs[2] != "" && (myBooks[i].others.search(inputs[2]) == -1 || myBooks[i].illustrators.search(inputs[2]) == -1)) ||
            (inputs[3] != -1 && (inputs[3] != (myBooks[i].author.search("J. R. R. Tolkien") >= 0)))                             ||
            (inputs[4] != -1 && (inputs[4] != myBooks[i].inArda))                                                               ||
            (inputs[5] != -1 && (inputs[5] != myBooks[i].meta))                                                                 ||
            (inputs[6] != -1 && (inputs[6] != myBooks[i].illustrated))                                                          ||
            (inputs[7] != -1 && (inputs[7] != myBooks[i].posthumous))
            )
        {
            //Remove non-matching book
            myBooks.splice(i, 1);
            i--;
        }
    }

    return myBooks;
}

//-1 is don't care, 1 is only include things that match this criteria, 0 is only include things that don't match this criteria
function parseInput(event)
{
    
    if(event.preventDefault)
    {
        event.preventDefault();
    }
    else
    {
        event.returnValue = false;
    }
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
                return false;
            } 
            else if(inputs1[i] == inputs1[i + 1]) 
            {
                inputs2.push(-1);
            }
            else
            {
                //One true one false, set to first one
                if(inputs1[i])
                {
                    inputs2.push(1);
                }
                else
                {
                    inputs2.push(0);
                }
            }
            changeRowBackground(i, "transparent");
    }
    var results = performQuery(inputs2);
    addResultsToPage(results);
    return false;
}

function requestBook(event) {
    event.returnValue = false;
    if(event.preventDefault)
    {
        event.preventDefault();
    }
    var email = form2.elements["email"].value.toString();
    var checks = [];
    var myBooks = [];

    if(email == "")
    {
        return;
    }

    for(var i = 0; i < form2.elements.length - 2; i++)
    {
        checks[i] = form2.elements[i];
        if(form2.elements[i].checked){
            myBooks.push(form2.elements[i].parentNode.parentNode.cells[1].childNodes[0].nodeValue);
        }
    }
    if(myBooks.length != 0)
    {
        var alertString = "A request by:\n" + email + "\nFor the following books:\n"
        for(var i = 0; i < myBooks.length; i++)
        {
            alertString += myBooks[i] + "\n";
        }
        alertString += "Has been registered. We will be in contact shortly."
        window.alert(alertString);
    }
}

var form = document.getElementById("advanced-search");
form.addEventListener("submit", parseInput);
var form2 = document.getElementById("request-book");
form2.addEventListener("submit", requestBook);