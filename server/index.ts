import express, { Request, Response } from "express";
import next from "next";
import Shopify, { ApiVersion, AuthQuery } from "@shopify/shopify-api";
require("dotenv").config();

import productRoutes from "./routes/products";

const server = express();

const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST_NAME } = process.env;

Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES: SCOPES.split(","),
  HOST_NAME,
  IS_EMBEDDED_APP: true,
  API_VERSION: ApiVersion.July21,
});

const dev = process.env.NODE_ENV !== "production";
// const renderer = next({ dev });
// const handle = renderer.getRequestHandler();

server.get("/", async (req, res) => {
  res.send(
    `<a href="/products?${Object.entries(req.query)
      .map((pair) => pair.join("="))
      .join("&")}" onclick="alert(this.href)">Products</a><br />
      QUERY: ${JSON.stringify(req.query)}<br />
      HEADER: ${JSON.stringify(req.headers)}`
  );
});

// Authorization：授權書說明 App 擁有的權限（需商家登入），同意後進行安裝並跳轉
server.get("/login", async (req, res) => {
  const authRoute = await Shopify.Auth.beginAuth(
    req,
    res,
    SHOP,
    "/auth/callback",
    true
  );

  console.log("Auth Route:", authRoute);

  return res.redirect(authRoute);
});

// 商家同意安裝之後，若與約定的 Redirect URL 無誤則導向至此（包含需要的 url 參數）
server.get("/auth/callback", async (req, res) => {
  try {
    console.log("Request Query:", req.query);

    // 將拿到的 Grant Code 及防 CSRF 的 State 向 Shopify Authorization Server 換取 access token（用於 call API）
    await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query as unknown as AuthQuery
    );
  } catch (err) {
    console.error(err);
  }

  return res.redirect("/");
});

// Routes
server.use("/products", productRoutes);

server.listen(6000, () => {
  console.log("listening on port 6000");
});
