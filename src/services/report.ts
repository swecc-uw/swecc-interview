import { devPrint } from "../components/utils/RandomUtils";
import { RawReport, Report, ReportBody } from "../types";
import api from "./api";

function deserializedReport(report: RawReport): Report {
  const ret: Report = {
    created: report.created,
    reason: report.reason,
    reportId: report.report_id,
    reporterUserId: report.reporter_user_id,
    status: report.status,
    type: report.type,
    updated: report.updated,
  };

  if (report.admin_id) ret.adminId = report.admin_id;
  if (report.admin_notes) ret.adminNotes = report.admin_notes;
  if (report.associated_id) ret.associatedId = report.associated_id;

  return ret;
}

export async function getAllReport(): Promise<RawReport[]> {
  const url = `/reports/all/`;

  const res = await api.get(url);
  devPrint("res:", res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, "data"))
    throw new Error("Failed to get reports");

  return res.data;
}

export async function createReport(body: ReportBody): Promise<RawReport> {
  const url = `/reports/`;
  const res = await api.post(url, body);
  devPrint("res:", res);
  if (res.status !== 201 || !Object.prototype.hasOwnProperty.call(res, "data"))
    throw new Error("Failed to create report");
  return res.data;
}

export async function getMyReport(memberId: number): Promise<Report[]> {
  const url = `/reports/users/${memberId}/`;

  const res = await api.get(url);
  devPrint("res:", res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, "data"))
    throw new Error("Failed to get reports");

  const reports: Report[] = res.data.map((report: RawReport) =>
    deserializedReport(report)
  );

  return reports;
}

export async function getReportDetail(reportId: string): Promise<Report> {
  const url = `/reports/${reportId}/`;

  const res = await api.get(url);
  devPrint("res:", res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, "data"))
    throw new Error("Failed to get report");

  return deserializedReport(res.data);
}
