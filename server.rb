require "pocket-ruby"
require "sinatra"
require "sinatra/json"
require 'dotenv'
require "ap"

Dotenv.load

enable :sessions

CALLBACK_URL = "http://#{ENV['host']}/oauth/callback"

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
    redirect "/login"
  end
end

get "/login" do
  erb :login
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
  result = Pocket.get_result(session[:code], :redirect_uri => CALLBACK_URL)
  ap result
  session[:access_token] = result['access_token']
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
    :count => 100
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

get "/info" do
  puts Time.now
  client = Pocket.client(:access_token => session[:access_token])
  unread  = client.retrieve(:state => :unread,  :detailType => :simple)
  archive = client.retrieve(:state => :archive, :detailType => :simple)
  all = client.retrieve(:state => :all, :detailType => :simple)
  result = {
    count_unread: unread['list'].size,
    count_archive: archive['list'].size
  }
  puts Time.now
  json result
end
