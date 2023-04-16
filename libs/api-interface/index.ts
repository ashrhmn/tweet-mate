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

const emptyStringToUndefined = z.literal("").transform(() => undefined);

function optionalUndefinedString<T extends z.ZodTypeAny>(schema: T) {
  return schema.optional().or(emptyStringToUndefined);
}

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

const newTweetPostSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  content: z.string().nullable(),
  media: z.string().array(),
});

const existingTweetPostSchema = z.object({
  id: z.string(),
  tweetUrl: z.string(),
  retweetOfProjectId: z.string().nullable(),
  likeOfProjectId: z.string().nullable(),
});

const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  url: z.string(),
  authorId: z.string(),
  // newTweetPosts: newTweetPostSchema.array(),
  // retweetPosts: existingTweetPostSchema.array(),
  // likeTweets: existingTweetPostSchema.array(),
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
    currentUser: {
      ...defaultConfig,
      pattern: "auth/current-user",
      responseSchema: z.object({
        username: z.string(),
        permissions: z.nativeEnum(PERMISSIONS).array(),
      }),
    },
    currentTwitterUser: {
      ...defaultConfig,
      pattern: "auth/current-twitter-user",
      responseSchema: z.object({
        id: z.string(),
        username: z.string(),
        name: z.string(),
      }),
    },
    currentDiscordUser: {
      ...defaultConfig,
      pattern: "auth/current-discord-user",
      responseSchema: z.object({
        username: z.string(),
        locale: z.string(),
        mfa_enabled: z.boolean(),
        flags: z.number(),
        avatar: z.string(),
        discriminator: z.string(),
        id: z.string(),
      }),
    },
    revokeDiscordUser: {
      ...defaultConfig,
      pattern: "auth/revoke-discord-user",
      responseSchema: z.string(),
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
    getProject: {
      ...defaultConfig,
      pattern: "project/:id",
      method: "GET",
      paramSchema: z.object({ id: z.string() }),
      responseSchema: projectSchema
        .and(z.object({ author: userSchema }))
        .and(z.object({ newTweetPosts: newTweetPostSchema.array() }))
        .and(z.object({ retweetPosts: existingTweetPostSchema.array() }))
        .and(z.object({ likeTweets: existingTweetPostSchema.array() })),
    },
    getProjectByUrl: {
      ...defaultConfig,
      pattern: "projecturl/:url",
      method: "GET",
      paramSchema: z.object({ url: z.string() }),
      responseSchema: projectSchema
        .and(z.object({ author: userSchema }))
        .and(z.object({ newTweetPosts: newTweetPostSchema.array() }))
        .and(z.object({ retweetPosts: existingTweetPostSchema.array() }))
        .and(z.object({ likeTweets: existingTweetPostSchema.array() })),
    },
    create: {
      ...defaultConfig,
      pattern: "projects",
      method: "POST",
      bodySchema: z.object({
        name: z.string().min(3, "Name must be at least 3 characters long"),
        description: z.string().optional(),
        url: z.string().optional(),
      }),
      responseSchema: z.string(),
    },
    delete: {
      ...defaultConfig,
      pattern: "projects/:id",
      method: "DELETE",
      paramSchema: z.object({ id: z.string() }),
      responseSchema: z.string(),
    },
  },
  users: {
    getAll: {
      ...defaultConfig,
      pattern: "users",
      responseSchema: userSchema.array(),
    },
    getUser: {
      ...defaultConfig,
      pattern: "user/:id",
      method: "GET",
      paramSchema: z.object({ id: z.string() }),
      responseSchema: userSchema,
    },
    create: {
      ...defaultConfig,
      pattern: "users",
      method: "POST",
      bodySchema: z.object({
        username: z
          .string()
          .min(3, "Username must be at least 3 characters long")
          .max(20),
        password: z
          .string()
          .min(8, "Password must be at least 8 characters long")
          .max(20),
        confirmPassword: z
          .string()
          .min(8, "Password must be at least 8 characters long")
          .max(20),
        permissions: z.nativeEnum(PERMISSIONS).array(),
      }),
      responseSchema: z.string(),
    },
    update: {
      ...defaultConfig,
      pattern: "user/:id",
      method: "PUT",
      paramSchema: z.object({ id: z.string() }),
      bodySchema: z
        .object({
          username: optionalUndefinedString(
            z
              .string()
              .min(3, "Username must be at least 8 characters long")
              .max(20),
          ),
          password: optionalUndefinedString(
            z
              .string()
              .min(3, "Password must be at least 8 characters long")
              .max(20, "Password must be at most 20 characters long"),
          ),
          confirmPassword: optionalUndefinedString(
            z
              .string()
              .min(3, "Password must be at least 8 characters long")
              .max(20, "Password must be at most 20 characters long"),
          ),
          permissions: z.nativeEnum(PERMISSIONS).array(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        }),
      responseSchema: z.string(),
    },
    delete: {
      ...defaultConfig,
      pattern: "user/:id",
      method: "DELETE",
      paramSchema: z.object({ id: z.string() }),
      responseSchema: z.string(),
    },
    getAllPermissions: {
      ...defaultConfig,
      pattern: "users/permissions",
      responseSchema: z.nativeEnum(PERMISSIONS).array(),
    },
  },
  newTweetPosts: {
    getAllByProjectId: {
      ...defaultConfig,
      pattern: "newTweet/posts/:projectId",
      paramSchema: z.object({ projectId: z.string() }),
      responseSchema: newTweetPostSchema
        .and(z.object({ project: projectSchema }))
        .array(),
    },
    create: {
      ...defaultConfig,
      pattern: "newTweet/post/create/:projectId",
      method: "POST",
      paramSchema: z.object({ projectId: z.string() }),
      bodySchema: newTweetPostSchema
        .omit({
          id: true,
          projectId: true,
          content: true,
          media: true,
        })
        .and(z.object({ content: z.string().optional() })),
      responseSchema: z.string(),
    },
    delete: {
      ...defaultConfig,
      pattern: "newTweet/post/:id",
      method: "DELETE",
      paramSchema: z.object({ id: z.string() }),
      responseSchema: z.string(),
    },
    createTweetPostByMember: {
      ...defaultConfig,
      pattern: "newTweet/create-member-tweet-post",
      method: "POST",
      bodySchema: z.object({ newTweetPostId: z.string() }),
      responseSchema: z.string(),
    },
  },
  existingTweetPosts: {
    getAllReTweetByProjectId: {
      ...defaultConfig,
      pattern: "existingTweet/posts/:projectId",
      paramSchema: z.object({ projectId: z.string() }),
      responseSchema: existingTweetPostSchema
        .and(z.object({ retweetOfProject: projectSchema }))
        .array(),
    },
    createReTweet: {
      ...defaultConfig,
      pattern: "reTweet/post/create/:projectId",
      method: "POST",
      paramSchema: z.object({ projectId: z.string() }),
      bodySchema: existingTweetPostSchema.omit({
        id: true,
        likeOfProjectId: true,
        retweetOfProjectId: true,
      }),
      responseSchema: z.string(),
    },
    createLikeOfTweet: {
      ...defaultConfig,
      pattern: "likeOfTweet/post/create/:projectId",
      method: "POST",
      paramSchema: z.object({ projectId: z.string() }),
      bodySchema: existingTweetPostSchema.omit({
        id: true,
        likeOfProjectId: true,
        retweetOfProjectId: true,
      }),
      responseSchema: z.string(),
    },
  },
} as const;
