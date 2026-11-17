import { ResolvedInvitation } from '../models/invitation.model';

export const defaultInvitation: ResolvedInvitation = {
  hero: {
    greeting: 'Thân gửi bạn,',
    message: 'Mình trân trọng mời bạn đến dự lễ tốt nghiệp của mình.',
  },

  event: {
    heading: 'Thông tin buổi lễ',
    invitationMessage: 'Sự có mặt của bạn là niềm vui của mình.',
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
    heading: 'Bạn sẽ đến chứ?',
    attendingButton: 'Mình sẽ đến!',
    decliningButton: 'Mình bận ùi',
    changeButton: 'Đổi câu trả lời',
    closeButton: 'Đóng',
    attendingConfirmation: {
      title: 'Tuyệt vời! 🎉',
      message: 'Hẹn gặp bạn trong ngày đặc biệt nhé!',
    },
    decliningConfirmation: {
      title: 'Không sao đâu!',
      message: 'Cảm ơn bạn đã phản hồi và những lời chúc!',
    },
  },

  closing: {
    heading: 'Cảm ơn bạn!',
    message: 'Hy vọng chúng ta sẽ có thêm một kỷ niệm đẹp cùng nhau.',
    signature: 'Thân mến,',
  },
};
