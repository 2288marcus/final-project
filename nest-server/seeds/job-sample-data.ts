import { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('job').del()

  // Inserts seed entries
  await knex('job').insert([
    {
      id: 1,
      user_id: 1, // Foreign key referencing user.id
      title: 'Web Developer',
      description: 'We are looking for a skilled web developer...',
      price: 5000,
      type: 'demand',
    },
    {
      id: 2,
      user_id: 2, // Foreign key referencing user.id
      title: 'Graphic Designer',
      description: 'We need a creative graphic designer...',
      price: 3000,
      type: 'offer',
    },
    // Add more sample job entries here
  ])
}
