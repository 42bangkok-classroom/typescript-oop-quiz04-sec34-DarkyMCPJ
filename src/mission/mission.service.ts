import { IMission } from './mission.interface';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class MissionService {
  private readonly missions = [
    { id: 1, codename: 'OPERATION_STORM', status: 'ACTIVE' },
    { id: 2, codename: 'SILENT_SNAKE', status: 'COMPLETED' },
    { id: 3, codename: 'RED_DAWN', status: 'FAILED' },
    { id: 4, codename: 'BLACKOUT', status: 'ACTIVE' },
    { id: 5, codename: 'ECHO_FALLS', status: 'COMPLETED' },
    { id: 6, codename: 'GHOST_RIDER', status: 'COMPLETED' },
  ];

  getSummary() {
    const activeCount = this.missions.filter(
      (m) => m.status === 'ACTIVE',
    ).length;
    const completeCount = this.missions.filter(
      (m) => m.status === 'COMPLETED',
    ).length;
    const failedCount = this.missions.filter(
      (m) => m.status === 'FAILED',
    ).length;
    return {
      ACTIVE: activeCount,
      COMPLETED: completeCount,
      FAILED: failedCount,
    };
  }
  findAll(): IMission[] {
    const raw = fs.readFile('data/missions.json', 'utf-8');
    return JSON.parse(raw) as IMission[];
  }
}