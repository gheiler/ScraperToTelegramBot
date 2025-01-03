import { Cron, scheduledJobs } from "croner";
import { db } from "../db";
import { chromium } from "playwright";
import { Apartment, NewApartment } from "../db-types";
import { Insertable, InsertType } from "kysely";
import { getProxy } from "../helpers";

// "* */5 * * * *"
export const executeUserSearch = new Cron(
  "* */2 * * * *",
  { name: "executeUserSearch", protect: true, interval: 120 },
  async (cron: Cron) => {
    console.log("cron options", cron.options);

    try {
      const userSearches = await db
        .selectFrom("user_apartment_search")
        .selectAll()
        .execute();

      const serverProxy = await getProxy();
      let server;

      if (serverProxy) {
        server = `${serverProxy.ip}:${serverProxy.port}`;
      }

      const browser = await chromium.launch({
        headless: false,
        ...(server && {
          proxy: { server: server },
        }),
      });

      const page = await browser.newPage();

      for (const userSearch of userSearches) {
        await page.goto(userSearch.url, { timeout: 900000 });

        try {
          await page.locator("#CookieBoxSaveButton").click();
        } catch (err) {
          console.log("can't close popup");
        }

        const locator = page
          .locator("#_tb_relevant_results")
          .getByRole("listitem");

        const apartmentsHtml = await locator.all();

        for (const apartmentHtml of apartmentsHtml) {
          const newApartment: Insertable<Apartment> = {
            id: undefined,
            provider: getProvider(
              (await apartmentHtml
                .locator(".tb-merkdetails .alg_c img")
                .getAttribute("src")) ?? ""
            ),
            url: getFullUrl(
              (await apartmentHtml.locator(".org-but").getAttribute("href")) ??
                ""
            ),
            address: {
              streetName:
                (await apartmentHtml.locator(".map-but").innerText()) ?? "",
              streetNumber: undefined,
              additionalInfo: undefined,
              postalCode: undefined,
              city: undefined,
              country: undefined,
            },
            sizeInSqrMeters:
              Number(
                await apartmentHtml
                  .locator("td:right-of(:text('Wohnfläche: '))")
                  .textContent()
              ) ?? "",
            totalRooms:
              Number(
                await apartmentHtml
                  .locator("td:right-of(:text('Zimmeranzahl: '))")
                  .textContent()
              ) ?? "",
            coldPrice: Number(
              await apartmentHtml
                .locator("._tb_left strong")
                .last()
                .textContent()
            ),
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const result = await db
            .insertInto("apartment")
            .values(newApartment)
            .executeTakeFirst();

          console.log("inserted apartment id", result.insertId);
        }
      }

      await browser.close();
    } catch (err) {
      console.error(err);
    }
  }
);

function getFullUrl(url: string) {
  if (url) return "https://inberlinwohnen.de" + url;
  return "";
}

function getProvider(imageUrl: string) {
  if (imageUrl.indexOf("degewo")) return "degewo";

  if (imageUrl.indexOf("gesobau")) return "gesobau";

  if (imageUrl.indexOf("gewobag")) return "gewobag";

  if (imageUrl.indexOf("howoge")) return "howoge";

  if (imageUrl.indexOf("stadtundland")) return "stadtundland";

  if (imageUrl.indexOf("wbm")) return "wbm";

  return "stadtundland";
}
