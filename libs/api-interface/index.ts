import { PERMISSIONS } from "@prisma/client";
import { z, ZodType } from "zod";

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

const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  // password: z.string(),
  permissions: z.nativeEnum(PERMISSIONS).array(),
});

const memberUserSchema = z.object({
  id: z.string(),
  discordUsername: z.string(),
  discordDiscriminator: z.number(),
});

const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  url: z.string(),
  authorId: z.string(),
});

const newTweetPostSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  content: z.string(),
  media: z.string().array(),
});

const existingTweetPostSchema = z.object({
  id: z.string(),
  tweetUrl: z.string(),
  retweetOfProjectId: z.string(),
  likeOfProjectId: z.string(),
});

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
      responseSchema: projectSchema
        .and(z.object({ author: userSchema }))
        .array(),
    },
    create: {
      ...defaultConfig,
      pattern: "projects",
      method: "POST",
      bodySchema: projectSchema
        .omit({
          id: true,
          authorId: true,
          description: true,
        })
        .and(z.object({ description: z.string().optional() })),
      responseSchema: z.string(),
    },
  },
  users: {
    getAll: {
      ...defaultConfig,
      pattern: "users",
      responseSchema: userSchema.array(),
    },
    create: {
      ...defaultConfig,
      pattern: "users",
      method: "POST",
      bodySchema: userSchema
        .omit({
          id: true,
        })
        .and(
          z.object({
            password: z.string(),
            confirmPassword: z.string().optional(),
          }),
        ),
      responseSchema: z.string(),
    },
    update: {
      ...defaultConfig,
      pattern: "users/:id",
      method: "PUT",
      paramSchema: z.object({ id: z.string() }),
      bodySchema: userSchema.and(
        z.object({
          password: z.string(),
          confirmPassword: z.string().optional(),
        }),
      ),
      responseSchema: z.string(),
    },
    delete: {
      ...defaultConfig,
      pattern: "users/:id",
      method: "DELETE",
      paramSchema: z.object({ id: z.string() }),
      responseSchema: z.string(),
    },
  },
} as const;
