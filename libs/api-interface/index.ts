import { PERMISSIONS } from "@prisma/client";
import { ZodType, z } from "zod";

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
  auth: {
    login: {
      ...defaultConfig,
      pattern: "auth/login",
      method: "POST",
      bodySchema: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responseSchema: z.string(),
    },
    signup: {
      ...defaultConfig,
      pattern: "auth/signup",
      method: "POST",
      bodySchema: z.object({
        username: z.string(),
        password: z.string(),
        confirmPassword: z.string(),
      }),
      responseSchema: z.string(),
    },
    currentUser: {
      ...defaultConfig,
      pattern: "auth/current-user",
      responseSchema: z.object({
        username: z.string(),
        permissions: z.nativeEnum(PERMISSIONS).array(),
      }),
    },
    logout: {
      ...defaultConfig,
      pattern: "auth/logout",
      responseSchema: z.void(),
    },
  },
  projects: {
    getAll: {
      ...defaultConfig,
      pattern: "projects",
      responseSchema: z
        .object({
          id: z.string(),
          name: z.string(),
          description: z.string().nullable(),
        })
        .array(),
    },
  },
} as const;
