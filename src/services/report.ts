import { devPrint } from "../components/utils/RandomUtils";
import { RawReport, RawReportBody, Report, ReportBody } from "../types";
import api from "./api";

function serializedReport(report: RawReport): Report {
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

function deserializedReportBody(reportBody: ReportBody): RawReportBody {
  return {
    associated_id: reportBody.associatedId,
    reporter_user_id: reportBody.reporterUserId,
    type: reportBody.type,
    reason: reportBody.reason,
  };
}

export async function getAllReport(): Promise<Report[]> {
  const url = `/reports/all/`;

  const res = await api.get(url);
  devPrint("res:", res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, "data"))
    throw new Error("Failed to get reports");

  const reports: Report[] = res.data.reports?.map((report: RawReport) =>
    serializedReport(report)
  );

  return reports;
}

export async function createReport(body: ReportBody): Promise<Report> {
  const url = `/reports/`;
  const res = await api.post(url, deserializedReportBody(body));
  devPrint("res:", res);
  if (res.status !== 201 || !Object.prototype.hasOwnProperty.call(res, "data"))
    throw new Error("Failed to create report");
  return serializedReport(res.data.report);
}

export async function getMyReport(memberId: number): Promise<Report[]> {
  const url = `/reports/users/${memberId}/`;

  const res = await api.get(url);
  devPrint("res:", res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, "data"))
    throw new Error("Failed to get reports");

  const reports: Report[] = res.data.map((report: RawReport) =>
    serializedReport(report)
  );

  return reports;
}

export async function getReportDetail(reportId: string): Promise<Report> {
  const url = `/reports/${reportId}/`;

  const res = await api.get(url);
  devPrint("res:", res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, "data"))
    throw new Error("Failed to get report");

  return serializedReport(res.data);
}
