#!/usr/bin/ruby

require 'mysql'

begin
    
    con = Mysql.new 'localhost', 'root', '12345678', 'SamWang'
   
    con.query("CREATE TABLE IF NOT EXISTS \
        User(Id INT PRIMARY KEY AUTO_INCREMENT, Name VARCHAR(25))")
    con.query("INSERT INTO User(Name) VALUES('Jack London')")
    con.query("INSERT INTO User(Name) VALUES('Honore de Balzac')")
    con.query("INSERT INTO User(Name) VALUES('Lion Feuchtwanger')")
    con.query("INSERT INTO User(Name) VALUES('Emile Zola')")
    con.query("INSERT INTO User(Name) VALUES('Truman Capote')")   
    
rescue Mysql::Error => e
    puts e.errno
    puts e.error
    
ensure
    con.close if con
end