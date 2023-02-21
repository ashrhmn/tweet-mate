import { ZodType, z } from "zod";

export const ApiInterface = { a: "b", d: "e" };

const defaultConfig = {
  paramSchema: z.object({}),
  bodySchema: z.object({}),
  responseSchema: z.object({}),
  querySchema: z.object({}),
  method: "GET",
} as const;

export type IEndpoint<P, Q, R, B> = {
  pattern: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  paramSchema: z.ZodSchema<P>;
  responseSchema: z.ZodSchema<R>;
  bodySchema: z.ZodSchema<B>;
  querySchema: z.ZodSchema<Q>;
};

type PickSchemaType<IEndpoint, key> = key extends keyof IEndpoint
  ? IEndpoint[key] extends ZodType<any, any, any>
    ? z.infer<IEndpoint[key]>
    : never
  : never;

export type InferInputs<IEndpoint> = {
  param: PickSchemaType<IEndpoint, "paramSchema">;
  query: PickSchemaType<IEndpoint, "querySchema">;
  body: PickSchemaType<IEndpoint, "bodySchema">;
};

export type InferOutputs<IEndpoint> = PickSchemaType<
  IEndpoint,
  "responseSchema"
>;
export type InferOutputsPromise<IEndpoint> = Promise<InferOutputs<IEndpoint>>;

export const endpoints = {
  getUserById: {
    ...defaultConfig,
    pattern: "users/:uid",
    paramSchema: z.object({ uid: z.coerce.number() }),
    responseSchema: z.object({ uid: z.number(), username: z.string() }),
  },
  getStudentById: {
    ...defaultConfig,
    pattern: "students/:sid",
    paramSchema: z.object({ sid: z.coerce.number() }),
    responseSchema: z.object({ sid: z.number(), studentName: z.string() }),
  },
  getProductsById: {
    ...defaultConfig,
    pattern: "products/:pid",
    paramSchema: z.object({ pid: z.coerce.number() }),
    responseSchema: z.object({ pid: z.number(), productName: z.string() }),
  },
  getAllUsers: {
    ...defaultConfig,
    pattern: "users",
    responseSchema: z.array(
      z.object({ uid: z.number(), username: z.string() })
    ),
  },
} as const;
