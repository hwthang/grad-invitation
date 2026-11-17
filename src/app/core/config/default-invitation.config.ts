import { Address, ResolvedInvitation } from '../models/invitation.model';

/**
 * How the graduate addresses the guest. `you` is the guest, `me` the graduate (assumed male),
 * `self` is how the guest refers to themself in their own replies.
 */
const PRONOUNS: Record<Address, { you: string; me: string; self: string }> = {
  anh: { you: 'anh', me: 'em', self: 'anh' },
  chi: { you: 'chị', me: 'em', self: 'chị' },
  em: { you: 'em', me: 'anh', self: 'em' },
  ban: { you: 'bạn', me: 'mình', self: 'mình' },
};

export const ADDRESS_LABELS: Record<Address, string> = { anh: 'Anh', chi: 'Chị', em: 'Em', ban: 'Bạn' };
export const ADDRESS_OPTIONS = Object.keys(PRONOUNS) as Address[];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** The default invitation text, worded for the chosen form of address. */
export function defaultInvitationFor(address: Address = 'ban'): ResolvedInvitation {
  const { you, me, self } = PRONOUNS[address] ?? PRONOUNS.ban;
  return {
    hero: {
      greeting: `Thân gửi ${you},`,
      message: `${cap(me)} trân trọng mời ${you} đến dự lễ tốt nghiệp của ${me}.`,
    },

    event: {
      heading: 'Thông tin buổi lễ',
      invitationMessage: `Sự có mặt của ${you} là niềm vui của ${me}.`,
      mapButtonLabel: 'Xem đường đi',
      calendarButtonLabel: 'Thêm vào lịch',
      dateLabel: 'Ngày',
      timeLabel: 'Thời gian',
      locationLabel: 'Địa điểm',
    },

    gallery: {
      heading: 'Khoảnh khắc đáng nhớ',
      closeLabel: 'Đóng',
      previousLabel: 'Ảnh trước',
      nextLabel: 'Ảnh sau',
      // Empty by default: the gallery section is hidden unless a guest defines images.
      images: [],
    },

    rsvp: {
      heading: `${cap(you)} sẽ đến chứ?`,
      attendingButton: `${cap(self)} sẽ đến!`,
      decliningButton: `${cap(self)} bận ùi`,
      changeButton: 'Đổi câu trả lời',
      closeButton: 'Đóng',
      attendingConfirmation: {
        title: 'Tuyệt vời! 🎉',
        message: `Hẹn gặp ${you} trong ngày đặc biệt nhé!`,
      },
      decliningConfirmation: {
        title: 'Không sao đâu!',
        message: `Cảm ơn ${you} đã phản hồi và những lời chúc!`,
      },
    },

    closing: {
      heading: `Cảm ơn ${you}!`,
      message: `Có ${you} ở đó là ${me} vui lắm rồi.`,
      signature: 'Thân mến,',
    },
  };
}

export const defaultInvitation = defaultInvitationFor('ban');
