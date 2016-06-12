require 'sinatra/base'
require 'mysql'

class SocialMoneyClass < Sinatra::Base
    DB_HOST = ENV['DATABASE_HOST']
    DB_USER = ENV['DATABASE_USER']
    DB_PASS = ENV['DATABASE_PASS']
    DB_NAME = ENV['DATABASE_NAME']

    helpers do
        def save_name(name, pic)
            begin
                @name = name
                @pic = pic
                con = Mysql.new DB_HOST, DB_USER, DB_PASS, DB_NAME

                con.query("SET NAMES UTF8")
                rs = con.query("SELECT * FROM User WHERE Name = '#{@name}'")
                if rs.num_rows == 0
                    con.query("INSERT INTO User(Name, Currency, Price, Available) VALUES('#{@name}','#{@name}',5100,5100)")
                end
                rs = con.query("SELECT * FROM Persons WHERE Name = '#{@name}'")
                if rs.num_rows == 0
                    con.query("INSERT INTO Persons(Name, Pic) VALUES('#{@name}','#{@pic}')")
                end
                
            rescue Mysql::Error => e
                puts e.errno
                puts e.error
                
            ensure
                con.close if con
            end
        end

        def find_my_money(name)
            begin

                @mycur = Array.new
                @name = name
                con = Mysql.new DB_HOST, DB_USER, DB_PASS, DB_NAME
                con.query("SET NAMES UTF8")
                rs = con.query("SELECT * FROM User WHERE Name = '#{@name}'")
                rs.each_hash do |row|
                    # @mycurrency = row['Currency'].to_s
                    # @mycurrency.force_encoding('UTF-8')
                    # @mycur << @mycurrency + row['Price'].to_s
                    @mycur << row['Currency'].to_s + '.' + row['Price'] + '.' + row['Available'] + '.'

                end
                return @mycur

            rescue Mysql::Error => e
                puts e.errno
                puts e.error
                
            ensure
                con.close if con
            end
        end

        def find_user()
            begin

                @mycur = Array.new
                con = Mysql.new DB_HOST, DB_USER, DB_PASS, DB_NAME
                con.query("SET NAMES UTF8")
                rs = con.query("SELECT * FROM Persons")
                rs.each_hash do |row|
                    @mycur << row['Name'].to_s + '%' + row['Pic'].to_s + '|'
                end

            rescue Mysql::Error => e
                puts e.errno
                puts e.error
                
            ensure
                con.close if con
            end
        end

        def keeprecord(namec,named,price,currency)
            begin
                con = Mysql.new DB_HOST, DB_USER, DB_PASS, DB_NAME

                @namec = namec
                @named = named
                @price = price
                @time = Time.new
                @date = @time.year.to_s + '/' + @time.month.to_s + '/' + @time.day.to_s
                @currency = currency
                con.query("SET NAMES UTF8")
                con.query("INSERT INTO Record(Credit, Debt, Booking, Currency, CreateTime) VALUES('#{@namec}','#{@named}','#{@named} -> #{@namec} #{@price}.','#{@currency}','#{@date}')")

            rescue Mysql::Error => e
                puts e.errno
                puts e.error
                
            ensure
                con.close if con
            end
        end

        def pincode(currency,pin,create)
            begin
                con = Mysql.new DB_HOST, DB_USER, DB_PASS, DB_NAME

                @currency = currency
                @pin = pin
                @create = create
                con.query("SET NAMES UTF8")
                con.query("INSERT INTO pincode(Currency,Pin,CreateName) VALUES('#{@currency}',#{@pin},'#{@create}')")

            rescue Mysql::Error => e
                puts e.errno
                puts e.error
                
            ensure
                con.close if con
            end
        end

        def checkpin(pin,name)
            begin
                con = Mysql.new DB_HOST, DB_USER, DB_PASS, DB_NAME
                @pin = pin
                @name = name
                con.query("SET NAMES UTF8")
                # rs = con.query("SELECT Currency FROM pincode WHERE Pin = #{@pin} AND CreateName NOT IN ('#{@name}')")
                rs = con.query("SELECT Currency FROM pincode WHERE Pin = #{@pin} AND CreateName = '#{@name}'")
                if rs.fetch_row.nil? == true
                    @result = 'fail'
                else
                    rs = con.query("SELECT Currency FROM pincode WHERE Pin = #{@pin} AND CreateName = '#{@name}'")
                    @result = rs.fetch_row[0].to_s
                    rs = con.query("DELETE FROM pincode WHERE Pin = #{@pin}")
                end
                

            rescue Mysql::Error => e
                puts e.errno
                puts e.error
                
            ensure
                con.close if con
            end
        end

        def addfriend(name,friend)
            begin
                con = Mysql.new DB_HOST, DB_USER, DB_PASS, DB_NAME
                @myfriend = Array.new
                @name = name
                @friend = friend.to_s + "."
                con.query("SET NAMES UTF8")
                rs = con.query("SELECT Friend FROM Persons WHERE Name = '#{@name}' AND Friend IS NOT NULL")
                if rs.num_rows != 0
                    @friend.force_encoding('UTF-8')
                    @friend += rs.fetch_row[0].to_s.force_encoding('UTF-8')
                    @myfriend = @friend.split('.')
                    @myfriend.uniq!
                    @friend = @myfriend.map { |k| "#{k}." }.join("").to_s.force_encoding('UTF-8')
                end
                # @friend.force_encoding(Encoding::UTF_8)
                con.query("SET NAMES UTF8")
                rs = con.query("UPDATE Persons SET Friend = '#{@friend}' WHERE Name = '#{@name}'")

            rescue Mysql::Error => e
                puts e.errno
                puts e.error
                
            ensure
                con.close if con
            end
        end

        def find_friend(name)
            begin
                con = Mysql.new DB_HOST, DB_USER, DB_PASS, DB_NAME
                @name = name
                con.query("SET NAMES UTF8")
                rs = con.query("SELECT Friend FROM Persons WHERE Name = '#{@name}' AND Friend IS NOT NULL")
                if rs.num_rows != 0
                    @friend = rs.fetch_row[0].to_s
                else 
                    @friend = ''
                end

            rescue Mysql::Error => e
                puts e.errno
                puts e.error
                
            ensure
                con.close if con
            end
        end


        def getrecord(name)
            begin
                con = Mysql.new DB_HOST, DB_USER, DB_PASS, DB_NAME
                @name = name
                @mycur = Array.new
                con.query("SET NAMES UTF8")
                rs = con.query("SELECT * FROM Record WHERE Credit = '#{@name}' OR Debt = '#{@name}'")
                rs.each_hash do |row|
                    @mycur << row['CreateTime'].to_s + ' ' + row['Booking'].to_s
                end

            rescue Mysql::Error => e
                puts e.errno
                puts e.error
                
            ensure
                con.close if con
            end
        end

        def toStore(name,price)
            begin
                con = Mysql.new DB_HOST, DB_USER, DB_PASS, DB_NAME
                @mycur = Array.new
                @mypri = Array.new
                @name = name
                @mycur.push(@name)
                @mypri.push(price)
                con.query("SET NAMES UTF8")
                minusAvailable(@name,@mycur,@mypri)
                minus(@name,@mycur,@mypri)
                add('誠實商店',@mycur,@mypri)

            rescue Mysql::Error => e
                puts e.errno
                puts e.error
                
            ensure
                con.close if con
            end
        end

        def minus(name,currency,price)
            begin
                con = Mysql.new DB_HOST, DB_USER, DB_PASS, DB_NAME
                @name = name
                @currency = currency
                @price = price
                con.query("SET NAMES UTF8")
                @currency.each_with_index do |c, index|
                    rs = con.query("SELECT Price FROM User WHERE Name = '#{@name}' AND Currency = '#{c}'")
                    @pricereminder = rs.fetch_row[0].to_i - @price[index].to_i
                    puts "reminder: #{@pricereminder}"
                    if @pricereminder == 0
                        rs = con.query("DELETE FROM User WHERE Name = '#{@name}' AND Currency = '#{c}'")
                    else
                        rs = con.query("UPDATE User SET Price = #{@pricereminder} WHERE Name = '#{@name}' AND Currency = '#{c}'")
                    end
                end

            rescue Mysql::Error => e
                puts e.errno
                puts e.error
                
            ensure
                con.close if con
            end
        end

        def minusAvailable(name,currency,price)
            begin
                con = Mysql.new DB_HOST, DB_USER, DB_PASS, DB_NAME
                @name = name
                @currency = currency
                @price = price
                con.query("SET NAMES UTF8")
                @currency.each_with_index do |c, index|
                    rs = con.query("SELECT Available FROM User WHERE Name = '#{@name}' AND Currency = '#{c}'")
                    @pricereminder = rs.fetch_row[0].to_i - @price[index].to_i
                    rs = con.query("UPDATE User SET Available = #{@pricereminder} WHERE Name = '#{@name}' AND Currency = '#{c}'")
                end

            rescue Mysql::Error => e
                puts e.errno
                puts e.error
                
            ensure
                con.close if con
            end
        end

        def add(name,currency,price)
            begin
                con = Mysql.new DB_HOST, DB_USER, DB_PASS, DB_NAME
                @name = name
                @currency = currency
                @price = price
                con.query("SET NAMES UTF8")
                @currency.each_with_index do |c, index|
                    rs = con.query("SELECT Price FROM User WHERE Name = '#{@name}' AND Currency = '#{c}'")
                    # puts rs.fetch_row.nil?, @price[index].to_i, c
                    # puts rs.fetch_row[0].to_i
                    if rs.fetch_row.nil? == true
                        rs = con.query("INSERT INTO User(Name,Currency,Price,Available) VALUES('#{@name}','#{c}',#{@price[index].to_i},#{@price[index].to_i})")
                        puts "ok #{index}"
                    else
                        rs = con.query("SELECT Price FROM User WHERE Name = '#{@name}' AND Currency = '#{c}'")
                        @priceadd = rs.fetch_row[0].to_i + @price[index].to_i
                        rs = con.query("SELECT Available FROM User WHERE Name = '#{@name}' AND Currency = '#{c}'")
                        @availableadd = rs.fetch_row[0].to_i + @price[index].to_i
                        rs = con.query("UPDATE User SET Price = #{@priceadd}, Available = #{@availableadd} WHERE Name = '#{@name}' AND Currency = '#{c}'")
                    end
                end

            rescue Mysql::Error => e
                puts e.errno
                puts e.error
                
            ensure
                con.close if con
            end
        end
    end

    get '/' do
        erb :indexminify
    end

    get '/find_user' do
        find_user
        return @mycur
    end 

    post '/find_friend' do 
        find_friend params[:name]
        return @friend
    end

    post '/save_name' do
        save_name params[:name], params[:pic]
    end

    post '/find_my_money' do 
        find_my_money params[:name]
        return @mycur
    end

    post '/minus' do 
        minus params[:name], params[:currency], params[:price]
    end

    post '/minusAvailable' do
        minusAvailable params[:name], params[:currency], params[:price]
    end

    post '/add' do 
        add params[:name], params[:currency], params[:price]
    end

    post '/checkpin' do 
        checkpin params[:pin], params[:name]
        return @result
    end

    post '/keeprecord' do 
        keeprecord params[:namec], params[:named], params[:price], params[:currency]
    end

    post '/getrecord' do 
        getrecord params[:name]
        return @mycur
    end

    post '/pincode' do 
        pincode params[:currency], params[:pin], params[:create]
    end

    post '/addfriend' do 
        addfriend params[:name], params[:friend]
    end

    post '/toStore' do
        toStore params[:name], params[:price]
    end

end
