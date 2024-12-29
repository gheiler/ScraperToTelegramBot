import { db } from "./db";
import { NewUser, User } from "./db-types";

export class UserRepository {
  createUser(user: NewUser) {
    return db
      .insertInto("user")
      .values(user)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  findUser(criteria: Partial<User>) {
    let query = db.selectFrom("user");

    if (criteria.id) {
      query = query.where("id", "=", criteria.id); // Kysely is immutable, you must re-assign!
    }

    if (criteria.firstName) {
      query = query.where("firstName", "=", criteria.firstName);
    }

    if (criteria.lastName !== undefined) {
      query = query.where(
        "lastName",
        criteria.lastName === null ? "is" : "=",
        criteria.lastName
      );
    }

    return query.selectAll().executeTakeFirst();
  }
}
