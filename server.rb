require "pocket-ruby"
require "sinatra"
require "sinatra/json"
require 'dotenv'
require "ap"

Dotenv.load

enable :sessions

CALLBACK_URL = "http://localhost:4567/oauth/callback"

Pocket.configure do |config|
  config.consumer_key = ENV['consumer_key']
end

get '/reset' do
  session.clear
  redirect "/"
end

get "/" do
  if session[:access_token]
    erb :index
  else
    erb :login
  end
end

get "/oauth/connect" do
  puts "OAUTH CONNECT"
  session[:code] = Pocket.get_code(:redirect_uri => CALLBACK_URL)
  new_url = Pocket.authorize_url(:code => session[:code], :redirect_uri => CALLBACK_URL)
  puts "new_url: #{new_url}"
  puts "session: #{session}"
  redirect new_url
end

get "/oauth/callback" do
  puts "OAUTH CALLBACK"
  puts "request.url: #{request.url}"
  puts "request.body: #{request.body.read}"
  result = Pocket.get_result(session[:code], :redirect_uri => CALLBACK_URL)
  session[:access_token] = result['access_token']
  puts result['access_token']
  puts result['username']
  # Alternative method to get the access token directly
  #session[:access_token] = Pocket.get_access_token(session[:code])
  puts session[:access_token]
  puts "session: #{session}"
  redirect "/"
end

get '/add' do
  client = Pocket.client(:access_token => session[:access_token])
  info = client.add(:url => 'http://getpocket.com')
  "<pre>#{info}</pre>"
end

get "/retrieve" do
  client = Pocket.client(:access_token => session[:access_token])
  info = client.retrieve(
    :detailType => :complete,
    :sort => "newest",
    :count => 20
  )
  list = []
  info['list'].each do |i|
    list << i[1]
  end
  json list
end

post '/archive' do
  client = Pocket.client(:access_token => session[:access_token])
  actions = [{action: 'archive', item_id: params['item_id']}]
  res = client.modify(actions)
  json res
end
