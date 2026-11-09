import { Guest } from '../models/guest.model';
import { defaultInvitation } from './default-invitation.config';

export const DEFAULT_GUEST_ID = 'guest';

export const defaultGuest: Guest = {
  id: DEFAULT_GUEST_ID,
  name: 'Bạn',
  relationship: 'Guest',
  image: '/assets/images/default-guest.svg',
  invitation: defaultInvitation,
};

/**
 * Named guests. Each guest only needs to define the invitation fields it overrides;
 * everything else is inherited from the default invitation.
 */
export const guestMap: Record<string, Guest> = {
  'guest-001': {
    id: 'guest-001',
    name: 'Nguyễn Văn A',
    aliases: ['A', 'Văn A'],
    image: '/assets/images/guests/nguyen-van-a.svg',
    relationship: 'Close Friend',
    invitation: {
      hero: {
        greeting: 'Gửi A,',
        message:
          'Cuối cùng cũng đến ngày này rồi! Mình muốn mời bạn đến chung vui và cùng lưu giữ thêm một kỷ niệm đẹp nhé!',
      },
      profile: {
        heading: 'Một chặng đường đã qua!',
        description: 'Thật vui vì trong hành trình này có những người bạn như A.',
      },
      rsvp: {
        heading: 'Có mặt để chung vui với mình nhé?',
        attendingButton: 'Chắc chắn rồi!',
        decliningButton: 'Tiếc quá, lần này mình bận mất rồi!',
      },
    },
  },

  'guest-002': {
    id: 'guest-002',
    name: 'Trần Thị B',
    aliases: ['B', 'Chị B'],
    relationship: 'Senior',
    invitation: {
      hero: {
        greeting: 'Kính gửi chị B,',
        message: 'Sự hiện diện của chị sẽ là niềm vinh dự của em trong ngày tốt nghiệp.',
      },
    },
  },

  'guest-003': {
    id: 'guest-003',
    name: 'Thắng',
    aliases: ['Anh Thắng'],
    relationship: 'Mentor',
    invitation: {
      hero: { greeting: 'Gửi anh Thắng,' },
      closing: { additionalMessage: 'Cảm ơn anh đã luôn đồng hành!' },
    },
  },

  'guest-004': {
    id: 'guest-004',
    name: 'Nguyễn Thị Thanh Hằng',
    aliases: ['Thanh Hằng', 'Hằng'],
    relationship: 'Partner',
    theme: 'pink',
    invitation: {
      hero: {
        greeting: 'Gửi Hằng,',
        message:
          'Ngày tốt nghiệp của mình sẽ trọn vẹn hơn rất nhiều nếu có Hằng ở bên cạnh. Mình muốn mời Hằng đến chung vui nhé!',
      },
      profile: {
        heading: 'Một chặng đường có Hằng đồng hành',
        description: 'Cảm ơn Hằng vì đã luôn ở bên, cùng mình đi qua những ngày vui lẫn những ngày mệt mỏi.',
      },
      rsvp: {
        heading: 'Hằng sẽ đến cùng mình chứ?',
        attendingButton: 'Chắc chắn rồi, em sẽ đến!',
        decliningButton: 'Tiếc quá, lần này em bận mất rồi',
      },
      closing: {
        additionalMessage: 'Có Hằng ở đó, mình sẽ thấy ngày hôm ấy thật đặc biệt.',
      },
    },
  },
};
