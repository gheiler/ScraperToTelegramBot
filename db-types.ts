import {
  ColumnType,
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from "kysely";

export interface Database {
  user: UserTable;
  apartment: Apartment;
  userApartmentSearch: UserApartmentSearchTable;
  userApartmentSubscription: UserApartmentSubscriptionTable;
  userApartmentSearchResult: UserApartmentSearchResultTable;
}

interface WithDate {
  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, never>;
}

// This interface describes the `person` table to Kysely. Table
// interfaces should only be used in the `Database` type above
// and never as a result type of a query!. See the `Person`,
// `NewPerson` and `PersonUpdate` types below.
export interface UserTable extends WithDate {
  id: Generated<string>;

  firstName: string;
  lastName: string;
  gender: string;
  title: string;

  email: string;
  telephoneNumber: string;

  address: Address;
  notes: string | null;
  totalAdults: number;
  totalKids: number;
  salary: number;
  needsWBS: boolean;
}

type Address = JSONColumnType<{
  streetName: string;
  streetNumber: string; // we don't validate only nunbers for better compatibility
  additionalInfo: string | null;
  postalCode: string; // we don't validate only nunbers for better compatibility
  city: string;
  country: string;
}>;

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
//
// Most of the time you should trust the type inference and not use explicit
// types at all. These types can be useful when typing function arguments.
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface ApartmentTable extends WithDate {
  id: Generated<string>;
  description: string | null;
  url: string;
  provider: string;
  address: Address;

  coldPrice: number | null;
  warmPrice: number | null;
  sizeInSqrMeters: number | null;
}

export type Apartment = Selectable<ApartmentTable>;
export type NewApartment = Insertable<ApartmentTable>;
export type ApartmentUpdate = Updateable<ApartmentTable>;

export interface UserApartmentSubscriptionTable extends WithDate {
  id: Generated<string>;
  userId: string;
  apartmentId: string;
  notifiedFound: boolean;
  notifiedSubscribed: boolean;
  status: "waiting" | "executed" | "error";
}

export type UserApartmentSubscription =
  Selectable<UserApartmentSubscriptionTable>;
export type NewUserApartmentSubscription =
  Insertable<UserApartmentSubscriptionTable>;
export type UserApartmentSubscriptionUpdate =
  Updateable<UserApartmentSubscriptionTable>;

export interface UserApartmentSearchTable extends WithDate {
  id: Generated<string>;
  userId: string;
  url: string;
  provider: string;
}

export type UserApartmentSearch = Selectable<UserApartmentSearchTable>;
export type NewUserApartmentSearch = Insertable<UserApartmentSearchTable>;
export type UserApartmentSearchUpdate = Updateable<UserApartmentSearchTable>;

export interface UserApartmentSearchResultTable {
  id: Generated<string>;
  userApartmentSearchId: string;
  total: number;
  apartmentIds: JSONColumnType<[ApartmentTable]>;
  notified: boolean;
  createdAt: ColumnType<Date, string | undefined, never>;
}

export type UserApartmentSearchResult =
  Selectable<UserApartmentSearchResultTable>;
export type NewUserApartmentSearchResult =
  Insertable<UserApartmentSearchResultTable>;
export type UserApartmentSearchResultUpdate =
  Updateable<UserApartmentSearchResultTable>;
