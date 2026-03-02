import { Injectable, NotFoundException } from "@nestjs/common";
import { IMission } from "./mission.interface";
import * as fs from "fs";

@Injectable()
export class MissionService {
  private readonly mission = [
    { id: 1, codename: "OPERATION_STORM", status: "ACTIVE" },
    { id: 2, codename: "SILENT_SNAKE", status: "COMPLETED" },
    { id: 3, codename: "RED_DAWN", status: "FAILED" },
    { id: 4, codename: "BLACKOUT", status: "ACTIVE" },
    { id: 5, codename: "ECHO_FALLS", status: "COMPLETED" },
    { id: 6, codename: "GHOST_RIDER", status: "COMPLETED" },
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

  create(
    mission: Omit<IMission, "id" | "status" | "endDate"> &
      Partial<Pick<IMission, "id" | "status" | "endDate">>,
  ) {
    const data = fs.readFileSync("data/missions.json", "utf8");
    const missions = JSON.parse(data) as IMission[];
    const latestId =
      missions.length > 0 ? Number(missions[missions.length - 1].id) : 0;
    const newMission: IMission = {
      ...mission,
      id: String(latestId + 1),
      status: "ACTIVE",
        endDate: "",
    };

    missions.push(newMission);
    fs.writeFileSync("data/missions.json", JSON.stringify(missions, null, 2));

    return newMission;
  }

  findAll() {
    const data = fs.readFileSync("data/missions.json", "utf8");
    const missions = JSON.parse(data) as IMission[];
    return missions.map((mission) => ({
      ...mission,
      durationDays: mission.endDate
        ? (new Date(mission.endDate).getTime() -
            new Date(mission.startDate).getTime()) /
          86400000
        : -1,
    }));
  }

  remove(id: string) {
    const data = fs.readFileSync("data/missions.json", "utf8");
    const missions = JSON.parse(data) as IMission[];
    const missionIndex = missions.findIndex((mission) => mission.id === id);

    if (missionIndex === -1) {
      throw new NotFoundException("Not Found");
    }

    missions.splice(missionIndex, 1);
    fs.writeFileSync("data/missions.json", JSON.stringify(missions, null, 2));

    return {
      message: `Mission ID ${id} has been successfully deleted.`,
    };
  }

  findOne(id: string, clearance: string = "STANDARD") {
    const data = fs.readFileSync("data/missions.json", "utf8");
    const missions = JSON.parse(data) as IMission[];
    const mission = missions.find((m) => m.id === id)!;
    if (!mission) {
      throw new NotFoundException("for unknown id");
    } else if (mission.riskLevel == "HIGH") {
      if (clearance == "SECRET") {
        return {
          ...mission,
          targetName: "***REDACTED***",
        };
      } else if (clearance == "TOP_SECRET") {
        return mission;
      } else {
        throw new NotFoundException("for insufficient clearance");
      }
    }
    return mission;
  }
}
