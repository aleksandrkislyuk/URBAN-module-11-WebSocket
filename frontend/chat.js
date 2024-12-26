const chat = document.getElementById("chat");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");

const socket = new WebSocket(
  "ws://localhost:8080"
); /*открылось новое соединение websocket*/

socket.onopen = (e) => {
  console.log("Соединение успешно!");
};

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  const messageElement =
    document.createElement(
      "div"
    ); /*создаётся новый блок для помещения туда информации от сервера*/

  if (message.type === "system") {
    /*если сообщение систмное от сервера - шрифт курсивом*/
    messageElement.classList.add("system-message");
  }
  messageElement.textContent =
    message.content; /*если сообщение от человека - шрифт прямой*/
  chat.appendChild(messageElement);
  chat.scrollTop = chat.scrollHeight;
};

socket.onclose = (event) => {
  if (event.wasClean) {
    console.log(
      "Соединение закрыто чисто, код=${event.code} причина = ${event.reason}"
    );
  } else {
    console.log("Соединение прервано");
  }
};

socket.onerror = (error) => {
  /*обработчик ошибок*/
  console.log("Ошибка ${error.message}");
};

messageForm.onsubmit = (e) => {
  /*запись информации в форму*/
  e.preventDefault();
  if (messageInput.value) {
    const message = {
      type: "user",
      content: messageInput.value,
    };
    socket.send(
      JSON.stringify(message)
    ); /*отправка сообщения от user на сервер*/
    messageInput.value = ""; /*очистка поля после отправки сообщения*/
  }
};
