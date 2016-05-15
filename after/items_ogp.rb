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

def get_exp_from_content_type(url)
  c = `curl -I '#{url}'`
  ap c
  m = c.match(%r{^Content-Type: image/(gif|jpg|jpeg|png|svg|svg\+xml)\r$})
  exp = m ? m[1] : ""
  exp.sub! /jpeg/, 'jpg'
  exp.sub! /svg\+xml/, 'svg'
  exp
end

data.each do |r|
  id10 = get_item10_id(r["item_id"])
  img_url = r["image_url"]
  dest_dir = id10[0, 3]

  if !dl_queue.include?(id10)
    next
  elsif img_url
    puts "-- #{id10} (NEW DOWNLOAD)"
  else
    `mkdir -p after/thumbs/#{dest_dir}`
    `cp after/blank.jpg after/thumbs/#{dest_dir}/#{id10}.jpg`
    next
  end

  begin
    exp = get_exp_from_content_type(img_url)
    unless exp
      puts "Not an image:"
      puts "URL: #{img_url}"
      puts "EXP: #{exp}"
      next
    end
    `mkdir -p after/thumbs/#{dest_dir}`
    puts "Downloading... #{img_url}"
    `curl -o after/thumbs/#{dest_dir}/#{id10}.#{exp} #{img_url}`
    ap "after/thumbs/#{dest_dir}/#{id10}.#{exp}"
  rescue => e
    puts "ERROR!!"
    ap r
    ap e
  end
end
