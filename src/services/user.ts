import { UserData } from '../types'
import { supabase } from '../utils/supabaseClient'

const getUser = async (): Promise<UserData | null> => {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    console.error(error)
    return null
  }

  const uid = data?.user?.id

  if (!uid) {
    console.error('User is null. should this happen?')
    return null
  }

  const res = await supabase.from('users').select('*').eq('user_id', uid)

  if (res.error) {
    console.error(res.error)
    return null
  }

  const user = res.data[0]
  return user
}

export { getUser }
