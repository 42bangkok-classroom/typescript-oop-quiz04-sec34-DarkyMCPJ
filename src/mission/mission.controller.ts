import { Controller, Get, Query } from "@nestjs/common";
import { MissionService } from "./mission.service";

@Controller("missions")
export class MissionController {
  constructor(private readonly missionService: MissionService) {}
  @Get("summary")
  getSummary() {
    return this.missionService.getSummary();
  }
  @Get(":id")
  getMissionById(id: string, @Query("clearance") clearance?: string) {
    return this.missionService.findOne(id, clearance);
  }
}