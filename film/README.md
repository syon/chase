Film
====

made with [Puppeteer Lambda Starter Kit](StarterKit.md)


## make fontcache

0. AWS Lambda
0. make zip and upload
    - `.fonts`
    - `.fonts.conf`
    - `fontcache.py`
0. run it
0. get result file from syon-temp on S3


## build and make zip

```bash
npm run package-nochrome
rm package.zip
cp -r src/.fontconfig/ dist/.fontconfig/
cp -r src/.fonts/ dist/.fonts/
cp -r src/.fonts.conf dist/
cd dist
zip -rq ../film.zip .
cd ..
```
