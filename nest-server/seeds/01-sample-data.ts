import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  async function seedRow<T>(
    table: string,
    key: keyof T,
    data: T,
  ): Promise<number> {
    let row = await knex(table).select('id').where(key, data[key]).first()
    if (row) {
      await knex(table).where({ id: row.id }).update(data)
      return row.id
    } else {
      let [{ id }] = await knex(table).insert(data).returning('id')
      return id
    }
  }

  let john_doe_id = await seedRow('user', 'username', {
    username: 'john_doe',
    fullName: 'John Doe',
    hkId: 'A1234567',
    email: 'john.doe@example.com',
    public_key:
      'fdf3226743429e4dedaf107bad8887c191142fc713c04da2ab60ad2d6eeab7bf',
    hk_phone: '12345678',
    human_verification: true,
    cv_upload: 'path/to/cv.pdf',
  })
  let jane_smith_id = await seedRow('user', 'username', {
    username: 'jane_smith',
    fullName: 'Jane Smith',
    hkId: 'B9876543',
    email: 'jane.smith@example.com',
    public_key:
      'dfbb547e78471a9dd36bb703fbe1b62b3265be823f66a468806b98f7b6947528',
    hk_phone: '87654321',
    human_verification: false,
    cv_upload: 'path/to/cv.pdf',
  })

  let web_job_id = await seedRow('job', 'title', {
    user_id: john_doe_id, // Foreign key referencing user.id
    title: 'Web Developer',
    description: 'We are looking for a skilled web developer...',
    price: 5000,
    type: 'demand',
  })
  let design_job_id = await seedRow('job', 'title', {
    user_id: jane_smith_id, // Foreign key referencing user.id
    title: 'Graphic Designer',
    description: 'We need a creative graphic designer...',
    price: 3000,
    type: 'offer',
  })

  await seedRow('contract', 'job_id', {
    buyer_user_id: john_doe_id,
    seller_user_id: jane_smith_id,
    start_time: new Date(),
    estimated_finish_time: new Date(),
    claim_finish_time: null,
    confirm_finish_time: null,
    reject_finish_time: null,
    cancel_time: null,
    cancel_by_user_id: null,
    estimated_payment_release_time: new Date(), // Provide a valid value here
    system_receive_payment_id: null,
    system_send_payment_id: null,
    job_id: web_job_id,
  })
  await seedRow('contract', 'job_id', {
    buyer_user_id: jane_smith_id,
    seller_user_id: john_doe_id,
    start_time: new Date(),
    estimated_finish_time: new Date(),
    claim_finish_time: null,
    confirm_finish_time: null,
    reject_finish_time: null,
    cancel_time: null,
    cancel_by_user_id: null,
    estimated_payment_release_time: new Date(), // Provide a valid value here
    system_receive_payment_id: null,
    system_send_payment_id: null,
    job_id: design_job_id,
  })
}
