import { ZodType, z } from "zod";
export type IEndpoint<P, Q, R, B> = {
    pattern: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    paramSchema: z.ZodSchema<P>;
    responseSchema: z.ZodSchema<R>;
    bodySchema: z.ZodSchema<B>;
    querySchema: z.ZodSchema<Q>;
};
type PickSchemaType<IEndpoint, key> = key extends keyof IEndpoint ? IEndpoint[key] extends ZodType<any, any, any> ? z.infer<IEndpoint[key]> : never : never;
export type InferInputs<IEndpoint> = {
    param: PickSchemaType<IEndpoint, "paramSchema">;
    query: PickSchemaType<IEndpoint, "querySchema">;
    body: PickSchemaType<IEndpoint, "bodySchema">;
};
export type InferOutputs<IEndpoint> = PickSchemaType<IEndpoint, "responseSchema">;
export type InferOutputsPromise<IEndpoint> = Promise<InferOutputs<IEndpoint>>;
export declare const endpoints: {
    readonly auth: {
        readonly login: {
            readonly pattern: "auth/login";
            readonly method: "POST";
            readonly bodySchema: z.ZodObject<{
                username: z.ZodString;
                password: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                username: string;
                password: string;
            }, {
                username: string;
                password: string;
            }>;
            readonly responseSchema: z.ZodString;
            readonly paramSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
            readonly querySchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        };
        readonly signup: {
            readonly pattern: "auth/signup";
            readonly method: "POST";
            readonly bodySchema: z.ZodObject<{
                username: z.ZodString;
                password: z.ZodString;
                confirmPassword: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                username: string;
                password: string;
                confirmPassword: string;
            }, {
                username: string;
                password: string;
                confirmPassword: string;
            }>;
            readonly responseSchema: z.ZodString;
            readonly paramSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
            readonly querySchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        };
        readonly currentUser: {
            readonly pattern: "auth/current-user";
            readonly responseSchema: z.ZodObject<{
                username: z.ZodString;
                roles: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                username: string;
                roles: string[];
            }, {
                username: string;
                roles: string[];
            }>;
            readonly paramSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
            readonly bodySchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
            readonly querySchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
            readonly method: "GET";
        };
        readonly logout: {
            readonly pattern: "auth/logout";
            readonly responseSchema: z.ZodVoid;
            readonly paramSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
            readonly bodySchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
            readonly querySchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
            readonly method: "GET";
        };
    };
};
export {};
