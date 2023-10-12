import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('contract').del()
  await knex('job').del()
  await knex('user').del()

  // Inserts seed entries.
  let usersId = await knex('user')
    .insert([
      {
        username: 'john_doe',
        fullName: 'John Doe',
        HKID: 'A1234567',
        email: 'john.doe@example.com',
        public_key:
          'fdf3226743429e4dedaf107bad8887c191142fc713c04da2ab60ad2d6eeab7bf',
        HK_phone: '12345678',
        human_verification: true,
        cv_upload: 'path/to/cv.pdf',
      },
      {
        username: 'jane_smith',
        fullName: 'Jane Smith',
        HKID: 'B9876543',
        email: 'jane.smith@example.com',
        public_key:
          'dfbb547e78471a9dd36bb703fbe1b62b3265be823f66a468806b98f7b6947528',
        HK_phone: '87654321',
        human_verification: false,
        cv_upload: 'path/to/cv.pdf',
      },
      // Add more user entries here if needed
    ])
    .returning('id')

  // Inserts seed entries
  let jobsId = await knex('job')
    .insert([
      {
        user_id: usersId[0].id, // Foreign key referencing user.id
        title: 'Web Developer',
        description: 'We are looking for a skilled web developer...',
        price: 5000,
        type: 'demand',
      },
      {
        user_id: usersId[0].id, // Foreign key referencing user.id
        title: 'Graphic Designer',
        description: 'We need a creative graphic designer...',
        price: 3000,
        type: 'offer',
      },
      // Add more sample job entries here
    ])
    .returning('id')

  // Inserts seed entries
  await knex('contract').insert([
    {
      buyer_user_id: usersId[0].id,
      seller_user_id: usersId[1].id,
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
      job_id: jobsId[0].id,
    },
    {
      buyer_user_id: usersId[1].id,
      seller_user_id: usersId[0].id,
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
      job_id: jobsId[1].id,
    },
    // Add more sample data entries as needed
  ])
}
