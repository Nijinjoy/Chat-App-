import moment from 'moment';

export type Message = {
  id: string;
  message: string;
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
};

export const groupMessagesByDate = (messages: Message[]) => {
  return messages.reduce((acc: Record<string, Message[]>, msg) => {
    const date = moment(msg.created_at).startOf('day');
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'day').startOf('day');

    const label = date.isSame(today)
      ? 'Today'
      : date.isSame(yesterday)
      ? 'Yesterday'
      : date.format('MMMM D, YYYY');

    if (!acc[label]) {
      acc[label] = [];
    }
    acc[label].push(msg);
    return acc;
  }, {});
};
