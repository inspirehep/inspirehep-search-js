Inspire-Search-Js
=================

[![Build Status](https://img.shields.io/travis/inspirehep/inspirehep-search-js.svg)](https://travis-ci.org/inspirehep/inspirehep-search-js)
[![Coverage](https://img.shields.io/coveralls/inspirehep/inspirehep-search-js.svg)](https://coveralls.io/r/inspirehep/inspirehep-search-js)
[![LICENSE](https://img.shields.io/github/license/inspirehep/inspirehep-search-js.svg)](https://github.com/inspirehep/inspirehep-search-js/blob/master/LICENSE)

Inspire-search Angular JS module used in http://labs.inspirehep.net search results.

Installation
------------

    $ npm i
    
Release
-------
❗❗❗ **Release step in actions doesn't work** ❗❗❗

1. Setup your `token` with from the `inspirehep` npm account (passbolt)
2. Edit in `package.json` the `version`.
3. `$ npm run-script postversion`
4. `$ npm publish --access public`
5. OPTIONAL: bump version in [inspire-next](https://github.com/inspirehep/inspire-next/blob/9cfc78e3b541650412bec1432c87f8a6648a12a2/inspirehep/modules/search/bundles.py#L37)


Demo
----

    $ cd example; npm install; cd ..
    $ npm run-script demo

Navigate to `http://localhost:8000` to see the `demo`.

Tests
-----

    $ npm test

Docs
----

    $ # build
    $ npm run-script docs
    $ # read
    $ open docs/index.html
    
   


How to use?
-----------

Check out the `example/` to see how to configure your app.

How to develop?
--------------
For easy development of **inspirehep-search-js** on top of **[inspire-next](https://github.com/inspirehep/inspire-next)** follow these steps:

1) Fork this repo and clone your personal fork.


    laptop> $ git clone git@github.com:<username>/inspirehep-search-js.git
    laptop> $ cd inspirehep-search-js

2) Set `ASSETS_DEBUG=True` in your configuration for easier debugging in the browser (files do not get minified).


    laptop> $ vim $DOCKER_DATA/tmp/virtualenv/var/inspirehep-instance/inspirehep.cfg

3) Install **Node.js** and npm on your system. If you are using Ubuntu, create a symlink from **node** to **nodejs** (needed because of a naming conflict with the node package).


    laptop> $ sudo apt-get update
    laptop> $ sudo apt-get install nodejs
    laptop> $ sudo ln -s "$(which nodejs)" /usr/bin/node
    laptop> $ sudo apt-get install npm

4) Install **PhantomJS** on your system and add `PHANTOMJS_BIN:$(which phantomjs)` env variable in `.bashrc` or `.zshrc`. to specify the path to the phantomjs binary.


    laptop> $ sudo apt-get update
    laptop> $ sudo apt-get install phantomjs

5) Assuming you followed the current **[INSPIRE-HEP](http://inspirehep.readthedocs.io/en/latest/getting_started.html)** installation guide documentation, add the volume to `services.yml` to mount **inspire-search-js** on **Docker**.


    laptop> $ vim /inspire-next/services.yml


    ```
    static:
        image: busybox
        volumes:
        - "<your-local-path>/inspirehep-search-js:/inspirehep-search-js"
        ```

6) Restart the containers and open a bash in the web container.


    laptop> $ docker-compose kill
    laptop> $ docker-compose rm
    laptop> $ docker-compose run web bash

7)  In the container bash, link the js volume to `/static/node_modules`. **CAREFUL**: if you run `laptop> $ ./inspire-next/scripts/clean_assets`, the link will have to be created again!


    container> $ rm -rf /virtualenv/var/inspirehep-instance/static/node_modules/inspirehep-search-js
    container> $ ln -s /inspirehep-search-js /virtualenv/var/inspirehep-instance/static/node_modules/inspirehep-search-js

8) To install all dependencies and **Gulp.js**, in the **inspirehep-search-js** folder run:


    laptop> $ npm install 
    laptop> $ nmp install gulp

9) As you run **inspire-next**, start watching changes in the **inspirehep-search-js** folder. Every time a **JS** or **HTML** file is modified, tests will run and the `dist/` folder will be recreated.


    laptop> $ cd inspirehep-search-js
    laptop> $ gulp watch

10) Every time you modify a **JavaScript** or **HTML** template, **hard refresh** your browser to avoid caching and see your changes. If the changes are not reflected after refreshing, you might need to delete the gen folder from the container in order to prevent caching.


    container> $ rm -rf /virtualenv/var/inspirehep-instance/static/gen/ .webassets-cache/
