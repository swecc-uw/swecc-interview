import { SignupData, SignupRecord } from "../types";
import { createClient } from "@supabase/supabase-js";
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
    console.log(error);
    return null;
  }

  let createFlag = false;
  console.log(data)
  if (data.length === 0) {
    createFlag = true;
  }

  if (data.length > 0) {
    console.log('found a form')
    const lastFormCreatedAt = new Date(data[0].created_at);
    console.log(`checking if ${lastFormCreatedAt} is less than ${lastMonday}`)
    if (lastFormCreatedAt.getDate() < lastMonday.getDate()) {
      console.log('it was')
      createFlag = true;
    } else {
      console.log('it was not')
      return data[0].id;
    }
  }

  if (createFlag) {
    console.log('creating a new form')
    const { data, error } = await supabase
      .from('forms')
      .insert({})
      .select('id');
    if (error) {
      console.log(error);
      return null;
    }
    return data[0].id;
  }
}


export const submitSignup = async (signup: SignupData) => {
  const fid = await getActiveFormID();
  let sr: SignupRecord = {
    first_name: signup.firstName,
    email: signup.email,
    discord: signup.discord,
    form_id: fid,
    availability: JSON.stringify(signup.availability),
    last_name: signup.lastName
  }

  // if signup for form_id and email exists, update it
  // else insert a new record
  const { data, error } = await supabase
    .from('signups')
    .select('id')
    .eq('email', signup.email)
    .eq('form_id', fid)

  if (error) {
    console.log(error);
    return null;
  }

  let sid = data.length > 0 ? data[0].id : null;

  if (sid) {
    const { data, error } = await supabase
      .from('signups')
      .update(sr)
      .eq('email', signup.email)
      .eq('form_id', fid)
      .eq('id', sid)
    if (error) {
      console.log(error);
      return null;
    }
  } else {
    const { data, error } = await supabase
      .from('signups')
      .insert(sr)
      .select('id')
    if (error) {
      console.log(error);
      return null;
    }

    sid = data[0].id;

  }

  if (error) {
    console.log(error);
    return null;
  }

  console.log(sid);
  return sid;
};

