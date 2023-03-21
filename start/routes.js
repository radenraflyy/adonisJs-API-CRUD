'use strict'

const PostinganController = require('../app/Controllers/Http/PostinganController')
const UserController = require('../app/Controllers/Http/UserController')

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {
  Route.get('/show-postingan', "PostinganController.showPostingan")
  Route.post('/insert-postingan', "PostinganController.insertPostingan")
  Route.put('/update-postingan', "PostinganController.updatePostingan")
  Route.post('/delete-postingan', "PostinganController.deletePostingan")
})


Route.group(() => {
  Route.post('/registered', "UserController.registerUser")
  Route.put('/update-profile', "UserController.updateProfile")
  Route.post('/user-login', "UserController.loginUsers")
})