import { devPrint } from '../components/utils/RandomUtils';
import { RawReport, RawReportBody, Report, ReportBody } from '../types';
import api from './api';

function deserializedReport({
  created: created,
  reason: reason,
  report_id: report_id,
  reporter_user_id: reporter_user_id,
  status: status,
  type: type,
  updated: updated,
  admin_id: admin_id,
  admin_notes: admin_notes,
  associated_id: associated_id,
  ...rest
}: RawReport): Report {
  const ret: Report = {
    created: created,
    reason: reason,
    reportId: report_id,
    reporterUserId: reporter_user_id,
    status: status,
    type: type,
    updated: updated,
  };

  if (admin_id) ret.adminId = admin_id;
  if (admin_notes) ret.adminNotes = admin_notes;
  if (associated_id) ret.associatedId = associated_id;

  return { ...ret, ...rest };
}

function serializedReportBody({
  associatedId: associatedId,
  reporterUserId: reporterUserId,
  type: type,
  reason: reason,
  ...rest
}: ReportBody): RawReportBody {
  return {
    associated_id: associatedId,
    reporter_user_id: reporterUserId,
    type: type,
    reason: reason,
    ...rest,
  };
}

export async function getAllReport(): Promise<Report[]> {
  const url = `/reports/all/`;

  const res = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get reports');

  const reports: Report[] = res.data.reports?.map(deserializedReport) || [];
  return reports;
}

export async function createReport(body: ReportBody): Promise<Report> {
  const url = `/reports/`;
  const res = await api.post(url, serializedReportBody(body));
  devPrint('res:', res);
  if (res.status !== 201 || !Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to create report');
  return deserializedReport(res.data.report);
}

export async function getMyReport(memberId: number): Promise<Report[]> {
  const url = `/reports/users/${memberId}/`;

  const res = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get reports');

  const reports: Report[] = res.data.map(deserializedReport);

  return reports;
}

export async function getReportDetail(reportId: string): Promise<Report> {
  const url = `/reports/${reportId}/`;

  const res = await api.get(url);
  devPrint('res:', res);

  if (res.status !== 200 || !Object.prototype.hasOwnProperty.call(res, 'data'))
    throw new Error('Failed to get report');

  return deserializedReport(res.data);
}
