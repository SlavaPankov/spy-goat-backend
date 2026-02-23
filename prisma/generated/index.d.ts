
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model UserStats
 * 
 */
export type UserStats = $Result.DefaultSelection<Prisma.$UserStatsPayload>
/**
 * Model Room
 * 
 */
export type Room = $Result.DefaultSelection<Prisma.$RoomPayload>
/**
 * Model Game
 * 
 */
export type Game = $Result.DefaultSelection<Prisma.$GamePayload>
/**
 * Model Player
 * 
 */
export type Player = $Result.DefaultSelection<Prisma.$PlayerPayload>
/**
 * Model RoomStats
 * 
 */
export type RoomStats = $Result.DefaultSelection<Prisma.$RoomStatsPayload>
/**
 * Model PlayerRoomStats
 * 
 */
export type PlayerRoomStats = $Result.DefaultSelection<Prisma.$PlayerRoomStatsPayload>
/**
 * Model Token
 * 
 */
export type Token = $Result.DefaultSelection<Prisma.$TokenPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const RoomStatus: {
  WAITING: 'WAITING',
  IN_PROGRESS: 'IN_PROGRESS',
  FINISHED: 'FINISHED'
};

export type RoomStatus = (typeof RoomStatus)[keyof typeof RoomStatus]


export const GameStatus: {
  IN_PROGRESS: 'IN_PROGRESS',
  FINISHED: 'FINISHED'
};

export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus]

}

export type RoomStatus = $Enums.RoomStatus

export const RoomStatus: typeof $Enums.RoomStatus

export type GameStatus = $Enums.GameStatus

