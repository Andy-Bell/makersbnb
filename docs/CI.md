#Continuous integration

The following technologies are used for continuous integration, as well as style
 checking and test coverage.

###Travis CI
[Travis] (https://travis-ci.org/) checks that each commit we push builds 
correctly, then runs all tests.

Help for writing the `.travis.yml` configuration file can be found
[here] (http://blog.tgrrtt.com/exploring-the-travisci-configuration-file). 

###Coveralls
[Coveralls] (https://coveralls.io/) checks test coverage on current builds.
We use [node-coveralls] (https://github.com/nickmerwin/node-coveralls) to
integrate Travis builds with Coveralls checks automatically.

###Hound
[Hound] (https://houndci.com) comments on all codebase according to JSHint 
standards, with [this] 
(https://raw.githubusercontent.com/houndci/jshint/master/config/.jshintrc) 
configuration.
