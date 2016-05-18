#!/bin/sh

### Phase.1
echo "\033[1;46m Scraping... \033[0;39m"

# export item ids and image urls from pocket (items.json)
bundle exec ruby after/items_export.rb

# scrapes to get ogp data and download images
bundle exec ruby after/items_ogp.rb

### Phase.2
echo "\033[1;46m Convert and resize \033[0;39m"

# convert to jpg
mogrify -format jpg after/thumbs/*/*.gif
mogrify -format jpg -fill "#FFFFFF" -opaque none after/thumbs/*/*.png
mogrify -format jpg after/thumbs/*/*.svg

# resize width 200px
mogrify -resize 200x after/thumbs/*/*.jpg

# delete except jpg
find after/thumbs -type f -name '*.gif' -delete
find after/thumbs -type f -name '*.png' -delete
find after/thumbs -type f -name '*.svg' -delete
find after/thumbs -type f -name '*~' -delete
find after/thumbs -type f -name '*.' -delete

### Phase.3
echo "\033[1;46m Syncing Amazon S3 \033[0;39m"

# Upload to S3
bundle exec ruby after/upload-s3.rb