export const GameStatus: typeof $Enums.GameStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userStats`: Exposes CRUD operations for the **UserStats** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserStats
    * const userStats = await prisma.userStats.findMany()
    * ```
    */
  get userStats(): Prisma.UserStatsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.room`: Exposes CRUD operations for the **Room** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Rooms
    * const rooms = await prisma.room.findMany()
    * ```
    */
  get room(): Prisma.RoomDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.game`: Exposes CRUD operations for the **Game** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Games
    * const games = await prisma.game.findMany()
    * ```
    */
  get game(): Prisma.GameDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.player`: Exposes CRUD operations for the **Player** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Players
    * const players = await prisma.player.findMany()
    * ```
    */
  get player(): Prisma.PlayerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.roomStats`: Exposes CRUD operations for the **RoomStats** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RoomStats
    * const roomStats = await prisma.roomStats.findMany()
    * ```
    */
  get roomStats(): Prisma.RoomStatsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.playerRoomStats`: Exposes CRUD operations for the **PlayerRoomStats** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PlayerRoomStats
    * const playerRoomStats = await prisma.playerRoomStats.findMany()
    * ```
    */
  get playerRoomStats(): Prisma.PlayerRoomStatsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.token`: Exposes CRUD operations for the **Token** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tokens
    * const tokens = await prisma.token.findMany()
    * ```
    */
  get token(): Prisma.TokenDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    UserStats: 'UserStats',
    Room: 'Room',
    Game: 'Game',
    Player: 'Player',
    RoomStats: 'RoomStats',
    PlayerRoomStats: 'PlayerRoomStats',
    Token: 'Token'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "userStats" | "room" | "game" | "player" | "roomStats" | "playerRoomStats" | "token"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      UserStats: {
        payload: Prisma.$UserStatsPayload<ExtArgs>
        fields: Prisma.UserStatsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserStatsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserStatsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatsPayload>
          }
          findFirst: {
            args: Prisma.UserStatsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserStatsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatsPayload>
          }
          findMany: {
            args: Prisma.UserStatsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatsPayload>[]
          }
          create: {
            args: Prisma.UserStatsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatsPayload>
          }
          createMany: {
            args: Prisma.UserStatsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserStatsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatsPayload>[]
          }
          delete: {
            args: Prisma.UserStatsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatsPayload>
          }
          update: {
            args: Prisma.UserStatsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatsPayload>
          }
          deleteMany: {
            args: Prisma.UserStatsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserStatsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserStatsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatsPayload>[]
          }
          upsert: {
            args: Prisma.UserStatsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStatsPayload>
          }
          aggregate: {
            args: Prisma.UserStatsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserStats>
          }
          groupBy: {
            args: Prisma.UserStatsGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserStatsGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserStatsCountArgs<ExtArgs>
            result: $Utils.Optional<UserStatsCountAggregateOutputType> | number
          }
        }
      }
      Room: {
        payload: Prisma.$RoomPayload<ExtArgs>
        fields: Prisma.RoomFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoomFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoomFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          findFirst: {
            args: Prisma.RoomFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoomFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          findMany: {
            args: Prisma.RoomFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>[]
          }
          create: {
            args: Prisma.RoomCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          createMany: {
            args: Prisma.RoomCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoomCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>[]
          }
          delete: {
            args: Prisma.RoomDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          update: {
            args: Prisma.RoomUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          deleteMany: {
            args: Prisma.RoomDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoomUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoomUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>[]
          }
          upsert: {
            args: Prisma.RoomUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomPayload>
          }
          aggregate: {
            args: Prisma.RoomAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoom>
          }
          groupBy: {
            args: Prisma.RoomGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoomGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoomCountArgs<ExtArgs>
            result: $Utils.Optional<RoomCountAggregateOutputType> | number
          }
        }
      }
      Game: {
        payload: Prisma.$GamePayload<ExtArgs>
        fields: Prisma.GameFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          findFirst: {
            args: Prisma.GameFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          findMany: {
            args: Prisma.GameFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>[]
          }
          create: {
            args: Prisma.GameCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          createMany: {
            args: Prisma.GameCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>[]
          }
          delete: {
            args: Prisma.GameDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          update: {
            args: Prisma.GameUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          deleteMany: {
            args: Prisma.GameDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>[]
          }
          upsert: {
            args: Prisma.GameUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GamePayload>
          }
          aggregate: {
            args: Prisma.GameAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGame>
          }
          groupBy: {
            args: Prisma.GameGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameCountArgs<ExtArgs>
            result: $Utils.Optional<GameCountAggregateOutputType> | number
          }
        }
      }
      Player: {
        payload: Prisma.$PlayerPayload<ExtArgs>
        fields: Prisma.PlayerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlayerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlayerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          findFirst: {
            args: Prisma.PlayerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlayerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          findMany: {
            args: Prisma.PlayerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          create: {
            args: Prisma.PlayerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          createMany: {
            args: Prisma.PlayerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlayerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          delete: {
            args: Prisma.PlayerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          update: {
            args: Prisma.PlayerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          deleteMany: {
            args: Prisma.PlayerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlayerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlayerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          upsert: {
            args: Prisma.PlayerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          aggregate: {
            args: Prisma.PlayerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlayer>
          }
          groupBy: {
            args: Prisma.PlayerGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlayerGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlayerCountArgs<ExtArgs>
            result: $Utils.Optional<PlayerCountAggregateOutputType> | number
          }
        }
      }
      RoomStats: {
        payload: Prisma.$RoomStatsPayload<ExtArgs>
        fields: Prisma.RoomStatsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoomStatsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomStatsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoomStatsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomStatsPayload>
          }
          findFirst: {
            args: Prisma.RoomStatsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomStatsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoomStatsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomStatsPayload>
          }
          findMany: {
            args: Prisma.RoomStatsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomStatsPayload>[]
          }
          create: {
            args: Prisma.RoomStatsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomStatsPayload>
          }
          createMany: {
            args: Prisma.RoomStatsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoomStatsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomStatsPayload>[]
          }
          delete: {
            args: Prisma.RoomStatsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomStatsPayload>
          }
          update: {
            args: Prisma.RoomStatsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomStatsPayload>
          }
          deleteMany: {
            args: Prisma.RoomStatsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoomStatsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoomStatsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomStatsPayload>[]
          }
          upsert: {
            args: Prisma.RoomStatsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RoomStatsPayload>
          }
          aggregate: {
            args: Prisma.RoomStatsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRoomStats>
          }
          groupBy: {
            args: Prisma.RoomStatsGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoomStatsGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoomStatsCountArgs<ExtArgs>
            result: $Utils.Optional<RoomStatsCountAggregateOutputType> | number
          }
        }
      }
      PlayerRoomStats: {
        payload: Prisma.$PlayerRoomStatsPayload<ExtArgs>
        fields: Prisma.PlayerRoomStatsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlayerRoomStatsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRoomStatsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlayerRoomStatsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRoomStatsPayload>
          }
          findFirst: {
            args: Prisma.PlayerRoomStatsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRoomStatsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlayerRoomStatsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRoomStatsPayload>
          }
          findMany: {
            args: Prisma.PlayerRoomStatsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRoomStatsPayload>[]
          }
          create: {
            args: Prisma.PlayerRoomStatsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRoomStatsPayload>
          }
          createMany: {
            args: Prisma.PlayerRoomStatsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlayerRoomStatsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRoomStatsPayload>[]
          }
          delete: {
            args: Prisma.PlayerRoomStatsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRoomStatsPayload>
          }
          update: {
            args: Prisma.PlayerRoomStatsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRoomStatsPayload>
          }
          deleteMany: {
            args: Prisma.PlayerRoomStatsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlayerRoomStatsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlayerRoomStatsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRoomStatsPayload>[]
          }
          upsert: {
            args: Prisma.PlayerRoomStatsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRoomStatsPayload>
          }
          aggregate: {
            args: Prisma.PlayerRoomStatsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlayerRoomStats>
          }
          groupBy: {
            args: Prisma.PlayerRoomStatsGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlayerRoomStatsGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlayerRoomStatsCountArgs<ExtArgs>
            result: $Utils.Optional<PlayerRoomStatsCountAggregateOutputType> | number
          }
        }
      }
      Token: {
        payload: Prisma.$TokenPayload<ExtArgs>
        fields: Prisma.TokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          findFirst: {
            args: Prisma.TokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          findMany: {
            args: Prisma.TokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>[]
          }
          create: {
            args: Prisma.TokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          createMany: {
            args: Prisma.TokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>[]
          }
          delete: {
            args: Prisma.TokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          update: {
            args: Prisma.TokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          deleteMany: {
            args: Prisma.TokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>[]
          }
          upsert: {
            args: Prisma.TokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          aggregate: {
            args: Prisma.TokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateToken>
          }
          groupBy: {
            args: Prisma.TokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<TokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.TokenCountArgs<ExtArgs>
            result: $Utils.Optional<TokenCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    userStats?: UserStatsOmit
    room?: RoomOmit
    game?: GameOmit
    player?: PlayerOmit
    roomStats?: RoomStatsOmit
    playerRoomStats?: PlayerRoomStatsOmit
    token?: TokenOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    createdRooms: number
    players: number
    playerRoomStats: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdRooms?: boolean | UserCountOutputTypeCountCreatedRoomsArgs
    players?: boolean | UserCountOutputTypeCountPlayersArgs
    playerRoomStats?: boolean | UserCountOutputTypeCountPlayerRoomStatsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreatedRoomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoomWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPlayersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPlayerRoomStatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerRoomStatsWhereInput
  }


  /**
   * Count Type RoomCountOutputType
   */

  export type RoomCountOutputType = {
    players: number
    games: number
    playerRoomStats: number
  }

  export type RoomCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    players?: boolean | RoomCountOutputTypeCountPlayersArgs
    games?: boolean | RoomCountOutputTypeCountGamesArgs
    playerRoomStats?: boolean | RoomCountOutputTypeCountPlayerRoomStatsArgs
  }

  // Custom InputTypes
  /**
   * RoomCountOutputType without action
   */
  export type RoomCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomCountOutputType
     */
    select?: RoomCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoomCountOutputType without action
   */
  export type RoomCountOutputTypeCountPlayersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerWhereInput
  }

  /**
   * RoomCountOutputType without action
   */
  export type RoomCountOutputTypeCountGamesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameWhereInput
  }

  /**
   * RoomCountOutputType without action
   */
  export type RoomCountOutputTypeCountPlayerRoomStatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerRoomStatsWhereInput
  }


  /**
   * Count Type GameCountOutputType
   */

  export type GameCountOutputType = {
    players: number
  }

  export type GameCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    players?: boolean | GameCountOutputTypeCountPlayersArgs
  }

  // Custom InputTypes
  /**
   * GameCountOutputType without action
   */
  export type GameCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameCountOutputType
     */
    select?: GameCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GameCountOutputType without action
   */
  export type GameCountOutputTypeCountPlayersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerWhereInput
  }


  /**
   * Count Type PlayerCountOutputType
   */

  export type PlayerCountOutputType = {
    wonGames: number
  }

  export type PlayerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    wonGames?: boolean | PlayerCountOutputTypeCountWonGamesArgs
  }

  // Custom InputTypes
  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerCountOutputType
     */
    select?: PlayerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeCountWonGamesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    version: number | null
  }

  export type UserSumAggregateOutputType = {
    version: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    username: string | null
    password: string | null
    version: number | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    surname: string | null
    email: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    username: string | null
    password: string | null
    version: number | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    surname: string | null
    email: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    password: number
    version: number
    createdAt: number
    updatedAt: number
    name: number
    surname: number
    email: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    version?: true
  }

  export type UserSumAggregateInputType = {
    version?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    password?: true
    version?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    surname?: true
    email?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    password?: true
    version?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    surname?: true
    email?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    password?: true
    version?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    surname?: true
    email?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    username: string
    password: string
    version: number
    createdAt: Date
    updatedAt: Date
    name: string | null
    surname: string | null
    email: string | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    surname?: boolean
    email?: boolean
    userStats?: boolean | User$userStatsArgs<ExtArgs>
    createdRooms?: boolean | User$createdRoomsArgs<ExtArgs>
    players?: boolean | User$playersArgs<ExtArgs>
    playerRoomStats?: boolean | User$playerRoomStatsArgs<ExtArgs>
    token?: boolean | User$tokenArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    surname?: boolean
    email?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    surname?: boolean
    email?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    password?: boolean
    version?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    surname?: boolean
    email?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "password" | "version" | "createdAt" | "updatedAt" | "name" | "surname" | "email", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userStats?: boolean | User$userStatsArgs<ExtArgs>
    createdRooms?: boolean | User$createdRoomsArgs<ExtArgs>
    players?: boolean | User$playersArgs<ExtArgs>
    playerRoomStats?: boolean | User$playerRoomStatsArgs<ExtArgs>
    token?: boolean | User$tokenArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      userStats: Prisma.$UserStatsPayload<ExtArgs> | null
      createdRooms: Prisma.$RoomPayload<ExtArgs>[]
      players: Prisma.$PlayerPayload<ExtArgs>[]
      playerRoomStats: Prisma.$PlayerRoomStatsPayload<ExtArgs>[]
      token: Prisma.$TokenPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      password: string
      version: number
      createdAt: Date
      updatedAt: Date
      name: string | null
      surname: string | null
      email: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userStats<T extends User$userStatsArgs<ExtArgs> = {}>(args?: Subset<T, User$userStatsArgs<ExtArgs>>): Prisma__UserStatsClient<$Result.GetResult<Prisma.$UserStatsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    createdRooms<T extends User$createdRoomsArgs<ExtArgs> = {}>(args?: Subset<T, User$createdRoomsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    players<T extends User$playersArgs<ExtArgs> = {}>(args?: Subset<T, User$playersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    playerRoomStats<T extends User$playerRoomStatsArgs<ExtArgs> = {}>(args?: Subset<T, User$playerRoomStatsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerRoomStatsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    token<T extends User$tokenArgs<ExtArgs> = {}>(args?: Subset<T, User$tokenArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly version: FieldRef<"User", 'Int'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly name: FieldRef<"User", 'String'>
    readonly surname: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.userStats
   */
  export type User$userStatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStats
     */
    select?: UserStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStats
     */
    omit?: UserStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatsInclude<ExtArgs> | null
    where?: UserStatsWhereInput
  }

  /**
   * User.createdRooms
   */
  export type User$createdRoomsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    where?: RoomWhereInput
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    cursor?: RoomWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RoomScalarFieldEnum | RoomScalarFieldEnum[]
  }

  /**
   * User.players
   */
  export type User$playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    where?: PlayerWhereInput
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    cursor?: PlayerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * User.playerRoomStats
   */
  export type User$playerRoomStatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRoomStats
     */
    select?: PlayerRoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRoomStats
     */
    omit?: PlayerRoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRoomStatsInclude<ExtArgs> | null
    where?: PlayerRoomStatsWhereInput
    orderBy?: PlayerRoomStatsOrderByWithRelationInput | PlayerRoomStatsOrderByWithRelationInput[]
    cursor?: PlayerRoomStatsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlayerRoomStatsScalarFieldEnum | PlayerRoomStatsScalarFieldEnum[]
  }

  /**
   * User.token
   */
  export type User$tokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    where?: TokenWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model UserStats
   */

  export type AggregateUserStats = {
    _count: UserStatsCountAggregateOutputType | null
    _avg: UserStatsAvgAggregateOutputType | null
    _sum: UserStatsSumAggregateOutputType | null
    _min: UserStatsMinAggregateOutputType | null
    _max: UserStatsMaxAggregateOutputType | null
  }

  export type UserStatsAvgAggregateOutputType = {
    gamesPlayed: number | null
    gamesWon: number | null
    totalPenalty: number | null
    bestScore: number | null
  }

  export type UserStatsSumAggregateOutputType = {
    gamesPlayed: number | null
    gamesWon: number | null
    totalPenalty: number | null
    bestScore: number | null
  }

  export type UserStatsMinAggregateOutputType = {
    id: string | null
    userId: string | null
    gamesPlayed: number | null
    gamesWon: number | null
    totalPenalty: number | null
    bestScore: number | null
    updatedAt: Date | null
  }

  export type UserStatsMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    gamesPlayed: number | null
    gamesWon: number | null
    totalPenalty: number | null
    bestScore: number | null
    updatedAt: Date | null
  }

  export type UserStatsCountAggregateOutputType = {
    id: number
    userId: number
    gamesPlayed: number
    gamesWon: number
    totalPenalty: number
    bestScore: number
    updatedAt: number
    _all: number
  }


  export type UserStatsAvgAggregateInputType = {
    gamesPlayed?: true
    gamesWon?: true
    totalPenalty?: true
    bestScore?: true
  }

  export type UserStatsSumAggregateInputType = {
    gamesPlayed?: true
    gamesWon?: true
    totalPenalty?: true
    bestScore?: true
  }

  export type UserStatsMinAggregateInputType = {
    id?: true
    userId?: true
    gamesPlayed?: true
    gamesWon?: true
    totalPenalty?: true
    bestScore?: true
    updatedAt?: true
  }

  export type UserStatsMaxAggregateInputType = {
    id?: true
    userId?: true
    gamesPlayed?: true
    gamesWon?: true
    totalPenalty?: true
    bestScore?: true
    updatedAt?: true
  }

  export type UserStatsCountAggregateInputType = {
    id?: true
    userId?: true
    gamesPlayed?: true
    gamesWon?: true
    totalPenalty?: true
    bestScore?: true
    updatedAt?: true
    _all?: true
  }

  export type UserStatsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserStats to aggregate.
     */
    where?: UserStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStats to fetch.
     */
    orderBy?: UserStatsOrderByWithRelationInput | UserStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserStats
    **/
    _count?: true | UserStatsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserStatsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserStatsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserStatsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserStatsMaxAggregateInputType
  }

  export type GetUserStatsAggregateType<T extends UserStatsAggregateArgs> = {
        [P in keyof T & keyof AggregateUserStats]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserStats[P]>
      : GetScalarType<T[P], AggregateUserStats[P]>
  }




  export type UserStatsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserStatsWhereInput
    orderBy?: UserStatsOrderByWithAggregationInput | UserStatsOrderByWithAggregationInput[]
    by: UserStatsScalarFieldEnum[] | UserStatsScalarFieldEnum
    having?: UserStatsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserStatsCountAggregateInputType | true
    _avg?: UserStatsAvgAggregateInputType
    _sum?: UserStatsSumAggregateInputType
    _min?: UserStatsMinAggregateInputType
    _max?: UserStatsMaxAggregateInputType
  }

  export type UserStatsGroupByOutputType = {
    id: string
    userId: string
    gamesPlayed: number
    gamesWon: number
    totalPenalty: number
    bestScore: number | null
    updatedAt: Date
    _count: UserStatsCountAggregateOutputType | null
    _avg: UserStatsAvgAggregateOutputType | null
    _sum: UserStatsSumAggregateOutputType | null
    _min: UserStatsMinAggregateOutputType | null
    _max: UserStatsMaxAggregateOutputType | null
  }

  type GetUserStatsGroupByPayload<T extends UserStatsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserStatsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserStatsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserStatsGroupByOutputType[P]>
            : GetScalarType<T[P], UserStatsGroupByOutputType[P]>
        }
      >
    >


  export type UserStatsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    totalPenalty?: boolean
    bestScore?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userStats"]>

  export type UserStatsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    totalPenalty?: boolean
    bestScore?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userStats"]>

  export type UserStatsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    totalPenalty?: boolean
    bestScore?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userStats"]>

  export type UserStatsSelectScalar = {
    id?: boolean
    userId?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    totalPenalty?: boolean
    bestScore?: boolean
    updatedAt?: boolean
  }

  export type UserStatsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "gamesPlayed" | "gamesWon" | "totalPenalty" | "bestScore" | "updatedAt", ExtArgs["result"]["userStats"]>
  export type UserStatsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserStatsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserStatsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserStatsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserStats"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      gamesPlayed: number
      gamesWon: number
      totalPenalty: number
      bestScore: number | null
      updatedAt: Date
    }, ExtArgs["result"]["userStats"]>
    composites: {}
  }

  type UserStatsGetPayload<S extends boolean | null | undefined | UserStatsDefaultArgs> = $Result.GetResult<Prisma.$UserStatsPayload, S>

  type UserStatsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserStatsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserStatsCountAggregateInputType | true
    }

  export interface UserStatsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserStats'], meta: { name: 'UserStats' } }
    /**
     * Find zero or one UserStats that matches the filter.
     * @param {UserStatsFindUniqueArgs} args - Arguments to find a UserStats
     * @example
     * // Get one UserStats
     * const userStats = await prisma.userStats.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserStatsFindUniqueArgs>(args: SelectSubset<T, UserStatsFindUniqueArgs<ExtArgs>>): Prisma__UserStatsClient<$Result.GetResult<Prisma.$UserStatsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserStats that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserStatsFindUniqueOrThrowArgs} args - Arguments to find a UserStats
     * @example
     * // Get one UserStats
     * const userStats = await prisma.userStats.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserStatsFindUniqueOrThrowArgs>(args: SelectSubset<T, UserStatsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserStatsClient<$Result.GetResult<Prisma.$UserStatsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserStats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStatsFindFirstArgs} args - Arguments to find a UserStats
     * @example
     * // Get one UserStats
     * const userStats = await prisma.userStats.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserStatsFindFirstArgs>(args?: SelectSubset<T, UserStatsFindFirstArgs<ExtArgs>>): Prisma__UserStatsClient<$Result.GetResult<Prisma.$UserStatsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserStats that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStatsFindFirstOrThrowArgs} args - Arguments to find a UserStats
     * @example
     * // Get one UserStats
     * const userStats = await prisma.userStats.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserStatsFindFirstOrThrowArgs>(args?: SelectSubset<T, UserStatsFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserStatsClient<$Result.GetResult<Prisma.$UserStatsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserStats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStatsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserStats
     * const userStats = await prisma.userStats.findMany()
     * 
     * // Get first 10 UserStats
     * const userStats = await prisma.userStats.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userStatsWithIdOnly = await prisma.userStats.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserStatsFindManyArgs>(args?: SelectSubset<T, UserStatsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStatsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserStats.
     * @param {UserStatsCreateArgs} args - Arguments to create a UserStats.
     * @example
     * // Create one UserStats
     * const UserStats = await prisma.userStats.create({
     *   data: {
     *     // ... data to create a UserStats
     *   }
     * })
     * 
     */
    create<T extends UserStatsCreateArgs>(args: SelectSubset<T, UserStatsCreateArgs<ExtArgs>>): Prisma__UserStatsClient<$Result.GetResult<Prisma.$UserStatsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserStats.
     * @param {UserStatsCreateManyArgs} args - Arguments to create many UserStats.
     * @example
     * // Create many UserStats
     * const userStats = await prisma.userStats.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserStatsCreateManyArgs>(args?: SelectSubset<T, UserStatsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserStats and returns the data saved in the database.
     * @param {UserStatsCreateManyAndReturnArgs} args - Arguments to create many UserStats.
     * @example
     * // Create many UserStats
     * const userStats = await prisma.userStats.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserStats and only return the `id`
     * const userStatsWithIdOnly = await prisma.userStats.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserStatsCreateManyAndReturnArgs>(args?: SelectSubset<T, UserStatsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStatsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserStats.
     * @param {UserStatsDeleteArgs} args - Arguments to delete one UserStats.
     * @example
     * // Delete one UserStats
     * const UserStats = await prisma.userStats.delete({
     *   where: {
     *     // ... filter to delete one UserStats
     *   }
     * })
     * 
     */
    delete<T extends UserStatsDeleteArgs>(args: SelectSubset<T, UserStatsDeleteArgs<ExtArgs>>): Prisma__UserStatsClient<$Result.GetResult<Prisma.$UserStatsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserStats.
     * @param {UserStatsUpdateArgs} args - Arguments to update one UserStats.
     * @example
     * // Update one UserStats
     * const userStats = await prisma.userStats.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserStatsUpdateArgs>(args: SelectSubset<T, UserStatsUpdateArgs<ExtArgs>>): Prisma__UserStatsClient<$Result.GetResult<Prisma.$UserStatsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserStats.
     * @param {UserStatsDeleteManyArgs} args - Arguments to filter UserStats to delete.
     * @example
     * // Delete a few UserStats
     * const { count } = await prisma.userStats.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserStatsDeleteManyArgs>(args?: SelectSubset<T, UserStatsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStatsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserStats
     * const userStats = await prisma.userStats.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserStatsUpdateManyArgs>(args: SelectSubset<T, UserStatsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserStats and returns the data updated in the database.
     * @param {UserStatsUpdateManyAndReturnArgs} args - Arguments to update many UserStats.
     * @example
     * // Update many UserStats
     * const userStats = await prisma.userStats.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserStats and only return the `id`
     * const userStatsWithIdOnly = await prisma.userStats.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserStatsUpdateManyAndReturnArgs>(args: SelectSubset<T, UserStatsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStatsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserStats.
     * @param {UserStatsUpsertArgs} args - Arguments to update or create a UserStats.
     * @example
     * // Update or create a UserStats
     * const userStats = await prisma.userStats.upsert({
     *   create: {
     *     // ... data to create a UserStats
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserStats we want to update
     *   }
     * })
     */
    upsert<T extends UserStatsUpsertArgs>(args: SelectSubset<T, UserStatsUpsertArgs<ExtArgs>>): Prisma__UserStatsClient<$Result.GetResult<Prisma.$UserStatsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStatsCountArgs} args - Arguments to filter UserStats to count.
     * @example
     * // Count the number of UserStats
     * const count = await prisma.userStats.count({
     *   where: {
     *     // ... the filter for the UserStats we want to count
     *   }
     * })
    **/
    count<T extends UserStatsCountArgs>(
      args?: Subset<T, UserStatsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserStatsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStatsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserStatsAggregateArgs>(args: Subset<T, UserStatsAggregateArgs>): Prisma.PrismaPromise<GetUserStatsAggregateType<T>>

    /**
     * Group by UserStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStatsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserStatsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserStatsGroupByArgs['orderBy'] }
        : { orderBy?: UserStatsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserStatsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserStatsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserStats model
   */
  readonly fields: UserStatsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserStats.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserStatsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserStats model
   */
  interface UserStatsFieldRefs {
    readonly id: FieldRef<"UserStats", 'String'>
    readonly userId: FieldRef<"UserStats", 'String'>
    readonly gamesPlayed: FieldRef<"UserStats", 'Int'>
    readonly gamesWon: FieldRef<"UserStats", 'Int'>
    readonly totalPenalty: FieldRef<"UserStats", 'Int'>
    readonly bestScore: FieldRef<"UserStats", 'Int'>
    readonly updatedAt: FieldRef<"UserStats", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserStats findUnique
   */
  export type UserStatsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStats
     */
    select?: UserStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStats
     */
    omit?: UserStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatsInclude<ExtArgs> | null
    /**
     * Filter, which UserStats to fetch.
     */
    where: UserStatsWhereUniqueInput
  }

  /**
   * UserStats findUniqueOrThrow
   */
  export type UserStatsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStats
     */
    select?: UserStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStats
     */
    omit?: UserStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatsInclude<ExtArgs> | null
    /**
     * Filter, which UserStats to fetch.
     */
    where: UserStatsWhereUniqueInput
  }

  /**
   * UserStats findFirst
   */
  export type UserStatsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStats
     */
    select?: UserStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStats
     */
    omit?: UserStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatsInclude<ExtArgs> | null
    /**
     * Filter, which UserStats to fetch.
     */
    where?: UserStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStats to fetch.
     */
    orderBy?: UserStatsOrderByWithRelationInput | UserStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserStats.
     */
    cursor?: UserStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserStats.
     */
    distinct?: UserStatsScalarFieldEnum | UserStatsScalarFieldEnum[]
  }

  /**
   * UserStats findFirstOrThrow
   */
  export type UserStatsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStats
     */
    select?: UserStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStats
     */
    omit?: UserStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatsInclude<ExtArgs> | null
    /**
     * Filter, which UserStats to fetch.
     */
    where?: UserStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStats to fetch.
     */
    orderBy?: UserStatsOrderByWithRelationInput | UserStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserStats.
     */
    cursor?: UserStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserStats.
     */
    distinct?: UserStatsScalarFieldEnum | UserStatsScalarFieldEnum[]
  }

  /**
   * UserStats findMany
   */
  export type UserStatsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStats
     */
    select?: UserStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStats
     */
    omit?: UserStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatsInclude<ExtArgs> | null
    /**
     * Filter, which UserStats to fetch.
     */
    where?: UserStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStats to fetch.
     */
    orderBy?: UserStatsOrderByWithRelationInput | UserStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserStats.
     */
    cursor?: UserStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStats.
     */
    skip?: number
    distinct?: UserStatsScalarFieldEnum | UserStatsScalarFieldEnum[]
  }

  /**
   * UserStats create
   */
  export type UserStatsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStats
     */
    select?: UserStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStats
     */
    omit?: UserStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatsInclude<ExtArgs> | null
    /**
     * The data needed to create a UserStats.
     */
    data: XOR<UserStatsCreateInput, UserStatsUncheckedCreateInput>
  }

  /**
   * UserStats createMany
   */
  export type UserStatsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserStats.
     */
    data: UserStatsCreateManyInput | UserStatsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserStats createManyAndReturn
   */
  export type UserStatsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStats
     */
    select?: UserStatsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserStats
     */
    omit?: UserStatsOmit<ExtArgs> | null
    /**
     * The data used to create many UserStats.
     */
    data: UserStatsCreateManyInput | UserStatsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserStats update
   */
  export type UserStatsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStats
     */
    select?: UserStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStats
     */
    omit?: UserStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatsInclude<ExtArgs> | null
    /**
     * The data needed to update a UserStats.
     */
    data: XOR<UserStatsUpdateInput, UserStatsUncheckedUpdateInput>
    /**
     * Choose, which UserStats to update.
     */
    where: UserStatsWhereUniqueInput
  }

  /**
   * UserStats updateMany
   */
  export type UserStatsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserStats.
     */
    data: XOR<UserStatsUpdateManyMutationInput, UserStatsUncheckedUpdateManyInput>
    /**
     * Filter which UserStats to update
     */
    where?: UserStatsWhereInput
    /**
     * Limit how many UserStats to update.
     */
    limit?: number
  }

  /**
   * UserStats updateManyAndReturn
   */
  export type UserStatsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStats
     */
    select?: UserStatsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserStats
     */
    omit?: UserStatsOmit<ExtArgs> | null
    /**
     * The data used to update UserStats.
     */
    data: XOR<UserStatsUpdateManyMutationInput, UserStatsUncheckedUpdateManyInput>
    /**
     * Filter which UserStats to update
     */
    where?: UserStatsWhereInput
    /**
     * Limit how many UserStats to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserStats upsert
   */
  export type UserStatsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStats
     */
    select?: UserStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStats
     */
    omit?: UserStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatsInclude<ExtArgs> | null
    /**
     * The filter to search for the UserStats to update in case it exists.
     */
    where: UserStatsWhereUniqueInput
    /**
     * In case the UserStats found by the `where` argument doesn't exist, create a new UserStats with this data.
     */
    create: XOR<UserStatsCreateInput, UserStatsUncheckedCreateInput>
    /**
     * In case the UserStats was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserStatsUpdateInput, UserStatsUncheckedUpdateInput>
  }

  /**
   * UserStats delete
   */
  export type UserStatsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStats
     */
    select?: UserStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStats
     */
    omit?: UserStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatsInclude<ExtArgs> | null
    /**
     * Filter which UserStats to delete.
     */
    where: UserStatsWhereUniqueInput
  }

  /**
   * UserStats deleteMany
   */
  export type UserStatsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserStats to delete
     */
    where?: UserStatsWhereInput
    /**
     * Limit how many UserStats to delete.
     */
    limit?: number
  }

  /**
   * UserStats without action
   */
  export type UserStatsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStats
     */
    select?: UserStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStats
     */
    omit?: UserStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStatsInclude<ExtArgs> | null
  }


  /**
   * Model Room
   */

  export type AggregateRoom = {
    _count: RoomCountAggregateOutputType | null
    _avg: RoomAvgAggregateOutputType | null
    _sum: RoomSumAggregateOutputType | null
    _min: RoomMinAggregateOutputType | null
    _max: RoomMaxAggregateOutputType | null
  }

  export type RoomAvgAggregateOutputType = {
    maxPlayers: number | null
    currentPlayers: number | null
  }

  export type RoomSumAggregateOutputType = {
    maxPlayers: number | null
    currentPlayers: number | null
  }

  export type RoomMinAggregateOutputType = {
    id: string | null
    name: string | null
    code: string | null
    maxPlayers: number | null
    currentPlayers: number | null
    isPrivate: boolean | null
    status: $Enums.RoomStatus | null
    createdAt: Date | null
    updatedAt: Date | null
    creatorId: string | null
    password: string | null
  }

  export type RoomMaxAggregateOutputType = {
    id: string | null
    name: string | null
    code: string | null
    maxPlayers: number | null
    currentPlayers: number | null
    isPrivate: boolean | null
    status: $Enums.RoomStatus | null
    createdAt: Date | null
    updatedAt: Date | null
    creatorId: string | null
    password: string | null
  }

  export type RoomCountAggregateOutputType = {
    id: number
    name: number
    code: number
    maxPlayers: number
    currentPlayers: number
    isPrivate: number
    status: number
    createdAt: number
    updatedAt: number
    creatorId: number
    password: number
    _all: number
  }


  export type RoomAvgAggregateInputType = {
    maxPlayers?: true
    currentPlayers?: true
  }

  export type RoomSumAggregateInputType = {
    maxPlayers?: true
    currentPlayers?: true
  }

  export type RoomMinAggregateInputType = {
    id?: true
    name?: true
    code?: true
    maxPlayers?: true
    currentPlayers?: true
    isPrivate?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    creatorId?: true
    password?: true
  }

  export type RoomMaxAggregateInputType = {
    id?: true
    name?: true
    code?: true
    maxPlayers?: true
    currentPlayers?: true
    isPrivate?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    creatorId?: true
    password?: true
  }

  export type RoomCountAggregateInputType = {
    id?: true
    name?: true
    code?: true
    maxPlayers?: true
    currentPlayers?: true
    isPrivate?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    creatorId?: true
    password?: true
    _all?: true
  }

  export type RoomAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Room to aggregate.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Rooms
    **/
    _count?: true | RoomCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoomAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoomSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoomMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoomMaxAggregateInputType
  }

  export type GetRoomAggregateType<T extends RoomAggregateArgs> = {
        [P in keyof T & keyof AggregateRoom]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoom[P]>
      : GetScalarType<T[P], AggregateRoom[P]>
  }




  export type RoomGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoomWhereInput
    orderBy?: RoomOrderByWithAggregationInput | RoomOrderByWithAggregationInput[]
    by: RoomScalarFieldEnum[] | RoomScalarFieldEnum
    having?: RoomScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoomCountAggregateInputType | true
    _avg?: RoomAvgAggregateInputType
    _sum?: RoomSumAggregateInputType
    _min?: RoomMinAggregateInputType
    _max?: RoomMaxAggregateInputType
  }

  export type RoomGroupByOutputType = {
    id: string
    name: string
    code: string
    maxPlayers: number
    currentPlayers: number
    isPrivate: boolean
    status: $Enums.RoomStatus
    createdAt: Date
    updatedAt: Date
    creatorId: string
    password: string | null
    _count: RoomCountAggregateOutputType | null
    _avg: RoomAvgAggregateOutputType | null
    _sum: RoomSumAggregateOutputType | null
    _min: RoomMinAggregateOutputType | null
    _max: RoomMaxAggregateOutputType | null
  }

  type GetRoomGroupByPayload<T extends RoomGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoomGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoomGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoomGroupByOutputType[P]>
            : GetScalarType<T[P], RoomGroupByOutputType[P]>
        }
      >
    >


  export type RoomSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    maxPlayers?: boolean
    currentPlayers?: boolean
    isPrivate?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    creatorId?: boolean
    password?: boolean
    creator?: boolean | UserDefaultArgs<ExtArgs>
    players?: boolean | Room$playersArgs<ExtArgs>
    games?: boolean | Room$gamesArgs<ExtArgs>
    roomStats?: boolean | Room$roomStatsArgs<ExtArgs>
    playerRoomStats?: boolean | Room$playerRoomStatsArgs<ExtArgs>
    _count?: boolean | RoomCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["room"]>

  export type RoomSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    maxPlayers?: boolean
    currentPlayers?: boolean
    isPrivate?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    creatorId?: boolean
    password?: boolean
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["room"]>

  export type RoomSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    maxPlayers?: boolean
    currentPlayers?: boolean
    isPrivate?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    creatorId?: boolean
    password?: boolean
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["room"]>

  export type RoomSelectScalar = {
    id?: boolean
    name?: boolean
    code?: boolean
    maxPlayers?: boolean
    currentPlayers?: boolean
    isPrivate?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    creatorId?: boolean
    password?: boolean
  }

  export type RoomOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "code" | "maxPlayers" | "currentPlayers" | "isPrivate" | "status" | "createdAt" | "updatedAt" | "creatorId" | "password", ExtArgs["result"]["room"]>
  export type RoomInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | UserDefaultArgs<ExtArgs>
    players?: boolean | Room$playersArgs<ExtArgs>
    games?: boolean | Room$gamesArgs<ExtArgs>
    roomStats?: boolean | Room$roomStatsArgs<ExtArgs>
    playerRoomStats?: boolean | Room$playerRoomStatsArgs<ExtArgs>
    _count?: boolean | RoomCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoomIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RoomIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RoomPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Room"
    objects: {
      creator: Prisma.$UserPayload<ExtArgs>
      players: Prisma.$PlayerPayload<ExtArgs>[]
      games: Prisma.$GamePayload<ExtArgs>[]
      roomStats: Prisma.$RoomStatsPayload<ExtArgs> | null
      playerRoomStats: Prisma.$PlayerRoomStatsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      code: string
      maxPlayers: number
      currentPlayers: number
      isPrivate: boolean
      status: $Enums.RoomStatus
      createdAt: Date
      updatedAt: Date
      creatorId: string
      password: string | null
    }, ExtArgs["result"]["room"]>
    composites: {}
  }

  type RoomGetPayload<S extends boolean | null | undefined | RoomDefaultArgs> = $Result.GetResult<Prisma.$RoomPayload, S>

  type RoomCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoomFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoomCountAggregateInputType | true
    }

  export interface RoomDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Room'], meta: { name: 'Room' } }
    /**
     * Find zero or one Room that matches the filter.
     * @param {RoomFindUniqueArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoomFindUniqueArgs>(args: SelectSubset<T, RoomFindUniqueArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Room that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoomFindUniqueOrThrowArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoomFindUniqueOrThrowArgs>(args: SelectSubset<T, RoomFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Room that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomFindFirstArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoomFindFirstArgs>(args?: SelectSubset<T, RoomFindFirstArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Room that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomFindFirstOrThrowArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoomFindFirstOrThrowArgs>(args?: SelectSubset<T, RoomFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Rooms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rooms
     * const rooms = await prisma.room.findMany()
     * 
     * // Get first 10 Rooms
     * const rooms = await prisma.room.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roomWithIdOnly = await prisma.room.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoomFindManyArgs>(args?: SelectSubset<T, RoomFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Room.
     * @param {RoomCreateArgs} args - Arguments to create a Room.
     * @example
     * // Create one Room
     * const Room = await prisma.room.create({
     *   data: {
     *     // ... data to create a Room
     *   }
     * })
     * 
     */
    create<T extends RoomCreateArgs>(args: SelectSubset<T, RoomCreateArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Rooms.
     * @param {RoomCreateManyArgs} args - Arguments to create many Rooms.
     * @example
     * // Create many Rooms
     * const room = await prisma.room.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoomCreateManyArgs>(args?: SelectSubset<T, RoomCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Rooms and returns the data saved in the database.
     * @param {RoomCreateManyAndReturnArgs} args - Arguments to create many Rooms.
     * @example
     * // Create many Rooms
     * const room = await prisma.room.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Rooms and only return the `id`
     * const roomWithIdOnly = await prisma.room.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoomCreateManyAndReturnArgs>(args?: SelectSubset<T, RoomCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Room.
     * @param {RoomDeleteArgs} args - Arguments to delete one Room.
     * @example
     * // Delete one Room
     * const Room = await prisma.room.delete({
     *   where: {
     *     // ... filter to delete one Room
     *   }
     * })
     * 
     */
    delete<T extends RoomDeleteArgs>(args: SelectSubset<T, RoomDeleteArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Room.
     * @param {RoomUpdateArgs} args - Arguments to update one Room.
     * @example
     * // Update one Room
     * const room = await prisma.room.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoomUpdateArgs>(args: SelectSubset<T, RoomUpdateArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Rooms.
     * @param {RoomDeleteManyArgs} args - Arguments to filter Rooms to delete.
     * @example
     * // Delete a few Rooms
     * const { count } = await prisma.room.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoomDeleteManyArgs>(args?: SelectSubset<T, RoomDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rooms
     * const room = await prisma.room.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoomUpdateManyArgs>(args: SelectSubset<T, RoomUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rooms and returns the data updated in the database.
     * @param {RoomUpdateManyAndReturnArgs} args - Arguments to update many Rooms.
     * @example
     * // Update many Rooms
     * const room = await prisma.room.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Rooms and only return the `id`
     * const roomWithIdOnly = await prisma.room.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoomUpdateManyAndReturnArgs>(args: SelectSubset<T, RoomUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Room.
     * @param {RoomUpsertArgs} args - Arguments to update or create a Room.
     * @example
     * // Update or create a Room
     * const room = await prisma.room.upsert({
     *   create: {
     *     // ... data to create a Room
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Room we want to update
     *   }
     * })
     */
    upsert<T extends RoomUpsertArgs>(args: SelectSubset<T, RoomUpsertArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Rooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomCountArgs} args - Arguments to filter Rooms to count.
     * @example
     * // Count the number of Rooms
     * const count = await prisma.room.count({
     *   where: {
     *     // ... the filter for the Rooms we want to count
     *   }
     * })
    **/
    count<T extends RoomCountArgs>(
      args?: Subset<T, RoomCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoomCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Room.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoomAggregateArgs>(args: Subset<T, RoomAggregateArgs>): Prisma.PrismaPromise<GetRoomAggregateType<T>>

    /**
     * Group by Room.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoomGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoomGroupByArgs['orderBy'] }
        : { orderBy?: RoomGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoomGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoomGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Room model
   */
  readonly fields: RoomFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Room.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoomClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    creator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    players<T extends Room$playersArgs<ExtArgs> = {}>(args?: Subset<T, Room$playersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    games<T extends Room$gamesArgs<ExtArgs> = {}>(args?: Subset<T, Room$gamesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    roomStats<T extends Room$roomStatsArgs<ExtArgs> = {}>(args?: Subset<T, Room$roomStatsArgs<ExtArgs>>): Prisma__RoomStatsClient<$Result.GetResult<Prisma.$RoomStatsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    playerRoomStats<T extends Room$playerRoomStatsArgs<ExtArgs> = {}>(args?: Subset<T, Room$playerRoomStatsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerRoomStatsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Room model
   */
  interface RoomFieldRefs {
    readonly id: FieldRef<"Room", 'String'>
    readonly name: FieldRef<"Room", 'String'>
    readonly code: FieldRef<"Room", 'String'>
    readonly maxPlayers: FieldRef<"Room", 'Int'>
    readonly currentPlayers: FieldRef<"Room", 'Int'>
    readonly isPrivate: FieldRef<"Room", 'Boolean'>
    readonly status: FieldRef<"Room", 'RoomStatus'>
    readonly createdAt: FieldRef<"Room", 'DateTime'>
    readonly updatedAt: FieldRef<"Room", 'DateTime'>
    readonly creatorId: FieldRef<"Room", 'String'>
    readonly password: FieldRef<"Room", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Room findUnique
   */
  export type RoomFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Room to fetch.
     */
    where: RoomWhereUniqueInput
  }

  /**
   * Room findUniqueOrThrow
   */
  export type RoomFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Room to fetch.
     */
    where: RoomWhereUniqueInput
  }

  /**
   * Room findFirst
   */
  export type RoomFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Room to fetch.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rooms.
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rooms.
     */
    distinct?: RoomScalarFieldEnum | RoomScalarFieldEnum[]
  }

  /**
   * Room findFirstOrThrow
   */
  export type RoomFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Room to fetch.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Rooms.
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Rooms.
     */
    distinct?: RoomScalarFieldEnum | RoomScalarFieldEnum[]
  }

  /**
   * Room findMany
   */
  export type RoomFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter, which Rooms to fetch.
     */
    where?: RoomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Rooms to fetch.
     */
    orderBy?: RoomOrderByWithRelationInput | RoomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Rooms.
     */
    cursor?: RoomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Rooms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Rooms.
     */
    skip?: number
    distinct?: RoomScalarFieldEnum | RoomScalarFieldEnum[]
  }

  /**
   * Room create
   */
  export type RoomCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * The data needed to create a Room.
     */
    data: XOR<RoomCreateInput, RoomUncheckedCreateInput>
  }

  /**
   * Room createMany
   */
  export type RoomCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Rooms.
     */
    data: RoomCreateManyInput | RoomCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Room createManyAndReturn
   */
  export type RoomCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * The data used to create many Rooms.
     */
    data: RoomCreateManyInput | RoomCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Room update
   */
  export type RoomUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * The data needed to update a Room.
     */
    data: XOR<RoomUpdateInput, RoomUncheckedUpdateInput>
    /**
     * Choose, which Room to update.
     */
    where: RoomWhereUniqueInput
  }

  /**
   * Room updateMany
   */
  export type RoomUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Rooms.
     */
    data: XOR<RoomUpdateManyMutationInput, RoomUncheckedUpdateManyInput>
    /**
     * Filter which Rooms to update
     */
    where?: RoomWhereInput
    /**
     * Limit how many Rooms to update.
     */
    limit?: number
  }

  /**
   * Room updateManyAndReturn
   */
  export type RoomUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * The data used to update Rooms.
     */
    data: XOR<RoomUpdateManyMutationInput, RoomUncheckedUpdateManyInput>
    /**
     * Filter which Rooms to update
     */
    where?: RoomWhereInput
    /**
     * Limit how many Rooms to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Room upsert
   */
  export type RoomUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * The filter to search for the Room to update in case it exists.
     */
    where: RoomWhereUniqueInput
    /**
     * In case the Room found by the `where` argument doesn't exist, create a new Room with this data.
     */
    create: XOR<RoomCreateInput, RoomUncheckedCreateInput>
    /**
     * In case the Room was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoomUpdateInput, RoomUncheckedUpdateInput>
  }

  /**
   * Room delete
   */
  export type RoomDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
    /**
     * Filter which Room to delete.
     */
    where: RoomWhereUniqueInput
  }

  /**
   * Room deleteMany
   */
  export type RoomDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rooms to delete
     */
    where?: RoomWhereInput
    /**
     * Limit how many Rooms to delete.
     */
    limit?: number
  }

  /**
   * Room.players
   */
  export type Room$playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    where?: PlayerWhereInput
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    cursor?: PlayerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Room.games
   */
  export type Room$gamesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    where?: GameWhereInput
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    cursor?: GameWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Room.roomStats
   */
  export type Room$roomStatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomStats
     */
    select?: RoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoomStats
     */
    omit?: RoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomStatsInclude<ExtArgs> | null
    where?: RoomStatsWhereInput
  }

  /**
   * Room.playerRoomStats
   */
  export type Room$playerRoomStatsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRoomStats
     */
    select?: PlayerRoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRoomStats
     */
    omit?: PlayerRoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRoomStatsInclude<ExtArgs> | null
    where?: PlayerRoomStatsWhereInput
    orderBy?: PlayerRoomStatsOrderByWithRelationInput | PlayerRoomStatsOrderByWithRelationInput[]
    cursor?: PlayerRoomStatsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlayerRoomStatsScalarFieldEnum | PlayerRoomStatsScalarFieldEnum[]
  }

  /**
   * Room without action
   */
  export type RoomDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Room
     */
    select?: RoomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Room
     */
    omit?: RoomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomInclude<ExtArgs> | null
  }


  /**
   * Model Game
   */

  export type AggregateGame = {
    _count: GameCountAggregateOutputType | null
    _avg: GameAvgAggregateOutputType | null
    _sum: GameSumAggregateOutputType | null
    _min: GameMinAggregateOutputType | null
    _max: GameMaxAggregateOutputType | null
  }

  export type GameAvgAggregateOutputType = {
    currentRound: number | null
    currentTurn: number | null
  }

  export type GameSumAggregateOutputType = {
    currentRound: number | null
    currentTurn: number | null
  }

  export type GameMinAggregateOutputType = {
    id: string | null
    roomId: string | null
    status: $Enums.GameStatus | null
    currentRound: number | null
    currentTurn: number | null
    startedAt: Date | null
    finishedAt: Date | null
    winnerId: string | null
  }

  export type GameMaxAggregateOutputType = {
    id: string | null
    roomId: string | null
    status: $Enums.GameStatus | null
    currentRound: number | null
    currentTurn: number | null
    startedAt: Date | null
    finishedAt: Date | null
    winnerId: string | null
  }

  export type GameCountAggregateOutputType = {
    id: number
    roomId: number
    status: number
    currentRound: number
    currentTurn: number
    rows: number
    currentTurnCards: number
    history: number
    startedAt: number
    finishedAt: number
    winnerId: number
    _all: number
  }


  export type GameAvgAggregateInputType = {
    currentRound?: true
    currentTurn?: true
  }

  export type GameSumAggregateInputType = {
    currentRound?: true
    currentTurn?: true
  }

  export type GameMinAggregateInputType = {
    id?: true
    roomId?: true
    status?: true
    currentRound?: true
    currentTurn?: true
    startedAt?: true
    finishedAt?: true
    winnerId?: true
  }

  export type GameMaxAggregateInputType = {
    id?: true
    roomId?: true
    status?: true
    currentRound?: true
    currentTurn?: true
    startedAt?: true
    finishedAt?: true
    winnerId?: true
  }

  export type GameCountAggregateInputType = {
    id?: true
    roomId?: true
    status?: true
    currentRound?: true
    currentTurn?: true
    rows?: true
    currentTurnCards?: true
    history?: true
    startedAt?: true
    finishedAt?: true
    winnerId?: true
    _all?: true
  }

  export type GameAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Game to aggregate.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Games
    **/
    _count?: true | GameCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameMaxAggregateInputType
  }

  export type GetGameAggregateType<T extends GameAggregateArgs> = {
        [P in keyof T & keyof AggregateGame]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGame[P]>
      : GetScalarType<T[P], AggregateGame[P]>
  }




  export type GameGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameWhereInput
    orderBy?: GameOrderByWithAggregationInput | GameOrderByWithAggregationInput[]
    by: GameScalarFieldEnum[] | GameScalarFieldEnum
    having?: GameScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameCountAggregateInputType | true
    _avg?: GameAvgAggregateInputType
    _sum?: GameSumAggregateInputType
    _min?: GameMinAggregateInputType
    _max?: GameMaxAggregateInputType
  }

  export type GameGroupByOutputType = {
    id: string
    roomId: string
    status: $Enums.GameStatus
    currentRound: number
    currentTurn: number
    rows: JsonValue
    currentTurnCards: JsonValue
    history: JsonValue
    startedAt: Date
    finishedAt: Date | null
    winnerId: string | null
    _count: GameCountAggregateOutputType | null
    _avg: GameAvgAggregateOutputType | null
    _sum: GameSumAggregateOutputType | null
    _min: GameMinAggregateOutputType | null
    _max: GameMaxAggregateOutputType | null
  }

  type GetGameGroupByPayload<T extends GameGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameGroupByOutputType[P]>
            : GetScalarType<T[P], GameGroupByOutputType[P]>
        }
      >
    >


  export type GameSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    status?: boolean
    currentRound?: boolean
    currentTurn?: boolean
    rows?: boolean
    currentTurnCards?: boolean
    history?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    winnerId?: boolean
    room?: boolean | RoomDefaultArgs<ExtArgs>
    players?: boolean | Game$playersArgs<ExtArgs>
    winner?: boolean | Game$winnerArgs<ExtArgs>
    _count?: boolean | GameCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["game"]>

  export type GameSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    status?: boolean
    currentRound?: boolean
    currentTurn?: boolean
    rows?: boolean
    currentTurnCards?: boolean
    history?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    winnerId?: boolean
    room?: boolean | RoomDefaultArgs<ExtArgs>
    winner?: boolean | Game$winnerArgs<ExtArgs>
  }, ExtArgs["result"]["game"]>

  export type GameSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    status?: boolean
    currentRound?: boolean
    currentTurn?: boolean
    rows?: boolean
    currentTurnCards?: boolean
    history?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    winnerId?: boolean
    room?: boolean | RoomDefaultArgs<ExtArgs>
    winner?: boolean | Game$winnerArgs<ExtArgs>
  }, ExtArgs["result"]["game"]>

  export type GameSelectScalar = {
    id?: boolean
    roomId?: boolean
    status?: boolean
    currentRound?: boolean
    currentTurn?: boolean
    rows?: boolean
    currentTurnCards?: boolean
    history?: boolean
    startedAt?: boolean
    finishedAt?: boolean
    winnerId?: boolean
  }

  export type GameOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roomId" | "status" | "currentRound" | "currentTurn" | "rows" | "currentTurnCards" | "history" | "startedAt" | "finishedAt" | "winnerId", ExtArgs["result"]["game"]>
  export type GameInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | RoomDefaultArgs<ExtArgs>
    players?: boolean | Game$playersArgs<ExtArgs>
    winner?: boolean | Game$winnerArgs<ExtArgs>
    _count?: boolean | GameCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GameIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | RoomDefaultArgs<ExtArgs>
    winner?: boolean | Game$winnerArgs<ExtArgs>
  }
  export type GameIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | RoomDefaultArgs<ExtArgs>
    winner?: boolean | Game$winnerArgs<ExtArgs>
  }

  export type $GamePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Game"
    objects: {
      room: Prisma.$RoomPayload<ExtArgs>
      players: Prisma.$PlayerPayload<ExtArgs>[]
      winner: Prisma.$PlayerPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      roomId: string
      status: $Enums.GameStatus
      currentRound: number
      currentTurn: number
      rows: Prisma.JsonValue
      currentTurnCards: Prisma.JsonValue
      history: Prisma.JsonValue
      startedAt: Date
      finishedAt: Date | null
      winnerId: string | null
    }, ExtArgs["result"]["game"]>
    composites: {}
  }

  type GameGetPayload<S extends boolean | null | undefined | GameDefaultArgs> = $Result.GetResult<Prisma.$GamePayload, S>

  type GameCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameCountAggregateInputType | true
    }

  export interface GameDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Game'], meta: { name: 'Game' } }
    /**
     * Find zero or one Game that matches the filter.
     * @param {GameFindUniqueArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameFindUniqueArgs>(args: SelectSubset<T, GameFindUniqueArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Game that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameFindUniqueOrThrowArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameFindUniqueOrThrowArgs>(args: SelectSubset<T, GameFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Game that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameFindFirstArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameFindFirstArgs>(args?: SelectSubset<T, GameFindFirstArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Game that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameFindFirstOrThrowArgs} args - Arguments to find a Game
     * @example
     * // Get one Game
     * const game = await prisma.game.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameFindFirstOrThrowArgs>(args?: SelectSubset<T, GameFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Games that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Games
     * const games = await prisma.game.findMany()
     * 
     * // Get first 10 Games
     * const games = await prisma.game.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameWithIdOnly = await prisma.game.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameFindManyArgs>(args?: SelectSubset<T, GameFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Game.
     * @param {GameCreateArgs} args - Arguments to create a Game.
     * @example
     * // Create one Game
     * const Game = await prisma.game.create({
     *   data: {
     *     // ... data to create a Game
     *   }
     * })
     * 
     */
    create<T extends GameCreateArgs>(args: SelectSubset<T, GameCreateArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Games.
     * @param {GameCreateManyArgs} args - Arguments to create many Games.
     * @example
     * // Create many Games
     * const game = await prisma.game.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameCreateManyArgs>(args?: SelectSubset<T, GameCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Games and returns the data saved in the database.
     * @param {GameCreateManyAndReturnArgs} args - Arguments to create many Games.
     * @example
     * // Create many Games
     * const game = await prisma.game.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Games and only return the `id`
     * const gameWithIdOnly = await prisma.game.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameCreateManyAndReturnArgs>(args?: SelectSubset<T, GameCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Game.
     * @param {GameDeleteArgs} args - Arguments to delete one Game.
     * @example
     * // Delete one Game
     * const Game = await prisma.game.delete({
     *   where: {
     *     // ... filter to delete one Game
     *   }
     * })
     * 
     */
    delete<T extends GameDeleteArgs>(args: SelectSubset<T, GameDeleteArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Game.
     * @param {GameUpdateArgs} args - Arguments to update one Game.
     * @example
     * // Update one Game
     * const game = await prisma.game.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameUpdateArgs>(args: SelectSubset<T, GameUpdateArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Games.
     * @param {GameDeleteManyArgs} args - Arguments to filter Games to delete.
     * @example
     * // Delete a few Games
     * const { count } = await prisma.game.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameDeleteManyArgs>(args?: SelectSubset<T, GameDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Games.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Games
     * const game = await prisma.game.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameUpdateManyArgs>(args: SelectSubset<T, GameUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Games and returns the data updated in the database.
     * @param {GameUpdateManyAndReturnArgs} args - Arguments to update many Games.
     * @example
     * // Update many Games
     * const game = await prisma.game.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Games and only return the `id`
     * const gameWithIdOnly = await prisma.game.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameUpdateManyAndReturnArgs>(args: SelectSubset<T, GameUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Game.
     * @param {GameUpsertArgs} args - Arguments to update or create a Game.
     * @example
     * // Update or create a Game
     * const game = await prisma.game.upsert({
     *   create: {
     *     // ... data to create a Game
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Game we want to update
     *   }
     * })
     */
    upsert<T extends GameUpsertArgs>(args: SelectSubset<T, GameUpsertArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Games.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameCountArgs} args - Arguments to filter Games to count.
     * @example
     * // Count the number of Games
     * const count = await prisma.game.count({
     *   where: {
     *     // ... the filter for the Games we want to count
     *   }
     * })
    **/
    count<T extends GameCountArgs>(
      args?: Subset<T, GameCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Game.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameAggregateArgs>(args: Subset<T, GameAggregateArgs>): Prisma.PrismaPromise<GetGameAggregateType<T>>

    /**
     * Group by Game.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameGroupByArgs['orderBy'] }
        : { orderBy?: GameGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Game model
   */
  readonly fields: GameFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Game.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    room<T extends RoomDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoomDefaultArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    players<T extends Game$playersArgs<ExtArgs> = {}>(args?: Subset<T, Game$playersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    winner<T extends Game$winnerArgs<ExtArgs> = {}>(args?: Subset<T, Game$winnerArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Game model
   */
  interface GameFieldRefs {
    readonly id: FieldRef<"Game", 'String'>
    readonly roomId: FieldRef<"Game", 'String'>
    readonly status: FieldRef<"Game", 'GameStatus'>
    readonly currentRound: FieldRef<"Game", 'Int'>
    readonly currentTurn: FieldRef<"Game", 'Int'>
    readonly rows: FieldRef<"Game", 'Json'>
    readonly currentTurnCards: FieldRef<"Game", 'Json'>
    readonly history: FieldRef<"Game", 'Json'>
    readonly startedAt: FieldRef<"Game", 'DateTime'>
    readonly finishedAt: FieldRef<"Game", 'DateTime'>
    readonly winnerId: FieldRef<"Game", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Game findUnique
   */
  export type GameFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game findUniqueOrThrow
   */
  export type GameFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game findFirst
   */
  export type GameFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Games.
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Games.
     */
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Game findFirstOrThrow
   */
  export type GameFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Game to fetch.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Games.
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Games.
     */
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Game findMany
   */
  export type GameFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter, which Games to fetch.
     */
    where?: GameWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Games to fetch.
     */
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Games.
     */
    cursor?: GameWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Games from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Games.
     */
    skip?: number
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Game create
   */
  export type GameCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * The data needed to create a Game.
     */
    data: XOR<GameCreateInput, GameUncheckedCreateInput>
  }

  /**
   * Game createMany
   */
  export type GameCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Games.
     */
    data: GameCreateManyInput | GameCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Game createManyAndReturn
   */
  export type GameCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * The data used to create many Games.
     */
    data: GameCreateManyInput | GameCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Game update
   */
  export type GameUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * The data needed to update a Game.
     */
    data: XOR<GameUpdateInput, GameUncheckedUpdateInput>
    /**
     * Choose, which Game to update.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game updateMany
   */
  export type GameUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Games.
     */
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyInput>
    /**
     * Filter which Games to update
     */
    where?: GameWhereInput
    /**
     * Limit how many Games to update.
     */
    limit?: number
  }

  /**
   * Game updateManyAndReturn
   */
  export type GameUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * The data used to update Games.
     */
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyInput>
    /**
     * Filter which Games to update
     */
    where?: GameWhereInput
    /**
     * Limit how many Games to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Game upsert
   */
  export type GameUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * The filter to search for the Game to update in case it exists.
     */
    where: GameWhereUniqueInput
    /**
     * In case the Game found by the `where` argument doesn't exist, create a new Game with this data.
     */
    create: XOR<GameCreateInput, GameUncheckedCreateInput>
    /**
     * In case the Game was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameUpdateInput, GameUncheckedUpdateInput>
  }

  /**
   * Game delete
   */
  export type GameDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    /**
     * Filter which Game to delete.
     */
    where: GameWhereUniqueInput
  }

  /**
   * Game deleteMany
   */
  export type GameDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Games to delete
     */
    where?: GameWhereInput
    /**
     * Limit how many Games to delete.
     */
    limit?: number
  }

  /**
   * Game.players
   */
  export type Game$playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    where?: PlayerWhereInput
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    cursor?: PlayerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Game.winner
   */
  export type Game$winnerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    where?: PlayerWhereInput
  }

  /**
   * Game without action
   */
  export type GameDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
  }


  /**
   * Model Player
   */

  export type AggregatePlayer = {
    _count: PlayerCountAggregateOutputType | null
    _avg: PlayerAvgAggregateOutputType | null
    _sum: PlayerSumAggregateOutputType | null
    _min: PlayerMinAggregateOutputType | null
    _max: PlayerMaxAggregateOutputType | null
  }

  export type PlayerAvgAggregateOutputType = {
    position: number | null
    totalPenalty: number | null
    roundPenalty: number | null
    finalPosition: number | null
  }

  export type PlayerSumAggregateOutputType = {
    position: number | null
    totalPenalty: number | null
    roundPenalty: number | null
    finalPosition: number | null
  }

  export type PlayerMinAggregateOutputType = {
    id: string | null
    userId: string | null
    roomId: string | null
    gameId: string | null
    isBot: boolean | null
    botName: string | null
    position: number | null
    totalPenalty: number | null
    roundPenalty: number | null
    isSelectedCardConfirmed: boolean | null
    isReady: boolean | null
    isWinner: boolean | null
    finalPosition: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PlayerMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    roomId: string | null
    gameId: string | null
    isBot: boolean | null
    botName: string | null
    position: number | null
    totalPenalty: number | null
    roundPenalty: number | null
    isSelectedCardConfirmed: boolean | null
    isReady: boolean | null
    isWinner: boolean | null
    finalPosition: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PlayerCountAggregateOutputType = {
    id: number
    userId: number
    roomId: number
    gameId: number
    isBot: number
    botName: number
    position: number
    hand: number
    penaltyCard: number
    totalPenalty: number
    roundPenaltyCard: number
    roundPenalty: number
    selectedCard: number
    isSelectedCardConfirmed: number
    isReady: number
    isWinner: number
    finalPosition: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PlayerAvgAggregateInputType = {
    position?: true
    totalPenalty?: true
    roundPenalty?: true
    finalPosition?: true
  }

  export type PlayerSumAggregateInputType = {
    position?: true
    totalPenalty?: true
    roundPenalty?: true
    finalPosition?: true
  }

  export type PlayerMinAggregateInputType = {
    id?: true
    userId?: true
    roomId?: true
    gameId?: true
    isBot?: true
    botName?: true
    position?: true
    totalPenalty?: true
    roundPenalty?: true
    isSelectedCardConfirmed?: true
    isReady?: true
    isWinner?: true
    finalPosition?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PlayerMaxAggregateInputType = {
    id?: true
    userId?: true
    roomId?: true
    gameId?: true
    isBot?: true
    botName?: true
    position?: true
    totalPenalty?: true
    roundPenalty?: true
    isSelectedCardConfirmed?: true
    isReady?: true
    isWinner?: true
    finalPosition?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PlayerCountAggregateInputType = {
    id?: true
    userId?: true
    roomId?: true
    gameId?: true
    isBot?: true
    botName?: true
    position?: true
    hand?: true
    penaltyCard?: true
    totalPenalty?: true
    roundPenaltyCard?: true
    roundPenalty?: true
    selectedCard?: true
    isSelectedCardConfirmed?: true
    isReady?: true
    isWinner?: true
    finalPosition?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PlayerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Player to aggregate.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Players
    **/
    _count?: true | PlayerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlayerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlayerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlayerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlayerMaxAggregateInputType
  }

  export type GetPlayerAggregateType<T extends PlayerAggregateArgs> = {
        [P in keyof T & keyof AggregatePlayer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlayer[P]>
      : GetScalarType<T[P], AggregatePlayer[P]>
  }




  export type PlayerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerWhereInput
    orderBy?: PlayerOrderByWithAggregationInput | PlayerOrderByWithAggregationInput[]
    by: PlayerScalarFieldEnum[] | PlayerScalarFieldEnum
    having?: PlayerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlayerCountAggregateInputType | true
    _avg?: PlayerAvgAggregateInputType
    _sum?: PlayerSumAggregateInputType
    _min?: PlayerMinAggregateInputType
    _max?: PlayerMaxAggregateInputType
  }

  export type PlayerGroupByOutputType = {
    id: string
    userId: string | null
    roomId: string
    gameId: string | null
    isBot: boolean
    botName: string | null
    position: number
    hand: JsonValue
    penaltyCard: JsonValue
    totalPenalty: number
    roundPenaltyCard: JsonValue
    roundPenalty: number
    selectedCard: JsonValue | null
    isSelectedCardConfirmed: boolean
    isReady: boolean
    isWinner: boolean
    finalPosition: number | null
    createdAt: Date
    updatedAt: Date
    _count: PlayerCountAggregateOutputType | null
    _avg: PlayerAvgAggregateOutputType | null
    _sum: PlayerSumAggregateOutputType | null
    _min: PlayerMinAggregateOutputType | null
    _max: PlayerMaxAggregateOutputType | null
  }

  type GetPlayerGroupByPayload<T extends PlayerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlayerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlayerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlayerGroupByOutputType[P]>
            : GetScalarType<T[P], PlayerGroupByOutputType[P]>
        }
      >
    >


  export type PlayerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    roomId?: boolean
    gameId?: boolean
    isBot?: boolean
    botName?: boolean
    position?: boolean
    hand?: boolean
    penaltyCard?: boolean
    totalPenalty?: boolean
    roundPenaltyCard?: boolean
    roundPenalty?: boolean
    selectedCard?: boolean
    isSelectedCardConfirmed?: boolean
    isReady?: boolean
    isWinner?: boolean
    finalPosition?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Player$userArgs<ExtArgs>
    room?: boolean | RoomDefaultArgs<ExtArgs>
    game?: boolean | Player$gameArgs<ExtArgs>
    wonGames?: boolean | Player$wonGamesArgs<ExtArgs>
    _count?: boolean | PlayerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    roomId?: boolean
    gameId?: boolean
    isBot?: boolean
    botName?: boolean
    position?: boolean
    hand?: boolean
    penaltyCard?: boolean
    totalPenalty?: boolean
    roundPenaltyCard?: boolean
    roundPenalty?: boolean
    selectedCard?: boolean
    isSelectedCardConfirmed?: boolean
    isReady?: boolean
    isWinner?: boolean
    finalPosition?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Player$userArgs<ExtArgs>
    room?: boolean | RoomDefaultArgs<ExtArgs>
    game?: boolean | Player$gameArgs<ExtArgs>
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    roomId?: boolean
    gameId?: boolean
    isBot?: boolean
    botName?: boolean
    position?: boolean
    hand?: boolean
    penaltyCard?: boolean
    totalPenalty?: boolean
    roundPenaltyCard?: boolean
    roundPenalty?: boolean
    selectedCard?: boolean
    isSelectedCardConfirmed?: boolean
    isReady?: boolean
    isWinner?: boolean
    finalPosition?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | Player$userArgs<ExtArgs>
    room?: boolean | RoomDefaultArgs<ExtArgs>
    game?: boolean | Player$gameArgs<ExtArgs>
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectScalar = {
    id?: boolean
    userId?: boolean
    roomId?: boolean
    gameId?: boolean
    isBot?: boolean
    botName?: boolean
    position?: boolean
    hand?: boolean
    penaltyCard?: boolean
    totalPenalty?: boolean
    roundPenaltyCard?: boolean
    roundPenalty?: boolean
    selectedCard?: boolean
    isSelectedCardConfirmed?: boolean
    isReady?: boolean
    isWinner?: boolean
    finalPosition?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PlayerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "roomId" | "gameId" | "isBot" | "botName" | "position" | "hand" | "penaltyCard" | "totalPenalty" | "roundPenaltyCard" | "roundPenalty" | "selectedCard" | "isSelectedCardConfirmed" | "isReady" | "isWinner" | "finalPosition" | "createdAt" | "updatedAt", ExtArgs["result"]["player"]>
  export type PlayerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Player$userArgs<ExtArgs>
    room?: boolean | RoomDefaultArgs<ExtArgs>
    game?: boolean | Player$gameArgs<ExtArgs>
    wonGames?: boolean | Player$wonGamesArgs<ExtArgs>
    _count?: boolean | PlayerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PlayerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Player$userArgs<ExtArgs>
    room?: boolean | RoomDefaultArgs<ExtArgs>
    game?: boolean | Player$gameArgs<ExtArgs>
  }
  export type PlayerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Player$userArgs<ExtArgs>
    room?: boolean | RoomDefaultArgs<ExtArgs>
    game?: boolean | Player$gameArgs<ExtArgs>
  }

  export type $PlayerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Player"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      room: Prisma.$RoomPayload<ExtArgs>
      game: Prisma.$GamePayload<ExtArgs> | null
      wonGames: Prisma.$GamePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      roomId: string
      gameId: string | null
      isBot: boolean
      botName: string | null
      position: number
      hand: Prisma.JsonValue
      penaltyCard: Prisma.JsonValue
      totalPenalty: number
      roundPenaltyCard: Prisma.JsonValue
      roundPenalty: number
      selectedCard: Prisma.JsonValue | null
      isSelectedCardConfirmed: boolean
      isReady: boolean
      isWinner: boolean
      finalPosition: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["player"]>
    composites: {}
  }

  type PlayerGetPayload<S extends boolean | null | undefined | PlayerDefaultArgs> = $Result.GetResult<Prisma.$PlayerPayload, S>

  type PlayerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlayerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlayerCountAggregateInputType | true
    }

  export interface PlayerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Player'], meta: { name: 'Player' } }
    /**
     * Find zero or one Player that matches the filter.
     * @param {PlayerFindUniqueArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlayerFindUniqueArgs>(args: SelectSubset<T, PlayerFindUniqueArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Player that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlayerFindUniqueOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlayerFindUniqueOrThrowArgs>(args: SelectSubset<T, PlayerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindFirstArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlayerFindFirstArgs>(args?: SelectSubset<T, PlayerFindFirstArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindFirstOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlayerFindFirstOrThrowArgs>(args?: SelectSubset<T, PlayerFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Players that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Players
     * const players = await prisma.player.findMany()
     * 
     * // Get first 10 Players
     * const players = await prisma.player.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const playerWithIdOnly = await prisma.player.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlayerFindManyArgs>(args?: SelectSubset<T, PlayerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Player.
     * @param {PlayerCreateArgs} args - Arguments to create a Player.
     * @example
     * // Create one Player
     * const Player = await prisma.player.create({
     *   data: {
     *     // ... data to create a Player
     *   }
     * })
     * 
     */
    create<T extends PlayerCreateArgs>(args: SelectSubset<T, PlayerCreateArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Players.
     * @param {PlayerCreateManyArgs} args - Arguments to create many Players.
     * @example
     * // Create many Players
     * const player = await prisma.player.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlayerCreateManyArgs>(args?: SelectSubset<T, PlayerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Players and returns the data saved in the database.
     * @param {PlayerCreateManyAndReturnArgs} args - Arguments to create many Players.
     * @example
     * // Create many Players
     * const player = await prisma.player.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Players and only return the `id`
     * const playerWithIdOnly = await prisma.player.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlayerCreateManyAndReturnArgs>(args?: SelectSubset<T, PlayerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Player.
     * @param {PlayerDeleteArgs} args - Arguments to delete one Player.
     * @example
     * // Delete one Player
     * const Player = await prisma.player.delete({
     *   where: {
     *     // ... filter to delete one Player
     *   }
     * })
     * 
     */
    delete<T extends PlayerDeleteArgs>(args: SelectSubset<T, PlayerDeleteArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Player.
     * @param {PlayerUpdateArgs} args - Arguments to update one Player.
     * @example
     * // Update one Player
     * const player = await prisma.player.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlayerUpdateArgs>(args: SelectSubset<T, PlayerUpdateArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Players.
     * @param {PlayerDeleteManyArgs} args - Arguments to filter Players to delete.
     * @example
     * // Delete a few Players
     * const { count } = await prisma.player.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlayerDeleteManyArgs>(args?: SelectSubset<T, PlayerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Players
     * const player = await prisma.player.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlayerUpdateManyArgs>(args: SelectSubset<T, PlayerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Players and returns the data updated in the database.
     * @param {PlayerUpdateManyAndReturnArgs} args - Arguments to update many Players.
     * @example
     * // Update many Players
     * const player = await prisma.player.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Players and only return the `id`
     * const playerWithIdOnly = await prisma.player.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PlayerUpdateManyAndReturnArgs>(args: SelectSubset<T, PlayerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Player.
     * @param {PlayerUpsertArgs} args - Arguments to update or create a Player.
     * @example
     * // Update or create a Player
     * const player = await prisma.player.upsert({
     *   create: {
     *     // ... data to create a Player
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Player we want to update
     *   }
     * })
     */
    upsert<T extends PlayerUpsertArgs>(args: SelectSubset<T, PlayerUpsertArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerCountArgs} args - Arguments to filter Players to count.
     * @example
     * // Count the number of Players
     * const count = await prisma.player.count({
     *   where: {
     *     // ... the filter for the Players we want to count
     *   }
     * })
    **/
    count<T extends PlayerCountArgs>(
      args?: Subset<T, PlayerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlayerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlayerAggregateArgs>(args: Subset<T, PlayerAggregateArgs>): Prisma.PrismaPromise<GetPlayerAggregateType<T>>

    /**
     * Group by Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlayerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlayerGroupByArgs['orderBy'] }
        : { orderBy?: PlayerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlayerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Player model
   */
  readonly fields: PlayerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Player.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlayerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Player$userArgs<ExtArgs> = {}>(args?: Subset<T, Player$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    room<T extends RoomDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoomDefaultArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    game<T extends Player$gameArgs<ExtArgs> = {}>(args?: Subset<T, Player$gameArgs<ExtArgs>>): Prisma__GameClient<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    wonGames<T extends Player$wonGamesArgs<ExtArgs> = {}>(args?: Subset<T, Player$wonGamesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GamePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Player model
   */
  interface PlayerFieldRefs {
    readonly id: FieldRef<"Player", 'String'>
    readonly userId: FieldRef<"Player", 'String'>
    readonly roomId: FieldRef<"Player", 'String'>
    readonly gameId: FieldRef<"Player", 'String'>
    readonly isBot: FieldRef<"Player", 'Boolean'>
    readonly botName: FieldRef<"Player", 'String'>
    readonly position: FieldRef<"Player", 'Int'>
    readonly hand: FieldRef<"Player", 'Json'>
    readonly penaltyCard: FieldRef<"Player", 'Json'>
    readonly totalPenalty: FieldRef<"Player", 'Int'>
    readonly roundPenaltyCard: FieldRef<"Player", 'Json'>
    readonly roundPenalty: FieldRef<"Player", 'Int'>
    readonly selectedCard: FieldRef<"Player", 'Json'>
    readonly isSelectedCardConfirmed: FieldRef<"Player", 'Boolean'>
    readonly isReady: FieldRef<"Player", 'Boolean'>
    readonly isWinner: FieldRef<"Player", 'Boolean'>
    readonly finalPosition: FieldRef<"Player", 'Int'>
    readonly createdAt: FieldRef<"Player", 'DateTime'>
    readonly updatedAt: FieldRef<"Player", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Player findUnique
   */
  export type PlayerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player findUniqueOrThrow
   */
  export type PlayerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player findFirst
   */
  export type PlayerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Players.
     */
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player findFirstOrThrow
   */
  export type PlayerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Players.
     */
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player findMany
   */
  export type PlayerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Players to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player create
   */
  export type PlayerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The data needed to create a Player.
     */
    data: XOR<PlayerCreateInput, PlayerUncheckedCreateInput>
  }

  /**
   * Player createMany
   */
  export type PlayerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Players.
     */
    data: PlayerCreateManyInput | PlayerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Player createManyAndReturn
   */
  export type PlayerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * The data used to create many Players.
     */
    data: PlayerCreateManyInput | PlayerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Player update
   */
  export type PlayerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The data needed to update a Player.
     */
    data: XOR<PlayerUpdateInput, PlayerUncheckedUpdateInput>
    /**
     * Choose, which Player to update.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player updateMany
   */
  export type PlayerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Players.
     */
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyInput>
    /**
     * Filter which Players to update
     */
    where?: PlayerWhereInput
    /**
     * Limit how many Players to update.
     */
    limit?: number
  }

  /**
   * Player updateManyAndReturn
   */
  export type PlayerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * The data used to update Players.
     */
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyInput>
    /**
     * Filter which Players to update
     */
    where?: PlayerWhereInput
    /**
     * Limit how many Players to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Player upsert
   */
  export type PlayerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The filter to search for the Player to update in case it exists.
     */
    where: PlayerWhereUniqueInput
    /**
     * In case the Player found by the `where` argument doesn't exist, create a new Player with this data.
     */
    create: XOR<PlayerCreateInput, PlayerUncheckedCreateInput>
    /**
     * In case the Player was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlayerUpdateInput, PlayerUncheckedUpdateInput>
  }

  /**
   * Player delete
   */
  export type PlayerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter which Player to delete.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player deleteMany
   */
  export type PlayerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Players to delete
     */
    where?: PlayerWhereInput
    /**
     * Limit how many Players to delete.
     */
    limit?: number
  }

  /**
   * Player.user
   */
  export type Player$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Player.game
   */
  export type Player$gameArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    where?: GameWhereInput
  }

  /**
   * Player.wonGames
   */
  export type Player$wonGamesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Game
     */
    select?: GameSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Game
     */
    omit?: GameOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameInclude<ExtArgs> | null
    where?: GameWhereInput
    orderBy?: GameOrderByWithRelationInput | GameOrderByWithRelationInput[]
    cursor?: GameWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameScalarFieldEnum | GameScalarFieldEnum[]
  }

  /**
   * Player without action
   */
  export type PlayerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
  }


  /**
   * Model RoomStats
   */

  export type AggregateRoomStats = {
    _count: RoomStatsCountAggregateOutputType | null
    _avg: RoomStatsAvgAggregateOutputType | null
    _sum: RoomStatsSumAggregateOutputType | null
    _min: RoomStatsMinAggregateOutputType | null
    _max: RoomStatsMaxAggregateOutputType | null
  }

  export type RoomStatsAvgAggregateOutputType = {
    totalGames: number | null
    completedGames: number | null
  }

  export type RoomStatsSumAggregateOutputType = {
    totalGames: number | null
    completedGames: number | null
  }

  export type RoomStatsMinAggregateOutputType = {
    id: string | null
    roomId: string | null
    totalGames: number | null
    completedGames: number | null
    updatedAt: Date | null
  }

  export type RoomStatsMaxAggregateOutputType = {
    id: string | null
    roomId: string | null
    totalGames: number | null
    completedGames: number | null
    updatedAt: Date | null
  }

  export type RoomStatsCountAggregateOutputType = {
    id: number
    roomId: number
    totalGames: number
    completedGames: number
    updatedAt: number
    _all: number
  }


  export type RoomStatsAvgAggregateInputType = {
    totalGames?: true
    completedGames?: true
  }

  export type RoomStatsSumAggregateInputType = {
    totalGames?: true
    completedGames?: true
  }

  export type RoomStatsMinAggregateInputType = {
    id?: true
    roomId?: true
    totalGames?: true
    completedGames?: true
    updatedAt?: true
  }

  export type RoomStatsMaxAggregateInputType = {
    id?: true
    roomId?: true
    totalGames?: true
    completedGames?: true
    updatedAt?: true
  }

  export type RoomStatsCountAggregateInputType = {
    id?: true
    roomId?: true
    totalGames?: true
    completedGames?: true
    updatedAt?: true
    _all?: true
  }

  export type RoomStatsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoomStats to aggregate.
     */
    where?: RoomStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoomStats to fetch.
     */
    orderBy?: RoomStatsOrderByWithRelationInput | RoomStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoomStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoomStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoomStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RoomStats
    **/
    _count?: true | RoomStatsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoomStatsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoomStatsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoomStatsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoomStatsMaxAggregateInputType
  }

  export type GetRoomStatsAggregateType<T extends RoomStatsAggregateArgs> = {
        [P in keyof T & keyof AggregateRoomStats]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoomStats[P]>
      : GetScalarType<T[P], AggregateRoomStats[P]>
  }




  export type RoomStatsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoomStatsWhereInput
    orderBy?: RoomStatsOrderByWithAggregationInput | RoomStatsOrderByWithAggregationInput[]
    by: RoomStatsScalarFieldEnum[] | RoomStatsScalarFieldEnum
    having?: RoomStatsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoomStatsCountAggregateInputType | true
    _avg?: RoomStatsAvgAggregateInputType
    _sum?: RoomStatsSumAggregateInputType
    _min?: RoomStatsMinAggregateInputType
    _max?: RoomStatsMaxAggregateInputType
  }

  export type RoomStatsGroupByOutputType = {
    id: string
    roomId: string
    totalGames: number
    completedGames: number
    updatedAt: Date
    _count: RoomStatsCountAggregateOutputType | null
    _avg: RoomStatsAvgAggregateOutputType | null
    _sum: RoomStatsSumAggregateOutputType | null
    _min: RoomStatsMinAggregateOutputType | null
    _max: RoomStatsMaxAggregateOutputType | null
  }

  type GetRoomStatsGroupByPayload<T extends RoomStatsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoomStatsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoomStatsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoomStatsGroupByOutputType[P]>
            : GetScalarType<T[P], RoomStatsGroupByOutputType[P]>
        }
      >
    >


  export type RoomStatsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    totalGames?: boolean
    completedGames?: boolean
    updatedAt?: boolean
    room?: boolean | RoomDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roomStats"]>

  export type RoomStatsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    totalGames?: boolean
    completedGames?: boolean
    updatedAt?: boolean
    room?: boolean | RoomDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roomStats"]>

  export type RoomStatsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomId?: boolean
    totalGames?: boolean
    completedGames?: boolean
    updatedAt?: boolean
    room?: boolean | RoomDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["roomStats"]>

  export type RoomStatsSelectScalar = {
    id?: boolean
    roomId?: boolean
    totalGames?: boolean
    completedGames?: boolean
    updatedAt?: boolean
  }

  export type RoomStatsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roomId" | "totalGames" | "completedGames" | "updatedAt", ExtArgs["result"]["roomStats"]>
  export type RoomStatsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | RoomDefaultArgs<ExtArgs>
  }
  export type RoomStatsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | RoomDefaultArgs<ExtArgs>
  }
  export type RoomStatsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    room?: boolean | RoomDefaultArgs<ExtArgs>
  }

  export type $RoomStatsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RoomStats"
    objects: {
      room: Prisma.$RoomPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      roomId: string
      totalGames: number
      completedGames: number
      updatedAt: Date
    }, ExtArgs["result"]["roomStats"]>
    composites: {}
  }

  type RoomStatsGetPayload<S extends boolean | null | undefined | RoomStatsDefaultArgs> = $Result.GetResult<Prisma.$RoomStatsPayload, S>

  type RoomStatsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoomStatsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoomStatsCountAggregateInputType | true
    }

  export interface RoomStatsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RoomStats'], meta: { name: 'RoomStats' } }
    /**
     * Find zero or one RoomStats that matches the filter.
     * @param {RoomStatsFindUniqueArgs} args - Arguments to find a RoomStats
     * @example
     * // Get one RoomStats
     * const roomStats = await prisma.roomStats.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoomStatsFindUniqueArgs>(args: SelectSubset<T, RoomStatsFindUniqueArgs<ExtArgs>>): Prisma__RoomStatsClient<$Result.GetResult<Prisma.$RoomStatsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RoomStats that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoomStatsFindUniqueOrThrowArgs} args - Arguments to find a RoomStats
     * @example
     * // Get one RoomStats
     * const roomStats = await prisma.roomStats.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoomStatsFindUniqueOrThrowArgs>(args: SelectSubset<T, RoomStatsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoomStatsClient<$Result.GetResult<Prisma.$RoomStatsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoomStats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomStatsFindFirstArgs} args - Arguments to find a RoomStats
     * @example
     * // Get one RoomStats
     * const roomStats = await prisma.roomStats.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoomStatsFindFirstArgs>(args?: SelectSubset<T, RoomStatsFindFirstArgs<ExtArgs>>): Prisma__RoomStatsClient<$Result.GetResult<Prisma.$RoomStatsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RoomStats that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomStatsFindFirstOrThrowArgs} args - Arguments to find a RoomStats
     * @example
     * // Get one RoomStats
     * const roomStats = await prisma.roomStats.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoomStatsFindFirstOrThrowArgs>(args?: SelectSubset<T, RoomStatsFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoomStatsClient<$Result.GetResult<Prisma.$RoomStatsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RoomStats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomStatsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RoomStats
     * const roomStats = await prisma.roomStats.findMany()
     * 
     * // Get first 10 RoomStats
     * const roomStats = await prisma.roomStats.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roomStatsWithIdOnly = await prisma.roomStats.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoomStatsFindManyArgs>(args?: SelectSubset<T, RoomStatsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomStatsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RoomStats.
     * @param {RoomStatsCreateArgs} args - Arguments to create a RoomStats.
     * @example
     * // Create one RoomStats
     * const RoomStats = await prisma.roomStats.create({
     *   data: {
     *     // ... data to create a RoomStats
     *   }
     * })
     * 
     */
    create<T extends RoomStatsCreateArgs>(args: SelectSubset<T, RoomStatsCreateArgs<ExtArgs>>): Prisma__RoomStatsClient<$Result.GetResult<Prisma.$RoomStatsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RoomStats.
     * @param {RoomStatsCreateManyArgs} args - Arguments to create many RoomStats.
     * @example
     * // Create many RoomStats
     * const roomStats = await prisma.roomStats.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoomStatsCreateManyArgs>(args?: SelectSubset<T, RoomStatsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RoomStats and returns the data saved in the database.
     * @param {RoomStatsCreateManyAndReturnArgs} args - Arguments to create many RoomStats.
     * @example
     * // Create many RoomStats
     * const roomStats = await prisma.roomStats.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RoomStats and only return the `id`
     * const roomStatsWithIdOnly = await prisma.roomStats.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoomStatsCreateManyAndReturnArgs>(args?: SelectSubset<T, RoomStatsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomStatsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RoomStats.
     * @param {RoomStatsDeleteArgs} args - Arguments to delete one RoomStats.
     * @example
     * // Delete one RoomStats
     * const RoomStats = await prisma.roomStats.delete({
     *   where: {
     *     // ... filter to delete one RoomStats
     *   }
     * })
     * 
     */
    delete<T extends RoomStatsDeleteArgs>(args: SelectSubset<T, RoomStatsDeleteArgs<ExtArgs>>): Prisma__RoomStatsClient<$Result.GetResult<Prisma.$RoomStatsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RoomStats.
     * @param {RoomStatsUpdateArgs} args - Arguments to update one RoomStats.
     * @example
     * // Update one RoomStats
     * const roomStats = await prisma.roomStats.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoomStatsUpdateArgs>(args: SelectSubset<T, RoomStatsUpdateArgs<ExtArgs>>): Prisma__RoomStatsClient<$Result.GetResult<Prisma.$RoomStatsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RoomStats.
     * @param {RoomStatsDeleteManyArgs} args - Arguments to filter RoomStats to delete.
     * @example
     * // Delete a few RoomStats
     * const { count } = await prisma.roomStats.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoomStatsDeleteManyArgs>(args?: SelectSubset<T, RoomStatsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoomStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomStatsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RoomStats
     * const roomStats = await prisma.roomStats.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoomStatsUpdateManyArgs>(args: SelectSubset<T, RoomStatsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RoomStats and returns the data updated in the database.
     * @param {RoomStatsUpdateManyAndReturnArgs} args - Arguments to update many RoomStats.
     * @example
     * // Update many RoomStats
     * const roomStats = await prisma.roomStats.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RoomStats and only return the `id`
     * const roomStatsWithIdOnly = await prisma.roomStats.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoomStatsUpdateManyAndReturnArgs>(args: SelectSubset<T, RoomStatsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RoomStatsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RoomStats.
     * @param {RoomStatsUpsertArgs} args - Arguments to update or create a RoomStats.
     * @example
     * // Update or create a RoomStats
     * const roomStats = await prisma.roomStats.upsert({
     *   create: {
     *     // ... data to create a RoomStats
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RoomStats we want to update
     *   }
     * })
     */
    upsert<T extends RoomStatsUpsertArgs>(args: SelectSubset<T, RoomStatsUpsertArgs<ExtArgs>>): Prisma__RoomStatsClient<$Result.GetResult<Prisma.$RoomStatsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RoomStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomStatsCountArgs} args - Arguments to filter RoomStats to count.
     * @example
     * // Count the number of RoomStats
     * const count = await prisma.roomStats.count({
     *   where: {
     *     // ... the filter for the RoomStats we want to count
     *   }
     * })
    **/
    count<T extends RoomStatsCountArgs>(
      args?: Subset<T, RoomStatsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoomStatsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RoomStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomStatsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoomStatsAggregateArgs>(args: Subset<T, RoomStatsAggregateArgs>): Prisma.PrismaPromise<GetRoomStatsAggregateType<T>>

    /**
     * Group by RoomStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomStatsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoomStatsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoomStatsGroupByArgs['orderBy'] }
        : { orderBy?: RoomStatsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoomStatsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoomStatsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RoomStats model
   */
  readonly fields: RoomStatsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RoomStats.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoomStatsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    room<T extends RoomDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoomDefaultArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RoomStats model
   */
  interface RoomStatsFieldRefs {
    readonly id: FieldRef<"RoomStats", 'String'>
    readonly roomId: FieldRef<"RoomStats", 'String'>
    readonly totalGames: FieldRef<"RoomStats", 'Int'>
    readonly completedGames: FieldRef<"RoomStats", 'Int'>
    readonly updatedAt: FieldRef<"RoomStats", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RoomStats findUnique
   */
  export type RoomStatsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomStats
     */
    select?: RoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoomStats
     */
    omit?: RoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomStatsInclude<ExtArgs> | null
    /**
     * Filter, which RoomStats to fetch.
     */
    where: RoomStatsWhereUniqueInput
  }

  /**
   * RoomStats findUniqueOrThrow
   */
  export type RoomStatsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomStats
     */
    select?: RoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoomStats
     */
    omit?: RoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomStatsInclude<ExtArgs> | null
    /**
     * Filter, which RoomStats to fetch.
     */
    where: RoomStatsWhereUniqueInput
  }

  /**
   * RoomStats findFirst
   */
  export type RoomStatsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomStats
     */
    select?: RoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoomStats
     */
    omit?: RoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomStatsInclude<ExtArgs> | null
    /**
     * Filter, which RoomStats to fetch.
     */
    where?: RoomStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoomStats to fetch.
     */
    orderBy?: RoomStatsOrderByWithRelationInput | RoomStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoomStats.
     */
    cursor?: RoomStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoomStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoomStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoomStats.
     */
    distinct?: RoomStatsScalarFieldEnum | RoomStatsScalarFieldEnum[]
  }

  /**
   * RoomStats findFirstOrThrow
   */
  export type RoomStatsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomStats
     */
    select?: RoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoomStats
     */
    omit?: RoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomStatsInclude<ExtArgs> | null
    /**
     * Filter, which RoomStats to fetch.
     */
    where?: RoomStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoomStats to fetch.
     */
    orderBy?: RoomStatsOrderByWithRelationInput | RoomStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RoomStats.
     */
    cursor?: RoomStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoomStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoomStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RoomStats.
     */
    distinct?: RoomStatsScalarFieldEnum | RoomStatsScalarFieldEnum[]
  }

  /**
   * RoomStats findMany
   */
  export type RoomStatsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomStats
     */
    select?: RoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoomStats
     */
    omit?: RoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomStatsInclude<ExtArgs> | null
    /**
     * Filter, which RoomStats to fetch.
     */
    where?: RoomStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RoomStats to fetch.
     */
    orderBy?: RoomStatsOrderByWithRelationInput | RoomStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RoomStats.
     */
    cursor?: RoomStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RoomStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RoomStats.
     */
    skip?: number
    distinct?: RoomStatsScalarFieldEnum | RoomStatsScalarFieldEnum[]
  }

  /**
   * RoomStats create
   */
  export type RoomStatsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomStats
     */
    select?: RoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoomStats
     */
    omit?: RoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomStatsInclude<ExtArgs> | null
    /**
     * The data needed to create a RoomStats.
     */
    data: XOR<RoomStatsCreateInput, RoomStatsUncheckedCreateInput>
  }

  /**
   * RoomStats createMany
   */
  export type RoomStatsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RoomStats.
     */
    data: RoomStatsCreateManyInput | RoomStatsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RoomStats createManyAndReturn
   */
  export type RoomStatsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomStats
     */
    select?: RoomStatsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoomStats
     */
    omit?: RoomStatsOmit<ExtArgs> | null
    /**
     * The data used to create many RoomStats.
     */
    data: RoomStatsCreateManyInput | RoomStatsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomStatsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoomStats update
   */
  export type RoomStatsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomStats
     */
    select?: RoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoomStats
     */
    omit?: RoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomStatsInclude<ExtArgs> | null
    /**
     * The data needed to update a RoomStats.
     */
    data: XOR<RoomStatsUpdateInput, RoomStatsUncheckedUpdateInput>
    /**
     * Choose, which RoomStats to update.
     */
    where: RoomStatsWhereUniqueInput
  }

  /**
   * RoomStats updateMany
   */
  export type RoomStatsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RoomStats.
     */
    data: XOR<RoomStatsUpdateManyMutationInput, RoomStatsUncheckedUpdateManyInput>
    /**
     * Filter which RoomStats to update
     */
    where?: RoomStatsWhereInput
    /**
     * Limit how many RoomStats to update.
     */
    limit?: number
  }

  /**
   * RoomStats updateManyAndReturn
   */
  export type RoomStatsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomStats
     */
    select?: RoomStatsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RoomStats
     */
    omit?: RoomStatsOmit<ExtArgs> | null
    /**
     * The data used to update RoomStats.
     */
    data: XOR<RoomStatsUpdateManyMutationInput, RoomStatsUncheckedUpdateManyInput>
    /**
     * Filter which RoomStats to update
     */
    where?: RoomStatsWhereInput
    /**
     * Limit how many RoomStats to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomStatsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RoomStats upsert
   */
  export type RoomStatsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomStats
     */
    select?: RoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoomStats
     */
    omit?: RoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomStatsInclude<ExtArgs> | null
    /**
     * The filter to search for the RoomStats to update in case it exists.
     */
    where: RoomStatsWhereUniqueInput
    /**
     * In case the RoomStats found by the `where` argument doesn't exist, create a new RoomStats with this data.
     */
    create: XOR<RoomStatsCreateInput, RoomStatsUncheckedCreateInput>
    /**
     * In case the RoomStats was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoomStatsUpdateInput, RoomStatsUncheckedUpdateInput>
  }

  /**
   * RoomStats delete
   */
  export type RoomStatsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomStats
     */
    select?: RoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoomStats
     */
    omit?: RoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomStatsInclude<ExtArgs> | null
    /**
     * Filter which RoomStats to delete.
     */
    where: RoomStatsWhereUniqueInput
  }

  /**
   * RoomStats deleteMany
   */
  export type RoomStatsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RoomStats to delete
     */
    where?: RoomStatsWhereInput
    /**
     * Limit how many RoomStats to delete.
     */
    limit?: number
  }

  /**
   * RoomStats without action
   */
  export type RoomStatsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoomStats
     */
    select?: RoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RoomStats
     */
    omit?: RoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoomStatsInclude<ExtArgs> | null
  }


  /**
   * Model PlayerRoomStats
   */

  export type AggregatePlayerRoomStats = {
    _count: PlayerRoomStatsCountAggregateOutputType | null
    _avg: PlayerRoomStatsAvgAggregateOutputType | null
    _sum: PlayerRoomStatsSumAggregateOutputType | null
    _min: PlayerRoomStatsMinAggregateOutputType | null
    _max: PlayerRoomStatsMaxAggregateOutputType | null
  }

  export type PlayerRoomStatsAvgAggregateOutputType = {
    gamesPlayed: number | null
    gamesWon: number | null
    totalPenalty: number | null
    bestScore: number | null
  }

  export type PlayerRoomStatsSumAggregateOutputType = {
    gamesPlayed: number | null
    gamesWon: number | null
    totalPenalty: number | null
    bestScore: number | null
  }

  export type PlayerRoomStatsMinAggregateOutputType = {
    id: string | null
    userId: string | null
    roomId: string | null
    gamesPlayed: number | null
    gamesWon: number | null
    totalPenalty: number | null
    bestScore: number | null
    lastPlayedAt: Date | null
    updatedAt: Date | null
  }

  export type PlayerRoomStatsMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    roomId: string | null
    gamesPlayed: number | null
    gamesWon: number | null
    totalPenalty: number | null
    bestScore: number | null
    lastPlayedAt: Date | null
    updatedAt: Date | null
  }

  export type PlayerRoomStatsCountAggregateOutputType = {
    id: number
    userId: number
    roomId: number
    gamesPlayed: number
    gamesWon: number
    totalPenalty: number
    bestScore: number
    lastPlayedAt: number
    updatedAt: number
    _all: number
  }


  export type PlayerRoomStatsAvgAggregateInputType = {
    gamesPlayed?: true
    gamesWon?: true
    totalPenalty?: true
    bestScore?: true
  }

  export type PlayerRoomStatsSumAggregateInputType = {
    gamesPlayed?: true
    gamesWon?: true
    totalPenalty?: true
    bestScore?: true
  }

  export type PlayerRoomStatsMinAggregateInputType = {
    id?: true
    userId?: true
    roomId?: true
    gamesPlayed?: true
    gamesWon?: true
    totalPenalty?: true
    bestScore?: true
    lastPlayedAt?: true
    updatedAt?: true
  }

  export type PlayerRoomStatsMaxAggregateInputType = {
    id?: true
    userId?: true
    roomId?: true
    gamesPlayed?: true
    gamesWon?: true
    totalPenalty?: true
    bestScore?: true
    lastPlayedAt?: true
    updatedAt?: true
  }

  export type PlayerRoomStatsCountAggregateInputType = {
    id?: true
    userId?: true
    roomId?: true
    gamesPlayed?: true
    gamesWon?: true
    totalPenalty?: true
    bestScore?: true
    lastPlayedAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PlayerRoomStatsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlayerRoomStats to aggregate.
     */
    where?: PlayerRoomStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlayerRoomStats to fetch.
     */
    orderBy?: PlayerRoomStatsOrderByWithRelationInput | PlayerRoomStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlayerRoomStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlayerRoomStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlayerRoomStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PlayerRoomStats
    **/
    _count?: true | PlayerRoomStatsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlayerRoomStatsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlayerRoomStatsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlayerRoomStatsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlayerRoomStatsMaxAggregateInputType
  }

  export type GetPlayerRoomStatsAggregateType<T extends PlayerRoomStatsAggregateArgs> = {
        [P in keyof T & keyof AggregatePlayerRoomStats]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlayerRoomStats[P]>
      : GetScalarType<T[P], AggregatePlayerRoomStats[P]>
  }




  export type PlayerRoomStatsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerRoomStatsWhereInput
    orderBy?: PlayerRoomStatsOrderByWithAggregationInput | PlayerRoomStatsOrderByWithAggregationInput[]
    by: PlayerRoomStatsScalarFieldEnum[] | PlayerRoomStatsScalarFieldEnum
    having?: PlayerRoomStatsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlayerRoomStatsCountAggregateInputType | true
    _avg?: PlayerRoomStatsAvgAggregateInputType
    _sum?: PlayerRoomStatsSumAggregateInputType
    _min?: PlayerRoomStatsMinAggregateInputType
    _max?: PlayerRoomStatsMaxAggregateInputType
  }

  export type PlayerRoomStatsGroupByOutputType = {
    id: string
    userId: string
    roomId: string
    gamesPlayed: number
    gamesWon: number
    totalPenalty: number
    bestScore: number | null
    lastPlayedAt: Date
    updatedAt: Date
    _count: PlayerRoomStatsCountAggregateOutputType | null
    _avg: PlayerRoomStatsAvgAggregateOutputType | null
    _sum: PlayerRoomStatsSumAggregateOutputType | null
    _min: PlayerRoomStatsMinAggregateOutputType | null
    _max: PlayerRoomStatsMaxAggregateOutputType | null
  }

  type GetPlayerRoomStatsGroupByPayload<T extends PlayerRoomStatsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlayerRoomStatsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlayerRoomStatsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlayerRoomStatsGroupByOutputType[P]>
            : GetScalarType<T[P], PlayerRoomStatsGroupByOutputType[P]>
        }
      >
    >


  export type PlayerRoomStatsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    roomId?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    totalPenalty?: boolean
    bestScore?: boolean
    lastPlayedAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    room?: boolean | RoomDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["playerRoomStats"]>

  export type PlayerRoomStatsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    roomId?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    totalPenalty?: boolean
    bestScore?: boolean
    lastPlayedAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    room?: boolean | RoomDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["playerRoomStats"]>

  export type PlayerRoomStatsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    roomId?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    totalPenalty?: boolean
    bestScore?: boolean
    lastPlayedAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    room?: boolean | RoomDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["playerRoomStats"]>

  export type PlayerRoomStatsSelectScalar = {
    id?: boolean
    userId?: boolean
    roomId?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    totalPenalty?: boolean
    bestScore?: boolean
    lastPlayedAt?: boolean
    updatedAt?: boolean
  }

  export type PlayerRoomStatsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "roomId" | "gamesPlayed" | "gamesWon" | "totalPenalty" | "bestScore" | "lastPlayedAt" | "updatedAt", ExtArgs["result"]["playerRoomStats"]>
  export type PlayerRoomStatsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    room?: boolean | RoomDefaultArgs<ExtArgs>
  }
  export type PlayerRoomStatsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    room?: boolean | RoomDefaultArgs<ExtArgs>
  }
  export type PlayerRoomStatsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    room?: boolean | RoomDefaultArgs<ExtArgs>
  }

  export type $PlayerRoomStatsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PlayerRoomStats"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      room: Prisma.$RoomPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      roomId: string
      gamesPlayed: number
      gamesWon: number
      totalPenalty: number
      bestScore: number | null
      lastPlayedAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["playerRoomStats"]>
    composites: {}
  }

  type PlayerRoomStatsGetPayload<S extends boolean | null | undefined | PlayerRoomStatsDefaultArgs> = $Result.GetResult<Prisma.$PlayerRoomStatsPayload, S>

  type PlayerRoomStatsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlayerRoomStatsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlayerRoomStatsCountAggregateInputType | true
    }

  export interface PlayerRoomStatsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PlayerRoomStats'], meta: { name: 'PlayerRoomStats' } }
    /**
     * Find zero or one PlayerRoomStats that matches the filter.
     * @param {PlayerRoomStatsFindUniqueArgs} args - Arguments to find a PlayerRoomStats
     * @example
     * // Get one PlayerRoomStats
     * const playerRoomStats = await prisma.playerRoomStats.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlayerRoomStatsFindUniqueArgs>(args: SelectSubset<T, PlayerRoomStatsFindUniqueArgs<ExtArgs>>): Prisma__PlayerRoomStatsClient<$Result.GetResult<Prisma.$PlayerRoomStatsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PlayerRoomStats that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlayerRoomStatsFindUniqueOrThrowArgs} args - Arguments to find a PlayerRoomStats
     * @example
     * // Get one PlayerRoomStats
     * const playerRoomStats = await prisma.playerRoomStats.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlayerRoomStatsFindUniqueOrThrowArgs>(args: SelectSubset<T, PlayerRoomStatsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlayerRoomStatsClient<$Result.GetResult<Prisma.$PlayerRoomStatsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlayerRoomStats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerRoomStatsFindFirstArgs} args - Arguments to find a PlayerRoomStats
     * @example
     * // Get one PlayerRoomStats
     * const playerRoomStats = await prisma.playerRoomStats.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlayerRoomStatsFindFirstArgs>(args?: SelectSubset<T, PlayerRoomStatsFindFirstArgs<ExtArgs>>): Prisma__PlayerRoomStatsClient<$Result.GetResult<Prisma.$PlayerRoomStatsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlayerRoomStats that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerRoomStatsFindFirstOrThrowArgs} args - Arguments to find a PlayerRoomStats
     * @example
     * // Get one PlayerRoomStats
     * const playerRoomStats = await prisma.playerRoomStats.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlayerRoomStatsFindFirstOrThrowArgs>(args?: SelectSubset<T, PlayerRoomStatsFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlayerRoomStatsClient<$Result.GetResult<Prisma.$PlayerRoomStatsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PlayerRoomStats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerRoomStatsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PlayerRoomStats
     * const playerRoomStats = await prisma.playerRoomStats.findMany()
     * 
     * // Get first 10 PlayerRoomStats
     * const playerRoomStats = await prisma.playerRoomStats.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const playerRoomStatsWithIdOnly = await prisma.playerRoomStats.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlayerRoomStatsFindManyArgs>(args?: SelectSubset<T, PlayerRoomStatsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerRoomStatsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PlayerRoomStats.
     * @param {PlayerRoomStatsCreateArgs} args - Arguments to create a PlayerRoomStats.
     * @example
     * // Create one PlayerRoomStats
     * const PlayerRoomStats = await prisma.playerRoomStats.create({
     *   data: {
     *     // ... data to create a PlayerRoomStats
     *   }
     * })
     * 
     */
    create<T extends PlayerRoomStatsCreateArgs>(args: SelectSubset<T, PlayerRoomStatsCreateArgs<ExtArgs>>): Prisma__PlayerRoomStatsClient<$Result.GetResult<Prisma.$PlayerRoomStatsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PlayerRoomStats.
     * @param {PlayerRoomStatsCreateManyArgs} args - Arguments to create many PlayerRoomStats.
     * @example
     * // Create many PlayerRoomStats
     * const playerRoomStats = await prisma.playerRoomStats.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlayerRoomStatsCreateManyArgs>(args?: SelectSubset<T, PlayerRoomStatsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PlayerRoomStats and returns the data saved in the database.
     * @param {PlayerRoomStatsCreateManyAndReturnArgs} args - Arguments to create many PlayerRoomStats.
     * @example
     * // Create many PlayerRoomStats
     * const playerRoomStats = await prisma.playerRoomStats.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PlayerRoomStats and only return the `id`
     * const playerRoomStatsWithIdOnly = await prisma.playerRoomStats.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlayerRoomStatsCreateManyAndReturnArgs>(args?: SelectSubset<T, PlayerRoomStatsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerRoomStatsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PlayerRoomStats.
     * @param {PlayerRoomStatsDeleteArgs} args - Arguments to delete one PlayerRoomStats.
     * @example
     * // Delete one PlayerRoomStats
     * const PlayerRoomStats = await prisma.playerRoomStats.delete({
     *   where: {
     *     // ... filter to delete one PlayerRoomStats
     *   }
     * })
     * 
     */
    delete<T extends PlayerRoomStatsDeleteArgs>(args: SelectSubset<T, PlayerRoomStatsDeleteArgs<ExtArgs>>): Prisma__PlayerRoomStatsClient<$Result.GetResult<Prisma.$PlayerRoomStatsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PlayerRoomStats.
     * @param {PlayerRoomStatsUpdateArgs} args - Arguments to update one PlayerRoomStats.
     * @example
     * // Update one PlayerRoomStats
     * const playerRoomStats = await prisma.playerRoomStats.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlayerRoomStatsUpdateArgs>(args: SelectSubset<T, PlayerRoomStatsUpdateArgs<ExtArgs>>): Prisma__PlayerRoomStatsClient<$Result.GetResult<Prisma.$PlayerRoomStatsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PlayerRoomStats.
     * @param {PlayerRoomStatsDeleteManyArgs} args - Arguments to filter PlayerRoomStats to delete.
     * @example
     * // Delete a few PlayerRoomStats
     * const { count } = await prisma.playerRoomStats.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlayerRoomStatsDeleteManyArgs>(args?: SelectSubset<T, PlayerRoomStatsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlayerRoomStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerRoomStatsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PlayerRoomStats
     * const playerRoomStats = await prisma.playerRoomStats.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlayerRoomStatsUpdateManyArgs>(args: SelectSubset<T, PlayerRoomStatsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlayerRoomStats and returns the data updated in the database.
     * @param {PlayerRoomStatsUpdateManyAndReturnArgs} args - Arguments to update many PlayerRoomStats.
     * @example
     * // Update many PlayerRoomStats
     * const playerRoomStats = await prisma.playerRoomStats.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PlayerRoomStats and only return the `id`
     * const playerRoomStatsWithIdOnly = await prisma.playerRoomStats.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PlayerRoomStatsUpdateManyAndReturnArgs>(args: SelectSubset<T, PlayerRoomStatsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerRoomStatsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PlayerRoomStats.
     * @param {PlayerRoomStatsUpsertArgs} args - Arguments to update or create a PlayerRoomStats.
     * @example
     * // Update or create a PlayerRoomStats
     * const playerRoomStats = await prisma.playerRoomStats.upsert({
     *   create: {
     *     // ... data to create a PlayerRoomStats
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PlayerRoomStats we want to update
     *   }
     * })
     */
    upsert<T extends PlayerRoomStatsUpsertArgs>(args: SelectSubset<T, PlayerRoomStatsUpsertArgs<ExtArgs>>): Prisma__PlayerRoomStatsClient<$Result.GetResult<Prisma.$PlayerRoomStatsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PlayerRoomStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerRoomStatsCountArgs} args - Arguments to filter PlayerRoomStats to count.
     * @example
     * // Count the number of PlayerRoomStats
     * const count = await prisma.playerRoomStats.count({
     *   where: {
     *     // ... the filter for the PlayerRoomStats we want to count
     *   }
     * })
    **/
    count<T extends PlayerRoomStatsCountArgs>(
      args?: Subset<T, PlayerRoomStatsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlayerRoomStatsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PlayerRoomStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerRoomStatsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlayerRoomStatsAggregateArgs>(args: Subset<T, PlayerRoomStatsAggregateArgs>): Prisma.PrismaPromise<GetPlayerRoomStatsAggregateType<T>>

    /**
     * Group by PlayerRoomStats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerRoomStatsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlayerRoomStatsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlayerRoomStatsGroupByArgs['orderBy'] }
        : { orderBy?: PlayerRoomStatsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlayerRoomStatsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayerRoomStatsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PlayerRoomStats model
   */
  readonly fields: PlayerRoomStatsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PlayerRoomStats.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlayerRoomStatsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    room<T extends RoomDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoomDefaultArgs<ExtArgs>>): Prisma__RoomClient<$Result.GetResult<Prisma.$RoomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PlayerRoomStats model
   */
  interface PlayerRoomStatsFieldRefs {
    readonly id: FieldRef<"PlayerRoomStats", 'String'>
    readonly userId: FieldRef<"PlayerRoomStats", 'String'>
    readonly roomId: FieldRef<"PlayerRoomStats", 'String'>
    readonly gamesPlayed: FieldRef<"PlayerRoomStats", 'Int'>
    readonly gamesWon: FieldRef<"PlayerRoomStats", 'Int'>
    readonly totalPenalty: FieldRef<"PlayerRoomStats", 'Int'>
    readonly bestScore: FieldRef<"PlayerRoomStats", 'Int'>
    readonly lastPlayedAt: FieldRef<"PlayerRoomStats", 'DateTime'>
    readonly updatedAt: FieldRef<"PlayerRoomStats", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PlayerRoomStats findUnique
   */
  export type PlayerRoomStatsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRoomStats
     */
    select?: PlayerRoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRoomStats
     */
    omit?: PlayerRoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRoomStatsInclude<ExtArgs> | null
    /**
     * Filter, which PlayerRoomStats to fetch.
     */
    where: PlayerRoomStatsWhereUniqueInput
  }

  /**
   * PlayerRoomStats findUniqueOrThrow
   */
  export type PlayerRoomStatsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRoomStats
     */
    select?: PlayerRoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRoomStats
     */
    omit?: PlayerRoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRoomStatsInclude<ExtArgs> | null
    /**
     * Filter, which PlayerRoomStats to fetch.
     */
    where: PlayerRoomStatsWhereUniqueInput
  }

  /**
   * PlayerRoomStats findFirst
   */
  export type PlayerRoomStatsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRoomStats
     */
    select?: PlayerRoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRoomStats
     */
    omit?: PlayerRoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRoomStatsInclude<ExtArgs> | null
    /**
     * Filter, which PlayerRoomStats to fetch.
     */
    where?: PlayerRoomStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlayerRoomStats to fetch.
     */
    orderBy?: PlayerRoomStatsOrderByWithRelationInput | PlayerRoomStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlayerRoomStats.
     */
    cursor?: PlayerRoomStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlayerRoomStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlayerRoomStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlayerRoomStats.
     */
    distinct?: PlayerRoomStatsScalarFieldEnum | PlayerRoomStatsScalarFieldEnum[]
  }

  /**
   * PlayerRoomStats findFirstOrThrow
   */
  export type PlayerRoomStatsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRoomStats
     */
    select?: PlayerRoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRoomStats
     */
    omit?: PlayerRoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRoomStatsInclude<ExtArgs> | null
    /**
     * Filter, which PlayerRoomStats to fetch.
     */
    where?: PlayerRoomStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlayerRoomStats to fetch.
     */
    orderBy?: PlayerRoomStatsOrderByWithRelationInput | PlayerRoomStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlayerRoomStats.
     */
    cursor?: PlayerRoomStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlayerRoomStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlayerRoomStats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlayerRoomStats.
     */
    distinct?: PlayerRoomStatsScalarFieldEnum | PlayerRoomStatsScalarFieldEnum[]
  }

  /**
   * PlayerRoomStats findMany
   */
  export type PlayerRoomStatsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRoomStats
     */
    select?: PlayerRoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRoomStats
     */
    omit?: PlayerRoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRoomStatsInclude<ExtArgs> | null
    /**
     * Filter, which PlayerRoomStats to fetch.
     */
    where?: PlayerRoomStatsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlayerRoomStats to fetch.
     */
    orderBy?: PlayerRoomStatsOrderByWithRelationInput | PlayerRoomStatsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PlayerRoomStats.
     */
    cursor?: PlayerRoomStatsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlayerRoomStats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlayerRoomStats.
     */
    skip?: number
    distinct?: PlayerRoomStatsScalarFieldEnum | PlayerRoomStatsScalarFieldEnum[]
  }

  /**
   * PlayerRoomStats create
   */
  export type PlayerRoomStatsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRoomStats
     */
    select?: PlayerRoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRoomStats
     */
    omit?: PlayerRoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRoomStatsInclude<ExtArgs> | null
    /**
     * The data needed to create a PlayerRoomStats.
     */
    data: XOR<PlayerRoomStatsCreateInput, PlayerRoomStatsUncheckedCreateInput>
  }

  /**
   * PlayerRoomStats createMany
   */
  export type PlayerRoomStatsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PlayerRoomStats.
     */
    data: PlayerRoomStatsCreateManyInput | PlayerRoomStatsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PlayerRoomStats createManyAndReturn
   */
  export type PlayerRoomStatsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRoomStats
     */
    select?: PlayerRoomStatsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRoomStats
     */
    omit?: PlayerRoomStatsOmit<ExtArgs> | null
    /**
     * The data used to create many PlayerRoomStats.
     */
    data: PlayerRoomStatsCreateManyInput | PlayerRoomStatsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRoomStatsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PlayerRoomStats update
   */
  export type PlayerRoomStatsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRoomStats
     */
    select?: PlayerRoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRoomStats
     */
    omit?: PlayerRoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRoomStatsInclude<ExtArgs> | null
    /**
     * The data needed to update a PlayerRoomStats.
     */
    data: XOR<PlayerRoomStatsUpdateInput, PlayerRoomStatsUncheckedUpdateInput>
    /**
     * Choose, which PlayerRoomStats to update.
     */
    where: PlayerRoomStatsWhereUniqueInput
  }

  /**
   * PlayerRoomStats updateMany
   */
  export type PlayerRoomStatsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PlayerRoomStats.
     */
    data: XOR<PlayerRoomStatsUpdateManyMutationInput, PlayerRoomStatsUncheckedUpdateManyInput>
    /**
     * Filter which PlayerRoomStats to update
     */
    where?: PlayerRoomStatsWhereInput
    /**
     * Limit how many PlayerRoomStats to update.
     */
    limit?: number
  }

  /**
   * PlayerRoomStats updateManyAndReturn
   */
  export type PlayerRoomStatsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRoomStats
     */
    select?: PlayerRoomStatsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRoomStats
     */
    omit?: PlayerRoomStatsOmit<ExtArgs> | null
    /**
     * The data used to update PlayerRoomStats.
     */
    data: XOR<PlayerRoomStatsUpdateManyMutationInput, PlayerRoomStatsUncheckedUpdateManyInput>
    /**
     * Filter which PlayerRoomStats to update
     */
    where?: PlayerRoomStatsWhereInput
    /**
     * Limit how many PlayerRoomStats to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRoomStatsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PlayerRoomStats upsert
   */
  export type PlayerRoomStatsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRoomStats
     */
    select?: PlayerRoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRoomStats
     */
    omit?: PlayerRoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRoomStatsInclude<ExtArgs> | null
    /**
     * The filter to search for the PlayerRoomStats to update in case it exists.
     */
    where: PlayerRoomStatsWhereUniqueInput
    /**
     * In case the PlayerRoomStats found by the `where` argument doesn't exist, create a new PlayerRoomStats with this data.
     */
    create: XOR<PlayerRoomStatsCreateInput, PlayerRoomStatsUncheckedCreateInput>
    /**
     * In case the PlayerRoomStats was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlayerRoomStatsUpdateInput, PlayerRoomStatsUncheckedUpdateInput>
  }

  /**
   * PlayerRoomStats delete
   */
  export type PlayerRoomStatsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRoomStats
     */
    select?: PlayerRoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRoomStats
     */
    omit?: PlayerRoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRoomStatsInclude<ExtArgs> | null
    /**
     * Filter which PlayerRoomStats to delete.
     */
    where: PlayerRoomStatsWhereUniqueInput
  }

  /**
   * PlayerRoomStats deleteMany
   */
  export type PlayerRoomStatsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlayerRoomStats to delete
     */
    where?: PlayerRoomStatsWhereInput
    /**
     * Limit how many PlayerRoomStats to delete.
     */
    limit?: number
  }

  /**
   * PlayerRoomStats without action
   */
  export type PlayerRoomStatsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRoomStats
     */
    select?: PlayerRoomStatsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRoomStats
     */
    omit?: PlayerRoomStatsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRoomStatsInclude<ExtArgs> | null
  }


  /**
   * Model Token
   */

  export type AggregateToken = {
    _count: TokenCountAggregateOutputType | null
    _min: TokenMinAggregateOutputType | null
    _max: TokenMaxAggregateOutputType | null
  }

  export type TokenMinAggregateOutputType = {
    id: string | null
    userId: string | null
    refreshToken: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TokenMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    refreshToken: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TokenCountAggregateOutputType = {
    id: number
    userId: number
    refreshToken: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TokenMinAggregateInputType = {
    id?: true
    userId?: true
    refreshToken?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TokenMaxAggregateInputType = {
    id?: true
    userId?: true
    refreshToken?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TokenCountAggregateInputType = {
    id?: true
    userId?: true
    refreshToken?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Token to aggregate.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tokens
    **/
    _count?: true | TokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TokenMaxAggregateInputType
  }

  export type GetTokenAggregateType<T extends TokenAggregateArgs> = {
        [P in keyof T & keyof AggregateToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateToken[P]>
      : GetScalarType<T[P], AggregateToken[P]>
  }




  export type TokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TokenWhereInput
    orderBy?: TokenOrderByWithAggregationInput | TokenOrderByWithAggregationInput[]
    by: TokenScalarFieldEnum[] | TokenScalarFieldEnum
    having?: TokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TokenCountAggregateInputType | true
    _min?: TokenMinAggregateInputType
    _max?: TokenMaxAggregateInputType
  }

  export type TokenGroupByOutputType = {
    id: string
    userId: string
    refreshToken: string
    createdAt: Date
    updatedAt: Date
    _count: TokenCountAggregateOutputType | null
    _min: TokenMinAggregateOutputType | null
    _max: TokenMaxAggregateOutputType | null
  }

  type GetTokenGroupByPayload<T extends TokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TokenGroupByOutputType[P]>
            : GetScalarType<T[P], TokenGroupByOutputType[P]>
        }
      >
    >


  export type TokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refreshToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["token"]>

  export type TokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refreshToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["token"]>

  export type TokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    refreshToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["token"]>

  export type TokenSelectScalar = {
    id?: boolean
    userId?: boolean
    refreshToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "refreshToken" | "createdAt" | "updatedAt", ExtArgs["result"]["token"]>
  export type TokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Token"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      refreshToken: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["token"]>
    composites: {}
  }

  type TokenGetPayload<S extends boolean | null | undefined | TokenDefaultArgs> = $Result.GetResult<Prisma.$TokenPayload, S>

  type TokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TokenCountAggregateInputType | true
    }

  export interface TokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Token'], meta: { name: 'Token' } }
    /**
     * Find zero or one Token that matches the filter.
     * @param {TokenFindUniqueArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TokenFindUniqueArgs>(args: SelectSubset<T, TokenFindUniqueArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Token that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TokenFindUniqueOrThrowArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TokenFindUniqueOrThrowArgs>(args: SelectSubset<T, TokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Token that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenFindFirstArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TokenFindFirstArgs>(args?: SelectSubset<T, TokenFindFirstArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Token that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenFindFirstOrThrowArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TokenFindFirstOrThrowArgs>(args?: SelectSubset<T, TokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tokens
     * const tokens = await prisma.token.findMany()
     * 
     * // Get first 10 Tokens
     * const tokens = await prisma.token.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tokenWithIdOnly = await prisma.token.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TokenFindManyArgs>(args?: SelectSubset<T, TokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Token.
     * @param {TokenCreateArgs} args - Arguments to create a Token.
     * @example
     * // Create one Token
     * const Token = await prisma.token.create({
     *   data: {
     *     // ... data to create a Token
     *   }
     * })
     * 
     */
    create<T extends TokenCreateArgs>(args: SelectSubset<T, TokenCreateArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tokens.
     * @param {TokenCreateManyArgs} args - Arguments to create many Tokens.
     * @example
     * // Create many Tokens
     * const token = await prisma.token.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TokenCreateManyArgs>(args?: SelectSubset<T, TokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tokens and returns the data saved in the database.
     * @param {TokenCreateManyAndReturnArgs} args - Arguments to create many Tokens.
     * @example
     * // Create many Tokens
     * const token = await prisma.token.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tokens and only return the `id`
     * const tokenWithIdOnly = await prisma.token.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TokenCreateManyAndReturnArgs>(args?: SelectSubset<T, TokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Token.
     * @param {TokenDeleteArgs} args - Arguments to delete one Token.
     * @example
     * // Delete one Token
     * const Token = await prisma.token.delete({
     *   where: {
     *     // ... filter to delete one Token
     *   }
     * })
     * 
     */
    delete<T extends TokenDeleteArgs>(args: SelectSubset<T, TokenDeleteArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Token.
     * @param {TokenUpdateArgs} args - Arguments to update one Token.
     * @example
     * // Update one Token
     * const token = await prisma.token.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TokenUpdateArgs>(args: SelectSubset<T, TokenUpdateArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tokens.
     * @param {TokenDeleteManyArgs} args - Arguments to filter Tokens to delete.
     * @example
     * // Delete a few Tokens
     * const { count } = await prisma.token.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TokenDeleteManyArgs>(args?: SelectSubset<T, TokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tokens
     * const token = await prisma.token.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TokenUpdateManyArgs>(args: SelectSubset<T, TokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tokens and returns the data updated in the database.
     * @param {TokenUpdateManyAndReturnArgs} args - Arguments to update many Tokens.
     * @example
     * // Update many Tokens
     * const token = await prisma.token.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tokens and only return the `id`
     * const tokenWithIdOnly = await prisma.token.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TokenUpdateManyAndReturnArgs>(args: SelectSubset<T, TokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Token.
     * @param {TokenUpsertArgs} args - Arguments to update or create a Token.
     * @example
     * // Update or create a Token
     * const token = await prisma.token.upsert({
     *   create: {
     *     // ... data to create a Token
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Token we want to update
     *   }
     * })
     */
    upsert<T extends TokenUpsertArgs>(args: SelectSubset<T, TokenUpsertArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenCountArgs} args - Arguments to filter Tokens to count.
     * @example
     * // Count the number of Tokens
     * const count = await prisma.token.count({
     *   where: {
     *     // ... the filter for the Tokens we want to count
     *   }
     * })
    **/
    count<T extends TokenCountArgs>(
      args?: Subset<T, TokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Token.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TokenAggregateArgs>(args: Subset<T, TokenAggregateArgs>): Prisma.PrismaPromise<GetTokenAggregateType<T>>

    /**
     * Group by Token.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TokenGroupByArgs['orderBy'] }
        : { orderBy?: TokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Token model
   */
  readonly fields: TokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Token.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Token model
   */
  interface TokenFieldRefs {
    readonly id: FieldRef<"Token", 'String'>
    readonly userId: FieldRef<"Token", 'String'>
    readonly refreshToken: FieldRef<"Token", 'String'>
    readonly createdAt: FieldRef<"Token", 'DateTime'>
    readonly updatedAt: FieldRef<"Token", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Token findUnique
   */
  export type TokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token findUniqueOrThrow
   */
  export type TokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token findFirst
   */
  export type TokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tokens.
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tokens.
     */
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * Token findFirstOrThrow
   */
  export type TokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tokens.
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tokens.
     */
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * Token findMany
   */
  export type TokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Tokens to fetch.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tokens.
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * Token create
   */
  export type TokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * The data needed to create a Token.
     */
    data: XOR<TokenCreateInput, TokenUncheckedCreateInput>
  }

  /**
   * Token createMany
   */
  export type TokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tokens.
     */
    data: TokenCreateManyInput | TokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Token createManyAndReturn
   */
  export type TokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * The data used to create many Tokens.
     */
    data: TokenCreateManyInput | TokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Token update
   */
  export type TokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * The data needed to update a Token.
     */
    data: XOR<TokenUpdateInput, TokenUncheckedUpdateInput>
    /**
     * Choose, which Token to update.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token updateMany
   */
  export type TokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tokens.
     */
    data: XOR<TokenUpdateManyMutationInput, TokenUncheckedUpdateManyInput>
    /**
     * Filter which Tokens to update
     */
    where?: TokenWhereInput
    /**
     * Limit how many Tokens to update.
     */
    limit?: number
  }

  /**
   * Token updateManyAndReturn
   */
  export type TokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * The data used to update Tokens.
     */
    data: XOR<TokenUpdateManyMutationInput, TokenUncheckedUpdateManyInput>
    /**
     * Filter which Tokens to update
     */
    where?: TokenWhereInput
    /**
     * Limit how many Tokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Token upsert
   */
  export type TokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * The filter to search for the Token to update in case it exists.
     */
    where: TokenWhereUniqueInput
    /**
     * In case the Token found by the `where` argument doesn't exist, create a new Token with this data.
     */
    create: XOR<TokenCreateInput, TokenUncheckedCreateInput>
    /**
     * In case the Token was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TokenUpdateInput, TokenUncheckedUpdateInput>
  }

  /**
   * Token delete
   */
  export type TokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter which Token to delete.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token deleteMany
   */
  export type TokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tokens to delete
     */
    where?: TokenWhereInput
    /**
     * Limit how many Tokens to delete.
     */
    limit?: number
  }

  /**
   * Token without action
   */
  export type TokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    password: 'password',
    version: 'version',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    surname: 'surname',
    email: 'email'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const UserStatsScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    gamesPlayed: 'gamesPlayed',
    gamesWon: 'gamesWon',
    totalPenalty: 'totalPenalty',
    bestScore: 'bestScore',
    updatedAt: 'updatedAt'
  };

  export type UserStatsScalarFieldEnum = (typeof UserStatsScalarFieldEnum)[keyof typeof UserStatsScalarFieldEnum]


  export const RoomScalarFieldEnum: {
    id: 'id',
    name: 'name',
    code: 'code',
    maxPlayers: 'maxPlayers',
    currentPlayers: 'currentPlayers',
    isPrivate: 'isPrivate',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    creatorId: 'creatorId',
    password: 'password'
  };

  export type RoomScalarFieldEnum = (typeof RoomScalarFieldEnum)[keyof typeof RoomScalarFieldEnum]


  export const GameScalarFieldEnum: {
    id: 'id',
    roomId: 'roomId',
    status: 'status',
    currentRound: 'currentRound',
    currentTurn: 'currentTurn',
    rows: 'rows',
    currentTurnCards: 'currentTurnCards',
    history: 'history',
    startedAt: 'startedAt',
    finishedAt: 'finishedAt',
    winnerId: 'winnerId'
  };

  export type GameScalarFieldEnum = (typeof GameScalarFieldEnum)[keyof typeof GameScalarFieldEnum]


  export const PlayerScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    roomId: 'roomId',
    gameId: 'gameId',
    isBot: 'isBot',
    botName: 'botName',
    position: 'position',
    hand: 'hand',
    penaltyCard: 'penaltyCard',
    totalPenalty: 'totalPenalty',
    roundPenaltyCard: 'roundPenaltyCard',
    roundPenalty: 'roundPenalty',
    selectedCard: 'selectedCard',
    isSelectedCardConfirmed: 'isSelectedCardConfirmed',
    isReady: 'isReady',
    isWinner: 'isWinner',
    finalPosition: 'finalPosition',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PlayerScalarFieldEnum = (typeof PlayerScalarFieldEnum)[keyof typeof PlayerScalarFieldEnum]


  export const RoomStatsScalarFieldEnum: {
    id: 'id',
    roomId: 'roomId',
    totalGames: 'totalGames',
    completedGames: 'completedGames',
    updatedAt: 'updatedAt'
  };

  export type RoomStatsScalarFieldEnum = (typeof RoomStatsScalarFieldEnum)[keyof typeof RoomStatsScalarFieldEnum]


  export const PlayerRoomStatsScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    roomId: 'roomId',
    gamesPlayed: 'gamesPlayed',
    gamesWon: 'gamesWon',
    totalPenalty: 'totalPenalty',
    bestScore: 'bestScore',
    lastPlayedAt: 'lastPlayedAt',
    updatedAt: 'updatedAt'
  };

  export type PlayerRoomStatsScalarFieldEnum = (typeof PlayerRoomStatsScalarFieldEnum)[keyof typeof PlayerRoomStatsScalarFieldEnum]


  export const TokenScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    refreshToken: 'refreshToken',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TokenScalarFieldEnum = (typeof TokenScalarFieldEnum)[keyof typeof TokenScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'RoomStatus'
   */
  export type EnumRoomStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RoomStatus'>
    


  /**
   * Reference to a field of type 'RoomStatus[]'
   */
  export type ListEnumRoomStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RoomStatus[]'>
    


  /**
   * Reference to a field of type 'GameStatus'
   */
  export type EnumGameStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GameStatus'>
    


  /**
   * Reference to a field of type 'GameStatus[]'
   */
  export type ListEnumGameStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GameStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    version?: IntFilter<"User"> | number
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    name?: StringNullableFilter<"User"> | string | null
    surname?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    userStats?: XOR<UserStatsNullableScalarRelationFilter, UserStatsWhereInput> | null
    createdRooms?: RoomListRelationFilter
    players?: PlayerListRelationFilter
    playerRoomStats?: PlayerRoomStatsListRelationFilter
    token?: XOR<TokenNullableScalarRelationFilter, TokenWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrderInput | SortOrder
    surname?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    userStats?: UserStatsOrderByWithRelationInput
    createdRooms?: RoomOrderByRelationAggregateInput
    players?: PlayerOrderByRelationAggregateInput
    playerRoomStats?: PlayerRoomStatsOrderByRelationAggregateInput
    token?: TokenOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    version?: IntFilter<"User"> | number
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    name?: StringNullableFilter<"User"> | string | null
    surname?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    userStats?: XOR<UserStatsNullableScalarRelationFilter, UserStatsWhereInput> | null
    createdRooms?: RoomListRelationFilter
    players?: PlayerListRelationFilter
    playerRoomStats?: PlayerRoomStatsListRelationFilter
    token?: XOR<TokenNullableScalarRelationFilter, TokenWhereInput> | null
  }, "id" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrderInput | SortOrder
    surname?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    version?: IntWithAggregatesFilter<"User"> | number
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    surname?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type UserStatsWhereInput = {
    AND?: UserStatsWhereInput | UserStatsWhereInput[]
    OR?: UserStatsWhereInput[]
    NOT?: UserStatsWhereInput | UserStatsWhereInput[]
    id?: StringFilter<"UserStats"> | string
    userId?: StringFilter<"UserStats"> | string
    gamesPlayed?: IntFilter<"UserStats"> | number
    gamesWon?: IntFilter<"UserStats"> | number
    totalPenalty?: IntFilter<"UserStats"> | number
    bestScore?: IntNullableFilter<"UserStats"> | number | null
    updatedAt?: DateTimeFilter<"UserStats"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserStatsOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    totalPenalty?: SortOrder
    bestScore?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserStatsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserStatsWhereInput | UserStatsWhereInput[]
    OR?: UserStatsWhereInput[]
    NOT?: UserStatsWhereInput | UserStatsWhereInput[]
    gamesPlayed?: IntFilter<"UserStats"> | number
    gamesWon?: IntFilter<"UserStats"> | number
    totalPenalty?: IntFilter<"UserStats"> | number
    bestScore?: IntNullableFilter<"UserStats"> | number | null
    updatedAt?: DateTimeFilter<"UserStats"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type UserStatsOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    totalPenalty?: SortOrder
    bestScore?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: UserStatsCountOrderByAggregateInput
    _avg?: UserStatsAvgOrderByAggregateInput
    _max?: UserStatsMaxOrderByAggregateInput
    _min?: UserStatsMinOrderByAggregateInput
    _sum?: UserStatsSumOrderByAggregateInput
  }

  export type UserStatsScalarWhereWithAggregatesInput = {
    AND?: UserStatsScalarWhereWithAggregatesInput | UserStatsScalarWhereWithAggregatesInput[]
    OR?: UserStatsScalarWhereWithAggregatesInput[]
    NOT?: UserStatsScalarWhereWithAggregatesInput | UserStatsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserStats"> | string
    userId?: StringWithAggregatesFilter<"UserStats"> | string
    gamesPlayed?: IntWithAggregatesFilter<"UserStats"> | number
    gamesWon?: IntWithAggregatesFilter<"UserStats"> | number
    totalPenalty?: IntWithAggregatesFilter<"UserStats"> | number
    bestScore?: IntNullableWithAggregatesFilter<"UserStats"> | number | null
    updatedAt?: DateTimeWithAggregatesFilter<"UserStats"> | Date | string
  }

  export type RoomWhereInput = {
    AND?: RoomWhereInput | RoomWhereInput[]
    OR?: RoomWhereInput[]
    NOT?: RoomWhereInput | RoomWhereInput[]
    id?: StringFilter<"Room"> | string
    name?: StringFilter<"Room"> | string
    code?: StringFilter<"Room"> | string
    maxPlayers?: IntFilter<"Room"> | number
    currentPlayers?: IntFilter<"Room"> | number
    isPrivate?: BoolFilter<"Room"> | boolean
    status?: EnumRoomStatusFilter<"Room"> | $Enums.RoomStatus
    createdAt?: DateTimeFilter<"Room"> | Date | string
    updatedAt?: DateTimeFilter<"Room"> | Date | string
    creatorId?: StringFilter<"Room"> | string
    password?: StringNullableFilter<"Room"> | string | null
    creator?: XOR<UserScalarRelationFilter, UserWhereInput>
    players?: PlayerListRelationFilter
    games?: GameListRelationFilter
    roomStats?: XOR<RoomStatsNullableScalarRelationFilter, RoomStatsWhereInput> | null
    playerRoomStats?: PlayerRoomStatsListRelationFilter
  }

  export type RoomOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    maxPlayers?: SortOrder
    currentPlayers?: SortOrder
    isPrivate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    creatorId?: SortOrder
    password?: SortOrderInput | SortOrder
    creator?: UserOrderByWithRelationInput
    players?: PlayerOrderByRelationAggregateInput
    games?: GameOrderByRelationAggregateInput
    roomStats?: RoomStatsOrderByWithRelationInput
    playerRoomStats?: PlayerRoomStatsOrderByRelationAggregateInput
  }

  export type RoomWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: RoomWhereInput | RoomWhereInput[]
    OR?: RoomWhereInput[]
    NOT?: RoomWhereInput | RoomWhereInput[]
    name?: StringFilter<"Room"> | string
    maxPlayers?: IntFilter<"Room"> | number
    currentPlayers?: IntFilter<"Room"> | number
    isPrivate?: BoolFilter<"Room"> | boolean
    status?: EnumRoomStatusFilter<"Room"> | $Enums.RoomStatus
    createdAt?: DateTimeFilter<"Room"> | Date | string
    updatedAt?: DateTimeFilter<"Room"> | Date | string
    creatorId?: StringFilter<"Room"> | string
    password?: StringNullableFilter<"Room"> | string | null
    creator?: XOR<UserScalarRelationFilter, UserWhereInput>
    players?: PlayerListRelationFilter
    games?: GameListRelationFilter
    roomStats?: XOR<RoomStatsNullableScalarRelationFilter, RoomStatsWhereInput> | null
    playerRoomStats?: PlayerRoomStatsListRelationFilter
  }, "id" | "code">

  export type RoomOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    maxPlayers?: SortOrder
    currentPlayers?: SortOrder
    isPrivate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    creatorId?: SortOrder
    password?: SortOrderInput | SortOrder
    _count?: RoomCountOrderByAggregateInput
    _avg?: RoomAvgOrderByAggregateInput
    _max?: RoomMaxOrderByAggregateInput
    _min?: RoomMinOrderByAggregateInput
    _sum?: RoomSumOrderByAggregateInput
  }

  export type RoomScalarWhereWithAggregatesInput = {
    AND?: RoomScalarWhereWithAggregatesInput | RoomScalarWhereWithAggregatesInput[]
    OR?: RoomScalarWhereWithAggregatesInput[]
    NOT?: RoomScalarWhereWithAggregatesInput | RoomScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Room"> | string
    name?: StringWithAggregatesFilter<"Room"> | string
    code?: StringWithAggregatesFilter<"Room"> | string
    maxPlayers?: IntWithAggregatesFilter<"Room"> | number
    currentPlayers?: IntWithAggregatesFilter<"Room"> | number
    isPrivate?: BoolWithAggregatesFilter<"Room"> | boolean
    status?: EnumRoomStatusWithAggregatesFilter<"Room"> | $Enums.RoomStatus
    createdAt?: DateTimeWithAggregatesFilter<"Room"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Room"> | Date | string
    creatorId?: StringWithAggregatesFilter<"Room"> | string
    password?: StringNullableWithAggregatesFilter<"Room"> | string | null
  }

  export type GameWhereInput = {
    AND?: GameWhereInput | GameWhereInput[]
    OR?: GameWhereInput[]
    NOT?: GameWhereInput | GameWhereInput[]
    id?: StringFilter<"Game"> | string
    roomId?: StringFilter<"Game"> | string
    status?: EnumGameStatusFilter<"Game"> | $Enums.GameStatus
    currentRound?: IntFilter<"Game"> | number
    currentTurn?: IntFilter<"Game"> | number
    rows?: JsonFilter<"Game">
    currentTurnCards?: JsonFilter<"Game">
    history?: JsonFilter<"Game">
    startedAt?: DateTimeFilter<"Game"> | Date | string
    finishedAt?: DateTimeNullableFilter<"Game"> | Date | string | null
    winnerId?: StringNullableFilter<"Game"> | string | null
    room?: XOR<RoomScalarRelationFilter, RoomWhereInput>
    players?: PlayerListRelationFilter
    winner?: XOR<PlayerNullableScalarRelationFilter, PlayerWhereInput> | null
  }

  export type GameOrderByWithRelationInput = {
    id?: SortOrder
    roomId?: SortOrder
    status?: SortOrder
    currentRound?: SortOrder
    currentTurn?: SortOrder
    rows?: SortOrder
    currentTurnCards?: SortOrder
    history?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrderInput | SortOrder
    winnerId?: SortOrderInput | SortOrder
    room?: RoomOrderByWithRelationInput
    players?: PlayerOrderByRelationAggregateInput
    winner?: PlayerOrderByWithRelationInput
  }

  export type GameWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GameWhereInput | GameWhereInput[]
    OR?: GameWhereInput[]
    NOT?: GameWhereInput | GameWhereInput[]
    roomId?: StringFilter<"Game"> | string
    status?: EnumGameStatusFilter<"Game"> | $Enums.GameStatus
    currentRound?: IntFilter<"Game"> | number
    currentTurn?: IntFilter<"Game"> | number
    rows?: JsonFilter<"Game">
    currentTurnCards?: JsonFilter<"Game">
    history?: JsonFilter<"Game">
    startedAt?: DateTimeFilter<"Game"> | Date | string
    finishedAt?: DateTimeNullableFilter<"Game"> | Date | string | null
    winnerId?: StringNullableFilter<"Game"> | string | null
    room?: XOR<RoomScalarRelationFilter, RoomWhereInput>
    players?: PlayerListRelationFilter
    winner?: XOR<PlayerNullableScalarRelationFilter, PlayerWhereInput> | null
  }, "id">

  export type GameOrderByWithAggregationInput = {
    id?: SortOrder
    roomId?: SortOrder
    status?: SortOrder
    currentRound?: SortOrder
    currentTurn?: SortOrder
    rows?: SortOrder
    currentTurnCards?: SortOrder
    history?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrderInput | SortOrder
    winnerId?: SortOrderInput | SortOrder
    _count?: GameCountOrderByAggregateInput
    _avg?: GameAvgOrderByAggregateInput
    _max?: GameMaxOrderByAggregateInput
    _min?: GameMinOrderByAggregateInput
    _sum?: GameSumOrderByAggregateInput
  }

  export type GameScalarWhereWithAggregatesInput = {
    AND?: GameScalarWhereWithAggregatesInput | GameScalarWhereWithAggregatesInput[]
    OR?: GameScalarWhereWithAggregatesInput[]
    NOT?: GameScalarWhereWithAggregatesInput | GameScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Game"> | string
    roomId?: StringWithAggregatesFilter<"Game"> | string
    status?: EnumGameStatusWithAggregatesFilter<"Game"> | $Enums.GameStatus
    currentRound?: IntWithAggregatesFilter<"Game"> | number
    currentTurn?: IntWithAggregatesFilter<"Game"> | number
    rows?: JsonWithAggregatesFilter<"Game">
    currentTurnCards?: JsonWithAggregatesFilter<"Game">
    history?: JsonWithAggregatesFilter<"Game">
    startedAt?: DateTimeWithAggregatesFilter<"Game"> | Date | string
    finishedAt?: DateTimeNullableWithAggregatesFilter<"Game"> | Date | string | null
    winnerId?: StringNullableWithAggregatesFilter<"Game"> | string | null
  }

  export type PlayerWhereInput = {
    AND?: PlayerWhereInput | PlayerWhereInput[]
    OR?: PlayerWhereInput[]
    NOT?: PlayerWhereInput | PlayerWhereInput[]
    id?: StringFilter<"Player"> | string
    userId?: StringNullableFilter<"Player"> | string | null
    roomId?: StringFilter<"Player"> | string
    gameId?: StringNullableFilter<"Player"> | string | null
    isBot?: BoolFilter<"Player"> | boolean
    botName?: StringNullableFilter<"Player"> | string | null
    position?: IntFilter<"Player"> | number
    hand?: JsonFilter<"Player">
    penaltyCard?: JsonFilter<"Player">
    totalPenalty?: IntFilter<"Player"> | number
    roundPenaltyCard?: JsonFilter<"Player">
    roundPenalty?: IntFilter<"Player"> | number
    selectedCard?: JsonNullableFilter<"Player">
    isSelectedCardConfirmed?: BoolFilter<"Player"> | boolean
    isReady?: BoolFilter<"Player"> | boolean
    isWinner?: BoolFilter<"Player"> | boolean
    finalPosition?: IntNullableFilter<"Player"> | number | null
    createdAt?: DateTimeFilter<"Player"> | Date | string
    updatedAt?: DateTimeFilter<"Player"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    room?: XOR<RoomScalarRelationFilter, RoomWhereInput>
    game?: XOR<GameNullableScalarRelationFilter, GameWhereInput> | null
    wonGames?: GameListRelationFilter
  }

  export type PlayerOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    roomId?: SortOrder
    gameId?: SortOrderInput | SortOrder
    isBot?: SortOrder
    botName?: SortOrderInput | SortOrder
    position?: SortOrder
    hand?: SortOrder
    penaltyCard?: SortOrder
    totalPenalty?: SortOrder
    roundPenaltyCard?: SortOrder
    roundPenalty?: SortOrder
    selectedCard?: SortOrderInput | SortOrder
    isSelectedCardConfirmed?: SortOrder
    isReady?: SortOrder
    isWinner?: SortOrder
    finalPosition?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    room?: RoomOrderByWithRelationInput
    game?: GameOrderByWithRelationInput
    wonGames?: GameOrderByRelationAggregateInput
  }

  export type PlayerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    gameId_position?: PlayerGameIdPositionCompoundUniqueInput
    AND?: PlayerWhereInput | PlayerWhereInput[]
    OR?: PlayerWhereInput[]
    NOT?: PlayerWhereInput | PlayerWhereInput[]
    userId?: StringNullableFilter<"Player"> | string | null
    roomId?: StringFilter<"Player"> | string
    gameId?: StringNullableFilter<"Player"> | string | null
    isBot?: BoolFilter<"Player"> | boolean
    botName?: StringNullableFilter<"Player"> | string | null
    position?: IntFilter<"Player"> | number
    hand?: JsonFilter<"Player">
    penaltyCard?: JsonFilter<"Player">
    totalPenalty?: IntFilter<"Player"> | number
    roundPenaltyCard?: JsonFilter<"Player">
    roundPenalty?: IntFilter<"Player"> | number
    selectedCard?: JsonNullableFilter<"Player">
    isSelectedCardConfirmed?: BoolFilter<"Player"> | boolean
    isReady?: BoolFilter<"Player"> | boolean
    isWinner?: BoolFilter<"Player"> | boolean
    finalPosition?: IntNullableFilter<"Player"> | number | null
    createdAt?: DateTimeFilter<"Player"> | Date | string
    updatedAt?: DateTimeFilter<"Player"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    room?: XOR<RoomScalarRelationFilter, RoomWhereInput>
    game?: XOR<GameNullableScalarRelationFilter, GameWhereInput> | null
    wonGames?: GameListRelationFilter
  }, "id" | "gameId_position">

  export type PlayerOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    roomId?: SortOrder
    gameId?: SortOrderInput | SortOrder
    isBot?: SortOrder
    botName?: SortOrderInput | SortOrder
    position?: SortOrder
    hand?: SortOrder
    penaltyCard?: SortOrder
    totalPenalty?: SortOrder
    roundPenaltyCard?: SortOrder
    roundPenalty?: SortOrder
    selectedCard?: SortOrderInput | SortOrder
    isSelectedCardConfirmed?: SortOrder
    isReady?: SortOrder
    isWinner?: SortOrder
    finalPosition?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PlayerCountOrderByAggregateInput
    _avg?: PlayerAvgOrderByAggregateInput
    _max?: PlayerMaxOrderByAggregateInput
    _min?: PlayerMinOrderByAggregateInput
    _sum?: PlayerSumOrderByAggregateInput
  }

  export type PlayerScalarWhereWithAggregatesInput = {
    AND?: PlayerScalarWhereWithAggregatesInput | PlayerScalarWhereWithAggregatesInput[]
    OR?: PlayerScalarWhereWithAggregatesInput[]
    NOT?: PlayerScalarWhereWithAggregatesInput | PlayerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Player"> | string
    userId?: StringNullableWithAggregatesFilter<"Player"> | string | null
    roomId?: StringWithAggregatesFilter<"Player"> | string
    gameId?: StringNullableWithAggregatesFilter<"Player"> | string | null
    isBot?: BoolWithAggregatesFilter<"Player"> | boolean
    botName?: StringNullableWithAggregatesFilter<"Player"> | string | null
    position?: IntWithAggregatesFilter<"Player"> | number
    hand?: JsonWithAggregatesFilter<"Player">
    penaltyCard?: JsonWithAggregatesFilter<"Player">
    totalPenalty?: IntWithAggregatesFilter<"Player"> | number
    roundPenaltyCard?: JsonWithAggregatesFilter<"Player">
    roundPenalty?: IntWithAggregatesFilter<"Player"> | number
    selectedCard?: JsonNullableWithAggregatesFilter<"Player">
    isSelectedCardConfirmed?: BoolWithAggregatesFilter<"Player"> | boolean
    isReady?: BoolWithAggregatesFilter<"Player"> | boolean
    isWinner?: BoolWithAggregatesFilter<"Player"> | boolean
    finalPosition?: IntNullableWithAggregatesFilter<"Player"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Player"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Player"> | Date | string
  }

  export type RoomStatsWhereInput = {
    AND?: RoomStatsWhereInput | RoomStatsWhereInput[]
    OR?: RoomStatsWhereInput[]
    NOT?: RoomStatsWhereInput | RoomStatsWhereInput[]
    id?: StringFilter<"RoomStats"> | string
    roomId?: StringFilter<"RoomStats"> | string
    totalGames?: IntFilter<"RoomStats"> | number
    completedGames?: IntFilter<"RoomStats"> | number
    updatedAt?: DateTimeFilter<"RoomStats"> | Date | string
    room?: XOR<RoomScalarRelationFilter, RoomWhereInput>
  }

  export type RoomStatsOrderByWithRelationInput = {
    id?: SortOrder
    roomId?: SortOrder
    totalGames?: SortOrder
    completedGames?: SortOrder
    updatedAt?: SortOrder
    room?: RoomOrderByWithRelationInput
  }

  export type RoomStatsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    roomId?: string
    AND?: RoomStatsWhereInput | RoomStatsWhereInput[]
    OR?: RoomStatsWhereInput[]
    NOT?: RoomStatsWhereInput | RoomStatsWhereInput[]
    totalGames?: IntFilter<"RoomStats"> | number
    completedGames?: IntFilter<"RoomStats"> | number
    updatedAt?: DateTimeFilter<"RoomStats"> | Date | string
    room?: XOR<RoomScalarRelationFilter, RoomWhereInput>
  }, "id" | "roomId">

  export type RoomStatsOrderByWithAggregationInput = {
    id?: SortOrder
    roomId?: SortOrder
    totalGames?: SortOrder
    completedGames?: SortOrder
    updatedAt?: SortOrder
    _count?: RoomStatsCountOrderByAggregateInput
    _avg?: RoomStatsAvgOrderByAggregateInput
    _max?: RoomStatsMaxOrderByAggregateInput
    _min?: RoomStatsMinOrderByAggregateInput
    _sum?: RoomStatsSumOrderByAggregateInput
  }

  export type RoomStatsScalarWhereWithAggregatesInput = {
    AND?: RoomStatsScalarWhereWithAggregatesInput | RoomStatsScalarWhereWithAggregatesInput[]
    OR?: RoomStatsScalarWhereWithAggregatesInput[]
    NOT?: RoomStatsScalarWhereWithAggregatesInput | RoomStatsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RoomStats"> | string
    roomId?: StringWithAggregatesFilter<"RoomStats"> | string
    totalGames?: IntWithAggregatesFilter<"RoomStats"> | number
    completedGames?: IntWithAggregatesFilter<"RoomStats"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"RoomStats"> | Date | string
  }

  export type PlayerRoomStatsWhereInput = {
    AND?: PlayerRoomStatsWhereInput | PlayerRoomStatsWhereInput[]
    OR?: PlayerRoomStatsWhereInput[]
    NOT?: PlayerRoomStatsWhereInput | PlayerRoomStatsWhereInput[]
    id?: StringFilter<"PlayerRoomStats"> | string
    userId?: StringFilter<"PlayerRoomStats"> | string
    roomId?: StringFilter<"PlayerRoomStats"> | string
    gamesPlayed?: IntFilter<"PlayerRoomStats"> | number
    gamesWon?: IntFilter<"PlayerRoomStats"> | number
    totalPenalty?: IntFilter<"PlayerRoomStats"> | number
    bestScore?: IntNullableFilter<"PlayerRoomStats"> | number | null
    lastPlayedAt?: DateTimeFilter<"PlayerRoomStats"> | Date | string
    updatedAt?: DateTimeFilter<"PlayerRoomStats"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    room?: XOR<RoomScalarRelationFilter, RoomWhereInput>
  }

  export type PlayerRoomStatsOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    roomId?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    totalPenalty?: SortOrder
    bestScore?: SortOrderInput | SortOrder
    lastPlayedAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    room?: RoomOrderByWithRelationInput
  }

  export type PlayerRoomStatsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_roomId?: PlayerRoomStatsUserIdRoomIdCompoundUniqueInput
    AND?: PlayerRoomStatsWhereInput | PlayerRoomStatsWhereInput[]
    OR?: PlayerRoomStatsWhereInput[]
    NOT?: PlayerRoomStatsWhereInput | PlayerRoomStatsWhereInput[]
    userId?: StringFilter<"PlayerRoomStats"> | string
    roomId?: StringFilter<"PlayerRoomStats"> | string
    gamesPlayed?: IntFilter<"PlayerRoomStats"> | number
    gamesWon?: IntFilter<"PlayerRoomStats"> | number
    totalPenalty?: IntFilter<"PlayerRoomStats"> | number
    bestScore?: IntNullableFilter<"PlayerRoomStats"> | number | null
    lastPlayedAt?: DateTimeFilter<"PlayerRoomStats"> | Date | string
    updatedAt?: DateTimeFilter<"PlayerRoomStats"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    room?: XOR<RoomScalarRelationFilter, RoomWhereInput>
  }, "id" | "userId_roomId">

  export type PlayerRoomStatsOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    roomId?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    totalPenalty?: SortOrder
    bestScore?: SortOrderInput | SortOrder
    lastPlayedAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PlayerRoomStatsCountOrderByAggregateInput
    _avg?: PlayerRoomStatsAvgOrderByAggregateInput
    _max?: PlayerRoomStatsMaxOrderByAggregateInput
    _min?: PlayerRoomStatsMinOrderByAggregateInput
    _sum?: PlayerRoomStatsSumOrderByAggregateInput
  }

  export type PlayerRoomStatsScalarWhereWithAggregatesInput = {
    AND?: PlayerRoomStatsScalarWhereWithAggregatesInput | PlayerRoomStatsScalarWhereWithAggregatesInput[]
    OR?: PlayerRoomStatsScalarWhereWithAggregatesInput[]
    NOT?: PlayerRoomStatsScalarWhereWithAggregatesInput | PlayerRoomStatsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PlayerRoomStats"> | string
    userId?: StringWithAggregatesFilter<"PlayerRoomStats"> | string
    roomId?: StringWithAggregatesFilter<"PlayerRoomStats"> | string
    gamesPlayed?: IntWithAggregatesFilter<"PlayerRoomStats"> | number
    gamesWon?: IntWithAggregatesFilter<"PlayerRoomStats"> | number
    totalPenalty?: IntWithAggregatesFilter<"PlayerRoomStats"> | number
    bestScore?: IntNullableWithAggregatesFilter<"PlayerRoomStats"> | number | null
    lastPlayedAt?: DateTimeWithAggregatesFilter<"PlayerRoomStats"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PlayerRoomStats"> | Date | string
  }

  export type TokenWhereInput = {
    AND?: TokenWhereInput | TokenWhereInput[]
    OR?: TokenWhereInput[]
    NOT?: TokenWhereInput | TokenWhereInput[]
    id?: StringFilter<"Token"> | string
    userId?: StringFilter<"Token"> | string
    refreshToken?: StringFilter<"Token"> | string
    createdAt?: DateTimeFilter<"Token"> | Date | string
    updatedAt?: DateTimeFilter<"Token"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type TokenOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type TokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    refreshToken?: string
    AND?: TokenWhereInput | TokenWhereInput[]
    OR?: TokenWhereInput[]
    NOT?: TokenWhereInput | TokenWhereInput[]
    createdAt?: DateTimeFilter<"Token"> | Date | string
    updatedAt?: DateTimeFilter<"Token"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId" | "refreshToken">

  export type TokenOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TokenCountOrderByAggregateInput
    _max?: TokenMaxOrderByAggregateInput
    _min?: TokenMinOrderByAggregateInput
  }

  export type TokenScalarWhereWithAggregatesInput = {
    AND?: TokenScalarWhereWithAggregatesInput | TokenScalarWhereWithAggregatesInput[]
    OR?: TokenScalarWhereWithAggregatesInput[]
    NOT?: TokenScalarWhereWithAggregatesInput | TokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Token"> | string
    userId?: StringWithAggregatesFilter<"Token"> | string
    refreshToken?: StringWithAggregatesFilter<"Token"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Token"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Token"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    username: string
    password: string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    surname?: string | null
    email?: string | null
    userStats?: UserStatsCreateNestedOneWithoutUserInput
    createdRooms?: RoomCreateNestedManyWithoutCreatorInput
    players?: PlayerCreateNestedManyWithoutUserInput
    playerRoomStats?: PlayerRoomStatsCreateNestedManyWithoutUserInput
    token?: TokenCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    username: string
    password: string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    surname?: string | null
    email?: string | null
    userStats?: UserStatsUncheckedCreateNestedOneWithoutUserInput
    createdRooms?: RoomUncheckedCreateNestedManyWithoutCreatorInput
    players?: PlayerUncheckedCreateNestedManyWithoutUserInput
    playerRoomStats?: PlayerRoomStatsUncheckedCreateNestedManyWithoutUserInput
    token?: TokenUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    surname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    userStats?: UserStatsUpdateOneWithoutUserNestedInput
    createdRooms?: RoomUpdateManyWithoutCreatorNestedInput
    players?: PlayerUpdateManyWithoutUserNestedInput
    playerRoomStats?: PlayerRoomStatsUpdateManyWithoutUserNestedInput
    token?: TokenUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    surname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    userStats?: UserStatsUncheckedUpdateOneWithoutUserNestedInput
    createdRooms?: RoomUncheckedUpdateManyWithoutCreatorNestedInput
    players?: PlayerUncheckedUpdateManyWithoutUserNestedInput
    playerRoomStats?: PlayerRoomStatsUncheckedUpdateManyWithoutUserNestedInput
    token?: TokenUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    username: string
    password: string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    surname?: string | null
    email?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    surname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    surname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserStatsCreateInput = {
    id?: string
    gamesPlayed?: number
    gamesWon?: number
    totalPenalty?: number
    bestScore?: number | null
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutUserStatsInput
  }

  export type UserStatsUncheckedCreateInput = {
    id?: string
    userId: string
    gamesPlayed?: number
    gamesWon?: number
    totalPenalty?: number
    bestScore?: number | null
    updatedAt?: Date | string
  }

  export type UserStatsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    totalPenalty?: IntFieldUpdateOperationsInput | number
    bestScore?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUserStatsNestedInput
  }

  export type UserStatsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    totalPenalty?: IntFieldUpdateOperationsInput | number
    bestScore?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserStatsCreateManyInput = {
    id?: string
    userId: string
    gamesPlayed?: number
    gamesWon?: number
    totalPenalty?: number
    bestScore?: number | null
    updatedAt?: Date | string
  }

  export type UserStatsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    totalPenalty?: IntFieldUpdateOperationsInput | number
    bestScore?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserStatsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    totalPenalty?: IntFieldUpdateOperationsInput | number
    bestScore?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomCreateInput = {
    id?: string
    name: string
    code: string
    maxPlayers?: number
    currentPlayers?: number
    isPrivate?: boolean
    status?: $Enums.RoomStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    password?: string | null
    creator: UserCreateNestedOneWithoutCreatedRoomsInput
    players?: PlayerCreateNestedManyWithoutRoomInput
    games?: GameCreateNestedManyWithoutRoomInput
    roomStats?: RoomStatsCreateNestedOneWithoutRoomInput
    playerRoomStats?: PlayerRoomStatsCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateInput = {
    id?: string
    name: string
    code: string
    maxPlayers?: number
    currentPlayers?: number
    isPrivate?: boolean
    status?: $Enums.RoomStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    creatorId: string
    password?: string | null
    players?: PlayerUncheckedCreateNestedManyWithoutRoomInput
    games?: GameUncheckedCreateNestedManyWithoutRoomInput
    roomStats?: RoomStatsUncheckedCreateNestedOneWithoutRoomInput
    playerRoomStats?: PlayerRoomStatsUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentPlayers?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumRoomStatusFieldUpdateOperationsInput | $Enums.RoomStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    creator?: UserUpdateOneRequiredWithoutCreatedRoomsNestedInput
    players?: PlayerUpdateManyWithoutRoomNestedInput
    games?: GameUpdateManyWithoutRoomNestedInput
    roomStats?: RoomStatsUpdateOneWithoutRoomNestedInput
    playerRoomStats?: PlayerRoomStatsUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentPlayers?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumRoomStatusFieldUpdateOperationsInput | $Enums.RoomStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creatorId?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    players?: PlayerUncheckedUpdateManyWithoutRoomNestedInput
    games?: GameUncheckedUpdateManyWithoutRoomNestedInput
    roomStats?: RoomStatsUncheckedUpdateOneWithoutRoomNestedInput
    playerRoomStats?: PlayerRoomStatsUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type RoomCreateManyInput = {
    id?: string
    name: string
    code: string
    maxPlayers?: number
    currentPlayers?: number
    isPrivate?: boolean
    status?: $Enums.RoomStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    creatorId: string
    password?: string | null
  }

  export type RoomUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentPlayers?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumRoomStatusFieldUpdateOperationsInput | $Enums.RoomStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RoomUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentPlayers?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumRoomStatusFieldUpdateOperationsInput | $Enums.RoomStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creatorId?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GameCreateInput = {
    id?: string
    status?: $Enums.GameStatus
    currentRound?: number
    currentTurn?: number
    rows: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    finishedAt?: Date | string | null
    room: RoomCreateNestedOneWithoutGamesInput
    players?: PlayerCreateNestedManyWithoutGameInput
    winner?: PlayerCreateNestedOneWithoutWonGamesInput
  }

  export type GameUncheckedCreateInput = {
    id?: string
    roomId: string
    status?: $Enums.GameStatus
    currentRound?: number
    currentTurn?: number
    rows: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    finishedAt?: Date | string | null
    winnerId?: string | null
    players?: PlayerUncheckedCreateNestedManyWithoutGameInput
  }

  export type GameUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    currentRound?: IntFieldUpdateOperationsInput | number
    currentTurn?: IntFieldUpdateOperationsInput | number
    rows?: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    room?: RoomUpdateOneRequiredWithoutGamesNestedInput
    players?: PlayerUpdateManyWithoutGameNestedInput
    winner?: PlayerUpdateOneWithoutWonGamesNestedInput
  }

  export type GameUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    currentRound?: IntFieldUpdateOperationsInput | number
    currentTurn?: IntFieldUpdateOperationsInput | number
    rows?: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    players?: PlayerUncheckedUpdateManyWithoutGameNestedInput
  }

  export type GameCreateManyInput = {
    id?: string
    roomId: string
    status?: $Enums.GameStatus
    currentRound?: number
    currentTurn?: number
    rows: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    finishedAt?: Date | string | null
    winnerId?: string | null
  }

  export type GameUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    currentRound?: IntFieldUpdateOperationsInput | number
    currentTurn?: IntFieldUpdateOperationsInput | number
    rows?: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    currentRound?: IntFieldUpdateOperationsInput | number
    currentTurn?: IntFieldUpdateOperationsInput | number
    rows?: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PlayerCreateInput = {
    id?: string
    isBot?: boolean
    botName?: string | null
    position: number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: boolean
    isReady?: boolean
    isWinner?: boolean
    finalPosition?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutPlayersInput
    room: RoomCreateNestedOneWithoutPlayersInput
    game?: GameCreateNestedOneWithoutPlayersInput
    wonGames?: GameCreateNestedManyWithoutWinnerInput
  }

  export type PlayerUncheckedCreateInput = {
    id?: string
    userId?: string | null
    roomId: string
    gameId?: string | null
    isBot?: boolean
    botName?: string | null
    position: number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: boolean
    isReady?: boolean
    isWinner?: boolean
    finalPosition?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    wonGames?: GameUncheckedCreateNestedManyWithoutWinnerInput
  }

  export type PlayerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    isBot?: BoolFieldUpdateOperationsInput | boolean
    botName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: IntFieldUpdateOperationsInput | number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: IntFieldUpdateOperationsInput | number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isWinner?: BoolFieldUpdateOperationsInput | boolean
    finalPosition?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutPlayersNestedInput
    room?: RoomUpdateOneRequiredWithoutPlayersNestedInput
    game?: GameUpdateOneWithoutPlayersNestedInput
    wonGames?: GameUpdateManyWithoutWinnerNestedInput
  }

  export type PlayerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    roomId?: StringFieldUpdateOperationsInput | string
    gameId?: NullableStringFieldUpdateOperationsInput | string | null
    isBot?: BoolFieldUpdateOperationsInput | boolean
    botName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: IntFieldUpdateOperationsInput | number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: IntFieldUpdateOperationsInput | number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isWinner?: BoolFieldUpdateOperationsInput | boolean
    finalPosition?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wonGames?: GameUncheckedUpdateManyWithoutWinnerNestedInput
  }

  export type PlayerCreateManyInput = {
    id?: string
    userId?: string | null
    roomId: string
    gameId?: string | null
    isBot?: boolean
    botName?: string | null
    position: number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: boolean
    isReady?: boolean
    isWinner?: boolean
    finalPosition?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlayerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    isBot?: BoolFieldUpdateOperationsInput | boolean
    botName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: IntFieldUpdateOperationsInput | number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: IntFieldUpdateOperationsInput | number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isWinner?: BoolFieldUpdateOperationsInput | boolean
    finalPosition?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    roomId?: StringFieldUpdateOperationsInput | string
    gameId?: NullableStringFieldUpdateOperationsInput | string | null
    isBot?: BoolFieldUpdateOperationsInput | boolean
    botName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: IntFieldUpdateOperationsInput | number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: IntFieldUpdateOperationsInput | number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isWinner?: BoolFieldUpdateOperationsInput | boolean
    finalPosition?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomStatsCreateInput = {
    id?: string
    totalGames?: number
    completedGames?: number
    updatedAt?: Date | string
    room: RoomCreateNestedOneWithoutRoomStatsInput
  }

  export type RoomStatsUncheckedCreateInput = {
    id?: string
    roomId: string
    totalGames?: number
    completedGames?: number
    updatedAt?: Date | string
  }

  export type RoomStatsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalGames?: IntFieldUpdateOperationsInput | number
    completedGames?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: RoomUpdateOneRequiredWithoutRoomStatsNestedInput
  }

  export type RoomStatsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    totalGames?: IntFieldUpdateOperationsInput | number
    completedGames?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomStatsCreateManyInput = {
    id?: string
    roomId: string
    totalGames?: number
    completedGames?: number
    updatedAt?: Date | string
  }

  export type RoomStatsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalGames?: IntFieldUpdateOperationsInput | number
    completedGames?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomStatsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    totalGames?: IntFieldUpdateOperationsInput | number
    completedGames?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerRoomStatsCreateInput = {
    id?: string
    gamesPlayed?: number
    gamesWon?: number
    totalPenalty?: number
    bestScore?: number | null
    lastPlayedAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPlayerRoomStatsInput
    room: RoomCreateNestedOneWithoutPlayerRoomStatsInput
  }

  export type PlayerRoomStatsUncheckedCreateInput = {
    id?: string
    userId: string
    roomId: string
    gamesPlayed?: number
    gamesWon?: number
    totalPenalty?: number
    bestScore?: number | null
    lastPlayedAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlayerRoomStatsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    totalPenalty?: IntFieldUpdateOperationsInput | number
    bestScore?: NullableIntFieldUpdateOperationsInput | number | null
    lastPlayedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlayerRoomStatsNestedInput
    room?: RoomUpdateOneRequiredWithoutPlayerRoomStatsNestedInput
  }

  export type PlayerRoomStatsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    totalPenalty?: IntFieldUpdateOperationsInput | number
    bestScore?: NullableIntFieldUpdateOperationsInput | number | null
    lastPlayedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerRoomStatsCreateManyInput = {
    id?: string
    userId: string
    roomId: string
    gamesPlayed?: number
    gamesWon?: number
    totalPenalty?: number
    bestScore?: number | null
    lastPlayedAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlayerRoomStatsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    totalPenalty?: IntFieldUpdateOperationsInput | number
    bestScore?: NullableIntFieldUpdateOperationsInput | number | null
    lastPlayedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerRoomStatsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    totalPenalty?: IntFieldUpdateOperationsInput | number
    bestScore?: NullableIntFieldUpdateOperationsInput | number | null
    lastPlayedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenCreateInput = {
    id?: string
    refreshToken: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTokenInput
  }

  export type TokenUncheckedCreateInput = {
    id?: string
    userId: string
    refreshToken: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTokenNestedInput
  }

  export type TokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenCreateManyInput = {
    id?: string
    userId: string
    refreshToken: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UserStatsNullableScalarRelationFilter = {
    is?: UserStatsWhereInput | null
    isNot?: UserStatsWhereInput | null
  }

  export type RoomListRelationFilter = {
    every?: RoomWhereInput
    some?: RoomWhereInput
    none?: RoomWhereInput
  }

  export type PlayerListRelationFilter = {
    every?: PlayerWhereInput
    some?: PlayerWhereInput
    none?: PlayerWhereInput
  }

  export type PlayerRoomStatsListRelationFilter = {
    every?: PlayerRoomStatsWhereInput
    some?: PlayerRoomStatsWhereInput
    none?: PlayerRoomStatsWhereInput
  }

  export type TokenNullableScalarRelationFilter = {
    is?: TokenWhereInput | null
    isNot?: TokenWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RoomOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlayerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlayerRoomStatsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    surname?: SortOrder
    email?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    version?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    surname?: SortOrder
    email?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    version?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    surname?: SortOrder
    email?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    version?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserStatsCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    totalPenalty?: SortOrder
    bestScore?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserStatsAvgOrderByAggregateInput = {
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    totalPenalty?: SortOrder
    bestScore?: SortOrder
  }

  export type UserStatsMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    totalPenalty?: SortOrder
    bestScore?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserStatsMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    totalPenalty?: SortOrder
    bestScore?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserStatsSumOrderByAggregateInput = {
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    totalPenalty?: SortOrder
    bestScore?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EnumRoomStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RoomStatus | EnumRoomStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RoomStatus[] | ListEnumRoomStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RoomStatus[] | ListEnumRoomStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRoomStatusFilter<$PrismaModel> | $Enums.RoomStatus
  }

  export type GameListRelationFilter = {
    every?: GameWhereInput
    some?: GameWhereInput
    none?: GameWhereInput
  }

  export type RoomStatsNullableScalarRelationFilter = {
    is?: RoomStatsWhereInput | null
    isNot?: RoomStatsWhereInput | null
  }

  export type GameOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoomCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    maxPlayers?: SortOrder
    currentPlayers?: SortOrder
    isPrivate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    creatorId?: SortOrder
    password?: SortOrder
  }

  export type RoomAvgOrderByAggregateInput = {
    maxPlayers?: SortOrder
    currentPlayers?: SortOrder
  }

  export type RoomMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    maxPlayers?: SortOrder
    currentPlayers?: SortOrder
    isPrivate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    creatorId?: SortOrder
    password?: SortOrder
  }

  export type RoomMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    maxPlayers?: SortOrder
    currentPlayers?: SortOrder
    isPrivate?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    creatorId?: SortOrder
    password?: SortOrder
  }

  export type RoomSumOrderByAggregateInput = {
    maxPlayers?: SortOrder
    currentPlayers?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumRoomStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RoomStatus | EnumRoomStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RoomStatus[] | ListEnumRoomStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RoomStatus[] | ListEnumRoomStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRoomStatusWithAggregatesFilter<$PrismaModel> | $Enums.RoomStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoomStatusFilter<$PrismaModel>
    _max?: NestedEnumRoomStatusFilter<$PrismaModel>
  }

  export type EnumGameStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GameStatus | EnumGameStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGameStatusFilter<$PrismaModel> | $Enums.GameStatus
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type RoomScalarRelationFilter = {
    is?: RoomWhereInput
    isNot?: RoomWhereInput
  }

  export type PlayerNullableScalarRelationFilter = {
    is?: PlayerWhereInput | null
    isNot?: PlayerWhereInput | null
  }

  export type GameCountOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    status?: SortOrder
    currentRound?: SortOrder
    currentTurn?: SortOrder
    rows?: SortOrder
    currentTurnCards?: SortOrder
    history?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    winnerId?: SortOrder
  }

  export type GameAvgOrderByAggregateInput = {
    currentRound?: SortOrder
    currentTurn?: SortOrder
  }

  export type GameMaxOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    status?: SortOrder
    currentRound?: SortOrder
    currentTurn?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    winnerId?: SortOrder
  }

  export type GameMinOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    status?: SortOrder
    currentRound?: SortOrder
    currentTurn?: SortOrder
    startedAt?: SortOrder
    finishedAt?: SortOrder
    winnerId?: SortOrder
  }

  export type GameSumOrderByAggregateInput = {
    currentRound?: SortOrder
    currentTurn?: SortOrder
  }

  export type EnumGameStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GameStatus | EnumGameStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGameStatusWithAggregatesFilter<$PrismaModel> | $Enums.GameStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGameStatusFilter<$PrismaModel>
    _max?: NestedEnumGameStatusFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type GameNullableScalarRelationFilter = {
    is?: GameWhereInput | null
    isNot?: GameWhereInput | null
  }

  export type PlayerGameIdPositionCompoundUniqueInput = {
    gameId: string
    position: number
  }

  export type PlayerCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    roomId?: SortOrder
    gameId?: SortOrder
    isBot?: SortOrder
    botName?: SortOrder
    position?: SortOrder
    hand?: SortOrder
    penaltyCard?: SortOrder
    totalPenalty?: SortOrder
    roundPenaltyCard?: SortOrder
    roundPenalty?: SortOrder
    selectedCard?: SortOrder
    isSelectedCardConfirmed?: SortOrder
    isReady?: SortOrder
    isWinner?: SortOrder
    finalPosition?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlayerAvgOrderByAggregateInput = {
    position?: SortOrder
    totalPenalty?: SortOrder
    roundPenalty?: SortOrder
    finalPosition?: SortOrder
  }

  export type PlayerMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    roomId?: SortOrder
    gameId?: SortOrder
    isBot?: SortOrder
    botName?: SortOrder
    position?: SortOrder
    totalPenalty?: SortOrder
    roundPenalty?: SortOrder
    isSelectedCardConfirmed?: SortOrder
    isReady?: SortOrder
    isWinner?: SortOrder
    finalPosition?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlayerMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    roomId?: SortOrder
    gameId?: SortOrder
    isBot?: SortOrder
    botName?: SortOrder
    position?: SortOrder
    totalPenalty?: SortOrder
    roundPenalty?: SortOrder
    isSelectedCardConfirmed?: SortOrder
    isReady?: SortOrder
    isWinner?: SortOrder
    finalPosition?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlayerSumOrderByAggregateInput = {
    position?: SortOrder
    totalPenalty?: SortOrder
    roundPenalty?: SortOrder
    finalPosition?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type RoomStatsCountOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    totalGames?: SortOrder
    completedGames?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoomStatsAvgOrderByAggregateInput = {
    totalGames?: SortOrder
    completedGames?: SortOrder
  }

  export type RoomStatsMaxOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    totalGames?: SortOrder
    completedGames?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoomStatsMinOrderByAggregateInput = {
    id?: SortOrder
    roomId?: SortOrder
    totalGames?: SortOrder
    completedGames?: SortOrder
    updatedAt?: SortOrder
  }

  export type RoomStatsSumOrderByAggregateInput = {
    totalGames?: SortOrder
    completedGames?: SortOrder
  }

  export type PlayerRoomStatsUserIdRoomIdCompoundUniqueInput = {
    userId: string
    roomId: string
  }

  export type PlayerRoomStatsCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    roomId?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    totalPenalty?: SortOrder
    bestScore?: SortOrder
    lastPlayedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlayerRoomStatsAvgOrderByAggregateInput = {
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    totalPenalty?: SortOrder
    bestScore?: SortOrder
  }

  export type PlayerRoomStatsMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    roomId?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    totalPenalty?: SortOrder
    bestScore?: SortOrder
    lastPlayedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlayerRoomStatsMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    roomId?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    totalPenalty?: SortOrder
    bestScore?: SortOrder
    lastPlayedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlayerRoomStatsSumOrderByAggregateInput = {
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    totalPenalty?: SortOrder
    bestScore?: SortOrder
  }

  export type TokenCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TokenMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TokenMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    refreshToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserStatsCreateNestedOneWithoutUserInput = {
    create?: XOR<UserStatsCreateWithoutUserInput, UserStatsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserStatsCreateOrConnectWithoutUserInput
    connect?: UserStatsWhereUniqueInput
  }

  export type RoomCreateNestedManyWithoutCreatorInput = {
    create?: XOR<RoomCreateWithoutCreatorInput, RoomUncheckedCreateWithoutCreatorInput> | RoomCreateWithoutCreatorInput[] | RoomUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: RoomCreateOrConnectWithoutCreatorInput | RoomCreateOrConnectWithoutCreatorInput[]
    createMany?: RoomCreateManyCreatorInputEnvelope
    connect?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
  }

  export type PlayerCreateNestedManyWithoutUserInput = {
    create?: XOR<PlayerCreateWithoutUserInput, PlayerUncheckedCreateWithoutUserInput> | PlayerCreateWithoutUserInput[] | PlayerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutUserInput | PlayerCreateOrConnectWithoutUserInput[]
    createMany?: PlayerCreateManyUserInputEnvelope
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
  }

  export type PlayerRoomStatsCreateNestedManyWithoutUserInput = {
    create?: XOR<PlayerRoomStatsCreateWithoutUserInput, PlayerRoomStatsUncheckedCreateWithoutUserInput> | PlayerRoomStatsCreateWithoutUserInput[] | PlayerRoomStatsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerRoomStatsCreateOrConnectWithoutUserInput | PlayerRoomStatsCreateOrConnectWithoutUserInput[]
    createMany?: PlayerRoomStatsCreateManyUserInputEnvelope
    connect?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
  }

  export type TokenCreateNestedOneWithoutUserInput = {
    create?: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput>
    connectOrCreate?: TokenCreateOrConnectWithoutUserInput
    connect?: TokenWhereUniqueInput
  }

  export type UserStatsUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserStatsCreateWithoutUserInput, UserStatsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserStatsCreateOrConnectWithoutUserInput
    connect?: UserStatsWhereUniqueInput
  }

  export type RoomUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<RoomCreateWithoutCreatorInput, RoomUncheckedCreateWithoutCreatorInput> | RoomCreateWithoutCreatorInput[] | RoomUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: RoomCreateOrConnectWithoutCreatorInput | RoomCreateOrConnectWithoutCreatorInput[]
    createMany?: RoomCreateManyCreatorInputEnvelope
    connect?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
  }

  export type PlayerUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PlayerCreateWithoutUserInput, PlayerUncheckedCreateWithoutUserInput> | PlayerCreateWithoutUserInput[] | PlayerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutUserInput | PlayerCreateOrConnectWithoutUserInput[]
    createMany?: PlayerCreateManyUserInputEnvelope
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
  }

  export type PlayerRoomStatsUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PlayerRoomStatsCreateWithoutUserInput, PlayerRoomStatsUncheckedCreateWithoutUserInput> | PlayerRoomStatsCreateWithoutUserInput[] | PlayerRoomStatsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerRoomStatsCreateOrConnectWithoutUserInput | PlayerRoomStatsCreateOrConnectWithoutUserInput[]
    createMany?: PlayerRoomStatsCreateManyUserInputEnvelope
    connect?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
  }

  export type TokenUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput>
    connectOrCreate?: TokenCreateOrConnectWithoutUserInput
    connect?: TokenWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserStatsUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserStatsCreateWithoutUserInput, UserStatsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserStatsCreateOrConnectWithoutUserInput
    upsert?: UserStatsUpsertWithoutUserInput
    disconnect?: UserStatsWhereInput | boolean
    delete?: UserStatsWhereInput | boolean
    connect?: UserStatsWhereUniqueInput
    update?: XOR<XOR<UserStatsUpdateToOneWithWhereWithoutUserInput, UserStatsUpdateWithoutUserInput>, UserStatsUncheckedUpdateWithoutUserInput>
  }

  export type RoomUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<RoomCreateWithoutCreatorInput, RoomUncheckedCreateWithoutCreatorInput> | RoomCreateWithoutCreatorInput[] | RoomUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: RoomCreateOrConnectWithoutCreatorInput | RoomCreateOrConnectWithoutCreatorInput[]
    upsert?: RoomUpsertWithWhereUniqueWithoutCreatorInput | RoomUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: RoomCreateManyCreatorInputEnvelope
    set?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    disconnect?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    delete?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    connect?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    update?: RoomUpdateWithWhereUniqueWithoutCreatorInput | RoomUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: RoomUpdateManyWithWhereWithoutCreatorInput | RoomUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: RoomScalarWhereInput | RoomScalarWhereInput[]
  }

  export type PlayerUpdateManyWithoutUserNestedInput = {
    create?: XOR<PlayerCreateWithoutUserInput, PlayerUncheckedCreateWithoutUserInput> | PlayerCreateWithoutUserInput[] | PlayerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutUserInput | PlayerCreateOrConnectWithoutUserInput[]
    upsert?: PlayerUpsertWithWhereUniqueWithoutUserInput | PlayerUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PlayerCreateManyUserInputEnvelope
    set?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    disconnect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    delete?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    update?: PlayerUpdateWithWhereUniqueWithoutUserInput | PlayerUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PlayerUpdateManyWithWhereWithoutUserInput | PlayerUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
  }

  export type PlayerRoomStatsUpdateManyWithoutUserNestedInput = {
    create?: XOR<PlayerRoomStatsCreateWithoutUserInput, PlayerRoomStatsUncheckedCreateWithoutUserInput> | PlayerRoomStatsCreateWithoutUserInput[] | PlayerRoomStatsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerRoomStatsCreateOrConnectWithoutUserInput | PlayerRoomStatsCreateOrConnectWithoutUserInput[]
    upsert?: PlayerRoomStatsUpsertWithWhereUniqueWithoutUserInput | PlayerRoomStatsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PlayerRoomStatsCreateManyUserInputEnvelope
    set?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
    disconnect?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
    delete?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
    connect?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
    update?: PlayerRoomStatsUpdateWithWhereUniqueWithoutUserInput | PlayerRoomStatsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PlayerRoomStatsUpdateManyWithWhereWithoutUserInput | PlayerRoomStatsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PlayerRoomStatsScalarWhereInput | PlayerRoomStatsScalarWhereInput[]
  }

  export type TokenUpdateOneWithoutUserNestedInput = {
    create?: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput>
    connectOrCreate?: TokenCreateOrConnectWithoutUserInput
    upsert?: TokenUpsertWithoutUserInput
    disconnect?: TokenWhereInput | boolean
    delete?: TokenWhereInput | boolean
    connect?: TokenWhereUniqueInput
    update?: XOR<XOR<TokenUpdateToOneWithWhereWithoutUserInput, TokenUpdateWithoutUserInput>, TokenUncheckedUpdateWithoutUserInput>
  }

  export type UserStatsUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserStatsCreateWithoutUserInput, UserStatsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserStatsCreateOrConnectWithoutUserInput
    upsert?: UserStatsUpsertWithoutUserInput
    disconnect?: UserStatsWhereInput | boolean
    delete?: UserStatsWhereInput | boolean
    connect?: UserStatsWhereUniqueInput
    update?: XOR<XOR<UserStatsUpdateToOneWithWhereWithoutUserInput, UserStatsUpdateWithoutUserInput>, UserStatsUncheckedUpdateWithoutUserInput>
  }

  export type RoomUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<RoomCreateWithoutCreatorInput, RoomUncheckedCreateWithoutCreatorInput> | RoomCreateWithoutCreatorInput[] | RoomUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: RoomCreateOrConnectWithoutCreatorInput | RoomCreateOrConnectWithoutCreatorInput[]
    upsert?: RoomUpsertWithWhereUniqueWithoutCreatorInput | RoomUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: RoomCreateManyCreatorInputEnvelope
    set?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    disconnect?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    delete?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    connect?: RoomWhereUniqueInput | RoomWhereUniqueInput[]
    update?: RoomUpdateWithWhereUniqueWithoutCreatorInput | RoomUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: RoomUpdateManyWithWhereWithoutCreatorInput | RoomUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: RoomScalarWhereInput | RoomScalarWhereInput[]
  }

  export type PlayerUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PlayerCreateWithoutUserInput, PlayerUncheckedCreateWithoutUserInput> | PlayerCreateWithoutUserInput[] | PlayerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutUserInput | PlayerCreateOrConnectWithoutUserInput[]
    upsert?: PlayerUpsertWithWhereUniqueWithoutUserInput | PlayerUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PlayerCreateManyUserInputEnvelope
    set?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    disconnect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    delete?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    update?: PlayerUpdateWithWhereUniqueWithoutUserInput | PlayerUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PlayerUpdateManyWithWhereWithoutUserInput | PlayerUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
  }

  export type PlayerRoomStatsUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PlayerRoomStatsCreateWithoutUserInput, PlayerRoomStatsUncheckedCreateWithoutUserInput> | PlayerRoomStatsCreateWithoutUserInput[] | PlayerRoomStatsUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerRoomStatsCreateOrConnectWithoutUserInput | PlayerRoomStatsCreateOrConnectWithoutUserInput[]
    upsert?: PlayerRoomStatsUpsertWithWhereUniqueWithoutUserInput | PlayerRoomStatsUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PlayerRoomStatsCreateManyUserInputEnvelope
    set?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
    disconnect?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
    delete?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
    connect?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
    update?: PlayerRoomStatsUpdateWithWhereUniqueWithoutUserInput | PlayerRoomStatsUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PlayerRoomStatsUpdateManyWithWhereWithoutUserInput | PlayerRoomStatsUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PlayerRoomStatsScalarWhereInput | PlayerRoomStatsScalarWhereInput[]
  }

  export type TokenUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput>
    connectOrCreate?: TokenCreateOrConnectWithoutUserInput
    upsert?: TokenUpsertWithoutUserInput
    disconnect?: TokenWhereInput | boolean
    delete?: TokenWhereInput | boolean
    connect?: TokenWhereUniqueInput
    update?: XOR<XOR<TokenUpdateToOneWithWhereWithoutUserInput, TokenUpdateWithoutUserInput>, TokenUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutUserStatsInput = {
    create?: XOR<UserCreateWithoutUserStatsInput, UserUncheckedCreateWithoutUserStatsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserStatsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutUserStatsNestedInput = {
    create?: XOR<UserCreateWithoutUserStatsInput, UserUncheckedCreateWithoutUserStatsInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserStatsInput
    upsert?: UserUpsertWithoutUserStatsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUserStatsInput, UserUpdateWithoutUserStatsInput>, UserUncheckedUpdateWithoutUserStatsInput>
  }

  export type UserCreateNestedOneWithoutCreatedRoomsInput = {
    create?: XOR<UserCreateWithoutCreatedRoomsInput, UserUncheckedCreateWithoutCreatedRoomsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedRoomsInput
    connect?: UserWhereUniqueInput
  }

  export type PlayerCreateNestedManyWithoutRoomInput = {
    create?: XOR<PlayerCreateWithoutRoomInput, PlayerUncheckedCreateWithoutRoomInput> | PlayerCreateWithoutRoomInput[] | PlayerUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutRoomInput | PlayerCreateOrConnectWithoutRoomInput[]
    createMany?: PlayerCreateManyRoomInputEnvelope
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
  }

  export type GameCreateNestedManyWithoutRoomInput = {
    create?: XOR<GameCreateWithoutRoomInput, GameUncheckedCreateWithoutRoomInput> | GameCreateWithoutRoomInput[] | GameUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: GameCreateOrConnectWithoutRoomInput | GameCreateOrConnectWithoutRoomInput[]
    createMany?: GameCreateManyRoomInputEnvelope
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
  }

  export type RoomStatsCreateNestedOneWithoutRoomInput = {
    create?: XOR<RoomStatsCreateWithoutRoomInput, RoomStatsUncheckedCreateWithoutRoomInput>
    connectOrCreate?: RoomStatsCreateOrConnectWithoutRoomInput
    connect?: RoomStatsWhereUniqueInput
  }

  export type PlayerRoomStatsCreateNestedManyWithoutRoomInput = {
    create?: XOR<PlayerRoomStatsCreateWithoutRoomInput, PlayerRoomStatsUncheckedCreateWithoutRoomInput> | PlayerRoomStatsCreateWithoutRoomInput[] | PlayerRoomStatsUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: PlayerRoomStatsCreateOrConnectWithoutRoomInput | PlayerRoomStatsCreateOrConnectWithoutRoomInput[]
    createMany?: PlayerRoomStatsCreateManyRoomInputEnvelope
    connect?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
  }

  export type PlayerUncheckedCreateNestedManyWithoutRoomInput = {
    create?: XOR<PlayerCreateWithoutRoomInput, PlayerUncheckedCreateWithoutRoomInput> | PlayerCreateWithoutRoomInput[] | PlayerUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutRoomInput | PlayerCreateOrConnectWithoutRoomInput[]
    createMany?: PlayerCreateManyRoomInputEnvelope
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
  }

  export type GameUncheckedCreateNestedManyWithoutRoomInput = {
    create?: XOR<GameCreateWithoutRoomInput, GameUncheckedCreateWithoutRoomInput> | GameCreateWithoutRoomInput[] | GameUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: GameCreateOrConnectWithoutRoomInput | GameCreateOrConnectWithoutRoomInput[]
    createMany?: GameCreateManyRoomInputEnvelope
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
  }

  export type RoomStatsUncheckedCreateNestedOneWithoutRoomInput = {
    create?: XOR<RoomStatsCreateWithoutRoomInput, RoomStatsUncheckedCreateWithoutRoomInput>
    connectOrCreate?: RoomStatsCreateOrConnectWithoutRoomInput
    connect?: RoomStatsWhereUniqueInput
  }

  export type PlayerRoomStatsUncheckedCreateNestedManyWithoutRoomInput = {
    create?: XOR<PlayerRoomStatsCreateWithoutRoomInput, PlayerRoomStatsUncheckedCreateWithoutRoomInput> | PlayerRoomStatsCreateWithoutRoomInput[] | PlayerRoomStatsUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: PlayerRoomStatsCreateOrConnectWithoutRoomInput | PlayerRoomStatsCreateOrConnectWithoutRoomInput[]
    createMany?: PlayerRoomStatsCreateManyRoomInputEnvelope
    connect?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumRoomStatusFieldUpdateOperationsInput = {
    set?: $Enums.RoomStatus
  }

  export type UserUpdateOneRequiredWithoutCreatedRoomsNestedInput = {
    create?: XOR<UserCreateWithoutCreatedRoomsInput, UserUncheckedCreateWithoutCreatedRoomsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCreatedRoomsInput
    upsert?: UserUpsertWithoutCreatedRoomsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCreatedRoomsInput, UserUpdateWithoutCreatedRoomsInput>, UserUncheckedUpdateWithoutCreatedRoomsInput>
  }

  export type PlayerUpdateManyWithoutRoomNestedInput = {
    create?: XOR<PlayerCreateWithoutRoomInput, PlayerUncheckedCreateWithoutRoomInput> | PlayerCreateWithoutRoomInput[] | PlayerUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutRoomInput | PlayerCreateOrConnectWithoutRoomInput[]
    upsert?: PlayerUpsertWithWhereUniqueWithoutRoomInput | PlayerUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: PlayerCreateManyRoomInputEnvelope
    set?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    disconnect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    delete?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    update?: PlayerUpdateWithWhereUniqueWithoutRoomInput | PlayerUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: PlayerUpdateManyWithWhereWithoutRoomInput | PlayerUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
  }

  export type GameUpdateManyWithoutRoomNestedInput = {
    create?: XOR<GameCreateWithoutRoomInput, GameUncheckedCreateWithoutRoomInput> | GameCreateWithoutRoomInput[] | GameUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: GameCreateOrConnectWithoutRoomInput | GameCreateOrConnectWithoutRoomInput[]
    upsert?: GameUpsertWithWhereUniqueWithoutRoomInput | GameUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: GameCreateManyRoomInputEnvelope
    set?: GameWhereUniqueInput | GameWhereUniqueInput[]
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[]
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    update?: GameUpdateWithWhereUniqueWithoutRoomInput | GameUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: GameUpdateManyWithWhereWithoutRoomInput | GameUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[]
  }

  export type RoomStatsUpdateOneWithoutRoomNestedInput = {
    create?: XOR<RoomStatsCreateWithoutRoomInput, RoomStatsUncheckedCreateWithoutRoomInput>
    connectOrCreate?: RoomStatsCreateOrConnectWithoutRoomInput
    upsert?: RoomStatsUpsertWithoutRoomInput
    disconnect?: RoomStatsWhereInput | boolean
    delete?: RoomStatsWhereInput | boolean
    connect?: RoomStatsWhereUniqueInput
    update?: XOR<XOR<RoomStatsUpdateToOneWithWhereWithoutRoomInput, RoomStatsUpdateWithoutRoomInput>, RoomStatsUncheckedUpdateWithoutRoomInput>
  }

  export type PlayerRoomStatsUpdateManyWithoutRoomNestedInput = {
    create?: XOR<PlayerRoomStatsCreateWithoutRoomInput, PlayerRoomStatsUncheckedCreateWithoutRoomInput> | PlayerRoomStatsCreateWithoutRoomInput[] | PlayerRoomStatsUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: PlayerRoomStatsCreateOrConnectWithoutRoomInput | PlayerRoomStatsCreateOrConnectWithoutRoomInput[]
    upsert?: PlayerRoomStatsUpsertWithWhereUniqueWithoutRoomInput | PlayerRoomStatsUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: PlayerRoomStatsCreateManyRoomInputEnvelope
    set?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
    disconnect?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
    delete?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
    connect?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
    update?: PlayerRoomStatsUpdateWithWhereUniqueWithoutRoomInput | PlayerRoomStatsUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: PlayerRoomStatsUpdateManyWithWhereWithoutRoomInput | PlayerRoomStatsUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: PlayerRoomStatsScalarWhereInput | PlayerRoomStatsScalarWhereInput[]
  }

  export type PlayerUncheckedUpdateManyWithoutRoomNestedInput = {
    create?: XOR<PlayerCreateWithoutRoomInput, PlayerUncheckedCreateWithoutRoomInput> | PlayerCreateWithoutRoomInput[] | PlayerUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutRoomInput | PlayerCreateOrConnectWithoutRoomInput[]
    upsert?: PlayerUpsertWithWhereUniqueWithoutRoomInput | PlayerUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: PlayerCreateManyRoomInputEnvelope
    set?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    disconnect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    delete?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    update?: PlayerUpdateWithWhereUniqueWithoutRoomInput | PlayerUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: PlayerUpdateManyWithWhereWithoutRoomInput | PlayerUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
  }

  export type GameUncheckedUpdateManyWithoutRoomNestedInput = {
    create?: XOR<GameCreateWithoutRoomInput, GameUncheckedCreateWithoutRoomInput> | GameCreateWithoutRoomInput[] | GameUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: GameCreateOrConnectWithoutRoomInput | GameCreateOrConnectWithoutRoomInput[]
    upsert?: GameUpsertWithWhereUniqueWithoutRoomInput | GameUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: GameCreateManyRoomInputEnvelope
    set?: GameWhereUniqueInput | GameWhereUniqueInput[]
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[]
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    update?: GameUpdateWithWhereUniqueWithoutRoomInput | GameUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: GameUpdateManyWithWhereWithoutRoomInput | GameUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[]
  }

  export type RoomStatsUncheckedUpdateOneWithoutRoomNestedInput = {
    create?: XOR<RoomStatsCreateWithoutRoomInput, RoomStatsUncheckedCreateWithoutRoomInput>
    connectOrCreate?: RoomStatsCreateOrConnectWithoutRoomInput
    upsert?: RoomStatsUpsertWithoutRoomInput
    disconnect?: RoomStatsWhereInput | boolean
    delete?: RoomStatsWhereInput | boolean
    connect?: RoomStatsWhereUniqueInput
    update?: XOR<XOR<RoomStatsUpdateToOneWithWhereWithoutRoomInput, RoomStatsUpdateWithoutRoomInput>, RoomStatsUncheckedUpdateWithoutRoomInput>
  }

  export type PlayerRoomStatsUncheckedUpdateManyWithoutRoomNestedInput = {
    create?: XOR<PlayerRoomStatsCreateWithoutRoomInput, PlayerRoomStatsUncheckedCreateWithoutRoomInput> | PlayerRoomStatsCreateWithoutRoomInput[] | PlayerRoomStatsUncheckedCreateWithoutRoomInput[]
    connectOrCreate?: PlayerRoomStatsCreateOrConnectWithoutRoomInput | PlayerRoomStatsCreateOrConnectWithoutRoomInput[]
    upsert?: PlayerRoomStatsUpsertWithWhereUniqueWithoutRoomInput | PlayerRoomStatsUpsertWithWhereUniqueWithoutRoomInput[]
    createMany?: PlayerRoomStatsCreateManyRoomInputEnvelope
    set?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
    disconnect?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
    delete?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
    connect?: PlayerRoomStatsWhereUniqueInput | PlayerRoomStatsWhereUniqueInput[]
    update?: PlayerRoomStatsUpdateWithWhereUniqueWithoutRoomInput | PlayerRoomStatsUpdateWithWhereUniqueWithoutRoomInput[]
    updateMany?: PlayerRoomStatsUpdateManyWithWhereWithoutRoomInput | PlayerRoomStatsUpdateManyWithWhereWithoutRoomInput[]
    deleteMany?: PlayerRoomStatsScalarWhereInput | PlayerRoomStatsScalarWhereInput[]
  }

  export type RoomCreateNestedOneWithoutGamesInput = {
    create?: XOR<RoomCreateWithoutGamesInput, RoomUncheckedCreateWithoutGamesInput>
    connectOrCreate?: RoomCreateOrConnectWithoutGamesInput
    connect?: RoomWhereUniqueInput
  }

  export type PlayerCreateNestedManyWithoutGameInput = {
    create?: XOR<PlayerCreateWithoutGameInput, PlayerUncheckedCreateWithoutGameInput> | PlayerCreateWithoutGameInput[] | PlayerUncheckedCreateWithoutGameInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutGameInput | PlayerCreateOrConnectWithoutGameInput[]
    createMany?: PlayerCreateManyGameInputEnvelope
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
  }

  export type PlayerCreateNestedOneWithoutWonGamesInput = {
    create?: XOR<PlayerCreateWithoutWonGamesInput, PlayerUncheckedCreateWithoutWonGamesInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutWonGamesInput
    connect?: PlayerWhereUniqueInput
  }

  export type PlayerUncheckedCreateNestedManyWithoutGameInput = {
    create?: XOR<PlayerCreateWithoutGameInput, PlayerUncheckedCreateWithoutGameInput> | PlayerCreateWithoutGameInput[] | PlayerUncheckedCreateWithoutGameInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutGameInput | PlayerCreateOrConnectWithoutGameInput[]
    createMany?: PlayerCreateManyGameInputEnvelope
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
  }

  export type EnumGameStatusFieldUpdateOperationsInput = {
    set?: $Enums.GameStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type RoomUpdateOneRequiredWithoutGamesNestedInput = {
    create?: XOR<RoomCreateWithoutGamesInput, RoomUncheckedCreateWithoutGamesInput>
    connectOrCreate?: RoomCreateOrConnectWithoutGamesInput
    upsert?: RoomUpsertWithoutGamesInput
    connect?: RoomWhereUniqueInput
    update?: XOR<XOR<RoomUpdateToOneWithWhereWithoutGamesInput, RoomUpdateWithoutGamesInput>, RoomUncheckedUpdateWithoutGamesInput>
  }

  export type PlayerUpdateManyWithoutGameNestedInput = {
    create?: XOR<PlayerCreateWithoutGameInput, PlayerUncheckedCreateWithoutGameInput> | PlayerCreateWithoutGameInput[] | PlayerUncheckedCreateWithoutGameInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutGameInput | PlayerCreateOrConnectWithoutGameInput[]
    upsert?: PlayerUpsertWithWhereUniqueWithoutGameInput | PlayerUpsertWithWhereUniqueWithoutGameInput[]
    createMany?: PlayerCreateManyGameInputEnvelope
    set?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    disconnect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    delete?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    update?: PlayerUpdateWithWhereUniqueWithoutGameInput | PlayerUpdateWithWhereUniqueWithoutGameInput[]
    updateMany?: PlayerUpdateManyWithWhereWithoutGameInput | PlayerUpdateManyWithWhereWithoutGameInput[]
    deleteMany?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
  }

  export type PlayerUpdateOneWithoutWonGamesNestedInput = {
    create?: XOR<PlayerCreateWithoutWonGamesInput, PlayerUncheckedCreateWithoutWonGamesInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutWonGamesInput
    upsert?: PlayerUpsertWithoutWonGamesInput
    disconnect?: PlayerWhereInput | boolean
    delete?: PlayerWhereInput | boolean
    connect?: PlayerWhereUniqueInput
    update?: XOR<XOR<PlayerUpdateToOneWithWhereWithoutWonGamesInput, PlayerUpdateWithoutWonGamesInput>, PlayerUncheckedUpdateWithoutWonGamesInput>
  }

  export type PlayerUncheckedUpdateManyWithoutGameNestedInput = {
    create?: XOR<PlayerCreateWithoutGameInput, PlayerUncheckedCreateWithoutGameInput> | PlayerCreateWithoutGameInput[] | PlayerUncheckedCreateWithoutGameInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutGameInput | PlayerCreateOrConnectWithoutGameInput[]
    upsert?: PlayerUpsertWithWhereUniqueWithoutGameInput | PlayerUpsertWithWhereUniqueWithoutGameInput[]
    createMany?: PlayerCreateManyGameInputEnvelope
    set?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    disconnect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    delete?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    update?: PlayerUpdateWithWhereUniqueWithoutGameInput | PlayerUpdateWithWhereUniqueWithoutGameInput[]
    updateMany?: PlayerUpdateManyWithWhereWithoutGameInput | PlayerUpdateManyWithWhereWithoutGameInput[]
    deleteMany?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutPlayersInput = {
    create?: XOR<UserCreateWithoutPlayersInput, UserUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: UserCreateOrConnectWithoutPlayersInput
    connect?: UserWhereUniqueInput
  }

  export type RoomCreateNestedOneWithoutPlayersInput = {
    create?: XOR<RoomCreateWithoutPlayersInput, RoomUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: RoomCreateOrConnectWithoutPlayersInput
    connect?: RoomWhereUniqueInput
  }

  export type GameCreateNestedOneWithoutPlayersInput = {
    create?: XOR<GameCreateWithoutPlayersInput, GameUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: GameCreateOrConnectWithoutPlayersInput
    connect?: GameWhereUniqueInput
  }

  export type GameCreateNestedManyWithoutWinnerInput = {
    create?: XOR<GameCreateWithoutWinnerInput, GameUncheckedCreateWithoutWinnerInput> | GameCreateWithoutWinnerInput[] | GameUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: GameCreateOrConnectWithoutWinnerInput | GameCreateOrConnectWithoutWinnerInput[]
    createMany?: GameCreateManyWinnerInputEnvelope
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
  }

  export type GameUncheckedCreateNestedManyWithoutWinnerInput = {
    create?: XOR<GameCreateWithoutWinnerInput, GameUncheckedCreateWithoutWinnerInput> | GameCreateWithoutWinnerInput[] | GameUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: GameCreateOrConnectWithoutWinnerInput | GameCreateOrConnectWithoutWinnerInput[]
    createMany?: GameCreateManyWinnerInputEnvelope
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
  }

  export type UserUpdateOneWithoutPlayersNestedInput = {
    create?: XOR<UserCreateWithoutPlayersInput, UserUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: UserCreateOrConnectWithoutPlayersInput
    upsert?: UserUpsertWithoutPlayersInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPlayersInput, UserUpdateWithoutPlayersInput>, UserUncheckedUpdateWithoutPlayersInput>
  }

  export type RoomUpdateOneRequiredWithoutPlayersNestedInput = {
    create?: XOR<RoomCreateWithoutPlayersInput, RoomUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: RoomCreateOrConnectWithoutPlayersInput
    upsert?: RoomUpsertWithoutPlayersInput
    connect?: RoomWhereUniqueInput
    update?: XOR<XOR<RoomUpdateToOneWithWhereWithoutPlayersInput, RoomUpdateWithoutPlayersInput>, RoomUncheckedUpdateWithoutPlayersInput>
  }

  export type GameUpdateOneWithoutPlayersNestedInput = {
    create?: XOR<GameCreateWithoutPlayersInput, GameUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: GameCreateOrConnectWithoutPlayersInput
    upsert?: GameUpsertWithoutPlayersInput
    disconnect?: GameWhereInput | boolean
    delete?: GameWhereInput | boolean
    connect?: GameWhereUniqueInput
    update?: XOR<XOR<GameUpdateToOneWithWhereWithoutPlayersInput, GameUpdateWithoutPlayersInput>, GameUncheckedUpdateWithoutPlayersInput>
  }

  export type GameUpdateManyWithoutWinnerNestedInput = {
    create?: XOR<GameCreateWithoutWinnerInput, GameUncheckedCreateWithoutWinnerInput> | GameCreateWithoutWinnerInput[] | GameUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: GameCreateOrConnectWithoutWinnerInput | GameCreateOrConnectWithoutWinnerInput[]
    upsert?: GameUpsertWithWhereUniqueWithoutWinnerInput | GameUpsertWithWhereUniqueWithoutWinnerInput[]
    createMany?: GameCreateManyWinnerInputEnvelope
    set?: GameWhereUniqueInput | GameWhereUniqueInput[]
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[]
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    update?: GameUpdateWithWhereUniqueWithoutWinnerInput | GameUpdateWithWhereUniqueWithoutWinnerInput[]
    updateMany?: GameUpdateManyWithWhereWithoutWinnerInput | GameUpdateManyWithWhereWithoutWinnerInput[]
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[]
  }

  export type GameUncheckedUpdateManyWithoutWinnerNestedInput = {
    create?: XOR<GameCreateWithoutWinnerInput, GameUncheckedCreateWithoutWinnerInput> | GameCreateWithoutWinnerInput[] | GameUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: GameCreateOrConnectWithoutWinnerInput | GameCreateOrConnectWithoutWinnerInput[]
    upsert?: GameUpsertWithWhereUniqueWithoutWinnerInput | GameUpsertWithWhereUniqueWithoutWinnerInput[]
    createMany?: GameCreateManyWinnerInputEnvelope
    set?: GameWhereUniqueInput | GameWhereUniqueInput[]
    disconnect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    delete?: GameWhereUniqueInput | GameWhereUniqueInput[]
    connect?: GameWhereUniqueInput | GameWhereUniqueInput[]
    update?: GameUpdateWithWhereUniqueWithoutWinnerInput | GameUpdateWithWhereUniqueWithoutWinnerInput[]
    updateMany?: GameUpdateManyWithWhereWithoutWinnerInput | GameUpdateManyWithWhereWithoutWinnerInput[]
    deleteMany?: GameScalarWhereInput | GameScalarWhereInput[]
  }

  export type RoomCreateNestedOneWithoutRoomStatsInput = {
    create?: XOR<RoomCreateWithoutRoomStatsInput, RoomUncheckedCreateWithoutRoomStatsInput>
    connectOrCreate?: RoomCreateOrConnectWithoutRoomStatsInput
    connect?: RoomWhereUniqueInput
  }

  export type RoomUpdateOneRequiredWithoutRoomStatsNestedInput = {
    create?: XOR<RoomCreateWithoutRoomStatsInput, RoomUncheckedCreateWithoutRoomStatsInput>
    connectOrCreate?: RoomCreateOrConnectWithoutRoomStatsInput
    upsert?: RoomUpsertWithoutRoomStatsInput
    connect?: RoomWhereUniqueInput
    update?: XOR<XOR<RoomUpdateToOneWithWhereWithoutRoomStatsInput, RoomUpdateWithoutRoomStatsInput>, RoomUncheckedUpdateWithoutRoomStatsInput>
  }

  export type UserCreateNestedOneWithoutPlayerRoomStatsInput = {
    create?: XOR<UserCreateWithoutPlayerRoomStatsInput, UserUncheckedCreateWithoutPlayerRoomStatsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPlayerRoomStatsInput
    connect?: UserWhereUniqueInput
  }

  export type RoomCreateNestedOneWithoutPlayerRoomStatsInput = {
    create?: XOR<RoomCreateWithoutPlayerRoomStatsInput, RoomUncheckedCreateWithoutPlayerRoomStatsInput>
    connectOrCreate?: RoomCreateOrConnectWithoutPlayerRoomStatsInput
    connect?: RoomWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPlayerRoomStatsNestedInput = {
    create?: XOR<UserCreateWithoutPlayerRoomStatsInput, UserUncheckedCreateWithoutPlayerRoomStatsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPlayerRoomStatsInput
    upsert?: UserUpsertWithoutPlayerRoomStatsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPlayerRoomStatsInput, UserUpdateWithoutPlayerRoomStatsInput>, UserUncheckedUpdateWithoutPlayerRoomStatsInput>
  }

  export type RoomUpdateOneRequiredWithoutPlayerRoomStatsNestedInput = {
    create?: XOR<RoomCreateWithoutPlayerRoomStatsInput, RoomUncheckedCreateWithoutPlayerRoomStatsInput>
    connectOrCreate?: RoomCreateOrConnectWithoutPlayerRoomStatsInput
    upsert?: RoomUpsertWithoutPlayerRoomStatsInput
    connect?: RoomWhereUniqueInput
    update?: XOR<XOR<RoomUpdateToOneWithWhereWithoutPlayerRoomStatsInput, RoomUpdateWithoutPlayerRoomStatsInput>, RoomUncheckedUpdateWithoutPlayerRoomStatsInput>
  }

  export type UserCreateNestedOneWithoutTokenInput = {
    create?: XOR<UserCreateWithoutTokenInput, UserUncheckedCreateWithoutTokenInput>
    connectOrCreate?: UserCreateOrConnectWithoutTokenInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutTokenNestedInput = {
    create?: XOR<UserCreateWithoutTokenInput, UserUncheckedCreateWithoutTokenInput>
    connectOrCreate?: UserCreateOrConnectWithoutTokenInput
    upsert?: UserUpsertWithoutTokenInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTokenInput, UserUpdateWithoutTokenInput>, UserUncheckedUpdateWithoutTokenInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumRoomStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RoomStatus | EnumRoomStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RoomStatus[] | ListEnumRoomStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RoomStatus[] | ListEnumRoomStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRoomStatusFilter<$PrismaModel> | $Enums.RoomStatus
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumRoomStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RoomStatus | EnumRoomStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RoomStatus[] | ListEnumRoomStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RoomStatus[] | ListEnumRoomStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRoomStatusWithAggregatesFilter<$PrismaModel> | $Enums.RoomStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoomStatusFilter<$PrismaModel>
    _max?: NestedEnumRoomStatusFilter<$PrismaModel>
  }

  export type NestedEnumGameStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GameStatus | EnumGameStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGameStatusFilter<$PrismaModel> | $Enums.GameStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumGameStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GameStatus | EnumGameStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGameStatusWithAggregatesFilter<$PrismaModel> | $Enums.GameStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGameStatusFilter<$PrismaModel>
    _max?: NestedEnumGameStatusFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserStatsCreateWithoutUserInput = {
    id?: string
    gamesPlayed?: number
    gamesWon?: number
    totalPenalty?: number
    bestScore?: number | null
    updatedAt?: Date | string
  }

  export type UserStatsUncheckedCreateWithoutUserInput = {
    id?: string
    gamesPlayed?: number
    gamesWon?: number
    totalPenalty?: number
    bestScore?: number | null
    updatedAt?: Date | string
  }

  export type UserStatsCreateOrConnectWithoutUserInput = {
    where: UserStatsWhereUniqueInput
    create: XOR<UserStatsCreateWithoutUserInput, UserStatsUncheckedCreateWithoutUserInput>
  }

  export type RoomCreateWithoutCreatorInput = {
    id?: string
    name: string
    code: string
    maxPlayers?: number
    currentPlayers?: number
    isPrivate?: boolean
    status?: $Enums.RoomStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    password?: string | null
    players?: PlayerCreateNestedManyWithoutRoomInput
    games?: GameCreateNestedManyWithoutRoomInput
    roomStats?: RoomStatsCreateNestedOneWithoutRoomInput
    playerRoomStats?: PlayerRoomStatsCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateWithoutCreatorInput = {
    id?: string
    name: string
    code: string
    maxPlayers?: number
    currentPlayers?: number
    isPrivate?: boolean
    status?: $Enums.RoomStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    password?: string | null
    players?: PlayerUncheckedCreateNestedManyWithoutRoomInput
    games?: GameUncheckedCreateNestedManyWithoutRoomInput
    roomStats?: RoomStatsUncheckedCreateNestedOneWithoutRoomInput
    playerRoomStats?: PlayerRoomStatsUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomCreateOrConnectWithoutCreatorInput = {
    where: RoomWhereUniqueInput
    create: XOR<RoomCreateWithoutCreatorInput, RoomUncheckedCreateWithoutCreatorInput>
  }

  export type RoomCreateManyCreatorInputEnvelope = {
    data: RoomCreateManyCreatorInput | RoomCreateManyCreatorInput[]
    skipDuplicates?: boolean
  }

  export type PlayerCreateWithoutUserInput = {
    id?: string
    isBot?: boolean
    botName?: string | null
    position: number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: boolean
    isReady?: boolean
    isWinner?: boolean
    finalPosition?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    room: RoomCreateNestedOneWithoutPlayersInput
    game?: GameCreateNestedOneWithoutPlayersInput
    wonGames?: GameCreateNestedManyWithoutWinnerInput
  }

  export type PlayerUncheckedCreateWithoutUserInput = {
    id?: string
    roomId: string
    gameId?: string | null
    isBot?: boolean
    botName?: string | null
    position: number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: boolean
    isReady?: boolean
    isWinner?: boolean
    finalPosition?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    wonGames?: GameUncheckedCreateNestedManyWithoutWinnerInput
  }

  export type PlayerCreateOrConnectWithoutUserInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutUserInput, PlayerUncheckedCreateWithoutUserInput>
  }

  export type PlayerCreateManyUserInputEnvelope = {
    data: PlayerCreateManyUserInput | PlayerCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PlayerRoomStatsCreateWithoutUserInput = {
    id?: string
    gamesPlayed?: number
    gamesWon?: number
    totalPenalty?: number
    bestScore?: number | null
    lastPlayedAt?: Date | string
    updatedAt?: Date | string
    room: RoomCreateNestedOneWithoutPlayerRoomStatsInput
  }

  export type PlayerRoomStatsUncheckedCreateWithoutUserInput = {
    id?: string
    roomId: string
    gamesPlayed?: number
    gamesWon?: number
    totalPenalty?: number
    bestScore?: number | null
    lastPlayedAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlayerRoomStatsCreateOrConnectWithoutUserInput = {
    where: PlayerRoomStatsWhereUniqueInput
    create: XOR<PlayerRoomStatsCreateWithoutUserInput, PlayerRoomStatsUncheckedCreateWithoutUserInput>
  }

  export type PlayerRoomStatsCreateManyUserInputEnvelope = {
    data: PlayerRoomStatsCreateManyUserInput | PlayerRoomStatsCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TokenCreateWithoutUserInput = {
    id?: string
    refreshToken: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TokenUncheckedCreateWithoutUserInput = {
    id?: string
    refreshToken: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TokenCreateOrConnectWithoutUserInput = {
    where: TokenWhereUniqueInput
    create: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput>
  }

  export type UserStatsUpsertWithoutUserInput = {
    update: XOR<UserStatsUpdateWithoutUserInput, UserStatsUncheckedUpdateWithoutUserInput>
    create: XOR<UserStatsCreateWithoutUserInput, UserStatsUncheckedCreateWithoutUserInput>
    where?: UserStatsWhereInput
  }

  export type UserStatsUpdateToOneWithWhereWithoutUserInput = {
    where?: UserStatsWhereInput
    data: XOR<UserStatsUpdateWithoutUserInput, UserStatsUncheckedUpdateWithoutUserInput>
  }

  export type UserStatsUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    totalPenalty?: IntFieldUpdateOperationsInput | number
    bestScore?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserStatsUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    totalPenalty?: IntFieldUpdateOperationsInput | number
    bestScore?: NullableIntFieldUpdateOperationsInput | number | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomUpsertWithWhereUniqueWithoutCreatorInput = {
    where: RoomWhereUniqueInput
    update: XOR<RoomUpdateWithoutCreatorInput, RoomUncheckedUpdateWithoutCreatorInput>
    create: XOR<RoomCreateWithoutCreatorInput, RoomUncheckedCreateWithoutCreatorInput>
  }

  export type RoomUpdateWithWhereUniqueWithoutCreatorInput = {
    where: RoomWhereUniqueInput
    data: XOR<RoomUpdateWithoutCreatorInput, RoomUncheckedUpdateWithoutCreatorInput>
  }

  export type RoomUpdateManyWithWhereWithoutCreatorInput = {
    where: RoomScalarWhereInput
    data: XOR<RoomUpdateManyMutationInput, RoomUncheckedUpdateManyWithoutCreatorInput>
  }

  export type RoomScalarWhereInput = {
    AND?: RoomScalarWhereInput | RoomScalarWhereInput[]
    OR?: RoomScalarWhereInput[]
    NOT?: RoomScalarWhereInput | RoomScalarWhereInput[]
    id?: StringFilter<"Room"> | string
    name?: StringFilter<"Room"> | string
    code?: StringFilter<"Room"> | string
    maxPlayers?: IntFilter<"Room"> | number
    currentPlayers?: IntFilter<"Room"> | number
    isPrivate?: BoolFilter<"Room"> | boolean
    status?: EnumRoomStatusFilter<"Room"> | $Enums.RoomStatus
    createdAt?: DateTimeFilter<"Room"> | Date | string
    updatedAt?: DateTimeFilter<"Room"> | Date | string
    creatorId?: StringFilter<"Room"> | string
    password?: StringNullableFilter<"Room"> | string | null
  }

  export type PlayerUpsertWithWhereUniqueWithoutUserInput = {
    where: PlayerWhereUniqueInput
    update: XOR<PlayerUpdateWithoutUserInput, PlayerUncheckedUpdateWithoutUserInput>
    create: XOR<PlayerCreateWithoutUserInput, PlayerUncheckedCreateWithoutUserInput>
  }

  export type PlayerUpdateWithWhereUniqueWithoutUserInput = {
    where: PlayerWhereUniqueInput
    data: XOR<PlayerUpdateWithoutUserInput, PlayerUncheckedUpdateWithoutUserInput>
  }

  export type PlayerUpdateManyWithWhereWithoutUserInput = {
    where: PlayerScalarWhereInput
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyWithoutUserInput>
  }

  export type PlayerScalarWhereInput = {
    AND?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
    OR?: PlayerScalarWhereInput[]
    NOT?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
    id?: StringFilter<"Player"> | string
    userId?: StringNullableFilter<"Player"> | string | null
    roomId?: StringFilter<"Player"> | string
    gameId?: StringNullableFilter<"Player"> | string | null
    isBot?: BoolFilter<"Player"> | boolean
    botName?: StringNullableFilter<"Player"> | string | null
    position?: IntFilter<"Player"> | number
    hand?: JsonFilter<"Player">
    penaltyCard?: JsonFilter<"Player">
    totalPenalty?: IntFilter<"Player"> | number
    roundPenaltyCard?: JsonFilter<"Player">
    roundPenalty?: IntFilter<"Player"> | number
    selectedCard?: JsonNullableFilter<"Player">
    isSelectedCardConfirmed?: BoolFilter<"Player"> | boolean
    isReady?: BoolFilter<"Player"> | boolean
    isWinner?: BoolFilter<"Player"> | boolean
    finalPosition?: IntNullableFilter<"Player"> | number | null
    createdAt?: DateTimeFilter<"Player"> | Date | string
    updatedAt?: DateTimeFilter<"Player"> | Date | string
  }

  export type PlayerRoomStatsUpsertWithWhereUniqueWithoutUserInput = {
    where: PlayerRoomStatsWhereUniqueInput
    update: XOR<PlayerRoomStatsUpdateWithoutUserInput, PlayerRoomStatsUncheckedUpdateWithoutUserInput>
    create: XOR<PlayerRoomStatsCreateWithoutUserInput, PlayerRoomStatsUncheckedCreateWithoutUserInput>
  }

  export type PlayerRoomStatsUpdateWithWhereUniqueWithoutUserInput = {
    where: PlayerRoomStatsWhereUniqueInput
    data: XOR<PlayerRoomStatsUpdateWithoutUserInput, PlayerRoomStatsUncheckedUpdateWithoutUserInput>
  }

  export type PlayerRoomStatsUpdateManyWithWhereWithoutUserInput = {
    where: PlayerRoomStatsScalarWhereInput
    data: XOR<PlayerRoomStatsUpdateManyMutationInput, PlayerRoomStatsUncheckedUpdateManyWithoutUserInput>
  }

  export type PlayerRoomStatsScalarWhereInput = {
    AND?: PlayerRoomStatsScalarWhereInput | PlayerRoomStatsScalarWhereInput[]
    OR?: PlayerRoomStatsScalarWhereInput[]
    NOT?: PlayerRoomStatsScalarWhereInput | PlayerRoomStatsScalarWhereInput[]
    id?: StringFilter<"PlayerRoomStats"> | string
    userId?: StringFilter<"PlayerRoomStats"> | string
    roomId?: StringFilter<"PlayerRoomStats"> | string
    gamesPlayed?: IntFilter<"PlayerRoomStats"> | number
    gamesWon?: IntFilter<"PlayerRoomStats"> | number
    totalPenalty?: IntFilter<"PlayerRoomStats"> | number
    bestScore?: IntNullableFilter<"PlayerRoomStats"> | number | null
    lastPlayedAt?: DateTimeFilter<"PlayerRoomStats"> | Date | string
    updatedAt?: DateTimeFilter<"PlayerRoomStats"> | Date | string
  }

  export type TokenUpsertWithoutUserInput = {
    update: XOR<TokenUpdateWithoutUserInput, TokenUncheckedUpdateWithoutUserInput>
    create: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput>
    where?: TokenWhereInput
  }

  export type TokenUpdateToOneWithWhereWithoutUserInput = {
    where?: TokenWhereInput
    data: XOR<TokenUpdateWithoutUserInput, TokenUncheckedUpdateWithoutUserInput>
  }

  export type TokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    refreshToken?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutUserStatsInput = {
    id?: string
    username: string
    password: string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    surname?: string | null
    email?: string | null
    createdRooms?: RoomCreateNestedManyWithoutCreatorInput
    players?: PlayerCreateNestedManyWithoutUserInput
    playerRoomStats?: PlayerRoomStatsCreateNestedManyWithoutUserInput
    token?: TokenCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUserStatsInput = {
    id?: string
    username: string
    password: string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    surname?: string | null
    email?: string | null
    createdRooms?: RoomUncheckedCreateNestedManyWithoutCreatorInput
    players?: PlayerUncheckedCreateNestedManyWithoutUserInput
    playerRoomStats?: PlayerRoomStatsUncheckedCreateNestedManyWithoutUserInput
    token?: TokenUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUserStatsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUserStatsInput, UserUncheckedCreateWithoutUserStatsInput>
  }

  export type UserUpsertWithoutUserStatsInput = {
    update: XOR<UserUpdateWithoutUserStatsInput, UserUncheckedUpdateWithoutUserStatsInput>
    create: XOR<UserCreateWithoutUserStatsInput, UserUncheckedCreateWithoutUserStatsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUserStatsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUserStatsInput, UserUncheckedUpdateWithoutUserStatsInput>
  }

  export type UserUpdateWithoutUserStatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    surname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdRooms?: RoomUpdateManyWithoutCreatorNestedInput
    players?: PlayerUpdateManyWithoutUserNestedInput
    playerRoomStats?: PlayerRoomStatsUpdateManyWithoutUserNestedInput
    token?: TokenUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUserStatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    surname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdRooms?: RoomUncheckedUpdateManyWithoutCreatorNestedInput
    players?: PlayerUncheckedUpdateManyWithoutUserNestedInput
    playerRoomStats?: PlayerRoomStatsUncheckedUpdateManyWithoutUserNestedInput
    token?: TokenUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutCreatedRoomsInput = {
    id?: string
    username: string
    password: string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    surname?: string | null
    email?: string | null
    userStats?: UserStatsCreateNestedOneWithoutUserInput
    players?: PlayerCreateNestedManyWithoutUserInput
    playerRoomStats?: PlayerRoomStatsCreateNestedManyWithoutUserInput
    token?: TokenCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCreatedRoomsInput = {
    id?: string
    username: string
    password: string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    surname?: string | null
    email?: string | null
    userStats?: UserStatsUncheckedCreateNestedOneWithoutUserInput
    players?: PlayerUncheckedCreateNestedManyWithoutUserInput
    playerRoomStats?: PlayerRoomStatsUncheckedCreateNestedManyWithoutUserInput
    token?: TokenUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCreatedRoomsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCreatedRoomsInput, UserUncheckedCreateWithoutCreatedRoomsInput>
  }

  export type PlayerCreateWithoutRoomInput = {
    id?: string
    isBot?: boolean
    botName?: string | null
    position: number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: boolean
    isReady?: boolean
    isWinner?: boolean
    finalPosition?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutPlayersInput
    game?: GameCreateNestedOneWithoutPlayersInput
    wonGames?: GameCreateNestedManyWithoutWinnerInput
  }

  export type PlayerUncheckedCreateWithoutRoomInput = {
    id?: string
    userId?: string | null
    gameId?: string | null
    isBot?: boolean
    botName?: string | null
    position: number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: boolean
    isReady?: boolean
    isWinner?: boolean
    finalPosition?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    wonGames?: GameUncheckedCreateNestedManyWithoutWinnerInput
  }

  export type PlayerCreateOrConnectWithoutRoomInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutRoomInput, PlayerUncheckedCreateWithoutRoomInput>
  }

  export type PlayerCreateManyRoomInputEnvelope = {
    data: PlayerCreateManyRoomInput | PlayerCreateManyRoomInput[]
    skipDuplicates?: boolean
  }

  export type GameCreateWithoutRoomInput = {
    id?: string
    status?: $Enums.GameStatus
    currentRound?: number
    currentTurn?: number
    rows: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    finishedAt?: Date | string | null
    players?: PlayerCreateNestedManyWithoutGameInput
    winner?: PlayerCreateNestedOneWithoutWonGamesInput
  }

  export type GameUncheckedCreateWithoutRoomInput = {
    id?: string
    status?: $Enums.GameStatus
    currentRound?: number
    currentTurn?: number
    rows: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    finishedAt?: Date | string | null
    winnerId?: string | null
    players?: PlayerUncheckedCreateNestedManyWithoutGameInput
  }

  export type GameCreateOrConnectWithoutRoomInput = {
    where: GameWhereUniqueInput
    create: XOR<GameCreateWithoutRoomInput, GameUncheckedCreateWithoutRoomInput>
  }

  export type GameCreateManyRoomInputEnvelope = {
    data: GameCreateManyRoomInput | GameCreateManyRoomInput[]
    skipDuplicates?: boolean
  }

  export type RoomStatsCreateWithoutRoomInput = {
    id?: string
    totalGames?: number
    completedGames?: number
    updatedAt?: Date | string
  }

  export type RoomStatsUncheckedCreateWithoutRoomInput = {
    id?: string
    totalGames?: number
    completedGames?: number
    updatedAt?: Date | string
  }

  export type RoomStatsCreateOrConnectWithoutRoomInput = {
    where: RoomStatsWhereUniqueInput
    create: XOR<RoomStatsCreateWithoutRoomInput, RoomStatsUncheckedCreateWithoutRoomInput>
  }

  export type PlayerRoomStatsCreateWithoutRoomInput = {
    id?: string
    gamesPlayed?: number
    gamesWon?: number
    totalPenalty?: number
    bestScore?: number | null
    lastPlayedAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPlayerRoomStatsInput
  }

  export type PlayerRoomStatsUncheckedCreateWithoutRoomInput = {
    id?: string
    userId: string
    gamesPlayed?: number
    gamesWon?: number
    totalPenalty?: number
    bestScore?: number | null
    lastPlayedAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlayerRoomStatsCreateOrConnectWithoutRoomInput = {
    where: PlayerRoomStatsWhereUniqueInput
    create: XOR<PlayerRoomStatsCreateWithoutRoomInput, PlayerRoomStatsUncheckedCreateWithoutRoomInput>
  }

  export type PlayerRoomStatsCreateManyRoomInputEnvelope = {
    data: PlayerRoomStatsCreateManyRoomInput | PlayerRoomStatsCreateManyRoomInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutCreatedRoomsInput = {
    update: XOR<UserUpdateWithoutCreatedRoomsInput, UserUncheckedUpdateWithoutCreatedRoomsInput>
    create: XOR<UserCreateWithoutCreatedRoomsInput, UserUncheckedCreateWithoutCreatedRoomsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCreatedRoomsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCreatedRoomsInput, UserUncheckedUpdateWithoutCreatedRoomsInput>
  }

  export type UserUpdateWithoutCreatedRoomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    surname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    userStats?: UserStatsUpdateOneWithoutUserNestedInput
    players?: PlayerUpdateManyWithoutUserNestedInput
    playerRoomStats?: PlayerRoomStatsUpdateManyWithoutUserNestedInput
    token?: TokenUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCreatedRoomsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    surname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    userStats?: UserStatsUncheckedUpdateOneWithoutUserNestedInput
    players?: PlayerUncheckedUpdateManyWithoutUserNestedInput
    playerRoomStats?: PlayerRoomStatsUncheckedUpdateManyWithoutUserNestedInput
    token?: TokenUncheckedUpdateOneWithoutUserNestedInput
  }

  export type PlayerUpsertWithWhereUniqueWithoutRoomInput = {
    where: PlayerWhereUniqueInput
    update: XOR<PlayerUpdateWithoutRoomInput, PlayerUncheckedUpdateWithoutRoomInput>
    create: XOR<PlayerCreateWithoutRoomInput, PlayerUncheckedCreateWithoutRoomInput>
  }

  export type PlayerUpdateWithWhereUniqueWithoutRoomInput = {
    where: PlayerWhereUniqueInput
    data: XOR<PlayerUpdateWithoutRoomInput, PlayerUncheckedUpdateWithoutRoomInput>
  }

  export type PlayerUpdateManyWithWhereWithoutRoomInput = {
    where: PlayerScalarWhereInput
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyWithoutRoomInput>
  }

  export type GameUpsertWithWhereUniqueWithoutRoomInput = {
    where: GameWhereUniqueInput
    update: XOR<GameUpdateWithoutRoomInput, GameUncheckedUpdateWithoutRoomInput>
    create: XOR<GameCreateWithoutRoomInput, GameUncheckedCreateWithoutRoomInput>
  }

  export type GameUpdateWithWhereUniqueWithoutRoomInput = {
    where: GameWhereUniqueInput
    data: XOR<GameUpdateWithoutRoomInput, GameUncheckedUpdateWithoutRoomInput>
  }

  export type GameUpdateManyWithWhereWithoutRoomInput = {
    where: GameScalarWhereInput
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyWithoutRoomInput>
  }

  export type GameScalarWhereInput = {
    AND?: GameScalarWhereInput | GameScalarWhereInput[]
    OR?: GameScalarWhereInput[]
    NOT?: GameScalarWhereInput | GameScalarWhereInput[]
    id?: StringFilter<"Game"> | string
    roomId?: StringFilter<"Game"> | string
    status?: EnumGameStatusFilter<"Game"> | $Enums.GameStatus
    currentRound?: IntFilter<"Game"> | number
    currentTurn?: IntFilter<"Game"> | number
    rows?: JsonFilter<"Game">
    currentTurnCards?: JsonFilter<"Game">
    history?: JsonFilter<"Game">
    startedAt?: DateTimeFilter<"Game"> | Date | string
    finishedAt?: DateTimeNullableFilter<"Game"> | Date | string | null
    winnerId?: StringNullableFilter<"Game"> | string | null
  }

  export type RoomStatsUpsertWithoutRoomInput = {
    update: XOR<RoomStatsUpdateWithoutRoomInput, RoomStatsUncheckedUpdateWithoutRoomInput>
    create: XOR<RoomStatsCreateWithoutRoomInput, RoomStatsUncheckedCreateWithoutRoomInput>
    where?: RoomStatsWhereInput
  }

  export type RoomStatsUpdateToOneWithWhereWithoutRoomInput = {
    where?: RoomStatsWhereInput
    data: XOR<RoomStatsUpdateWithoutRoomInput, RoomStatsUncheckedUpdateWithoutRoomInput>
  }

  export type RoomStatsUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalGames?: IntFieldUpdateOperationsInput | number
    completedGames?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoomStatsUncheckedUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    totalGames?: IntFieldUpdateOperationsInput | number
    completedGames?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerRoomStatsUpsertWithWhereUniqueWithoutRoomInput = {
    where: PlayerRoomStatsWhereUniqueInput
    update: XOR<PlayerRoomStatsUpdateWithoutRoomInput, PlayerRoomStatsUncheckedUpdateWithoutRoomInput>
    create: XOR<PlayerRoomStatsCreateWithoutRoomInput, PlayerRoomStatsUncheckedCreateWithoutRoomInput>
  }

  export type PlayerRoomStatsUpdateWithWhereUniqueWithoutRoomInput = {
    where: PlayerRoomStatsWhereUniqueInput
    data: XOR<PlayerRoomStatsUpdateWithoutRoomInput, PlayerRoomStatsUncheckedUpdateWithoutRoomInput>
  }

  export type PlayerRoomStatsUpdateManyWithWhereWithoutRoomInput = {
    where: PlayerRoomStatsScalarWhereInput
    data: XOR<PlayerRoomStatsUpdateManyMutationInput, PlayerRoomStatsUncheckedUpdateManyWithoutRoomInput>
  }

  export type RoomCreateWithoutGamesInput = {
    id?: string
    name: string
    code: string
    maxPlayers?: number
    currentPlayers?: number
    isPrivate?: boolean
    status?: $Enums.RoomStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    password?: string | null
    creator: UserCreateNestedOneWithoutCreatedRoomsInput
    players?: PlayerCreateNestedManyWithoutRoomInput
    roomStats?: RoomStatsCreateNestedOneWithoutRoomInput
    playerRoomStats?: PlayerRoomStatsCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateWithoutGamesInput = {
    id?: string
    name: string
    code: string
    maxPlayers?: number
    currentPlayers?: number
    isPrivate?: boolean
    status?: $Enums.RoomStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    creatorId: string
    password?: string | null
    players?: PlayerUncheckedCreateNestedManyWithoutRoomInput
    roomStats?: RoomStatsUncheckedCreateNestedOneWithoutRoomInput
    playerRoomStats?: PlayerRoomStatsUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomCreateOrConnectWithoutGamesInput = {
    where: RoomWhereUniqueInput
    create: XOR<RoomCreateWithoutGamesInput, RoomUncheckedCreateWithoutGamesInput>
  }

  export type PlayerCreateWithoutGameInput = {
    id?: string
    isBot?: boolean
    botName?: string | null
    position: number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: boolean
    isReady?: boolean
    isWinner?: boolean
    finalPosition?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutPlayersInput
    room: RoomCreateNestedOneWithoutPlayersInput
    wonGames?: GameCreateNestedManyWithoutWinnerInput
  }

  export type PlayerUncheckedCreateWithoutGameInput = {
    id?: string
    userId?: string | null
    roomId: string
    isBot?: boolean
    botName?: string | null
    position: number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: boolean
    isReady?: boolean
    isWinner?: boolean
    finalPosition?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    wonGames?: GameUncheckedCreateNestedManyWithoutWinnerInput
  }

  export type PlayerCreateOrConnectWithoutGameInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutGameInput, PlayerUncheckedCreateWithoutGameInput>
  }

  export type PlayerCreateManyGameInputEnvelope = {
    data: PlayerCreateManyGameInput | PlayerCreateManyGameInput[]
    skipDuplicates?: boolean
  }

  export type PlayerCreateWithoutWonGamesInput = {
    id?: string
    isBot?: boolean
    botName?: string | null
    position: number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: boolean
    isReady?: boolean
    isWinner?: boolean
    finalPosition?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutPlayersInput
    room: RoomCreateNestedOneWithoutPlayersInput
    game?: GameCreateNestedOneWithoutPlayersInput
  }

  export type PlayerUncheckedCreateWithoutWonGamesInput = {
    id?: string
    userId?: string | null
    roomId: string
    gameId?: string | null
    isBot?: boolean
    botName?: string | null
    position: number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: boolean
    isReady?: boolean
    isWinner?: boolean
    finalPosition?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlayerCreateOrConnectWithoutWonGamesInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutWonGamesInput, PlayerUncheckedCreateWithoutWonGamesInput>
  }

  export type RoomUpsertWithoutGamesInput = {
    update: XOR<RoomUpdateWithoutGamesInput, RoomUncheckedUpdateWithoutGamesInput>
    create: XOR<RoomCreateWithoutGamesInput, RoomUncheckedCreateWithoutGamesInput>
    where?: RoomWhereInput
  }

  export type RoomUpdateToOneWithWhereWithoutGamesInput = {
    where?: RoomWhereInput
    data: XOR<RoomUpdateWithoutGamesInput, RoomUncheckedUpdateWithoutGamesInput>
  }

  export type RoomUpdateWithoutGamesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentPlayers?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumRoomStatusFieldUpdateOperationsInput | $Enums.RoomStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    creator?: UserUpdateOneRequiredWithoutCreatedRoomsNestedInput
    players?: PlayerUpdateManyWithoutRoomNestedInput
    roomStats?: RoomStatsUpdateOneWithoutRoomNestedInput
    playerRoomStats?: PlayerRoomStatsUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateWithoutGamesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentPlayers?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumRoomStatusFieldUpdateOperationsInput | $Enums.RoomStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creatorId?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    players?: PlayerUncheckedUpdateManyWithoutRoomNestedInput
    roomStats?: RoomStatsUncheckedUpdateOneWithoutRoomNestedInput
    playerRoomStats?: PlayerRoomStatsUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type PlayerUpsertWithWhereUniqueWithoutGameInput = {
    where: PlayerWhereUniqueInput
    update: XOR<PlayerUpdateWithoutGameInput, PlayerUncheckedUpdateWithoutGameInput>
    create: XOR<PlayerCreateWithoutGameInput, PlayerUncheckedCreateWithoutGameInput>
  }

  export type PlayerUpdateWithWhereUniqueWithoutGameInput = {
    where: PlayerWhereUniqueInput
    data: XOR<PlayerUpdateWithoutGameInput, PlayerUncheckedUpdateWithoutGameInput>
  }

  export type PlayerUpdateManyWithWhereWithoutGameInput = {
    where: PlayerScalarWhereInput
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyWithoutGameInput>
  }

  export type PlayerUpsertWithoutWonGamesInput = {
    update: XOR<PlayerUpdateWithoutWonGamesInput, PlayerUncheckedUpdateWithoutWonGamesInput>
    create: XOR<PlayerCreateWithoutWonGamesInput, PlayerUncheckedCreateWithoutWonGamesInput>
    where?: PlayerWhereInput
  }

  export type PlayerUpdateToOneWithWhereWithoutWonGamesInput = {
    where?: PlayerWhereInput
    data: XOR<PlayerUpdateWithoutWonGamesInput, PlayerUncheckedUpdateWithoutWonGamesInput>
  }

  export type PlayerUpdateWithoutWonGamesInput = {
    id?: StringFieldUpdateOperationsInput | string
    isBot?: BoolFieldUpdateOperationsInput | boolean
    botName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: IntFieldUpdateOperationsInput | number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: IntFieldUpdateOperationsInput | number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isWinner?: BoolFieldUpdateOperationsInput | boolean
    finalPosition?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutPlayersNestedInput
    room?: RoomUpdateOneRequiredWithoutPlayersNestedInput
    game?: GameUpdateOneWithoutPlayersNestedInput
  }

  export type PlayerUncheckedUpdateWithoutWonGamesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    roomId?: StringFieldUpdateOperationsInput | string
    gameId?: NullableStringFieldUpdateOperationsInput | string | null
    isBot?: BoolFieldUpdateOperationsInput | boolean
    botName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: IntFieldUpdateOperationsInput | number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: IntFieldUpdateOperationsInput | number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isWinner?: BoolFieldUpdateOperationsInput | boolean
    finalPosition?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutPlayersInput = {
    id?: string
    username: string
    password: string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    surname?: string | null
    email?: string | null
    userStats?: UserStatsCreateNestedOneWithoutUserInput
    createdRooms?: RoomCreateNestedManyWithoutCreatorInput
    playerRoomStats?: PlayerRoomStatsCreateNestedManyWithoutUserInput
    token?: TokenCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPlayersInput = {
    id?: string
    username: string
    password: string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    surname?: string | null
    email?: string | null
    userStats?: UserStatsUncheckedCreateNestedOneWithoutUserInput
    createdRooms?: RoomUncheckedCreateNestedManyWithoutCreatorInput
    playerRoomStats?: PlayerRoomStatsUncheckedCreateNestedManyWithoutUserInput
    token?: TokenUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPlayersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPlayersInput, UserUncheckedCreateWithoutPlayersInput>
  }

  export type RoomCreateWithoutPlayersInput = {
    id?: string
    name: string
    code: string
    maxPlayers?: number
    currentPlayers?: number
    isPrivate?: boolean
    status?: $Enums.RoomStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    password?: string | null
    creator: UserCreateNestedOneWithoutCreatedRoomsInput
    games?: GameCreateNestedManyWithoutRoomInput
    roomStats?: RoomStatsCreateNestedOneWithoutRoomInput
    playerRoomStats?: PlayerRoomStatsCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateWithoutPlayersInput = {
    id?: string
    name: string
    code: string
    maxPlayers?: number
    currentPlayers?: number
    isPrivate?: boolean
    status?: $Enums.RoomStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    creatorId: string
    password?: string | null
    games?: GameUncheckedCreateNestedManyWithoutRoomInput
    roomStats?: RoomStatsUncheckedCreateNestedOneWithoutRoomInput
    playerRoomStats?: PlayerRoomStatsUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomCreateOrConnectWithoutPlayersInput = {
    where: RoomWhereUniqueInput
    create: XOR<RoomCreateWithoutPlayersInput, RoomUncheckedCreateWithoutPlayersInput>
  }

  export type GameCreateWithoutPlayersInput = {
    id?: string
    status?: $Enums.GameStatus
    currentRound?: number
    currentTurn?: number
    rows: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    finishedAt?: Date | string | null
    room: RoomCreateNestedOneWithoutGamesInput
    winner?: PlayerCreateNestedOneWithoutWonGamesInput
  }

  export type GameUncheckedCreateWithoutPlayersInput = {
    id?: string
    roomId: string
    status?: $Enums.GameStatus
    currentRound?: number
    currentTurn?: number
    rows: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    finishedAt?: Date | string | null
    winnerId?: string | null
  }

  export type GameCreateOrConnectWithoutPlayersInput = {
    where: GameWhereUniqueInput
    create: XOR<GameCreateWithoutPlayersInput, GameUncheckedCreateWithoutPlayersInput>
  }

  export type GameCreateWithoutWinnerInput = {
    id?: string
    status?: $Enums.GameStatus
    currentRound?: number
    currentTurn?: number
    rows: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    finishedAt?: Date | string | null
    room: RoomCreateNestedOneWithoutGamesInput
    players?: PlayerCreateNestedManyWithoutGameInput
  }

  export type GameUncheckedCreateWithoutWinnerInput = {
    id?: string
    roomId: string
    status?: $Enums.GameStatus
    currentRound?: number
    currentTurn?: number
    rows: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    finishedAt?: Date | string | null
    players?: PlayerUncheckedCreateNestedManyWithoutGameInput
  }

  export type GameCreateOrConnectWithoutWinnerInput = {
    where: GameWhereUniqueInput
    create: XOR<GameCreateWithoutWinnerInput, GameUncheckedCreateWithoutWinnerInput>
  }

  export type GameCreateManyWinnerInputEnvelope = {
    data: GameCreateManyWinnerInput | GameCreateManyWinnerInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutPlayersInput = {
    update: XOR<UserUpdateWithoutPlayersInput, UserUncheckedUpdateWithoutPlayersInput>
    create: XOR<UserCreateWithoutPlayersInput, UserUncheckedCreateWithoutPlayersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPlayersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPlayersInput, UserUncheckedUpdateWithoutPlayersInput>
  }

  export type UserUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    surname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    userStats?: UserStatsUpdateOneWithoutUserNestedInput
    createdRooms?: RoomUpdateManyWithoutCreatorNestedInput
    playerRoomStats?: PlayerRoomStatsUpdateManyWithoutUserNestedInput
    token?: TokenUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    surname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    userStats?: UserStatsUncheckedUpdateOneWithoutUserNestedInput
    createdRooms?: RoomUncheckedUpdateManyWithoutCreatorNestedInput
    playerRoomStats?: PlayerRoomStatsUncheckedUpdateManyWithoutUserNestedInput
    token?: TokenUncheckedUpdateOneWithoutUserNestedInput
  }

  export type RoomUpsertWithoutPlayersInput = {
    update: XOR<RoomUpdateWithoutPlayersInput, RoomUncheckedUpdateWithoutPlayersInput>
    create: XOR<RoomCreateWithoutPlayersInput, RoomUncheckedCreateWithoutPlayersInput>
    where?: RoomWhereInput
  }

  export type RoomUpdateToOneWithWhereWithoutPlayersInput = {
    where?: RoomWhereInput
    data: XOR<RoomUpdateWithoutPlayersInput, RoomUncheckedUpdateWithoutPlayersInput>
  }

  export type RoomUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentPlayers?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumRoomStatusFieldUpdateOperationsInput | $Enums.RoomStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    creator?: UserUpdateOneRequiredWithoutCreatedRoomsNestedInput
    games?: GameUpdateManyWithoutRoomNestedInput
    roomStats?: RoomStatsUpdateOneWithoutRoomNestedInput
    playerRoomStats?: PlayerRoomStatsUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentPlayers?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumRoomStatusFieldUpdateOperationsInput | $Enums.RoomStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creatorId?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    games?: GameUncheckedUpdateManyWithoutRoomNestedInput
    roomStats?: RoomStatsUncheckedUpdateOneWithoutRoomNestedInput
    playerRoomStats?: PlayerRoomStatsUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type GameUpsertWithoutPlayersInput = {
    update: XOR<GameUpdateWithoutPlayersInput, GameUncheckedUpdateWithoutPlayersInput>
    create: XOR<GameCreateWithoutPlayersInput, GameUncheckedCreateWithoutPlayersInput>
    where?: GameWhereInput
  }

  export type GameUpdateToOneWithWhereWithoutPlayersInput = {
    where?: GameWhereInput
    data: XOR<GameUpdateWithoutPlayersInput, GameUncheckedUpdateWithoutPlayersInput>
  }

  export type GameUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    currentRound?: IntFieldUpdateOperationsInput | number
    currentTurn?: IntFieldUpdateOperationsInput | number
    rows?: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    room?: RoomUpdateOneRequiredWithoutGamesNestedInput
    winner?: PlayerUpdateOneWithoutWonGamesNestedInput
  }

  export type GameUncheckedUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    currentRound?: IntFieldUpdateOperationsInput | number
    currentTurn?: IntFieldUpdateOperationsInput | number
    rows?: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GameUpsertWithWhereUniqueWithoutWinnerInput = {
    where: GameWhereUniqueInput
    update: XOR<GameUpdateWithoutWinnerInput, GameUncheckedUpdateWithoutWinnerInput>
    create: XOR<GameCreateWithoutWinnerInput, GameUncheckedCreateWithoutWinnerInput>
  }

  export type GameUpdateWithWhereUniqueWithoutWinnerInput = {
    where: GameWhereUniqueInput
    data: XOR<GameUpdateWithoutWinnerInput, GameUncheckedUpdateWithoutWinnerInput>
  }

  export type GameUpdateManyWithWhereWithoutWinnerInput = {
    where: GameScalarWhereInput
    data: XOR<GameUpdateManyMutationInput, GameUncheckedUpdateManyWithoutWinnerInput>
  }

  export type RoomCreateWithoutRoomStatsInput = {
    id?: string
    name: string
    code: string
    maxPlayers?: number
    currentPlayers?: number
    isPrivate?: boolean
    status?: $Enums.RoomStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    password?: string | null
    creator: UserCreateNestedOneWithoutCreatedRoomsInput
    players?: PlayerCreateNestedManyWithoutRoomInput
    games?: GameCreateNestedManyWithoutRoomInput
    playerRoomStats?: PlayerRoomStatsCreateNestedManyWithoutRoomInput
  }

  export type RoomUncheckedCreateWithoutRoomStatsInput = {
    id?: string
    name: string
    code: string
    maxPlayers?: number
    currentPlayers?: number
    isPrivate?: boolean
    status?: $Enums.RoomStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    creatorId: string
    password?: string | null
    players?: PlayerUncheckedCreateNestedManyWithoutRoomInput
    games?: GameUncheckedCreateNestedManyWithoutRoomInput
    playerRoomStats?: PlayerRoomStatsUncheckedCreateNestedManyWithoutRoomInput
  }

  export type RoomCreateOrConnectWithoutRoomStatsInput = {
    where: RoomWhereUniqueInput
    create: XOR<RoomCreateWithoutRoomStatsInput, RoomUncheckedCreateWithoutRoomStatsInput>
  }

  export type RoomUpsertWithoutRoomStatsInput = {
    update: XOR<RoomUpdateWithoutRoomStatsInput, RoomUncheckedUpdateWithoutRoomStatsInput>
    create: XOR<RoomCreateWithoutRoomStatsInput, RoomUncheckedCreateWithoutRoomStatsInput>
    where?: RoomWhereInput
  }

  export type RoomUpdateToOneWithWhereWithoutRoomStatsInput = {
    where?: RoomWhereInput
    data: XOR<RoomUpdateWithoutRoomStatsInput, RoomUncheckedUpdateWithoutRoomStatsInput>
  }

  export type RoomUpdateWithoutRoomStatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentPlayers?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumRoomStatusFieldUpdateOperationsInput | $Enums.RoomStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    creator?: UserUpdateOneRequiredWithoutCreatedRoomsNestedInput
    players?: PlayerUpdateManyWithoutRoomNestedInput
    games?: GameUpdateManyWithoutRoomNestedInput
    playerRoomStats?: PlayerRoomStatsUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateWithoutRoomStatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentPlayers?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumRoomStatusFieldUpdateOperationsInput | $Enums.RoomStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creatorId?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    players?: PlayerUncheckedUpdateManyWithoutRoomNestedInput
    games?: GameUncheckedUpdateManyWithoutRoomNestedInput
    playerRoomStats?: PlayerRoomStatsUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type UserCreateWithoutPlayerRoomStatsInput = {
    id?: string
    username: string
    password: string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    surname?: string | null
    email?: string | null
    userStats?: UserStatsCreateNestedOneWithoutUserInput
    createdRooms?: RoomCreateNestedManyWithoutCreatorInput
    players?: PlayerCreateNestedManyWithoutUserInput
    token?: TokenCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPlayerRoomStatsInput = {
    id?: string
    username: string
    password: string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    surname?: string | null
    email?: string | null
    userStats?: UserStatsUncheckedCreateNestedOneWithoutUserInput
    createdRooms?: RoomUncheckedCreateNestedManyWithoutCreatorInput
    players?: PlayerUncheckedCreateNestedManyWithoutUserInput
    token?: TokenUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPlayerRoomStatsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPlayerRoomStatsInput, UserUncheckedCreateWithoutPlayerRoomStatsInput>
  }

  export type RoomCreateWithoutPlayerRoomStatsInput = {
    id?: string
    name: string
    code: string
    maxPlayers?: number
    currentPlayers?: number
    isPrivate?: boolean
    status?: $Enums.RoomStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    password?: string | null
    creator: UserCreateNestedOneWithoutCreatedRoomsInput
    players?: PlayerCreateNestedManyWithoutRoomInput
    games?: GameCreateNestedManyWithoutRoomInput
    roomStats?: RoomStatsCreateNestedOneWithoutRoomInput
  }

  export type RoomUncheckedCreateWithoutPlayerRoomStatsInput = {
    id?: string
    name: string
    code: string
    maxPlayers?: number
    currentPlayers?: number
    isPrivate?: boolean
    status?: $Enums.RoomStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    creatorId: string
    password?: string | null
    players?: PlayerUncheckedCreateNestedManyWithoutRoomInput
    games?: GameUncheckedCreateNestedManyWithoutRoomInput
    roomStats?: RoomStatsUncheckedCreateNestedOneWithoutRoomInput
  }

  export type RoomCreateOrConnectWithoutPlayerRoomStatsInput = {
    where: RoomWhereUniqueInput
    create: XOR<RoomCreateWithoutPlayerRoomStatsInput, RoomUncheckedCreateWithoutPlayerRoomStatsInput>
  }

  export type UserUpsertWithoutPlayerRoomStatsInput = {
    update: XOR<UserUpdateWithoutPlayerRoomStatsInput, UserUncheckedUpdateWithoutPlayerRoomStatsInput>
    create: XOR<UserCreateWithoutPlayerRoomStatsInput, UserUncheckedCreateWithoutPlayerRoomStatsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPlayerRoomStatsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPlayerRoomStatsInput, UserUncheckedUpdateWithoutPlayerRoomStatsInput>
  }

  export type UserUpdateWithoutPlayerRoomStatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    surname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    userStats?: UserStatsUpdateOneWithoutUserNestedInput
    createdRooms?: RoomUpdateManyWithoutCreatorNestedInput
    players?: PlayerUpdateManyWithoutUserNestedInput
    token?: TokenUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPlayerRoomStatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    surname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    userStats?: UserStatsUncheckedUpdateOneWithoutUserNestedInput
    createdRooms?: RoomUncheckedUpdateManyWithoutCreatorNestedInput
    players?: PlayerUncheckedUpdateManyWithoutUserNestedInput
    token?: TokenUncheckedUpdateOneWithoutUserNestedInput
  }

  export type RoomUpsertWithoutPlayerRoomStatsInput = {
    update: XOR<RoomUpdateWithoutPlayerRoomStatsInput, RoomUncheckedUpdateWithoutPlayerRoomStatsInput>
    create: XOR<RoomCreateWithoutPlayerRoomStatsInput, RoomUncheckedCreateWithoutPlayerRoomStatsInput>
    where?: RoomWhereInput
  }

  export type RoomUpdateToOneWithWhereWithoutPlayerRoomStatsInput = {
    where?: RoomWhereInput
    data: XOR<RoomUpdateWithoutPlayerRoomStatsInput, RoomUncheckedUpdateWithoutPlayerRoomStatsInput>
  }

  export type RoomUpdateWithoutPlayerRoomStatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentPlayers?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumRoomStatusFieldUpdateOperationsInput | $Enums.RoomStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    creator?: UserUpdateOneRequiredWithoutCreatedRoomsNestedInput
    players?: PlayerUpdateManyWithoutRoomNestedInput
    games?: GameUpdateManyWithoutRoomNestedInput
    roomStats?: RoomStatsUpdateOneWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateWithoutPlayerRoomStatsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentPlayers?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumRoomStatusFieldUpdateOperationsInput | $Enums.RoomStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creatorId?: StringFieldUpdateOperationsInput | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    players?: PlayerUncheckedUpdateManyWithoutRoomNestedInput
    games?: GameUncheckedUpdateManyWithoutRoomNestedInput
    roomStats?: RoomStatsUncheckedUpdateOneWithoutRoomNestedInput
  }

  export type UserCreateWithoutTokenInput = {
    id?: string
    username: string
    password: string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    surname?: string | null
    email?: string | null
    userStats?: UserStatsCreateNestedOneWithoutUserInput
    createdRooms?: RoomCreateNestedManyWithoutCreatorInput
    players?: PlayerCreateNestedManyWithoutUserInput
    playerRoomStats?: PlayerRoomStatsCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTokenInput = {
    id?: string
    username: string
    password: string
    version?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    name?: string | null
    surname?: string | null
    email?: string | null
    userStats?: UserStatsUncheckedCreateNestedOneWithoutUserInput
    createdRooms?: RoomUncheckedCreateNestedManyWithoutCreatorInput
    players?: PlayerUncheckedCreateNestedManyWithoutUserInput
    playerRoomStats?: PlayerRoomStatsUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTokenInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTokenInput, UserUncheckedCreateWithoutTokenInput>
  }

  export type UserUpsertWithoutTokenInput = {
    update: XOR<UserUpdateWithoutTokenInput, UserUncheckedUpdateWithoutTokenInput>
    create: XOR<UserCreateWithoutTokenInput, UserUncheckedCreateWithoutTokenInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTokenInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTokenInput, UserUncheckedUpdateWithoutTokenInput>
  }

  export type UserUpdateWithoutTokenInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    surname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    userStats?: UserStatsUpdateOneWithoutUserNestedInput
    createdRooms?: RoomUpdateManyWithoutCreatorNestedInput
    players?: PlayerUpdateManyWithoutUserNestedInput
    playerRoomStats?: PlayerRoomStatsUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTokenInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    version?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    surname?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    userStats?: UserStatsUncheckedUpdateOneWithoutUserNestedInput
    createdRooms?: RoomUncheckedUpdateManyWithoutCreatorNestedInput
    players?: PlayerUncheckedUpdateManyWithoutUserNestedInput
    playerRoomStats?: PlayerRoomStatsUncheckedUpdateManyWithoutUserNestedInput
  }

  export type RoomCreateManyCreatorInput = {
    id?: string
    name: string
    code: string
    maxPlayers?: number
    currentPlayers?: number
    isPrivate?: boolean
    status?: $Enums.RoomStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    password?: string | null
  }

  export type PlayerCreateManyUserInput = {
    id?: string
    roomId: string
    gameId?: string | null
    isBot?: boolean
    botName?: string | null
    position: number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: boolean
    isReady?: boolean
    isWinner?: boolean
    finalPosition?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlayerRoomStatsCreateManyUserInput = {
    id?: string
    roomId: string
    gamesPlayed?: number
    gamesWon?: number
    totalPenalty?: number
    bestScore?: number | null
    lastPlayedAt?: Date | string
    updatedAt?: Date | string
  }

  export type RoomUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentPlayers?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumRoomStatusFieldUpdateOperationsInput | $Enums.RoomStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    players?: PlayerUpdateManyWithoutRoomNestedInput
    games?: GameUpdateManyWithoutRoomNestedInput
    roomStats?: RoomStatsUpdateOneWithoutRoomNestedInput
    playerRoomStats?: PlayerRoomStatsUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentPlayers?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumRoomStatusFieldUpdateOperationsInput | $Enums.RoomStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
    players?: PlayerUncheckedUpdateManyWithoutRoomNestedInput
    games?: GameUncheckedUpdateManyWithoutRoomNestedInput
    roomStats?: RoomStatsUncheckedUpdateOneWithoutRoomNestedInput
    playerRoomStats?: PlayerRoomStatsUncheckedUpdateManyWithoutRoomNestedInput
  }

  export type RoomUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentPlayers?: IntFieldUpdateOperationsInput | number
    isPrivate?: BoolFieldUpdateOperationsInput | boolean
    status?: EnumRoomStatusFieldUpdateOperationsInput | $Enums.RoomStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    password?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PlayerUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    isBot?: BoolFieldUpdateOperationsInput | boolean
    botName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: IntFieldUpdateOperationsInput | number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: IntFieldUpdateOperationsInput | number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isWinner?: BoolFieldUpdateOperationsInput | boolean
    finalPosition?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: RoomUpdateOneRequiredWithoutPlayersNestedInput
    game?: GameUpdateOneWithoutPlayersNestedInput
    wonGames?: GameUpdateManyWithoutWinnerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    gameId?: NullableStringFieldUpdateOperationsInput | string | null
    isBot?: BoolFieldUpdateOperationsInput | boolean
    botName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: IntFieldUpdateOperationsInput | number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: IntFieldUpdateOperationsInput | number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isWinner?: BoolFieldUpdateOperationsInput | boolean
    finalPosition?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wonGames?: GameUncheckedUpdateManyWithoutWinnerNestedInput
  }

  export type PlayerUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    gameId?: NullableStringFieldUpdateOperationsInput | string | null
    isBot?: BoolFieldUpdateOperationsInput | boolean
    botName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: IntFieldUpdateOperationsInput | number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: IntFieldUpdateOperationsInput | number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isWinner?: BoolFieldUpdateOperationsInput | boolean
    finalPosition?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerRoomStatsUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    totalPenalty?: IntFieldUpdateOperationsInput | number
    bestScore?: NullableIntFieldUpdateOperationsInput | number | null
    lastPlayedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    room?: RoomUpdateOneRequiredWithoutPlayerRoomStatsNestedInput
  }

  export type PlayerRoomStatsUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    totalPenalty?: IntFieldUpdateOperationsInput | number
    bestScore?: NullableIntFieldUpdateOperationsInput | number | null
    lastPlayedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerRoomStatsUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    totalPenalty?: IntFieldUpdateOperationsInput | number
    bestScore?: NullableIntFieldUpdateOperationsInput | number | null
    lastPlayedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerCreateManyRoomInput = {
    id?: string
    userId?: string | null
    gameId?: string | null
    isBot?: boolean
    botName?: string | null
    position: number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: boolean
    isReady?: boolean
    isWinner?: boolean
    finalPosition?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GameCreateManyRoomInput = {
    id?: string
    status?: $Enums.GameStatus
    currentRound?: number
    currentTurn?: number
    rows: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    finishedAt?: Date | string | null
    winnerId?: string | null
  }

  export type PlayerRoomStatsCreateManyRoomInput = {
    id?: string
    userId: string
    gamesPlayed?: number
    gamesWon?: number
    totalPenalty?: number
    bestScore?: number | null
    lastPlayedAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlayerUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    isBot?: BoolFieldUpdateOperationsInput | boolean
    botName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: IntFieldUpdateOperationsInput | number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: IntFieldUpdateOperationsInput | number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isWinner?: BoolFieldUpdateOperationsInput | boolean
    finalPosition?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutPlayersNestedInput
    game?: GameUpdateOneWithoutPlayersNestedInput
    wonGames?: GameUpdateManyWithoutWinnerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    gameId?: NullableStringFieldUpdateOperationsInput | string | null
    isBot?: BoolFieldUpdateOperationsInput | boolean
    botName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: IntFieldUpdateOperationsInput | number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: IntFieldUpdateOperationsInput | number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isWinner?: BoolFieldUpdateOperationsInput | boolean
    finalPosition?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wonGames?: GameUncheckedUpdateManyWithoutWinnerNestedInput
  }

  export type PlayerUncheckedUpdateManyWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    gameId?: NullableStringFieldUpdateOperationsInput | string | null
    isBot?: BoolFieldUpdateOperationsInput | boolean
    botName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: IntFieldUpdateOperationsInput | number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: IntFieldUpdateOperationsInput | number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isWinner?: BoolFieldUpdateOperationsInput | boolean
    finalPosition?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    currentRound?: IntFieldUpdateOperationsInput | number
    currentTurn?: IntFieldUpdateOperationsInput | number
    rows?: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    players?: PlayerUpdateManyWithoutGameNestedInput
    winner?: PlayerUpdateOneWithoutWonGamesNestedInput
  }

  export type GameUncheckedUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    currentRound?: IntFieldUpdateOperationsInput | number
    currentTurn?: IntFieldUpdateOperationsInput | number
    rows?: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    players?: PlayerUncheckedUpdateManyWithoutGameNestedInput
  }

  export type GameUncheckedUpdateManyWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    currentRound?: IntFieldUpdateOperationsInput | number
    currentTurn?: IntFieldUpdateOperationsInput | number
    rows?: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PlayerRoomStatsUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    totalPenalty?: IntFieldUpdateOperationsInput | number
    bestScore?: NullableIntFieldUpdateOperationsInput | number | null
    lastPlayedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlayerRoomStatsNestedInput
  }

  export type PlayerRoomStatsUncheckedUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    totalPenalty?: IntFieldUpdateOperationsInput | number
    bestScore?: NullableIntFieldUpdateOperationsInput | number | null
    lastPlayedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerRoomStatsUncheckedUpdateManyWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    totalPenalty?: IntFieldUpdateOperationsInput | number
    bestScore?: NullableIntFieldUpdateOperationsInput | number | null
    lastPlayedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerCreateManyGameInput = {
    id?: string
    userId?: string | null
    roomId: string
    isBot?: boolean
    botName?: string | null
    position: number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: boolean
    isReady?: boolean
    isWinner?: boolean
    finalPosition?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PlayerUpdateWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    isBot?: BoolFieldUpdateOperationsInput | boolean
    botName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: IntFieldUpdateOperationsInput | number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: IntFieldUpdateOperationsInput | number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isWinner?: BoolFieldUpdateOperationsInput | boolean
    finalPosition?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutPlayersNestedInput
    room?: RoomUpdateOneRequiredWithoutPlayersNestedInput
    wonGames?: GameUpdateManyWithoutWinnerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    roomId?: StringFieldUpdateOperationsInput | string
    isBot?: BoolFieldUpdateOperationsInput | boolean
    botName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: IntFieldUpdateOperationsInput | number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: IntFieldUpdateOperationsInput | number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isWinner?: BoolFieldUpdateOperationsInput | boolean
    finalPosition?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    wonGames?: GameUncheckedUpdateManyWithoutWinnerNestedInput
  }

  export type PlayerUncheckedUpdateManyWithoutGameInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    roomId?: StringFieldUpdateOperationsInput | string
    isBot?: BoolFieldUpdateOperationsInput | boolean
    botName?: NullableStringFieldUpdateOperationsInput | string | null
    position?: IntFieldUpdateOperationsInput | number
    hand?: JsonNullValueInput | InputJsonValue
    penaltyCard?: JsonNullValueInput | InputJsonValue
    totalPenalty?: IntFieldUpdateOperationsInput | number
    roundPenaltyCard?: JsonNullValueInput | InputJsonValue
    roundPenalty?: IntFieldUpdateOperationsInput | number
    selectedCard?: NullableJsonNullValueInput | InputJsonValue
    isSelectedCardConfirmed?: BoolFieldUpdateOperationsInput | boolean
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isWinner?: BoolFieldUpdateOperationsInput | boolean
    finalPosition?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameCreateManyWinnerInput = {
    id?: string
    roomId: string
    status?: $Enums.GameStatus
    currentRound?: number
    currentTurn?: number
    rows: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    finishedAt?: Date | string | null
  }

  export type GameUpdateWithoutWinnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    currentRound?: IntFieldUpdateOperationsInput | number
    currentTurn?: IntFieldUpdateOperationsInput | number
    rows?: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    room?: RoomUpdateOneRequiredWithoutGamesNestedInput
    players?: PlayerUpdateManyWithoutGameNestedInput
  }

  export type GameUncheckedUpdateWithoutWinnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    currentRound?: IntFieldUpdateOperationsInput | number
    currentTurn?: IntFieldUpdateOperationsInput | number
    rows?: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    players?: PlayerUncheckedUpdateManyWithoutGameNestedInput
  }

  export type GameUncheckedUpdateManyWithoutWinnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomId?: StringFieldUpdateOperationsInput | string
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    currentRound?: IntFieldUpdateOperationsInput | number
    currentTurn?: IntFieldUpdateOperationsInput | number
    rows?: JsonNullValueInput | InputJsonValue
    currentTurnCards?: JsonNullValueInput | InputJsonValue
    history?: JsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    finishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}