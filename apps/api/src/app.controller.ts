import { Controller, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { InferInputs, InferOutputs, endpoints } from 'api-interface';
import { Request } from 'express';
import { InferMethod, Input, createController } from './utils/common.utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @InferMethod(endpoints.getProductsById)
  getProductsById(
    @Input(endpoints.getProductsById)
    input: InferInputs<typeof endpoints.getProductsById>,
  ): InferOutputs<typeof endpoints.getProductsById> {
    const {
      param: { pid },
    } = input;
    return { pid, productName: 1 } as any;
  }

  @InferMethod(endpoints.getUserById)
  getUserById(@Req() req: Request) {
    return createController(endpoints.getUserById, req, async ({ param }) => {
      const { uid } = param;
      return { uid, username: 'hold' };
    });
  }

  @InferMethod(endpoints.getStudentById)
  getStudentById(@Req() req: Request) {
    return createController(
      endpoints.getStudentById,
      req,
      this.appService.getStudentById,
    );
  }

  @InferMethod(endpoints.getAllUsers)
  getAllUsers(@Req() req: Request) {
    return createController(
      endpoints.getAllUsers,
      req,
      this.appService.getAllUsers,
    );
  }
}
