#!/bin/sh

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
