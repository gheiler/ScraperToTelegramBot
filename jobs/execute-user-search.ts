import { Cron } from "croner";
import { db } from "../db";

export const executeUserSearch = new Cron("* */5 * * * *", async () => {
  (await db.selectFrom("userApartmentSearch").selectAll().execute()).forEach(
    (userApartmentSearch) => {
      userApartmentSearch.url;
    }
  );
});
