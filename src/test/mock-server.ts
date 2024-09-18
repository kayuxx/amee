import polka from "polka";
import { json, urlencoded } from "body-parser";
// @ts-expect-error: The declaration file is declared.
import send from "@polka/send-type";
import { type Request } from "polka";

type MockServer = {
  port: number;
  url: string;
  lastRequest: () => Request;
};

declare module "express-serve-static-core" {
  // The send method should accept three params instead of one.
  // Can't override the send property type
  interface Response {
    sendBack: (status: number, body?: string | object) => void;
  }
}

const errorResponse = {
  error: "invalid_request",
  error_description: "the request is missing a required parameter",
  error_uri: "somewebsite.com/docs/errors/invalid_request"
};

const successResponse = {
  access_token: "access_token_000",
  token_type: "bearer",
  expires_in: Math.floor(Date.now() / 1000) + 60 * 60 * 6
};
let currRequest: Request;
// A basic simulation for the authorization code flow
export function mockServer(): MockServer {
  const PORT = 30000 + Math.round(Math.random() * 9999);
  const app = polka();
  app.use((_req, res, next) => {
    res.sendBack = (status, body) => {
      send(res, status, body);
    };
    next();
  });
  app.use(json());
  app.use(urlencoded({ extended: true }));

  app.post("/token", function (req, res) {
    currRequest = req as unknown as Request;
    const {
      client_id,
      client_secret,
      redirect_uri,
      code,
      grant_type,
      refresh_token
    } = req.body;
    if (grant_type !== "refresh_token") {
      if (
        !code ||
        code != "code_000" ||
        !client_id ||
        !client_secret ||
        !redirect_uri
      ) {
        res.sendBack(400, errorResponse);
        return;
      }
    } else {
      if (!client_id || !client_secret || !refresh_token) {
        res.sendBack(400, errorResponse);
        return;
      }
    }

    res.sendBack(200, successResponse);
  });

  // Run the server!
  app.listen(PORT);

  return {
    url: "http://localhost:" + PORT,
    port: PORT,
    lastRequest: () => currRequest
  };
}
