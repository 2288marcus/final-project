export type User = {
  id?: null | number
  username: string
  fullName: string
  hkId: string
  email: string
  public_key: string
  hk_phone: string
  human_verification: null | boolean
  cv_upload: null | string
  description: null | string
}

export type Job = {
  id?: null | number
  user_id: number
  user?: User
  title: string
  description: string
  price: number
  type: ('demand' | 'supply')
  cancel_time: null | string
}

export type JobComment = {
  id?: null | number
  job_id: number
  job?: Job
  user_id: number
  user?: User
  score: number
  remark: string
}

export type Tag = {
  id?: null | number
  name: string
}

export type JobTag = {
  id?: null | number
  job_id: number
  job?: Job
  tag_id: number
  tag?: Tag
}

export type Bookmark = {
  id?: null | number
  job_id: number
  job?: Job
  user_id: number
  user?: User
}

export type Contract = {
  id?: null | number
  real_price: number
  real_description: string
  estimated_finish_time: string
  real_finish_time: null | string
  confirm_finish_time: null | string
  cancel_time: null | string
  job_id: number
  job?: Job
}

export type Chatroom = {
  id?: null | number
  job_id: number
  job?: Job
  supplier_id: number
  supplier?: User
  demander_id: number
  demander?: User
  contract_id: null | number
  contract?: Contract
}

export type Message = {
  id?: null | number
  chatroom_id: number
  chatroom?: Chatroom
  user_id: number
  user?: User
  content: string
}

export type Transaction = {
  id?: null | number
  real_price: number
  contract_id: number
  contract?: Contract
  direction: ('buyer_to_system' | 'system_to_seller' | 'system_to_buyer')
}
