const { readBody } = require("./utils");
const respond = require("./respond");
const { OAuth2Client } = require("google-auth-library");
const cookie = require("cookie");

const CLIENT_ID =
  "1040288817661-9g1hmcsieftvp0f98cq94lo8hpu27f67.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return respond.sendMethodNotAllowed(res);
  }

  const body = await readBody(req);
  const tokenDelimiter = "credential=";
  const credentialStart = body.indexOf(tokenDelimiter) + tokenDelimiter.length;
  const credentialEnd = body.indexOf("&", credentialStart);
  const token = body.substring(credentialStart, credentialEnd);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (payload.hd !== "scu.edu") {
    return respond.sendUnauthorized(res);
  }

  const loginCookie = cookie.serialize("auth", token, {
    httpOnly: true,
    sameSite: true,
  });

  const user = { name: payload.name, email: payload.email };
  const userCookie = cookie.serialize("user", JSON.stringify(user), {
    sameSite: true,
    path: "/",
  });

  res.setHeader("Set-Cookie", loginCookie);
  res.setHeader("Set-Cookie", userCookie);

  return respond.sendOk(res, user);
};
