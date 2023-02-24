import { IEndpoint } from "api-interface";
import axios from "axios";
import { GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";
import { z } from "zod";

export const getAxios =
  (baseURL: string) =>
  <P extends Record<string, any>, Q, R, B>(
    endpoint: IEndpoint<P, Q, R, B>,
    context: GetServerSidePropsContext<
      ParsedUrlQuery,
      PreviewData
    > | null = null,
  ) => {
    const {
      paramSchema,
      pattern,
      responseSchema,
      bodySchema,
      querySchema,
      method,
    } = endpoint;

    const cookies = !!context ? context.req.cookies : null;

    let cookieHeader = "";
    if (!!cookies) {
      for (const key in cookies) {
        cookieHeader += `${key}=${cookies[key]}; `;
      }
    }

    return (
      args: {
        param?: z.infer<typeof paramSchema>;
        body?: z.infer<typeof bodySchema>;
        query?: z.infer<typeof querySchema>;
      },
      overrides?: { url?: string; headers?: Record<string, any> },
    ) => {
      const param = paramSchema.parse(args.param || {});
      const body = bodySchema.parse(args.body || {});
      const query = querySchema.parse(args.query || {});
      let url = pattern;
      Object.keys(param).forEach((key) => {
        url = url.replace(`:${key}`, param[key]);
      });
      if (!!overrides?.url) url = overrides.url;

      return new Promise<R>((resolve, reject) =>
        axios
          .create({
            baseURL: `${
              !!context && !!context.req.headers.host
                ? `http://${context.req.headers.host}`
                : ""
            }${baseURL}`,
            withCredentials: true,
            headers: {
              ...(!!cookieHeader ? { Cookie: cookieHeader } : {}),
              ...(!!overrides?.headers ? overrides.headers : {}),
            },
          })({
            method,
            data: body,
            params: query,
            url,
          })
          .then((res) => res.data)
          .then(responseSchema.parse)
          .then(resolve)
          .catch(reject),
      );
    };
  };

const service = getAxios("/api/");

export default service;
