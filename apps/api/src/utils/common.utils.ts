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
} from '@nestjs/common';
import {
  IEndpoint,
  InferInputs,
  InferOutputs,
  InferOutputsPromise,
} from 'api-interface';

import { Request } from 'express';

export const InferMethod = <P, Q, R, B>(endpoint: IEndpoint<P, Q, R, B>) => {
  const { method, pattern } = endpoint;
  switch (method) {
    case 'GET':
      return Get(pattern);
    case 'POST':
      return Post(pattern);
    case 'DELETE':
      return Delete(pattern);
    case 'PUT':
      return Put(pattern);
    default:
      return Get(pattern);
  }
};

export const createController = async <P, Q, R, B>(
  {
    paramSchema,
    bodySchema,
    querySchema,
    responseSchema,
  }: IEndpoint<P, Q, R, B>,
  req: Request,
  fn: (args: { param: P; query: Q; body: B }) => Promise<R>,
): Promise<R> => {
  try {
    const param = paramSchema.parse(req.params);
    const body = bodySchema.parse(req.body);
    const query = querySchema.parse(req.query);
    const data = await fn({ param, body, query });
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
        'Not implemented',
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

export const createService = <IEndpoint>(
  fn: (input: InferInputs<IEndpoint>) => InferOutputs<IEndpoint>,
) => {
  return (input: InferInputs<IEndpoint>) => fn(input);
};

export const createAsyncService = <IEndpoint>(
  fn: (input: InferInputs<IEndpoint>) => InferOutputsPromise<IEndpoint>,
) => {
  return async (input: InferInputs<IEndpoint>) => await fn(input);
};
