require 'sinatra/base'
require 'mysql'

class SocialMoneyClass < Sinatra::Base
    helpers do
        def save_name(name)
            begin
                @name = name
                con = Mysql.new 'us-cdbr-iron-east-03.cleardb.net', 'b2e373432ecddb', '1b03db28', 'heroku_31a4afc40e277ed'
                # con = Mysql.new 'us-cdbr-iron-east-03.cleardb.net', 'b2e373432ecddb', '1b03db28', 'SamWang'

                con.query("SET NAMES UTF8")
                # con.query("ALTER DATABASE SamWang CHARACTER SET utf8 COLLATE utf8_general_ci")
                # con.query("ALTER TABLE User CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci")
                rs = con.query("SELECT * FROM User WHERE Name = '#{@name}'")
                if rs.num_rows == 0
                    con.query("INSERT INTO User(Name, Currency, Price) VALUES('#{@name}','#{@name}',10000)")
                end
                # rs.each_hash do |row|
                #     # puts row['Name']
                #     if row['Name'] == @name
                #         break
                #     end
                #     if rs.row_tell.to_s.to_i == rs.num_rows - 1
                #         con.query("SET NAMES UTF8")
                #         con.query("INSERT INTO User(Name) VALUES('#{@name}')")
                #     end
                # end  
                
            rescue Mysql::Error => e
                puts e.errno
                puts e.error
                
            ensure
                con.close if con
            end
        end

        def find_currency(name, price)
            begin
                @cur = Array.new
                @pri = Array.new
                @name = name
                @price = price
                con = Mysql.new 'us-cdbr-iron-east-03.cleardb.net', 'b2e373432ecddb', '1b03db28', 'heroku_31a4afc40e277ed'
                con.query("ALTER DATABASE SamWang CHARACTER SET utf8 COLLATE utf8_general_ci")
                con.query("ALTER TABLE User CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci")
                # con.query("SET NAMES UTF8")
                rs = con.query("SELECT * FROM User WHERE Name = '#{@name}' AND Price >= #{@price}")
                rs.each_hash do |row|
                    @currency = row['Currency'].to_s
                    @currency.force_encoding('UTF-8')
                    # @cur.push(@currency)
                    @cur << @currency + row['Price'].to_s
                    # @pri << row['Price'].to_i
                    # @cur[@currency] = row['Price'].to_i
                end
                return @cur
                # @pri
                # erb :index

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
                con = Mysql.new 'us-cdbr-iron-east-03.cleardb.net', 'b2e373432ecddb', '1b03db28', 'heroku_31a4afc40e277ed'
                con.query("SET NAMES UTF8")
                rs = con.query("SELECT * FROM User WHERE Name = '#{@name}'")
                rs.each_hash do |row|
                    @mycurrency = row['Currency'].to_s
                    @mycurrency.force_encoding('UTF-8')
                    # @cur.push(@currency)
                    @mycur << @mycurrency + row['Price'].to_s
                    # @pri << row['Price'].to_i
                    # @cur[@currency] = row['Price'].to_i
                end
                return @mycur

            rescue Mysql::Error => e
                puts e.errno
                puts e.error
                
            ensure
                con.close if con
            end
        end

        def keeprecord(namec,named,price,currency)
            begin
                con = Mysql.new 'us-cdbr-iron-east-03.cleardb.net', 'b2e373432ecddb', '1b03db28', 'heroku_31a4afc40e277ed'

                @namec = namec
                @named = named
                @price = price
                @currency = currency
                puts @namec.class, @named, @price
                # con.query("ALTER TABLE Record CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_bin")
                con.query("SET NAMES UTF8")
                con.query("INSERT INTO Record(Credit, Debt, Booking, Currency) VALUES('王敍親','#{@named}','#{@named} borrowed #{@price} from #{@namec}.','#{@currency}')")

            rescue Mysql::Error => e
                puts e.errno
                puts e.error
                
            ensure
                con.close if con
            end
        end

        def getrecord(name)
            begin
                con = Mysql.new 'us-cdbr-iron-east-03.cleardb.net', 'b2e373432ecddb', '1b03db28', 'heroku_31a4afc40e277ed'
                @name = name
                @mycur = Array.new
                con.query("SET NAMES UTF8")
                rs = con.query("SELECT Booking FROM Record WHERE Credit = '#{@name}' OR Debt = '#{@name}'")
                rs.each_hash do |row|
                    @mycur << row['Booking'].to_s
                end

            rescue Mysql::Error => e
                puts e.errno
                puts e.error
                
            ensure
                con.close if con
            end
        end

        def minus(name,currency,price)
            begin
                con = Mysql.new 'us-cdbr-iron-east-03.cleardb.net', 'b2e373432ecddb', '1b03db28', 'heroku_31a4afc40e277ed'
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

        def add(name,currency,price)
            begin
                con = Mysql.new 'us-cdbr-iron-east-03.cleardb.net', 'b2e373432ecddb', '1b03db28', 'heroku_31a4afc40e277ed'
                @name = name
                @currency = currency
                @price = price
                con.query("SET NAMES UTF8")
                puts @name,@currency,@price
                @currency.each_with_index do |c, index|
                    rs = con.query("SELECT Price FROM User WHERE Name = '#{@name}' AND Currency = '#{c}'")
                    # puts rs.fetch_row.nil?, @price[index].to_i, c
                    # puts rs.fetch_row[0].to_i
                    if rs.fetch_row.nil? == true
                        rs = con.query("INSERT INTO User(Name,Currency,Price) VALUES('#{@name}','#{c}',#{@price[index].to_i})")
                        puts "ok #{index}"
                    else
                        # puts rs.fetch_row[0].to_i
                        rs = con.query("SELECT Price FROM User WHERE Name = '#{@name}' AND Currency = '#{c}'")
                        @priceadd = rs.fetch_row[0].to_i + @price[index].to_i
                        rs = con.query("UPDATE User SET Price = #{@priceadd} WHERE Name = '#{@name}' AND Currency = '#{c}'")
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
        erb :index
    end

    post '/save_name' do
        save_name params[:name]
    end

    post '/find_currency' do 
        find_currency params[:name], params[:price]
        return @cur
    end

    post '/find_my_money' do 
        find_my_money params[:name]
        return @mycur
    end

    post '/minus' do 
        minus params[:name], params[:currency], params[:price]
    end

    post '/add' do 
        add params[:name], params[:currency], params[:price]
    end

    post '/keeprecord' do 
        keeprecord params[:namec], params[:named], params[:price], params[:currency]
    end

    post '/getrecord' do 
        getrecord params[:name]
        return @mycur
    end

end
