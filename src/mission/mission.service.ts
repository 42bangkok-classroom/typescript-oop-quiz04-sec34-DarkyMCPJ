import { Injectable } from '@nestjs/common';

@Injectable()
export class MissionService {
  getSummary(): string {
    return 'Hello World!';
  }
}