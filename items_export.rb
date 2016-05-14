require 'pocket-ruby'
require 'dotenv'
require 'ap'
require 'json'

Dotenv.load

Pocket.configure do |config|
  config.consumer_key = ENV['consumer_key']
end

access_token = ENV["sandbag_token"]

client = Pocket.client(:access_token => access_token)

info = client.retrieve(
  :detailType => :complete,
  :state => :unread,
  :sort => "newest",
  :count => 100
)

def conv(obj)
  item_id = obj['resolved_id']
  if item_id == "0"
    item_id = obj['item_id']
  end
  item_url = obj['resolved_url']
  unless item_url
    item_url = obj['given_url']
  end
  image_url = nil
  if obj['has_image'] == "1"
    image_url = obj['images']["1"]["src"]
  end
  item = {item_id: item_id, item_url: item_url, image_url: image_url}
  return item
end

rows = []
info['list'].each do |i|
  rows << conv(i[1])
end

open("items.json", "w") do |io|
	JSON.dump(rows, io)
end
