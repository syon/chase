import Debug from "debug";
import Consts from "@/Consts";

const debug = Debug("chase:lambda-user");
const ENDPOINT = Consts.LAMBDA_ENDPOINT;

async function login(arg) {
  debug("[login]>>>>", arg);
  if (!arg || !arg.access_token) return null;
  const result = await fetch(`${ENDPOINT}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user: arg
    })
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .catch(e => {
      debug(arg, e);
      throw e;
    });
  debug("[login]<<<<", result);
  return result;
}

export default {
  login
};
