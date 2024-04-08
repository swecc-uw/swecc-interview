import { supabase } from '../utils/supabaseClient'
import { getActiveSignupFormID } from './form'

export const testDB = async () => {
  const { data, error } = await supabase.from('signups').select('*')
  console.log(data, error)
  return data
}

export const submitSignup = async (
  userId: string,
  availability: boolean[][]
) => {
  const fid = await getActiveSignupFormID()

  if (!fid) {
    console.error('no active form found')
    return false
  }

  // if signup for form_id and email exists, update it
  // else insert a new record
  const { data, error } = await supabase
    .from('signups')
    .select('*')
    .eq('user_id', userId)
    .eq('form_id', fid)

  if (error) {
    console.error(error)
    return false
  }

  if (data.length > 0) {
    const res = await supabase
      .from('signups')
      .update({ availability })
      .eq('user_id', userId)
      .eq('form_id', fid)
    if (res.error) {
      console.error(error)
      return false
    }
  } else {
    const { error } = await supabase
      .from('signups')
      .insert({ user_id: userId, form_id: fid, availability })
    if (error) {
      console.error(error)
      return false
    }
  }

  if (error) {
    console.error(error)
    return false
  }

  return true
}
