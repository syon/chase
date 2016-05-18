require 'aws-sdk'
require 'dotenv'
require 'ap'

Dotenv.load

Aws.config.update({
  region: 'us-east-1',
  credentials: Aws::Credentials.new(ENV['AWS_ACCESS_KEY_ID'], ENV['AWS_SECRET_ACCESS_KEY'])
})

S3_BUCKET = Aws::S3::Resource.new.bucket(ENV['S3_BUCKET'])

Dir::glob("after/thumbs/**/*.jpg").each do |path|
  key = path.sub 'after', 'items'
  obj = S3_BUCKET.object(key)
  result = obj.upload_file(path)
  ap "#{key} => #{result}"
  File.delete(path)
end
