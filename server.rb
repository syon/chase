require 'pocket-ruby'
require 'sinatra'
require 'sinatra/json'
require 'dotenv'
require 'active_support/core_ext/object/blank'
require './after/scrape_util'

Dotenv.load

Aws.config.update({
  region: 'us-east-1',
  credentials: Aws::Credentials.new(ENV['AWS_ACCESS_KEY_ID'], ENV['AWS_SECRET_ACCESS_KEY'])
})

S3_BUCKET = Aws::S3::Resource.new.bucket(ENV['S3_BUCKET'])

use Rack::Session::Cookie, :key => 'rack.session',
                           :domain => ENV['domain'],
                           :path => '/',
                           :expire_after => 2592000 # In seconds

CALLBACK_URL = "https://#{ENV['fqdn']}/oauth/callback"

Pocket.configure do |config|
  config.consumer_key = ENV['consumer_key']
end

get "/" do
  if session[:access_token]
    erb :index
  else
    redirect "/connect"
  end
end

get "/connect" do
  erb :connect
end

get "/disconnect" do
  session.clear
  redirect "/"
end

get "/oauth/connect" do
  puts "OAUTH CONNECT"
  session[:code] = Pocket.get_code(:redirect_uri => CALLBACK_URL)
  new_url = Pocket.authorize_url(:code => session[:code], :redirect_uri => CALLBACK_URL)
  redirect new_url
end

get "/oauth/callback" do
  puts "OAUTH CALLBACK"
  result = Pocket.get_result(session[:code], :redirect_uri => CALLBACK_URL)
  session[:access_token] = result['access_token']
  redirect "/"
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

post "/fav" do
  data = JSON.parse request.body.read
  client = Pocket.client(:access_token => session[:access_token])
  actions = [{action: 'favorite', item_id: data['item_id']}]
  res = client.modify(actions)
  json res
end

post "/unfav" do
  data = JSON.parse request.body.read
  client = Pocket.client(:access_token => session[:access_token])
  actions = [{action: 'unfavorite', item_id: data['item_id']}]
  res = client.modify(actions)
  json res
end

post "/archive" do
  data = JSON.parse request.body.read
  client = Pocket.client(:access_token => session[:access_token])
  actions = [{action: 'archive', item_id: data['item_id']}]
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

post "/thumbnail" do
  data = JSON.parse request.body.read
  su = ScrapeUtil.new
  su.put_thumbnail(data)
end
