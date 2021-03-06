require 'sinatra'
require 'chat'
require 'json'
use Rack::Session::Cookie, :key => 'rack.session',
                           :domain => 'localhost',
                           :path => '/',
                           :expire_after => 30600, 
                           :secret => 'a secret'

set :views, settings.root + '/../views/'
set :public_folder, File.dirname(__FILE__) + '/../public/'
@c = Chat.instance
@c.name = 'Test chat'
@c.create_room(Room.new('test_room'))
get '/' do 
  erb :index
end
post '/' do
  session[:nickname] = params[:nickname]
  @c = Chat.instance
  @c.enter_room(session[:nickname],'test_room')
  erb :index
end
get '/users' do
  @c = Chat.instance
  room_info = @c.get_room_info('test_room')
  JSON(room_info.users)
end
get '/messages' do
  @c = Chat.instance
  room_info = @c.get_room_info('test_room')
  num_messages = room_info.messages.count > 15 ? 15 : room_info.messages.count
  JSON(room_info.messages[-num_messages,num_messages].map { |message| { :message => message.message, :nickname => message.user } })
end
post '/messages' do
  @c = Chat.instance
  room_info = @c.get_room_info('test_room')
  @c.add_message(session[:nickname],'test_room',params[:message]) if session[:nickname] != nil
  num_messages = room_info.messages.count > 15 ? 15 : room_info.messages.count
  JSON(room_info.messages[-num_messages,num_messages].map { |message| { :message => message.message, :nickname => message.user } })
end
get '/leave' do
  @c = Chat.instance
  @c.leave_room(session[:nickname],'test_room')
  session.clear
  redirect '/'
end
