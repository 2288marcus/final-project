export type User = {
  id?: null | number
  username: string
  fullName: string
  hkId: string
  email: string
  card: null | string
  public_key: null | string // char(64)
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
  type: ('demand' | 'offer')
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
  buyer_user_id: number
  buyer_user?: User
  seller_user_id: number
  seller_user?: User
  created_at: string
  updated_at: string
  job_id: number
  job?: Job
}

export type Transaction = {
  id?: null | number
  amount: number
  user_id: number
  user?: User
  direction: ('from_system' | 'to_system')
}

export type Contract = {
  id?: null | number
  buyer_user_id: number
  buyer_user?: User
  seller_user_id: number
  seller_user?: User
  start_time: string
  estimated_finish_time: string
  claim_finish_time: null | string
  confirm_finish_time: null | string
  reject_finish_time: null | string
  cancel_time: null | string
  cancel_by_user_id: null | number
  cancel_by_user?: User
  estimated_payment_release_time: string
  system_receive_payment_id: null | number
  system_receive_payment?: Transaction
  system_send_payment_id: null | number
  system_send_payment?: Transaction
  job_id: number
  job?: Job
}

export type ChatMessage = {
  id?: null | number
  contract_id: number
  contract?: Contract
  user_id: number
  user?: User
  content: number
}
