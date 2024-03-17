import { getNextMonday } from "../utils/time";
import { supabase } from "../utils/supabaseClient";

export const testDB = async () => {
  const { data, error } = await supabase
    .from('signups')
    .select('*')
  console.log(data, error)
  return data
}

export const getActiveFormID = async () => {
  const lastMonday = getNextMonday(new Date());
  lastMonday.setDate(lastMonday.getDate() - 7);
  // if the last form id was created before last Monday, create a new form
  const { data, error } = await supabase
    .from('forms')
    .select('id, created_at')
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error(error);
    return null;
  }

  console.log(data);
  if (data.length === 0) {
    console.error('no forms found')
    return null;
  }

  console.log('found a form')
  const lastFormCreatedAt = new Date(data[0].created_at);
  console.log(`checking if ${lastFormCreatedAt} is less than ${lastMonday}`)
  if (lastFormCreatedAt.getDate() < lastMonday.getDate()) {
    console.log('it was')
  } else {
    console.log('it was not')
    return data[0].id;
  }
}


export const submitSignup = async (userId: string, availability: boolean[][]) => {
  const fid = await getActiveFormID();

  if (!fid) {
    console.error('no active form found');
    return false;
  }

  // if signup for form_id and email exists, update it
  // else insert a new record
  const { data, error } = await supabase
    .from('signups')
    .select('*')
    .eq('user_id', userId)
    .eq('form_id', fid)

  if (error) {
    console.error(error);
    return false;
  }

  if (data.length > 0) {
    console.log('updating', data)
    const res = await supabase
      .from('signups')
      .update({ availability })
      .eq('user_id', userId)
      .eq('form_id', fid)
    if (res.error) {
      console.error(error);
      return false;
    }

  } else {
    console.log('inserting')
    const { error } = await supabase
      .from('signups')
      .insert({ user_id: userId, form_id: fid, availability })
    if (error) {
      console.error(error);
      return false;
    }

  }

  if (error) {
    console.error(error);
    return false;
  }

  return true;
};

