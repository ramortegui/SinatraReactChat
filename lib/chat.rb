require 'singleton'
class Chat
  attr_accessor :name
  include Singleton 

  def initialize
    @rooms = Hash.new 
  end

  def create_room ( room )
    @rooms[room.name] = room 
  end

  def get_rooms_general_info
    room_info = []
    @rooms.each do |key, room|
      room_info << { :name => key, :users => room.count_users }  
    end
    room_info.sort! { |a,b| a[:name].downcase <=> b[:name].downcase  }
  end

  def get_room_info(name_room)
    @rooms[name_room]
  end

  def enter_room( username, room_name )
    @rooms[room_name].users << username  
    @rooms[room_name]
  end
  
  def add_message( username, room_name, message )
    @rooms[room_name].messages << Message.new(username, message)
  end

  def leave_room( username, room_name)
    @rooms[room_name].users.delete(username) if @rooms[room_name]
  end
end

class Room
  attr_accessor :name, :users, :messages
  def initialize(name)
    @name = name
    @users = []
    @messages = []
  end

  def count_users
    @users.count
  end
end

class Message
  attr_accessor :user, :message, :created_at 
  def initialize( user, message )
    @user = user
    @message = message
    @created_at = Time.now()
  end
end
