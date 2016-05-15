#!/bin/sh

# export item ids and image urls from pocket (items.json)
bundle exec ruby after/items_export.rb

# scrapes to get ogp data and download images
bundle exec ruby after/items_ogp.rb

# convert to jpg
mogrify -format jpg after/thumbs/*/*.gif
mogrify -format jpg after/thumbs/*/*.png
mogrify -format jpg after/thumbs/*/*.svg

# resize width 200px
mogrify -resize 200x after/thumbs/*/*.jpg

# delete except jpg
find after/thumbs -type f -name '*.gif' -delete
find after/thumbs -type f -name '*.png' -delete
find after/thumbs -type f -name '*.svg' -delete
find after/thumbs -type f -name '*~' -delete
find after/thumbs -type f -name '*.' -delete

# sync with S3
aws s3 sync after/thumbs s3://syon-chase/items/thumbs/
