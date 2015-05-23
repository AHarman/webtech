"use strict"

//Variable declarations & initiailisations
var images = [["./tolkien-map.jpg", "./tolkien-monopoly.jpg", "./tolkien-dvds1.jpg"],
              ["./tolkien-string.jpg", "./tolkien-books.jpg", "./tolkien-knit.jpg"],
              ["./tolkien-dvds2.jpg", "./tolkien-stall.jpg", "./tolkien-games.jpg"]];
var aTags = [document.getElementById('gallery1'),
             document.getElementById('gallery2'),
             document.getElementById('gallery3')];
var preloaded = [[], [], []];
var iterator = 0;
var deltaOpacity = -0.025;
var imgOpacity = 1.0;

//Should mean images are fetched before being needed in the gallery
function preloadImages()
{
    var img;
    for(var i = 0; i < images.length; i++)
        for(var j = 0; j < images[i].length; j++)
        {
            preloaded[i][j] = new Image();
            preloaded[i][j].src = images[i][j];
        }
}

function changeImages()
{
    iterator = (iterator + 1) % 3;
    aTags[0].src = images[0][iterator];
    aTags[1].src = images[1][iterator];
    aTags[2].src = images[2][iterator];
}

//Fade in uses inOrOut = +1, fade out uses inOrOut = -1
function fadeAndChange()
{
    imgOpacity += deltaOpacity;
    aTags[0].style.opacity = imgOpacity;
    aTags[1].style.opacity = imgOpacity;
    aTags[2].style.opacity = imgOpacity;

    if (imgOpacity < 1.0 && imgOpacity > 0.0)
    {
        window.setTimeout(fadeAndChange, 10);
    } 
    else if (imgOpacity <= 0.0)
    {
        changeImages();
        deltaOpacity *= -1.0;
        window.setTimeout(fadeAndChange, 10);
    } 
    else if (imgOpacity >= 1.0)
    {
        deltaOpacity *= -1.0;
    }
}

preloadImages();
if (aTags[0].style.opacity !== undefined) 
{
    aTags[0].style.opacity = 1.0;
    aTags[1].style.opacity = 1.0;
    aTags[2].style.opacity = 1.0;
    window.setInterval(fadeAndChange, 5000);
}
else 
{
    window.setInterval(changeImages, 5000);
}

//window.setInterval(changeImages, 4000);