const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "thehealthylife",
  brokers: [
    "ct839sui3f1a6jhmvd50.any.eu-central-1.mpx.prd.cloud.redpanda.com:9092",
  ],
  ssl: true,
  sasl: {
    mechanism: "SCRAM-SHA-256",
    username: "Ayala",
    password: "U3B8jnzpHGW9to5Y8bbhRYk5bA8UBl",
  },
});

module.exports = kafka;
