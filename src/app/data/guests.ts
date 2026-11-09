export interface GuestDetail {
  /** Tên hiển thị */
  displayName: string;
  /** Cách xưng hô */
  title: string;
  /** Lời nhắn riêng */
  message: string;
  /** Bàn ngồi */
  table: string;
}

export interface EventInfo {
  title: string;
  date: string;
  time: string;
  place: string;
}

export const EVENT: EventInfo = {
  title: 'Lễ Tốt Nghiệp',
  date: '20/12/2026',
  time: '09:00',
  place: 'Hội trường A, Đại học Demo',
};

/** Key = tên đã chuẩn hóa (chữ thường, bỏ dấu, bỏ khoảng trắng thừa) */
export const GUESTS: Record<string, GuestDetail> = {
  'nguyen van a': {
    displayName: 'Nguyễn Văn A',
    title: 'Bạn',
    message: 'Rất vui được mời bạn đến chung vui cùng mình!',
    table: 'Bàn 1',
  },
  'tran thi b': {
    displayName: 'Trần Thị B',
    title: 'Chị',
    message: 'Sự hiện diện của chị là niềm vinh dự của em.',
    table: 'Bàn 2',
  },
  thang: {
    displayName: 'Thắng',
    title: 'Anh',
    message: 'Cảm ơn anh đã luôn đồng hành!',
    table: 'Bàn VIP',
  },
};

export function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

export function findGuest(name: string): GuestDetail | undefined {
  return GUESTS[normalizeName(name)];
}
