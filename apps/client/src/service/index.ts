import { IEndpoint } from "api-interface";
import axios from "axios";
import { z } from "zod";

export const getAxios =
  (baseURL: string) =>
  <P extends Record<string, any>, Q, R, B>(endpoint: IEndpoint<P, Q, R, B>) => {
    const {
      paramSchema,
      pattern,
      responseSchema,
      bodySchema,
      querySchema,
      method,
    } = endpoint;

    return (args: {
      param?: z.infer<typeof paramSchema>;
      body?: z.infer<typeof bodySchema>;
      query?: z.infer<typeof querySchema>;
    }) => {
      const param = paramSchema.parse(args.param || {});
      const body = bodySchema.parse(args.body || {});
      const query = querySchema.parse(args.query || {});
      let url = pattern;
      Object.keys(param).forEach((key) => {
        url = url.replace(`:${key}`, param[key]);
      });
      return new Promise<R>((resolve, reject) =>
        axios
          .create({ baseURL })({ method, data: body, params: query, url })
          .then((res) => res.data)
          .then(responseSchema.parse)
          .then(resolve)
          .catch(reject)
      );
    };
  };

const service = getAxios("/api/");

export default service;
