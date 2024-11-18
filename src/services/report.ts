import { devPrint } from "../components/utils/RandomUtils";
import { RawReport, ReportBody } from "../types";
import api from "./api";

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

export async function getMyReport(memberId: number): Promise<RawReport[]> {
  const url = `/reports/users/${memberId}/`;

  const res = await api.get(url);
  devPrint("res:", res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, "data"))
    throw new Error("Failed to get reports");

  return res.data;
}

export async function getReportDetail(reportId: string): Promise<RawReport> {
  const url = `/reports/${reportId}/`;

  const res = await api.get(url);
  devPrint("res:", res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, "data"))
    throw new Error("Failed to get report");

  return res.data;
}
