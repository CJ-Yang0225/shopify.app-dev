import express, { Request, Response } from "express";
import Shopify, { ApiVersion, AuthQuery } from "@shopify/shopify-api";
require("dotenv").config();

const app = express();

const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST_NAME } = process.env;

Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES: SCOPES.split(","),
  HOST_NAME,
  IS_EMBEDDED_APP: true,
  API_VERSION: ApiVersion.April21,
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).send('Welcome!');
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
