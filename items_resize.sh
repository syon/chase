# convert to jpg
mogrify -format jpg results/*/*.gif
mogrify -format jpg results/*/*.png

# resize width 200px
mogrify -resize 200x results/*/*.jpg

# delete except jpg
find results -type f -name '*.png' -delete
