AI Lovers
========

Web Sites
- http://www.ai-comp.net/cedec2014/
- http://cedec.cesa.or.jp/2014/ (TBD)

# For Participants

## How to Execute Game with Sample AIs

1. Install node.js (http://nodejs.org/)
2. Open shell in the AILovers directory
3. Execute ```npm install```
4. Execute ```node server/standalone.js```

## How to Execute Game with Your AIs

1. Write your AI using any programming language
2. Execute ```node server/standalone.js -a "command to execute your AI program"```  
You can specify four AI programs.
e.g. ```node server/standalone.js -a "python ai/ai.py" -a "python ai/equal.py" -a "python ai/ai.py" -a "python ai/equal.py"```.

# For Contributors
Here are some basic instructions on how to run the server.

## Install development tools
In order to run the server you need to install Node.js (and the bundled npm) from the [Node.js site](http://nodejs.org/).
Other developer tools that you need can then be installed by running the following npm commands:
```
npm install -g bower
npm install -g grunt-cli
```

Optional, but recommended for development:
```
npm install -g node-inspector
```

## Install dependencies
Dependencies can be installed by running the following commands:
```
npm install
bower install
```

## Fire up the server
Finally the server can be started by running this command:
```
npm start
```
