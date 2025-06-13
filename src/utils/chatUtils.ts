import { supabase } from "../services/supabase";

export const getOrCreateChatId = async (
  user1Id: string,
  user2Id: string
): Promise<string | null> => {
  try {
    const { data: existingChats, error: fetchError } = await supabase
      .from('chats')
      .select('*')
      .or(
        `and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`
      );

    if (fetchError) {
      console.error('Chat fetch failed:', fetchError.message);
      return null;
    }

    if (existingChats && existingChats.length > 0) {
      return existingChats[0].id;
    }

    const { data, error: insertError } = await supabase
      .from('chats')
      .insert([{ user1_id: user1Id, user2_id: user2Id }])
      .select()
      .single();

    if (insertError) {
      console.error('Chat creation failed:', insertError.message);
      return null;
    }

    return data.id;
  } catch (err) {
    console.error('Unexpected error in getOrCreateChatId:', err);
    return null;
  }
};
