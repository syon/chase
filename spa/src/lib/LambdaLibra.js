import Debug from "debug";
import Consts from "@/Consts";
import URLSearchParams from "url-search-params";

const debug = Debug("chase:lambda-libra");
const ENDPOINT = Consts.LAMBDA_ENDPOINT.LIBRA;

async function info(arg) {
  debug("[info]>>>>");
  const { eid, url } = arg;
  const q = new URLSearchParams();
  q.append("url", url);
  q.append("pocket_id", eid);
  const pageinfo = await fetch(`${ENDPOINT}/info?${q.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .catch(e => {
      debug(eid, url, e);
      throw e;
    });
  debug(pageinfo);
  debug("[info]<<<<", pageinfo);
  return pageinfo;
}

async function thumb(arg) {
  debug("[thumb]>>>>");
  const { eid, url, image_suggested } = arg;
  const result = await fetch(`${ENDPOINT}/thumb`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      pocket_id: eid,
      url,
      image_suggested
    })
  }).catch(error => {
    debug(arg, error);
    throw error;
  });
  debug("[thumb]<<<<", result);
  return result;
}

export default {
  info,
  thumb
};
