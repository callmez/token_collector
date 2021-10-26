import express from "express";
import config from "./config";
import networks from "./networks";

const app = express();

for (const name in config.networks) {
  if (Object.prototype.hasOwnProperty.call(config.networks, name)) {
    const networkConfig = config.networks[name];
    const network = networks[name];

    if (!networkConfig || !networkConfig.enable === false || !network) continue;

    network();
  }
}

app.get("/", (reg, res) => {
  res.send("Hello World");
});

app.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${config.port}`);
});
