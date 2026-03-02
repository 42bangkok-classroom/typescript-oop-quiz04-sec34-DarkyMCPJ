import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IMission } from './mission.interface';

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
    const missionsData: IMission[] = JSON.parse(rawData);

    return missionsData.map((m) => {
      let duration = -1;
      if (m.endDate) {
        const start = new Date(m.startDate);
        const end = new Date(m.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        duration = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
      }
      return { ...m, durationDays: duration };
    });
  }

  getSummary() {
    const res = {
      ACTIVE: 0,
      COMPLETED: 0,
      FAILED: 0,
    };

    for (let i = 0; i < this.missions.length; i++) {
      const data: any = this.missions[i]; 
      if (data.status in res) {
        res[data.status as keyof typeof res]++;
      }
    }

    return res;
  }
}