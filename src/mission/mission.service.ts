import { Injectable } from '@nestjs/common';
import { IMission } from './mission.interface';
import * as fs from 'fs';
import * as path from 'path';

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

findAll(): IMission[] {
    const filePath = path.join(process.cwd(), 'data', 'missions.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const missions: IMission[] = JSON.parse(rawData);

    return missions.map((mission) => {
      let durationDays = -1;

      if (mission.endDate) {
        const start = new Date(mission.startDate);
        const end = new Date(mission.endDate);
        
        const diffInMs = end.getTime() - start.getTime();
        durationDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      }

      return {
        ...mission,
        durationDays: durationDays,
      };
    });
  }

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
