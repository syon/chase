require "pocket-ruby"
require 'dotenv'
require "ap"
require 'csv'

Dotenv.load

Pocket.configure do |config|
  config.consumer_key = ENV['consumer_key']
end

access_token = ENV["sandbag_token"]

client = Pocket.client(:access_token => access_token)

info = client.retrieve(
  :detailType => :complete,
  :sort => "newest",
  :count => 50
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
  item = {item_id: item_id, item_url: item_url}
  return item
end

rows = []
info['list'].each do |i|
  rows << conv(i[1])
end

data = CSV.generate do |csv|
  rows.each do |r|
    csv << [
      r[:item_id],
      r[:item_url]
    ]
  end
end

File.open("items.csv", 'w') do |file|
  file.write(data)
end
