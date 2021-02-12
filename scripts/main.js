import { router } from "./modules/router.js";
import accessToken from "./routes/accessToken.js";
import favouritesList from "./routes/favouritesList.js";
import generator from "./routes/generator.js";
import index from "./routes/index.js";
import tripDuration from "./routes/tripDuration.js";
import { route } from "./utils/route.js";

main();

async function main() {
  const render = await router([
    route("/", index),
    route("/access_token", accessToken),
    route("/trip-duration", tripDuration),
    route("/list-favourites", favouritesList),
    route("/generate", generator),
  ]);
  render(document.querySelector("#app"));
}
