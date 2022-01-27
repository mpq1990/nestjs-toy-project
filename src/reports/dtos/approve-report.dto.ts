import { IsBoolean } from 'class-validator';

export default class ApproveReportDto {
  @IsBoolean()
  approved: boolean;
}
