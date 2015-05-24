// Run a minimal node.js web server for local development of a web site.
// Put this program in a site folder and start it with "node server.js".
// Then visit the site at the addresses printed on the console.
// The server is configured to match the most restrictive publishing sites.

// Load the web-server, file-system and file-path modules.
var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');
var sql = require("sqlite3").verbose();
var db = new sql.Database("private/tolkien.db", sql.OPEN_READWRITE);
var dynamicHtmlPagePart1 = "";
var dynamicHtmlPagePart2 = "";

// The default port numbers are the standard ones [80,443] for convenience.
// Change them to e.g. [8080,8443] to avoid privilege or clash problems.
var ports = [8181, 8182];

// The most common standard file extensions are supported.
// The most common non-standard file extensions are excluded, with a message.
var types = {
    '.html' : 'text/html, application/xhtml+xml',
    '.css'  : 'text/css',
    '.js'   : 'application/javascript',
    '.png'  : 'image/png',
    '.jpg'  : 'image/jpg',
};

// Start both the http and https services.  Requests can only come from
// localhost, for security.  (This can be changed to a specific computer, but
// shouldn't be removed, otherwise the site becomes public.)
function start() {
    test();
    var httpService = http.createServer(serve);
    httpService.listen(ports[0], 'localhost');
    var options = { key: key, cert: cert };
    var httpsService = https.createServer(options, serve);
    httpsService.listen(ports[1], 'localhost');
}

// Response codes: see http://en.wikipedia.org/wiki/List_of_HTTP_status_codes
var OK = 200, Redirect = 307, NotFound = 404, BadType = 415, Error = 500;

// Succeed, sending back the content and its type.
function succeed(response, type, content) {
    var typeHeader = { 'Content-Type': type };
    response.writeHead(OK, typeHeader);
    response.write(content);
    response.end();
}

// Tell the browser to try again at a different URL.
function redirect(response, url) {
    var locationHeader = { 'Location': url };
    response.writeHead(Redirect, locationHeader);
    response.end();
}

// Give a failure response with a given code.
function fail(response, code) {
    response.writeHead(code);
    response.end();
}

function isImage(type) {
    switch(type) {
        case "image/png":
        case "image/jpg":
            return true;
        default:
            return false;
    }
}

function err(e)
{
    if(e)
    {
        console.log(e.message);
        throw e;
    }
}

function serve_search(request, response, callback)
{
    var file = request.url;

    split = file.split("?");
    file = split[0];
    params = split[1].split("&");
    fields = {  title: null,
                author: null,
                collaborator: null,
                writtenByTolkien: null,
                notWrittenByTolkien: null,
                setInArda: null,
                notSetInArda: null,
                meta: null,
                notMeta: null,
                illustrated: null,
                notIllustrated: null,
                posthumous: null,
                notPosthumous: null
    };

    var temp;
    for (var i = 0; i < params.length; i++)
    {
        temp = params[i].split("=");
        if (temp.length > 1 && temp[0] in fields && temp[1].length > 0)
        {
            fields[temp[0]] = temp[1].trim();
        }
    }
    
    var query = buildQuery(fields);
    //TODO: Write the prepare stuff to sanitize
    db.all(query, dbCallBack);

    function dbCallBack(e, rows)
    {
        if (e)
            err(e);

        //console.log(rows);
        var htmlRows = "<tr class=\"results-header\"><td></td><td class=\"title leftalign\">Title:</td><td>Author:</td><td>Published:</td><td>Illustrated:</td><td>Total Copies:</td><td>Available:</td></tr>";
        for (var i = 0; i < rows.length; i++)
        {
            if(rows[i].reserved == null)
                rows[i].reserved = 0;
            //Do this by hand as it's fairly simple and we don't want to use external libraries
            htmlRows +="<tr class=\"results-row ";
            if(i % 2)
                htmlRows += "parity0\">";
            else
                htmlRows += "parity1\">";
            htmlRows += "<td class=\"checkcell\"><input type=\"checkbox\" name=\"check" + rows[i].work_id + "\" id=\"check" + rows[i].work_id +"\" /></td>";
            htmlRows += "<td class=\"leftalign\">" + rows[i].title + "</td>";
            htmlRows += "<td class=\"leftalign\">" + rows[i].author + "</td>";
            htmlRows += "<td class=\"leftalign\">" + rows[i].published + "</td>";
            if (rows[i].illustrated == 1)
                htmlRows += "<td class=\"illustratedcell\"><img class=\"icon\" src=\"./tick.png\" alt=\"true\" /></td>";
            else
                htmlRows += "<td class=\"illustratedcell\"><img class=\"icon\" src=\"./cross.png\" alt=\"false\" /></td>";
            htmlRows += "<td class=\"copiescell\">" + rows[i].totalCopies + "</td>";
            htmlRows += "<td class=\"freecell\">" + (rows[i].totalCopies - rows[i].reserved) + "</td>";
            htmlRows +="</tr>"
        }

        var page = dynamicHtmlPagePart1 + htmlRows + dynamicHtmlPagePart2;
        callback(null, page);
    }
}

