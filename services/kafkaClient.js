const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "thehealthylife",
  brokers: [
    "csstjgljp6ucv9qqot90.any.us-east-1.mpx.prd.cloud.redpanda.com:9092",
  ],
  ssl: true,
  sasl: {
    mechanism: "SCRAM-SHA-256",
    username: "avital",
    password: "KwGgf1UXYbz5Vb1eZwSYVaI2gTXO5O",
  },
});

module.exports = kafka;
