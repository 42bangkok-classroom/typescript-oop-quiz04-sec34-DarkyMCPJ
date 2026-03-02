import { Controller, Get } from '@nestjs/common';
import { MissionService } from './mission.service';
import { IMission } from './mission.interface';

@Controller('missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get()
  findAll(): IMission[] {
    return this.missionService.findAll();
  }

  @Get('summary')
  getSummary() {
    return this.missionService.getSummary();
  }
}
