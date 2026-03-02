import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { MissionService } from './mission.service';
import type { CreateMissionDto } from './mission.interface';
@Controller('missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get()
  findAll() {
    return this.missionService.findAll();
  }

  @Get('summary')
  getSummary() {
    return this.missionService.getSummary();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('clearance') clearance: string) {
    return this.missionService.findOne(id, clearance);
  }
  
  @Post()
  create(@Body() body: CreateMissionDto) {
    return this.missionService.create(body);
  }
}
