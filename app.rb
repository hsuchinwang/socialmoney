require 'sinatra/base'
require 'mysql'

class SocialMoneyClass < Sinatra::Base
    helpers do
        def save_name(name, pic)
            begin
                @name = name
                @pic = pic
                con = Mysql.new 'us-cdbr-iron-east-03.cleardb.net', 'b2e373432ecddb', '1b03db28', 'heroku_31a4afc40e277ed'
                # con = Mysql.new 'us-cdbr-iron-east-03.cleardb.net', 'b2e373432ecddb', '1b03db28', 'SamWang'

                con.query("SET NAMES UTF8")
                rs = con.query("SELECT * FROM User WHERE Name = '#{@name}'")
                if rs.num_rows == 0
                    con.query("INSERT INTO User(Name, Currency, Price) VALUES('#{@name}','#{@name}',10000)")
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
                con = Mysql.new 'us-cdbr-iron-east-03.cleardb.net', 'b2e373432ecddb', '1b03db28', 'heroku_31a4afc40e277ed'
                con.query("SET NAMES UTF8")
                rs = con.query("SELECT * FROM User WHERE Name = '#{@name}'")
                rs.each_hash do |row|
                    @mycurrency = row['Currency'].to_s
                    @mycurrency.force_encoding('UTF-8')
                    @mycur << @mycurrency + row['Price'].to_s

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

                # @mycur = Array.new
                # @mycur1 = Array.new
                @mycur = {
                    'name' => [],
                    'pic' => []
                }
                con = Mysql.new 'us-cdbr-iron-east-03.cleardb.net', 'b2e373432ecddb', '1b03db28', 'heroku_31a4afc40e277ed'
                con.query("SET NAMES UTF8")
                rs = con.query("SELECT * FROM Persons")
                rs.each_hash do |row|
                    @mycur['name'] += row['Name'].to_s
                    @mycur['pic'] += row['Pic'].to_s
                    # @mycur += row['Name'].to_s + '%' + row['Pic'].to_s + '|'
                    # @mycur1 += row['Name'].to_s

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
                con = Mysql.new 'us-cdbr-iron-east-03.cleardb.net', 'b2e373432ecddb', '1b03db28', 'heroku_31a4afc40e277ed'

                @namec = namec
                @named = named
                @price = price
                @time = Time.new
                @date = @time.year.to_s + '/' + @time.month.to_s + '/' + @time.day.to_s
                @currency = currency
                con.query("SET NAMES UTF8")
                con.query("INSERT INTO Record(Credit, Debt, Booking, Currency, CreateTime) VALUES('#{@namec}','#{@named}','#{@namec} -> #{@named} #{@price}.','#{@currency}','#{@date}')")

            rescue Mysql::Error => e
                puts e.errno
                puts e.error
                
            ensure
                con.close if con
            end
        end

        def pincode(currency,pin,create)
            begin
                con = Mysql.new 'us-cdbr-iron-east-03.cleardb.net', 'b2e373432ecddb', '1b03db28', 'heroku_31a4afc40e277ed'

                @currency = currency
                @pin = pin
                @create = create
                puts @create
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
                con = Mysql.new 'us-cdbr-iron-east-03.cleardb.net', 'b2e373432ecddb', '1b03db28', 'heroku_31a4afc40e277ed'
                @pin = pin
                @name = name
                con.query("SET NAMES UTF8")
                # rs = con.query("SELECT Currency FROM pincode WHERE Pin = #{@pin} AND CreateName NOT IN ('#{@name}')")
                rs = con.query("SELECT Currency FROM pincode WHERE Pin = #{@pin} AND CreateName = '#{@name}'")
                if rs.fetch_row.nil? == true
                    @result = 'fail'
                else
                    rs = con.query("SELECT Currency FROM pincode WHERE Pin = #{@pin}")
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

        def getrecord(name)
            begin
                con = Mysql.new 'us-cdbr-iron-east-03.cleardb.net', 'b2e373432ecddb', '1b03db28', 'heroku_31a4afc40e277ed'
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

    get '/find_user' do
        find_user
        return @mycur
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

end