function buildQuery(fields)
{
    var writtenByTolkien = null;
    var setInArda = null;
    var meta = null;
    var illustrated = null;
    var posthumous = null;

    if (fields.writtenByTolkien == fields.notWrittenByTolkien && fields.writtenByTolkien == "on" ||
        fields.setInArda        == fields.notSetInArda        && fields.setInArda        == "on" ||
        fields.meta             == fields.notMeta             && fields.meta             == "on" ||
        fields.illustrated      == fields.notIllustrated      && fields.illustrated      == "on" ||
        fields.posthumous       == fields.notPosthumous       && fields.posthumous       == "on")
        return null;
    if(!fields.title)
        fields.title = "";
    if(!fields.author)
        fields.author = "";
    if(!fields.collaborator)
        fields.collaborator = "";

    if (fields.writtenByTolkien == "on")
        writtenByTolkien = true;
    else if (fields.notWrittenByTolkien == "on")
        writtenByTolkien = false;
    
    if (fields.setInArda == "on")
        setInArda = true;
    else if (fields.notSetInArda == "on")
        setInArda = false;

    if (fields.meta == "on")
        meta = true;
    else if (fields.notMeta == "on")
        meta = false;

    if (fields.illustrated == "on")
        illustrated = true;
    else if (fields.notIllustrated == "on")
        illustrated = false;

    if (fields.posthumous == "on")
        posthumous = true;
    else if (fields.notPosthumous == "on")
        posthumous = false;

    //Build initial table that has all possible works the user might want
    var ctable1 = "";
    cTable1 = "SELECT Works.id AS work_id, Works.title, published, illustrated, Authors.name AS author ";
    //cTable1 = "SELECT Works.id AS work_id ";
    cTable1 += "FROM Works, Authors WHERE ";
    cTable1 += "Works.author_id == Authors.id";
    if (fields.title.length > 0)
        cTable1 += " AND Works.title LIKE '%" + fields.title + "%'";
    if (fields.author.length > 0 && ! writtenByTolkien)
        cTable1 += " AND Works.author LIKE '%" + fields.author + "%'";
    if (fields.collaborator.length > 0)
        cTable1 += " AND Works.title LIKE '%" + fields.collaborator + "%'";

    //Have to be specific as we're using null as "don't care"
    if (writtenByTolkien == true)
        cTable1 += " AND Authors.name == 'J. R. R. Tolkien'";
    else if(writtenByTolkien == false)
        cTable1 += " AND Authors.name != 'J. R. R. Tolkien'";
    
    if (setInArda == true)
        cTable1 += " AND Works.inArda == 1";
    else if (setInArda == false)
        cTable1 += " AND Works.inArda == 0";
    
    if (meta == true)
        cTable1 += " AND Works.meta == 1";
    else if (meta == false)
        cTable1 += " AND Works.meta == 0";
    
    if (illustrated == true)
        cTable1 += " AND Books.illustrated == 1";
    else if (illustrated == false)
        cTable1 += " AND Books.illustrated == 0";
    
    if (posthumous == true)
        cTable1 += " AND Books.posthumous == 1";
    else if (posthumous == false)
        cTable1 += " AND Books.posthumous == 0";

    cTable1 = cTable1.trim();
    if(cTable1[cTable1.length - 1] == ",")
        cTable1 = cTable1.substring(0, cTable1.length - 1);

    //Get a count of how many of each work is currently taken out.
    var cTable2 = "";
    cTable2  = "SELECT Works.id as work_id, COUNT(Books.id) AS reserved ";
    cTable2 += "FROM Works, Books ";
    cTable2 += "WHERE Works.id == Books.title_id AND ";
    cTable2 += "Books.id IN (SELECT book_id FROM Loans) ";
    cTable2 += "GROUP BY Works.id";

    var query = "";
    query  = "SELECT cTable1.work_id AS work_id, ";
    query += "cTable1.title AS title, ";
    query += "cTable1.published AS published, ";
    query += "cTable1.illustrated AS illustrated, ";
    query += "cTable1.author AS author, ";
    query += "COUNT(Books.title_id) AS totalCopies, ";
    query += "cTable2.reserved AS reserved ";
    query += "FROM Books, (" + cTable1 + ") AS cTable1 LEFT OUTER JOIN (" + cTable2 + ") AS cTable2 ";
    query += "ON cTable1.work_id == cTable2.work_id ";
    query += "WHERE cTable1.work_id == Books.title_id ";
    query += "GROUP BY cTable1.work_id"

    //console.log(query);
    return query;
}

