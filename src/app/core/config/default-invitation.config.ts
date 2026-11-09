import { ResolvedInvitation } from '../models/invitation.model';

export const defaultInvitation: ResolvedInvitation = {
  hero: {
    greeting: 'Thân gửi bạn,',
    message:
      'Mình trân trọng gửi đến bạn lời mời tham dự buổi lễ tốt nghiệp và cùng chia sẻ khoảnh khắc đáng nhớ này.',
    subtitle: 'Hy vọng chúng ta sẽ có cơ hội gặp nhau trong ngày đặc biệt này nhé!',
  },

  profile: {
    heading: 'Một hành trình, một dấu mốc',
    description:
      'Những năm tháng học tập, những trải nghiệm và cả những thử thách đã góp phần tạo nên hành trình đáng nhớ này.',
    personalMessage: 'Mỗi bước đi đều là một phần của hành trình trưởng thành.',
    universityLabel: 'Trường',
    majorLabel: 'Ngành học',
    yearLabel: 'Năm tốt nghiệp',
  },

  event: {
    heading: 'Thông tin buổi lễ',
    subtitle: 'Hẹn gặp bạn trong ngày đặc biệt này nhé!',
    invitationMessage: 'Sự hiện diện của bạn sẽ làm buổi lễ thêm trọn vẹn.',
    mapButtonLabel: 'Xem đường đi',
    calendarButtonLabel: 'Thêm vào lịch',
    dateLabel: 'Ngày',
    timeLabel: 'Thời gian',
    locationLabel: 'Địa điểm',
  },

  gallery: {
    heading: 'Những khoảnh khắc đáng nhớ',
    description: 'Mỗi bức ảnh là một phần của hành trình.',
    closeLabel: 'Đóng',
    previousLabel: 'Ảnh trước',
    nextLabel: 'Ảnh sau',
    // Empty by default: the gallery section is hidden unless a guest defines images.
    images: [],
  },

  rsvp: {
    heading: 'Bạn sẽ đến chung vui cùng mình chứ?',
    subtitle:
      'Mình rất mong được gặp bạn, nhưng dù thế nào cũng cảm ơn bạn đã dành thời gian ghé qua lời mời này nhé!',
    attendingButton: 'Đếm mình một chỗ nhé!',
    attendingDescription: 'Mình sẽ đến chung vui!',
    decliningButton: 'Lần này mình không tham gia được',
    decliningDescription: 'Gửi bạn thật nhiều lời chúc nhé!',
    changeButton: 'Đổi câu trả lời',
    attendingConfirmation: {
      title: 'Tuyệt vời! 🎉',
      message: 'Mình rất vui khi biết bạn sẽ đến. Hẹn gặp bạn trong ngày đặc biệt nhé!',
    },
    decliningConfirmation: {
      title: 'Không sao đâu!',
      message:
        'Cảm ơn bạn đã phản hồi. Dù không thể gặp nhau lần này, mình vẫn rất trân trọng những lời chúc của bạn!',
    },
  },

  closing: {
    heading: 'Cảm ơn bạn đã ghé thăm!',
    message:
      'Sự hiện diện của bạn sẽ là một niềm vui trong ngày đặc biệt này. Hy vọng chúng ta sẽ có thêm một kỷ niệm thật đẹp cùng nhau!',
    signature: 'Thân mến,',
  },
};
