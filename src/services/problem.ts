import { supabase } from "../utils/supabaseClient";
import { getPairsForUser } from "./pair";

async function getAllProblems() {
  const { data, error } = await supabase
    .from('problems')
    .select('*')
  if (error) {
    console.error(error)
    return null
  }
  return data
}

// returns questions the user should
// use while interviewing their partner
export async function getProblemsForUser(userId: string) {

  const pairs = await getPairsForUser(userId)
  const questions = await getAllProblems()

  if (!pairs) return null
  if (!questions) return null

  const formQuestionMap: { [key: number]: { [key: number]: any } } = {}
  questions.forEach(q => {
    if (!formQuestionMap[q.form_id]) {
      formQuestionMap[q.form_id] = {}
    }
    formQuestionMap[q.form_id][q.seq] = q
  })

  const seqFormMap: { [key: number]: number } = {}
  pairs.forEach(pair => {
    seqFormMap[pair.form_id] = pair.seq
  })

  // formId -> questionData for the user
  const result: { [key: number]: any } = {}

  for (const formId in seqFormMap) {
    const seq = seqFormMap[parseInt(formId)]
    const questionData = formQuestionMap[parseInt(formId)][seq]
    result[parseInt(formId)] = questionData
  }

  return result
}