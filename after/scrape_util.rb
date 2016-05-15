require 'nokogiri'
require 'open-uri'
require 'open_uri_redirections'

class ScrapeUtil
  def initialize(url)
    html = open(url, :allow_redirections => :safe) do |f|
      @charset = f.charset
      f.read
    end
    @doc = Nokogiri::HTML.parse(html, @charset)
  end

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
end
