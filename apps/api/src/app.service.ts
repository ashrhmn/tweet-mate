import { Injectable } from '@nestjs/common';
import { endpoints } from 'api-interface';
import { createAsyncService } from './utils/common.utils';

@Injectable()
export class AppService {
  async getHello({ pid }: { pid: number }) {
    return { pid, productName: '' };
  }

  getStudentById = createAsyncService<typeof endpoints.getStudentById>(
    async ({ param }) => ({
      sid: param.sid,
      studentName: 'hola',
    }),
  );

  getAllUsers = createAsyncService<typeof endpoints.getAllUsers>(async () => [
    { uid: 1, username: 'user1' },
    { uid: 2, username: 'user2' },
  ]);
}