//Courtesy of http://stackoverflow.com/questions/280634/endswith-in-javascript
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function serve_email_submit(request, response, ready)
{

}

// Serve a single request.  Redirect / to add the prefix, but otherwise insist
// that every URL should start with the prefix.  A URL ending with / is treated
// as a folder and index.html is added.  A file name without an extension is
// reported as an error (because we don't know how to deliver it, or if it was
// meant to be a folder, it would inefficiently have to be redirected for the
// browser to get relative links right).
function serve(request, response) {
    var file = request.url;
    console.log(file);
    
    // If dynamic, handle it without sending an existing file because it doesn't exist.
    if (starts(file, '/library.html?') && (file.match(/\?/g) || []).length == 1)
    {
        if(endsWith(file, "submit=Search"))
            serve_search(request, response, ready);
        //else if (endsWith(file, "submit=Request+books"))

        return;
    }

    if (file == '/')
        file = file + 'index.html';

    if (file.indexOf("..") > -1)
    {
        console.log("Fail 2");
        return fail(response, Error);
    }
    
    var type = findType(request, path.extname(file));
    if (! type)
    {
        console.log("Fail 3");
        console.log(file);
        return fail(response, BadType);
    }
    else if (isImage(type))
    {
        file = '/images' + file;
    }

    if (starts(file,'/'))
        file = '/public' + file;

    file = "." + file;
    
    if (! inSite(file)) 
    {
        console.log("Fail 4");
        console.log(file);
        return fail(response, NotFound);
    }
    
    if (! matchCase(file))
    {
        return fail(response, NotFound);
    }
 
    if (! noSpaces(file)) 
    {
        console.log("Fail 5");
        console.log(file);
        return fail(response, NotFound);
    }

    try { fs.readFile(file, ready); }
    catch (err) { return fail(response, Error); }

    function ready(error, content) {
        if (error) return fail(response, NotFound);
        succeed(response, type, content);
    }
}

// Find the content type (MIME type) to respond with.
// Content negotiation is used for XHTML delivery to new/old browsers.
function findType(request, extension) {
    var type = types[extension];
    if (! type) 
        return type;
    if (extension != ".html") 
        return type;

    var htmlTypes = types[".html"].split(", ");
    var accepts = request.headers['accept'].split(",");
    
    if (accepts.indexOf(htmlTypes[1]) >= 0) 
        return htmlTypes[1];

    return htmlTypes[0];
}

// Check whether a string starts with a prefix, or ends with a suffix
function starts(s, x) { return s.lastIndexOf(x, 0) == 0; }
function ends(s, x) { return s.indexOf(x, s.length-x.length) == 0; }

// Check that a file is inside the site.  This is essential for security.
var site = fs.realpathSync('.') + path.sep;
function inSite(file) {
    var real;
    try { real = fs.realpathSync(file); }
    catch (err) { return false; }
    return starts(real, site);
}

// Check that the case of a path matches the actual case of the files.  This is
// needed in case the target publishing site is case-sensitive, and you are
// running this server on a case-insensitive file system such as Windows or
// (usually) OS X on a Mac.  The results are not (yet) cached for efficiency.
function matchCase(file) {
    var parts = file.split('/');
    var dir = '.';
    for (var i=1; i<parts.length; i++) {
        var names = fs.readdirSync(dir);
        if (names.indexOf(parts[i]) < 0) return false;
        dir = dir + '/' + parts[i];
    }
    return true;
}

// Check that a name contains no spaces.  This is because spaces are not
// allowed in URLs without being escaped, and escaping is too confusing.
// URLS with other special characters are also not allowed.
function noSpaces(name) {
    return (name.indexOf(' ') < 0);
}

// Do a few tests.
function test() {
    if (! fs.existsSync('./public/index.html'))
        failTest('no index.html page found');

    if (! inSite('./public/index.html'))
        failTest('inSite failure 1');

    if (inSite('./../site'))
        failTest('inSite failure 2');

    if (! matchCase('./public/index.html'))
        failTest('matchCase failure');

    if (matchCase('./public/Index.html'))
        failTest('matchCase failure');

    if (! noSpaces('./public/index.html'))
        failTest('noSpaces failure');

    if (noSpaces('./public/my index.html'))
        failTest('noSpaces failure');
}

function failTest(s) {
    console.log(s);
    process.exit(1);
}

