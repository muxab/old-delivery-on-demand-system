import { SetMetadata } from '@nestjs/common';
import { AccountStatus } from './account-status.enum';

export const STATUS_KEY = 'status';
export const Status = (...status: AccountStatus[]) => SetMetadata(STATUS_KEY, status);
