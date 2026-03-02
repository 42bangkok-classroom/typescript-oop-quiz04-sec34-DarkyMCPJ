import { Module } from "@nestjs/common";
import { MissionModule } from "src/mission/mission.module";

@Module({
  imports: [MissionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}