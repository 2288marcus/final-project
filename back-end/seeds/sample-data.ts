import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('user').del()

  // Inserts seed entries
  await knex('user').insert([
    {
      id: 1,
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
      id: 2,
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
}
