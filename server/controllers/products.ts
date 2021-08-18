import Shopify from "@shopify/shopify-api";
import { Request, Response } from "express";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res, true);

    // 確認 session 存在，以對應的 access token 請求 API
    if (session) {
      const client = new Shopify.Clients.Graphql(
        session.shop,
        session.accessToken
      );

      // 測試請求前10筆商品資料
      const products = await client.query({
        data: `{
          products (first: 10) {
            edges {
              node {
                id
                title
                descriptionHtml
              }
            }
          }
        }`,
      });

      // console.log(products);

      res.status(200).json(products);
    }

    res.redirect("/login");
  } catch (err) {
    console.error(err);
  }
};
