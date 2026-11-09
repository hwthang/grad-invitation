export interface GraduationInfo {
  graduateName: string;
  university: string;
  major: string;
  graduationYear: number;
  portrait: string;

  event: {
    title: string;
    /** ISO date, e.g. 2026-12-20 */
    date: string;
    /** 24h time, e.g. 09:00 */
    startTime: string;
    location: string;
    address: string;
    mapUrl: string;
  };
}
