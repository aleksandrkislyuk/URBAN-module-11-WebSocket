const WebSocket = require("ws"); /*подключение библиотеки ws*/

const wss = new WebSocket.Server({
  port: 8080,
}); /*создано новое подключение ws*/

console.log("WebSocket сервер запущен на порту:8080");

wss.on("connection", (ws) => {
  /*подключился новый клиент-открыл приложение на своём сайте*/
  console.log("Новый клиент подключился.");

  ws.send(
    JSON.stringify({
      /*дежурное сообщение клиенту в чат от сервера*/ type: "system",
      content: "Добро пожаловать в чат!",
    })
  );
  ws.on("message", (message) => {
    /*сервер слушает сообщение и передаёт в функцию*/
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message); /*разбор сообщеня: вывод в консоль*/
      console.log("Получено сообщение", parsedMessage);
    } catch (e) {
      console.log(
        "Произошла ошибка при обработке сообщения: " + e
      ); /**если ошибка = соединение разрывается*/
      return;
    }
    wss.clients.forEach((client) => {
      /*проход по списку клиентов, каждому назначается переменная client*/
      if (client.readyState === WebSocket.OPEN) {
        /*для открытых соединений*/
        client.send(
          JSON.stringify(parsedMessage)
        ); /*отправляется всем сообщение, кот. пришло ранее*/
      }
    });
  });
});
