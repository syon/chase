Film
====

## build

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
