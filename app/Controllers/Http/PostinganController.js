const { validate } = use('Validator')
const Database = use('Database')
const moment = require('moment')
'use strict'

class PostinganController {
  async showPostingan({ }) {
    const show = await Database.raw(`SELECT * FROM public.posts ORDER BY ID DESC`)

    return {
      messages: 'Succesfully Show Postingan',
      data: show.rows
    }
  }


  async insertPostingan({ request, response }) {
    const { title, description, category } = request.all()

    const validation = {
      title: "required",
      description: "required",
      category: "required",
    }

    const rules = await validate(request.all(), validation);

    if (rules.fails()) {
      response.status(400)
      return rules.messages()
    }

    const query = await Database.raw(`INSERT INTO public.posts(title, description, category, created_at) VALUES('${title}', '${description}', '${category}', '${moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")}')`);

    const data = await Database.raw(`SELECT * FROM public.posts ORDER BY ID DESC`)

    return {
      messages: 'Succesfully Insert Postingan',
      data: data.rows
    }
  }

  async updatePostingan({ request, response }) {
    const { title, description, category } = request.all()

    const rules = {
      id: "required|number"
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      response.status(400)
      return validation.messages()
    }
    
    const query = await Database.raw(`UPDATE public.posts SET title='${title}', description='${description}', category='${category}', updated_at='${moment(Date.now()).format("YYYY-MM-DD HH:mm:ss") }' `)

    const dataUpdate = await Database.raw(`SELECT * FROM public.posts ORDER BY ID DESC`)

    return {
      messages: 'Succesfully Update Postingan',
      data: dataUpdate.rows
    }
  }

  async deletePostingan({ request, response }) {
    const params = request.all();

    //atribut apa aja yg wajib
    const validation = await validate(params, {
      id: "required|number",
    });

    //logic validasi
    if (validation.fails()) {
      response.status(400);
      return validation.messages();
    }

    // contoh query insert
    const query = await Database.raw(`
    DELETE FROM public.posts WHERE id=${params.id}           
    `);

    const data = await Database.raw(
      `select * from public.posts order by id desc`
    );

    //ngasih pesan berhasil
    return {
      messages: "Succesfully Delte Postingan",
      data: data.rows,
    };
  }

}

module.exports = PostinganController
