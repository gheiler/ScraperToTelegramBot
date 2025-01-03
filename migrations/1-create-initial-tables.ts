import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("firstName", "varchar", (col) => col.notNull())
    .addColumn("lastName", "varchar", (col) => col.notNull())
    .addColumn("gender", "varchar")
    .addColumn("title", "varchar")
    .addColumn("email", "varchar", (col) => col.notNull())
    .addColumn("telephoneNumber", "varchar", (col) => col.notNull())
    .addColumn("notes", "varchar")
    .addColumn("totalAdults", "integer")
    .addColumn("totalKids", "integer")
    .addColumn("address", "jsonb")
    .addColumn("salary", "integer")
    .addColumn("needsWBS", "boolean")
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updatedAt", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  await db.schema
    .createTable("apartment")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("description", "varchar", (col) => col.notNull())
    .addColumn("provider", "varchar", (col) => col.notNull())
    .addColumn("url", "varchar", (col) => col.notNull())
    .addColumn("coldPrice", "integer")
    .addColumn("warmPrice", "integer")
    .addColumn("sizeInSqrMeters", "integer")
    .addColumn("totalRooms", "integer")
    .addColumn("address", "jsonb")
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updatedAt", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .execute();

  await db.schema
    .createIndex("apartment_url")
    .on("apartment")
    .column("url")
    .unique()
    .execute();

  await db.schema
    .createTable("user_apartment_subscription")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("userId", "uuid", (col) => col.notNull())
    .addColumn("apartmentId", "uuid", (col) => col.notNull())
    .addColumn("status", "varchar", (col) => col.notNull())
    .addColumn("notifiedFound", "boolean", (col) => col.notNull())
    .addColumn("notifiedSubscribed", "boolean", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updatedAt", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addForeignKeyConstraint(
      "user_apartment_subscription_user",
      ["userId"],
      "user",
      ["id"]
    )
    .addForeignKeyConstraint(
      "user_apartment_subscription_apartment",
      ["apartmentId"],
      "apartment",
      ["id"]
    )
    .execute();

  await db.schema
    .createIndex("user_apartment_subscription_user_userId")
    .on("user_apartment_subscription")
    .column("userId")
    .execute();

  await db.schema
    .createTable("user_apartment_search")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("userId", "uuid", (col) => col.notNull())
    .addColumn("provider", "varchar", (col) => col.notNull())
    .addColumn("url", "varchar", (col) => col.notNull())
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updatedAt", "timestamp", (col) =>
      col.notNull().defaultTo(sql`now()`)
    )
    .addForeignKeyConstraint("user_apartment_search_user", ["userId"], "user", [
      "id",
    ])
    .execute();

  await db.schema
    .createTable("user_apartment_search_results")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("user_apartment_search_id", "uuid", (col) => col.notNull())
    .addColumn("total", "integer", (col) => col.notNull())
    .addColumn("notified", "boolean", (col) => col.notNull())
    .addColumn("apartmentIds", "jsonb")
    .addColumn("createdAt", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addForeignKeyConstraint(
      "user_apartment_search_user_apartment_search_results",
      ["user_apartment_search_id"],
      "user_apartment_search",
      ["id"]
    )
    .execute();

  await db.schema
    .createIndex("user_apartment_search_results_user_apartment_search_id")
    .on("user_apartment_search_results")
    .column("user_apartment_search_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user_apartment_subscription").execute();
  await db.schema.dropTable("user_apartment_search_results").execute();
  await db.schema.dropTable("user_apartment_search").execute();
  await db.schema.dropTable("user").execute();
  await db.schema.dropTable("apartment").execute();
}
