require "pocket-ruby"
require "sinatra"
require "sinatra/json"
require 'dotenv'
require "ap"
require 'active_support/core_ext/object/blank'
require 'aws-sdk'
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

CALLBACK_URL = "http://#{ENV['fqdn']}/oauth/callback"

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
  ap session
  redirect new_url
end

get "/oauth/callback" do
  puts "OAUTH CALLBACK"
  result = Pocket.get_result(session[:code], :redirect_uri => CALLBACK_URL)
  ap result
  session[:access_token] = result['access_token']
  redirect "/"
end

get "/retrieve" do
  client = Pocket.client(:access_token => session[:access_token])
  ap session
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
  item = ScrapeUtil.conv(data)
  id10 = ScrapeUtil.get_item10_id(item[:item_id])
  img_url = item[:image_url]
  dest_dir = id10[0, 3]
  key  = ScrapeUtil.get_s3_obj_key(id10)
  obj  = S3_BUCKET.object(key)
  return if obj.exists?

  result = ''
  begin
    site = ScrapeUtil.new(item[:item_url])
    img_url = site.get_imagepath if site.get_imagepath.present?
    exp = ScrapeUtil.get_exp_from_content_type(img_url)
    if exp.blank?
      raise "Cannot get extention: #{img_url}"
    end
    img_path = 'tmp/' + key
    `mkdir -p #{File.dirname(img_path)}`
    open(img_path, 'wb') do |output|
      open(img_url) do |data|
        output.write(data.read)
      end
    end
    option = ''
    if 'png' == exp
      option = '-fill "#FFFFFF" -opaque none'
    end
    `mogrify -format jpg #{option} #{img_path}`
    `mogrify -resize 200x #{img_path}`
    obj.upload_file(img_path)
    File.delete(img_path)
    status 200
    result = 'OK!'
  rescue => e
    puts "ERROR!!"
    ap e
    result = 'NG...'
    obj.upload_file('after/blank.jpg')
    status 403
  end
  json result
end
