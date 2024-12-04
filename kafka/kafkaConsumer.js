const alerts = require("../kafka/alerts"); // ייבוא המודול הנכון
const kafka = require("../services/kafkaClient");

const consumeTestResult = async () => {
  console.log("hii");
  const kafkaClient = kafka.consumer({ groupId: "results-consumer-group" });

  await kafkaClient.connect();
  await kafkaClient.subscribe({ topic: "test-results", fromBeginning: true });

  await kafkaClient.run({
    eachMessage: async ({ topic, partition, message }) => {
      const receivedMessage = JSON.parse(message.value.toString());
      console.log(receivedMessage);

      console.log(receivedMessage.message);
      // שידור הודעה למשתמש
      alerts.broadcastMessage(receivedMessage.message);
    },
  });
};

module.exports = { consumeTestResult };
