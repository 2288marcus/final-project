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
  async function seedRelation<T>(table: string, data: T) {
    let row = await knex(table).select('id').where(data).first()
    if (!row) {
      await knex(table).insert(data)
    }
  }

  let john_doe_id = await seedRow('user', 'username', {
    username: 'john_doe',
    fullName: 'John Doe',
    hkId: 'A1234567',
    email: 'john.doe@example.com',
    public_key: '7HLdB3CLhp/vm92hbx+qTUKAhAnlvlByXexWxz+Fi20=',
    //IMxAwdQRlJLkqsN3Ywp7DLYzUijVR/BdwdcdlVn4Jebsct0HcIuGn++b3aFvH6pNQoCECeW+UHJd7FbHP4WLbQ==
    hk_phone: '12345678',
    human_verification: true,
    cv_upload: 'path/to/cv.pdf',
  })
  let jane_smith_id = await seedRow('user', 'username', {
    username: 'jane_smith',
    fullName: 'Jane Smith',
    hkId: 'B9876543',
    email: 'jane.smith@example.com',
    public_key: 'OMZlPE1GPuCjJIAYyk6n0mVtPZ6GcL/ot4uUKcuUajQ=',
    //87wzRiZJAUEmn4edg1dlktEVSDrEhDvZv/+T+To8C9I4xmU8TUY+4KMkgBjKTqfSZW09noZwv+i3i5Qpy5RqNA==
    hk_phone: '87654321',
    human_verification: false,
    cv_upload: 'path/to/cv.pdf',
  })

  let developer_tag_id = await seedRow('tag', 'name', { name: 'developer' })
  let designer_tag_id = await seedRow('tag', 'name', { name: 'designer' })
  let creative_tag_id = await seedRow('tag', 'name', { name: 'creative' })
  let graphic_tag_id = await seedRow('tag', 'name', { name: 'graphic' })

  let web_job_id = await seedRow('job', 'title', {
    user_id: john_doe_id, // Foreign key referencing user.id
    title: 'Web Developer',
    description: 'We are looking for a skilled web developer...',
    price: 5000,
    type: 'demand',
  })
  await seedRelation('job_tag', {
    job_id: web_job_id,
    tag_id: developer_tag_id,
  })

  let design_job_id = await seedRow('job', 'title', {
    user_id: john_doe_id, // Foreign key referencing user.id
    title: 'Graphic Designer',
    description: 'We need a creative graphic designer...',
    price: 3000,
    type: 'supply',
  })
  await seedRelation('job_tag', {
    job_id: design_job_id,
    tag_id: designer_tag_id,
  })
  await seedRelation('job_tag', {
    job_id: design_job_id,
    tag_id: creative_tag_id,
  })
  await seedRelation('job_tag', {
    job_id: design_job_id,
    tag_id: graphic_tag_id,
  })

  let web_contract_id = await seedRow('contract', 'job_id', {
    job_id: web_job_id, // Foreign key referencing job.id
    real_price: 5001,
    real_description: 'Web development services',
    estimated_finish_time: new Date(),
    real_finish_time: new Date(),
    confirm_finish_time: new Date(),
    cancel_time: null,
  })

  let design_contract_id = await seedRow('contract', 'job_id', {
    job_id: design_job_id, // Foreign key referencing job.id
    real_price: 3001,
    real_description: 'Graphic design services',
    estimated_finish_time: new Date(),
    real_finish_time: new Date(),
    confirm_finish_time: new Date(),
    cancel_time: null,
  })

  // 关联Jane Smith的第一个收藏夹数据
  await seedRelation('bookmark', {
    user_id: jane_smith_id,
    job_id: web_job_id,
  })

  // 关联Jane Smith的第二个收藏夹数据
  await seedRelation('bookmark', {
    user_id: jane_smith_id,
    job_id: design_job_id,
  })
}
