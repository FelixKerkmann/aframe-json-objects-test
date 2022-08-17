## Virtual Showroom Creator IP6

### Setup:

#### Prerequisites
- node.js Version >= 15.4.0
- npm Version >= 7.0.15
- git

#### Start Application
``` shell
git clone git@gitlab.fhnw.ch:iit-projektschiene/fs22/ip6_virtual-showroom-creator.git
```
in the project directory:
``` shell
npm install

npm start
```

It is possible to debug with flags.
``` shell
npm start -- debug-updateDB
```
Application runs local on [127.0.0.1:8888](http://127.0.0.1:8888)


#### Connect own MongoDB

Edit the Variables in the [.env](.env) file to your DB and check in the [db.config.js](db.config.js) the Connection String