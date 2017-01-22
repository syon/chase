Chase
=====

Web client for Pocket

- https://syon-chase.herokuapp.com


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

### dev

starts __gulp watch__ and __unicorn__ by foreman

```sh
$ npm run dev
```

### build

```sh
$ npm run build
```


## Deploy

```sh
$ git push heroku master
```
