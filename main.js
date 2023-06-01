

import { CLOSE_ICON, MESSAGE_ICON, styles } from "./assets.js";
import { io } from 'socket.io-client/dist/socket.io.js';

class MessageWidget {
  constructor(position = "bottom-right") {
    this.position = this.getPosition(position);
    this.open = false;
    this.initialize();
    this.injectStyles();
  }

  position = "";
  open = false;
  widgetContainer = null;

  getPosition(position) {
    const [vertical, horizontal] = position.split("-");
    return {
      [vertical]: "30px",
      [horizontal]: "30px",
    };
  }

  async initialize() {
    /**
     * Create and append a div element to the document body
     */
    const container = document.createElement("div");
    container.style.position = "fixed";
    Object.keys(this.position).forEach(
      (key) => (container.style[key] = this.position[key])
    );
    document.body.appendChild(container);

    /**
     * Create a button element and give it a class of button__container
     */
    const buttonContainer = document.createElement("button");
    buttonContainer.classList.add("button__container");

    /**
     * Create a span element for the widget icon, give it a class of `widget__icon`, and update its innerHTML property to an icon that would serve as the widget icon.
     */
    const widgetIconElement = document.createElement("span");
    widgetIconElement.innerHTML = MESSAGE_ICON;
    widgetIconElement.classList.add("widget__icon");
    this.widgetIcon = widgetIconElement;

    /**
     * Create a span element for the close icon, give it a class of `widget__icon` and `widget__hidden` which would be removed whenever the widget is closed, and update its innerHTML property to an icon that would serve as the widget icon during that state.
     */
    const closeIconElement = document.createElement("span");
    closeIconElement.innerHTML = CLOSE_ICON;
    closeIconElement.classList.add("widget__icon", "widget__hidden");
    this.closeIcon = closeIconElement;

    /**
     * Append both icons created to the button element and add a `click` event listener on the button to toggle the widget open and close.
     */
    buttonContainer.appendChild(this.widgetIcon);
    buttonContainer.appendChild(this.closeIcon);
    buttonContainer.addEventListener("click", this.toggleOpen.bind(this));

    /**
     * Create a container for the widget and add the following classes:- `widget__hidden`, `widget__container`
     */
    this.widgetContainer = document.createElement("div");
    this.widgetContainer.classList.add("widget__hidden", "widget__container");

    /**
     * Invoke the `createWidget()` method
     */
    this.createWidgetContent();

    /**
     * Append the widget's content and the button to the container
     */
    container.appendChild(this.widgetContainer);
    container.appendChild(buttonContainer);
  }

  createWidgetContent() {

    

 
    this.widgetContainer.innerHTML = `
    <!-- manipulation -->
    <div style="background-color: #2a7561; margin: 0px;padding: 10;height: 500px; width:100px,color: white;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ghjk</div>
    <head>
    <meta charset="UTF-8">
    <title>Socket IO Private Chat Messaging</title>
    <link rel='stylesheet prefetch' href='https://fonts.googleapis.com/css?family=Open+Sans'>
	<link rel='stylesheet prefetch' href='https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.3/jquery.mCustomScrollbar.min.css'>
	<link href="https://wmuza.github.io/SocketIO-Chat-App/public/css/normalize.css" rel="stylesheet" type="text/css">
    <link href="https://wmuza.github.io/SocketIO-Chat-App/public/css/style.css" rel="stylesheet" type="text/css">
  </head>

  <body >
		<div class="chat" style="height: 600px; background-color: blue;">
			<div class="chat-title">
				<h1>We are Online</h1>
				<figure class="avatar">
				  <img src="https://wmuza.github.io/SocketIO-Chat-App/public/img/sa.png" />
				  <span class="chat-message-counter">3</span>
				</figure>
				<span class="online-bullet"></span>
			</div>
			<div class="messages">
				<div class="messages-content"></div>
			</div>
			<div class="message-box">
				<textarea type="text" class="message-input" placeholder="Type message..."></textarea>
				<button type="submit" class="message-submit">Send</button>
			</div>
		</div>
		<div class="bg"></div>
		
    <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
	<script src='https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.3/jquery.mCustomScrollbar.concat.min.js'></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js"></script>
	<script src="https://wmuza.github.io/SocketIO-Chat-App/public/js/index.js"></script>     
  </body>
       
    `;
  }

  injectStyles() {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles.replace(/^\s+|\n/gm, "");
    document.head.appendChild(styleTag);
  }

  toggleOpen() {
    this.open = !this.open;
    if (this.open) {
      this.widgetIcon.classList.add("widget__hidden");
      this.closeIcon.classList.remove("widget__hidden");
      this.widgetContainer.classList.remove("widget__hidden");
    } else {
      this.createWidgetContent();
      this.widgetIcon.classList.remove("widget__hidden");
      this.closeIcon.classList.add("widget__hidden");
      this.widgetContainer.classList.add("widget__hidden");
    }
  }
}
function initializeWidget() {
  return new MessageWidget();
}

initializeWidget();

const socket = io;

// when the client emits 'sendchat', this listens and executes
socket.on('sendchat', (data) => {
  // handle received chat data
  io.emit('updatechat', socket.username, data);
});
socket.on('adduser', (username) => {
  // store the username in the socket session for this client
  socket.username = username;
  // add the client's username to the global list
  usernames[username] = socket.id;
  // echo to client they've connected
  socket.emit('updatechat', 'Chat Bot', `${socket.username} you have joined the chat`);
  // echo to client their username
  socket.emit('store_username', username);
});

// when the user disconnects.. perform this
socket.on('disconnect', () => {
  // remove the username from global usernames list
  delete usernames[socket.username];
});