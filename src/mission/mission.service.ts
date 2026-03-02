import { IMission } from './mission.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';

interface CreateMissionDto {
  codename: string;
  riskLevel: string;
  targetName: string;
  startDate: string;
}

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
  findAll() {
    const raw = fs.readFileSync('data/missions.json', 'utf8');
    const jsonMission = JSON.parse(raw) as IMission[];
    return jsonMission.map((mission) => ({
      ...mission,
      durationDays: mission.endDate
        ? (new Date(mission.endDate).getTime() -
            new Date(mission.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
        : -1,
    }));
  }

  findOne(id: string, clearance: string) {
    const raw = fs.readFileSync('data/missions.json', 'utf8');
    const jsonMission = JSON.parse(raw) as IMission[];
    const found = jsonMission.find((mission) => mission.id === id);
    if (!found) throw new NotFoundException();
    const risk = found.riskLevel;
    if (
      (risk === 'HIGH' || risk === 'CRITICAL') &&
      clearance !== 'TOP_SECRET'
    ) {
      found.targetName = '***REDACTED***';
    }
    return found;
  }

  create(body: CreateMissionDto) {
    const raw = fs.readFileSync('data/missions.json', 'utf8');
    const jsonMission = JSON.parse(raw) as IMission[];

    const last = jsonMission[jsonMission.length - 1];
    const lastIdNum = last ? Number(last.id) : 0;
    const nextId = String(lastIdNum + 1);

    const newMission: IMission = {
      id: nextId,
      codename: body.codename,
      status: 'ACTIVE',
      riskLevel: body.riskLevel,
      targetName: body.targetName,
      startDate: body.startDate,
      endDate: null,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    jsonMission.push(newMission as any);
    fs.writeFileSync(
      'data/missions.json',
      JSON.stringify(jsonMission, null, 2),
      'utf8',
    );
    return newMission;
  }
}
