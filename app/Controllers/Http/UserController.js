const { validate } = use('Validator')
const Database = use('Database')
const moment = require('moment')
const Hash = use('Hash')
'use strict'

class UserController {
  async registerUser({ request, response }) {
    const { username, email, password } = request.all()
  

    const rules = {
      username: "required",
      email: "required|email|unique:public.users,email",
      password: "required"
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      response.status(400)
      return validation.messages()
    }

    const emailToLowerCase = email.toLowerCase()
    const passwordHash = await Hash.make(password)
    await Database.raw(`INSERT INTO public.users(username, email, password, created_at) VALUES('${username}', '${emailToLowerCase}', '${passwordHash}', '${moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}')`)

    const dataRegister = await Database.raw('SELECT * FROM public.users')

    return {
      messages: "Succesfully Registered",
      data: dataRegister.rows
    }
  }

  async loginUsers({ request, response }) {
    const { email, password } = request.all()
    let loggedInUser = null;
    const rules = {
      email: "required",
      password: "required"
    }

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      response.status(400)
      return validation.messages()
    }

    const emailToLowerCase = email.toLowerCase();
    const checkUser = await Database.raw(`SELECT * FROM public.users where email ='${emailToLowerCase}' `)
    
    if (!checkUser.rows.length > 0) {
      response.status(401)
      return {
        messages: 'Email Tidak ada'
      }
    }

    const passwordDb = checkUser.rows[0].password

    const isSame = await Hash.verify(
      password, passwordDb
    )
    
    if (isSame) {
      if (!checkUser.rows.length > 0) {
        response.status(401);
        return {
          message: "Alamat email dan password tidak sesuai",
        };
      }

      let dataUser = checkUser.rows[0];
      let user = {
        id_siswa: dataUser.id,
        username: dataUser.username,
        email: dataUser.email,
      };

      loggedInUser = user;

      return {
        message: 'Berhasil Login',
        username: dataUser.username,
        email: dataUser.email
      }
    } else {
      response.status(401)
      return {
        message: 'Login Gagal'
      }
    }

    }
}
module.exports = UserController
