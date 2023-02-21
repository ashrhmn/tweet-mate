import { ZodType, z } from "zod";
export declare const ApiInterface: {
    a: string;
    d: string;
};
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
    readonly getUserById: {
        readonly pattern: "users/:uid";
        readonly paramSchema: z.ZodObject<{
            uid: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            uid: number;
        }, {
            uid: number;
        }>;
        readonly responseSchema: z.ZodObject<{
            uid: z.ZodNumber;
            username: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            uid: number;
            username: string;
        }, {
            uid: number;
            username: string;
        }>;
        readonly bodySchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        readonly querySchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        readonly method: "GET";
    };
    readonly getStudentById: {
        readonly pattern: "students/:sid";
        readonly paramSchema: z.ZodObject<{
            sid: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            sid: number;
        }, {
            sid: number;
        }>;
        readonly responseSchema: z.ZodObject<{
            sid: z.ZodNumber;
            studentName: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            sid: number;
            studentName: string;
        }, {
            sid: number;
            studentName: string;
        }>;
        readonly bodySchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        readonly querySchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        readonly method: "GET";
    };
    readonly getProductsById: {
        readonly pattern: "products/:pid";
        readonly paramSchema: z.ZodObject<{
            pid: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            pid: number;
        }, {
            pid: number;
        }>;
        readonly responseSchema: z.ZodObject<{
            pid: z.ZodNumber;
            productName: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            pid: number;
            productName: string;
        }, {
            pid: number;
            productName: string;
        }>;
        readonly bodySchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        readonly querySchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        readonly method: "GET";
    };
    readonly getAllUsers: {
        readonly pattern: "users";
        readonly responseSchema: z.ZodArray<z.ZodObject<{
            uid: z.ZodNumber;
            username: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            uid: number;
            username: string;
        }, {
            uid: number;
            username: string;
        }>, "many">;
        readonly paramSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        readonly bodySchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        readonly querySchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        readonly method: "GET";
    };
};
export {};