// A dummy key and certificate are provided for https.
// They should not be used on a public site because they are insecure.
// They are effectively public, which private keys should never be.
var key =
    "-----BEGIN RSA PRIVATE KEY-----\n" +
    "MIICXAIBAAKBgQDGkGjkLwOG9gkuaBFj12n+dLc+fEFk1ns60vsE1LNTDtqe87vj\n" +
    "3cTMPpsSjzZpzm1+xQs3+ayAM2+wkhdjhthWwiG2v2Ime2afde3iFzA93r4UPlQv\n" +
    "aDVET8AiweE6f092R0riPpaG3zdx6gnsnNfIEzRH3MnPUe5eGJ/TAiwxsQIDAQAB\n" +
    "AoGAGz51JdnNghb/634b5LcJtAAPpGMoFc3X2ppYFrGYaS0Akg6fGQS0m9F7NXCw\n" +
    "5pOMMniWsXdwU6a7DF7/FojJ5d+Y5nWkqyg7FRnrR5QavIdA6IQCIq8by9GRZ0LX\n" +
    "EUpgIqE/hFbbPM2v2YxMe6sO7E63CU2wzSI2aYQtWCUYKAECQQDnfABYbySAJHyR\n" +
    "uxntTeuEahryt5Z/rc0XRluF5yUGkaafiDHoxqjvirN4IJrqT/qBxv6NxvKRu9F0\n" +
    "UsQOzMpJAkEA25ff5UQRGg5IjozuccopTLxLJfTG4Ui/uQKjILGKCuvnTYHYsdaY\n" +
    "cZeVjuSJgtrz5g7EKdOi0H69/dej1cFsKQJBAIkc/wti0ekBM7QScloItH9bZhjs\n" +
    "u71nEjs+FoorDthkP6DxSDbMLVat/n4iOgCeXRCv8SnDdPzzli5js/PcQ9kCQFWX\n" +
    "0DykGGpokN2Hj1WpMAnqBvyneXHMknaB0aXnrd/t7b2nVBiVhdwY8sG80ODBiXnt\n" +
    "3YZUKM1N6a5tBD5IY2kCQDIjsE0c39OLiFFnpBwE64xTNhkptgABWzN6vY7xWRJ/\n" +
    "bbMgeh+dQH20iq+O0dDjXkWUGDfbioqtRClhcyct/qE=\n" +
    "-----END RSA PRIVATE KEY-----\n";

var cert =
    "-----BEGIN CERTIFICATE-----\n" +
    "MIIClTCCAf4CCQDwoLa5kuCqOTANBgkqhkiG9w0BAQUFADCBjjELMAkGA1UEBhMC\n" +
    "VUsxDTALBgNVBAgMBEF2b24xEDAOBgNVBAcMB0JyaXN0b2wxDDAKBgNVBAoMA1VP\n" +
    "QjEZMBcGA1UECwwQQ29tcHV0ZXIgU2NpZW5jZTESMBAGA1UEAwwJbG9jYWxob3N0\n" +
    "MSEwHwYJKoZIhvcNAQkBFhJub25lQGNzLmJyaXMuYWMudWswHhcNMTMwNDA4MDgy\n" +
    "NjE2WhcNMTUwNDA4MDgyNjE2WjCBjjELMAkGA1UEBhMCVUsxDTALBgNVBAgMBEF2\n" +
    "b24xEDAOBgNVBAcMB0JyaXN0b2wxDDAKBgNVBAoMA1VPQjEZMBcGA1UECwwQQ29t\n" +
    "cHV0ZXIgU2NpZW5jZTESMBAGA1UEAwwJbG9jYWxob3N0MSEwHwYJKoZIhvcNAQkB\n" +
    "FhJub25lQGNzLmJyaXMuYWMudWswgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGB\n" +
    "AMaQaOQvA4b2CS5oEWPXaf50tz58QWTWezrS+wTUs1MO2p7zu+PdxMw+mxKPNmnO\n" +
    "bX7FCzf5rIAzb7CSF2OG2FbCIba/YiZ7Zp917eIXMD3evhQ+VC9oNURPwCLB4Tp/\n" +
    "T3ZHSuI+lobfN3HqCeyc18gTNEfcyc9R7l4Yn9MCLDGxAgMBAAEwDQYJKoZIhvcN\n" +
    "AQEFBQADgYEAQo4j5DAC04trL3nKDm54/COAEKmT0PGg87BvC88S5sTsWTF4jZdj\n" +
    "dgxV4FeBF6hW2pnchveJK4Kh56ShKF8SK1P8wiqHqV04O9p1OrkB6GxlIO37eq1U\n" +
    "xQMaMCUsZCWPP3ujKAVL7m3HY2FQ7EJBVoqvSvqSaHfnhog3WpgdyMw=\n" +
    "-----END CERTIFICATE-----\n";


var tempReading = fs.readFileSync("./private/library-dynamic.html", 'utf8').split('<HOOK/>');
dynamicHtmlPagePart1 = tempReading[0];
dynamicHtmlPagePart2 = tempReading[1];
// Start everything going.
start();