import {
  Get,
  Post,
  Delete,
  Put,
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { User } from "@prisma/client";
import {
  IEndpoint,
  InferInputs,
  InferOutputs,
  InferOutputsPromise,
} from "api-interface";

import { Request, Response } from "express";
import { getUser } from "./auth.utils";

export const InferMethod = <P, Q, R, B>(endpoint: IEndpoint<P, Q, R, B>) => {
  const { method, pattern } = endpoint;
  switch (method) {
    case "GET":
      return Get(pattern);
    case "POST":
      return Post(pattern);
    case "DELETE":
      return Delete(pattern);
    case "PUT":
      return Put(pattern);
    default:
      return Get(pattern);
  }
};

export const createController = <P, Q, R, B>(
  {
    paramSchema,
    bodySchema,
    querySchema,
    responseSchema,
  }: IEndpoint<P, Q, R, B>,
  context: IContext,
  fn: (args: { param: P; query: Q; body: B }, context: IContext) => R,
): R => {
  try {
    const { req } = context;
    const param = paramSchema.parse(req.params);
    const body = bodySchema.parse(req.body);
    const query = querySchema.parse(req.query);
    const data = fn({ param, body, query }, context);
    return responseSchema.parse(data);
  } catch (error) {
    throw new BadRequestException(error);
  }
};

export const createAsyncController = async <P, Q, R, B>(
  {
    paramSchema,
    bodySchema,
    querySchema,
    responseSchema,
  }: IEndpoint<P, Q, R, B>,
  context: IContext,
  fn: (args: { param: P; query: Q; body: B }, context: IContext) => Promise<R>,
): Promise<R> => {
  try {
    const { req } = context;
    const param = paramSchema.parse(req.params);
    const body = bodySchema.parse(req.body);
    const query = querySchema.parse(req.query);
    const data = await fn({ param, body, query }, context);
    return responseSchema.parse(data);
  } catch (error) {
    throw new BadRequestException(error);
  }
};

export const Input = createParamDecorator<IEndpoint<any, any, any, any>>(
  ({ bodySchema, paramSchema, querySchema }, context: ExecutionContext) => {
    const req: Request = context.switchToHttp().getRequest();

    if (!req)
      throw new HttpException(
        "Not implemented",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    try {
      const param = paramSchema.parse(req.params);
      const body = bodySchema.parse(req.body);
      const query = querySchema.parse(req.query);
      return { param, body, query };
    } catch (error) {
      throw new BadRequestException(error);
    }
  },
);

export const Context = createParamDecorator((_, context: ExecutionContext) => {
  const req: Request = context.switchToHttp().getRequest();
  const res: Response = context.switchToHttp().getResponse();
  const user = getUser(req);
  return { req, res, user };
});

export type IContext = {
  req: Request;
  res: Response;
  user: Omit<User, "password"> | null;
};

export const createService = <IEndpoint>(
  fn: (
    input: InferInputs<IEndpoint>,
    context: IContext,
  ) => InferOutputs<IEndpoint>,
) => {
  return (input: InferInputs<IEndpoint>, context: IContext) =>
    fn(input, context);
};

export const createAsyncService = <IEndpoint>(
  fn: (
    input: InferInputs<IEndpoint>,
    context: IContext,
  ) => InferOutputsPromise<IEndpoint>,
) => {
  return async (input: InferInputs<IEndpoint>, context: IContext) =>
    await fn(input, context);
};
