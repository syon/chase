Chase
=====

Web App client for Pocket

- http://syon-chase.herokuapp.com


## Develop

### prepare

```sh
# .env (local)
domain="local.syon-chase.herokuapp.com"
fqdn="local.syon-chase.herokuapp.com:4567"
consumer_key="99999-xxxxxxxxxxxxxxxxxxxxxxxx"
```

```sh
# /etc/hosts
127.0.0.1       local.syon-chase.herokuapp.com
```

```sh
$ npm install
```

### build and run

```sh
$ gulp
```

```sh
$ bundle exec ruby server.rb
```


## Deploy

```sh
$ git push heroku master
```
