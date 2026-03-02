import { Injectable } from '@nestjs/common';

@Injectable()
export class MissionService {
  private readonly mission = [
    { id: 1, codename: 'OPERATION_STORM', status: 'ACTIVE' },
    { id: 2, codename: 'SILENT_SNAKE', status: 'COMPLETED' },
    { id: 3, codename: 'RED_DAWN', status: 'FAILED' },
    { id: 4, codename: 'BLACKOUT', status: 'ACTIVE' },
    { id: 5, codename: 'ECHO_FALLS', status: 'COMPLETED' },
    { id: 6, codename: 'GHOST_RIDER', status: 'COMPLETED' },
  ];

  getSummary() {
    const res = {
      ACTIVE: 0,
      COMPLETED: 0,
      FAILED: 0,
    };

    for (let i = 0; i < this.mission.length; i++) {
      const data = this.mission[i];
      if (data.status in res) {
        res[data.status as keyof typeof res]++;
      }
    }

    return res;
  }
}