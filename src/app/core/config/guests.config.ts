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
      // Voice: anh (graduate) speaking to em (Hằng).
      hero: {
        greeting: 'Gửi em Hằng,',
        message:
          'Ngày tốt nghiệp của anh sẽ trọn vẹn hơn rất nhiều nếu có em ở bên cạnh. Anh muốn mời em đến chung vui nhé!',
        subtitle: 'Anh mong được gặp em trong ngày đặc biệt này!',
      },
      profile: {
        heading: 'Một chặng đường có em đồng hành',
        description: 'Cảm ơn em vì đã luôn ở bên, cùng anh đi qua những ngày vui lẫn những ngày mệt mỏi.',
        personalMessage: 'Mỗi bước anh đi đều có một phần của em.',
      },
      event: {
        subtitle: 'Anh hẹn gặp em trong ngày đặc biệt này nhé!',
        invitationMessage: 'Có em ở đó, buổi lễ của anh sẽ thêm trọn vẹn.',
      },
      rsvp: {
        heading: 'Em sẽ đến cùng anh chứ?',
        subtitle:
          'Anh rất mong được gặp em, nhưng dù thế nào cũng cảm ơn em đã dành thời gian ghé qua lời mời này nhé!',
        attendingButton: 'Chắc chắn rồi, em sẽ đến!',
        attendingDescription: 'Em sẽ đến chung vui cùng anh!',
        decliningButton: 'Tiếc quá, lần này em bận mất rồi',
        decliningDescription: 'Em gửi anh thật nhiều lời chúc nhé!',
        attendingConfirmation: {
          message: 'Anh rất vui khi biết em sẽ đến. Hẹn gặp em trong ngày đặc biệt nhé!',
        },
        decliningConfirmation: {
          title: 'Không sao đâu em!',
          message:
            'Cảm ơn em đã phản hồi. Dù không thể gặp nhau lần này, anh vẫn rất trân trọng những lời chúc của em!',
        },
      },
      closing: {
        heading: 'Cảm ơn em đã ghé thăm!',
        message:
          'Sự hiện diện của em sẽ là niềm vui lớn nhất của anh trong ngày đặc biệt này. Hy vọng chúng ta sẽ có thêm một kỷ niệm thật đẹp cùng nhau!',
        signature: 'Thương em,',
        additionalMessage: 'Có em ở đó, anh sẽ thấy ngày hôm ấy thật đặc biệt.',
      },
    },
  },
};
