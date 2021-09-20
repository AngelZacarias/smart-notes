import { sendMail } from "../email/email-sender";

async function remindOfPendingTasks() {
  // To send an email uncomment next section
  // await sendMail("improgrades@gmail.com", "test", {
  //   taskName: "Resumen del capítulo 4 de Programación Competitiva",
  //   userName: "Julio González",
  //   deadline: "21 de septiembre a las 3:00 pm",
  //   clientOrigin: process.env.CLIENT_ORIGIN,
  //   urlViewRequest: "www.google.com"
  // });
  console.log("Sistema de recordatorio funcionando!");
}

module.exports = { remindOfPendingTasks };