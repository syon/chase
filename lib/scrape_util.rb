require 'nokogiri'
require 'open-uri'
require 'open_uri_redirections'
require 'aws-sdk'

class ScrapeUtil
  def prepare(url)
    html = open(url, :allow_redirections => :safe) do |f|
      @charset = f.charset
      f.read
    end
    @doc = Nokogiri::HTML.parse(html, @charset)
  end

  def put_thumbnail(data)
    item = conv(data)
    id10 = get_item10_id(item[:item_id])
    img_url = item[:image_url]
    dest_dir = id10[0, 3]
    key  = get_s3_obj_key(id10)
    obj  = S3_BUCKET.object(key)
    return if obj.exists?

    result = ''
    begin
      prepare(item[:item_url])
      img_url = get_imagepath if get_imagepath.present?
      exp = get_exp_from_content_type(img_url)
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
      result = 'Thumbnail OK!'
    rescue => e
      puts "== ERROR on put_thumbnail =="
      ap e
      result = 'Thumbnail NG...'
      obj.upload_file('after/blank.jpg')
    end
    result
  end

  private

    def get_title
      if @doc.css('//meta[property="og:site_name"]/@content').empty?
        return @doc.title.to_s
      else
        return @doc.css('//meta[property="og:site_name"]/@content').to_s
      end
    end

    def get_description
      if @doc.css('//meta[property="og:description"]/@content').empty?
        return @doc.css('//meta[name$="escription"]/@content').to_s
      else
        return @doc.css('//meta[property="og:description"]/@content').to_s
      end
    end

    def get_imagepath
      return @doc.css('//meta[property="og:image"]/@content').to_s
    end

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
      if obj['has_image'] == "1" && obj['images']["1"]
        image_url = obj['images']["1"]["src"]
      end
      item = {item_id: item_id, item_url: item_url, image_url: image_url}
      return item
    end

    def get_item10_id(item_id)
      id = item_id.rjust(10, '0') # leftpad
      id[0, 10]
    end

    def get_s3_obj_key(item10_id)
      "items/thumbs/#{item10_id[0, 3]}/#{item10_id}.jpg"
    end

    def get_exp_from_content_type(url)
      c = `curl -I '#{url}'`
      m = c.match(%r{^Content-Type: image/(gif|jpg|jpeg|png|svg|svg\+xml)\r$}i)
      exp = m ? m[1] : ""
      exp.sub! /jpeg/, 'jpg'
      exp.sub! /svg\+xml/, 'svg'
      exp
    end
end
