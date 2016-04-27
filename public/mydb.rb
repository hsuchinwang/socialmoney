#!/usr/bin/ruby

require 'mysql'

    begin
        
        con = Mysql.new 'localhost', 'root', '12345678', 'SamWang'
        con.query("CREATE TABLE IF NOT EXISTS \
            User(Id INT PRIMARY KEY AUTO_INCREMENT, Name VARCHAR(25), Currency VARCHAR(25), Price INT)")
        con.query("CREATE TABLE IF NOT EXISTS \
            Record(Id INT PRIMARY KEY AUTO_INCREMENT, Credit VARCHAR(25), Debt VARCHAR(25), Booking VARCHAR(25))") 
        
    rescue Mysql::Error => e
        puts e.errno
        puts e.error
        
    ensure
        con.close if con
    end

