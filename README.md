# Elliptical Html Boilerplate Project

Installs an elliptical html boilerplate project. By default, uses libsass for faster sass compilation, although elliptical-sass will compile
under ruby sass.

# Installation


##prerequisites

``` bash

sudo gem install node-sass -g

```


#clone repo

``` bash

git clone https://github.com/tachyon1337/elliptical-boilerplate.git
mv ./elliptical-boilerplate  my-project
cd my-project

```


#npm

``` bash

npm init
npm install
gulp build

```


#tasks

``` bash

gulp start


```

# Browser

``` bash

localhost:8080

```

## Additional Tasks

``` bash

gulp start-live [live reload]
localhost:9040

gulp sass [manual compilation]
gulp sass-watch [auto compilation on changes]




