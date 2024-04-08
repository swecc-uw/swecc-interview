import { supabase } from '../utils/supabaseClient';

export const getActiveSignupFormID = async (): Promise<number | null> => {
  // if the last form id was created before last Monday, create a new form
  const { data, error } = await supabase
    .from('forms')
    .select('id, created_at, state')
    .eq('state', 'active')

  if (error) {
    console.error(error)
    return null
  }

  if (data.length === 0) {
    console.error('no forms found')
    return null
  }

  if (data.length > 1) {
    console.error('more than one active form found')
    return null
  }

  return data[0].id
}

export const getActiveInterviewFormID = async () => {
  const { data, error } = await supabase
    .from('forms')
    .select('id, created_at, state')
    .eq('state', 'interview')

  if (error) {
    console.error(error)
    return null
  }

  if (data.length === 0) {
    console.error('no forms found')
    return null
  }

  if (data.length > 1) {
    console.error('more than one active form found')
    return null
  }

  return data[0].id
}