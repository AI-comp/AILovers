AI Lovers
========

Web Sites
- http://www.ai-comp.net/cedec2014/
- http://cedec.cesa.or.jp/2014/ (TBD)

# For Participants

There are two ways to play the game.

- Play online. Go to [the contest server](arena.ai-comp.net) and submit your AI.
- Play on your machine. You need to install [node.js](http://nodejs.org/) to execute the game. Follow the instructions below.

## How to Play the Game on Your Machine

1. Open shell in the AILovers directory
2. Run the following commands:

        npm install -g bower
        npm install -g grunt-cli
        npm install
        bower install

3. Execute `npm start`.
4. Access `localhost:8000` in your browser.
5. Specify commands to run AIs.
6. Click "Run Game".

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
