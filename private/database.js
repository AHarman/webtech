"use strict";
var sql = require("sqlite3").verbose();
var fs = require("fs");

var file = "tolkien.db";
var exists = fs.existsSync(file);
var db = new sql.Database(file);

if(!exists)
    db.serialize(startup);

function startup() 
{
    var query = "";
    query = "CREATE TABLE IF NOT EXISTS Authors (id INTEGER PRIMARY KEY, name TEXT NOT NULL)";
    db.run(query, err);

    query = "CREATE TABLE IF NOT EXISTS Works (id INTEGER PRIMARY KEY, author_id INTEGER NOT NULL, title TEXT NOT NULL, published DATE, illustrated INTEGER NOT NULL DEFAULT 0, ";
    query = query + "inArda INTEGER NOT NULL DEFAULT 1, posthumous INTEGER NOT NULL DEFAULT 0, meta INTEGER NOT NULL DEFAULT 0, ";
    query = query + "CHECK (inArda IN (0,1)), CHECK (posthumous IN (0,1)), CHECK (meta IN (0,1)), CHECK (illustrated IN (0,1)), ";
    query = query + "FOREIGN KEY(author_id) REFERENCES Authors(id))";
    db.run(query, err);
    
    query = "CREATE TABLE IF NOT EXISTS Books (id INTEGER PRIMARY KEY, title_id INTEGER NOT NULL, ";
    query = query + "FOREIGN KEY(title_id) REFERENCES Works(id))";
    db.run(query, err);

    query = "CREATE TABLE IF NOT EXISTS Members (email TEXT PRIMARY KEY)";
    db.run(query, err);

    query = "CREATE TABLE IF NOT EXISTS Loans (member_email TEXT, book_id INTEGER,";
    query = query + "FOREIGN KEY(member_email) REFERENCES Members(email),";
    query = query + "FOREIGN KEY(book_id) REFERENCES Books(id))";
    db.run(query, err);
    
    db.run("INSERT INTO Authors VALUES(null, 'J. R. R. Tolkien')", err);
    db.run("INSERT INTO Authors VALUES(null, 'David Day')", err);
    db.run("INSERT INTO Authors VALUES(null, 'Unknown')", err);
    db.run("INSERT INTO Members VALUES('example@example.com')", err);
    db.run("INSERT INTO Members VALUES('alex@alexharman.com')", err);

    query = "INSERT INTO Works (id, author_id, title, published, illustrated) SELECT null, ";
    query = query + "Authors.id, ";
    query = query + "'The Hobbit', ";
    query = query + "'1937-9-21', ";
    query = query + "1 ";
    query = query + "FROM Authors ";
    query = query + "WHERE Authors.name = 'J. R. R. Tolkien'";
    db.run(query, err);

    query = "INSERT INTO Works (id, author_id, title, published) SELECT null, ";
    query = query + "Authors.id, ";
    query = query + "'The Fellowship of the Ring', ";
    query = query + "'1954-7-29' ";
    query = query + "FROM Authors ";
    query = query + "WHERE Authors.name = 'J. R. R. Tolkien'";
    db.run(query, err);

    query = "INSERT INTO Works (id, author_id, title, published) SELECT null, ";
    query = query + "Authors.id, ";
    query = query + "'The Two Towers', ";
    query = query + "'1954-11-11' ";
    query = query + "FROM Authors ";
    query = query + "WHERE Authors.name = 'J. R. R. Tolkien'";
    db.run(query, err);

    query = "INSERT INTO Works (id, author_id, title, published) SELECT null, ";
    query = query + "Authors.id, ";
    query = query + "'The Return of the King', ";
    query = query + "'1955-10-20' ";
    query = query + "FROM Authors ";
    query = query + "WHERE Authors.name = 'J. R. R. Tolkien'";
    db.run(query, err);

    query = "INSERT INTO Works (id, author_id, title, published, posthumous, meta) SELECT null, ";
    query = query + "Authors.id, ";
    query = query + "'A Guide To Tolkien', ";
    query = query + "'2001-10-10', ";
    query = query + "1, ";
    query = query + "1 ";
    query = query + "FROM Authors ";
    query = query + "WHERE Authors.name = 'David Day'";
    db.run(query, err);

    query = "INSERT INTO Works (id, author_id, title, published, inArda) SELECT null, ";
    query = query + "Authors.id, ";
    query = query + "'Sir Gawain and the Green Knight: with Pearl and Sir Orfeo', ";
    query = query + "'1975-9-1', ";
    query = query + "0 ";
    query = query + "FROM Authors ";
    query = query + "WHERE Authors.name = 'Unknown'";
    db.run(query, err);

    for (var i = 0; i < 3; i++)
        db.run("INSERT INTO Books (id, title_id) SELECT null, Works.id FROM Works WHERE Works.title = 'The Hobbit'", err);
    for (var i = 0; i < 5; i++)
        db.run("INSERT INTO Books (id, title_id) SELECT null, Works.id FROM Works WHERE Works.title = 'The Fellowship of the Ring'", err);
    for (var i = 0; i < 4; i++)
        db.run("INSERT INTO Books (id, title_id) SELECT null, Works.id FROM Works WHERE Works.title = 'The Two Towers'", err);
    for (var i = 0; i < 4; i ++)
        db.run("INSERT INTO Books (id, title_id) SELECT null, Works.id FROM Works WHERE Works.title = 'The Return of the King'", err);
    
    db.run("INSERT INTO Books (id, title_id) SELECT null, Works.id FROM Works WHERE Works.title = 'Sir Gawain and the Green Knight: with Pearl and Sir Orfeo'",err);
    db.run("INSERT INTO Books (id, title_id) SELECT null, Works.id FROM Works WHERE Works.title = 'A Guide To Tolkien'", err);

    db.run("INSERT INTO LOANS VALUES('example@example.com', 1)", err);
    db.run("INSERT INTO LOANS VALUES('example@example.com', 2)", err);
    db.run("INSERT INTO LOANS VALUES('example@example.com', 10)", err);
    
    db.close();
    return
}


function err(e)
{
    if(e)
    {
        console.log("8");
        console.log(e.message);
        throw e;
    }
}

