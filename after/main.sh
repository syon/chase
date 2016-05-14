#!/bin/sh

# export item ids and image urls from pocket (items.json)
bundle exec ruby after/items_export.rb

# scrapes to get ogp data and download images
bundle exec ruby after/items_ogp.rb

# convert to jpg
mogrify -format jpg after/results/*/*.gif
mogrify -format jpg after/results/*/*.png

# resize width 200px
mogrify -resize 200x after/results/*/*.jpg

# delete except jpg
find after/results -type f -name '*.gif' -delete
find after/results -type f -name '*.png' -delete
find after/results -type f -name '*.jpg~' -delete
