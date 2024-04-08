import { supabase } from '../utils/supabaseClient'

const getPairsForUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('pairs')
    .select('*')
    .or(`p1_id.eq.${userId},p2_id.eq.${userId}`)

  if (error) {
    console.error(error)
    return null
  }

  if (!data || data.length === 0) return null

  const partners = data
    .sort((a, b) => a.form_id - b.form_id)
    .map(pair =>
      pair.p1_id === userId
        ? { pid: pair.p2_id, date: pair.created_at, form_id: pair.form_id, seq: 0}
        : { pid: pair.p1_id, date: pair.created_at, form_id: pair.form_id, seq: 1}
    )

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .in(
      'user_id',
      partners.map(p => p.pid)
    )

  if (userError) {
    console.error(userError)
    return null
  }

  const result = partners.map(partner => {
    const user = userData.find(u => u.user_id === partner.pid)
    return {
      date: partner.date,
      partner: user,
      form_id: partner.form_id,
      seq: partner.seq
    }
  })

  return result
}

export { getPairsForUser }
