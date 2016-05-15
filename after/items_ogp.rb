require './after/scrape_util'
require 'json'
require 'active_support/core_ext/object/blank'
require "ap"

def get_item10_id(item_id)
  id = item_id.rjust(10, '0') # leftpad
  id[0, 10]
end

exist_ids = []
Dir::glob("after/thumbs/**/*.jpg").each do |f|
  exist_ids << File.basename(f, ".jpg")
end

# url = 'http://www.perfume-web.jp'
data = open("after/items.json") do |io|
  JSON.load(io)
end

puts "==== GET IMAGE URL ============================"

sites = []
dl_queue = []
data.each do |r|
  puts "\n#{r["item_id"]} - - - - - - - -"

  id10 = get_item10_id(r["item_id"])
  if exist_ids.include?(id10)
    puts "-- #{id10} (ALREADY SCRAPED)"
    next
  else
    puts "-- #{id10} (NEW SCRAPING)"
  end

  begin
    site = ScrapeUtil.new(r["item_url"])
    puts site.get_title
    puts "[org] #{r["image_url"]}"
    puts "[ogp] #{site.get_imagepath}"
    r["image_url"] = site.get_imagepath if site.get_imagepath.present?
    puts "[aft] #{r["image_url"]}"
    dl_queue << id10
  rescue => e
    puts "ERROR"
    ap r
    ap e
  end
end

puts "==== DOWNLOAD IMAGE ============================"
ap dl_queue
data.each do |r|
  id10 = get_item10_id(r["item_id"])
  unless dl_queue.include?(id10)
    puts "-- #{id10} (ALREADY DOWNLOADED)"
    next
  else
    puts "-- #{id10} (NEW DOWNLOAD)"
  end

  begin
    img_url = r["image_url"]
    ap r
    next unless img_url
    m = img_url.match(%r{.(gif|jpg|png)(\?.*)?$}i)
    next unless m
    exp = m[1]
    unless exp
      puts "Not an image: #{img_url}"
      next
    end
    dest_dir = id10[0, 3]
    `mkdir -p after/thumbs/#{dest_dir}`
    `curl -o after/thumbs/#{dest_dir}/#{id10}.#{exp} #{img_url}`
  rescue => e
    puts "ERROR!!"
    ap r
    ap e
  end
end
