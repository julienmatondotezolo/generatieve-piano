# Pa.ino
<h3>Play, Enjoy, Make friends or catch feelings for our A.I.</h3>

<img src="https://play-paino.web.app/images/paino-logo.png" alt="drawing" width="300" style="background: #202020; padding: 0 2em"/>
</br>

[Pa.i.no](https://play-paino.web.app/) is an web app where you'll be able to not only play solo but also with an amazing 
virtuoso (read as AI). Furthermore you have the option to join other people in a private room to compose something great.

</br>
## Requirements

You can use this app to play with your friends or duet with an A.I bot

Use the package manager [yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/) to install all the requirements.
-   Music packages
    - [magenta](https://magenta.github.io/magenta-js/music/index.html)
    - [tone.js](https://tonejs.github.io/)
    - [midi-note](https://www.npmjs.com/package/midi-note)
-   Serving packages
    - [express](https://classic.yarnpkg.com/en/package/exrpress)
    - [heroku](https://dashboard.heroku.com/)
    - [firebase](https://firebase.google.com/)
    - [socket](https://socket.io/)
    - [peer.js](https://peerjs.com/)
-   Packages
    - [body-parser](https://yarnpkg.com/package/body-parser)
    - [http](https://yarnpkg.com/package/http)


## Install packages
Run terminal on the API folder.
```
npm install
```


## Start API
Run terminal on the API folder.
```
npm start
```


## Endpoints
Run terminal on the BACKEND folder.

[/socket](http://localhost:3000/shop/) Socket connection [ POST ]</br>
[/emotion-to-notes](http://localhost:3000/shop/id) Convert emotions to notes [ POST ]</br>
[/notes-to-midi](http://localhost:3000/shop/id) Convert user notes  to MIDI [ POST ] </br>


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](/LICENSE)

