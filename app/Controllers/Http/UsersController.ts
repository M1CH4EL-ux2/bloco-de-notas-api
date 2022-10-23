import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { createHash } from 'node:crypto'

import User from "App/Models/User"

export default class UsersController {
  public async index({}: HttpContextContract) {
    const user = await User.query().preload('notas')

    return {
      data: user
    }
  }

  public async store({ request }: HttpContextContract) {
    const data = await request.body()

    const name = data.name
    const password = createHash('sha256', data.password).digest('hex')
    
    User.create({ name, password })
      .then(() => {
        return { name, password }
      })
      .catch((err) => {
        console.log(`Erro ao adicionar a usuário: ${err}`)
      })
  }

  public async show({ params, response }: HttpContextContract) {
    const id = await params.id
    const data = await User.findOrFail(id)
    
    await data.load('notas')

    return response.json(data)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const id = params.id
    const user = await User.findOrFail(id)
    const { name, password } = await request.body()

    user.name = name
    user.password = password

    await user.save()

    return response.json(user)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const id = await params.id
    const deleted = await User.findOrFail(id)

    await deleted.delete()

    return response.json(deleted)
  }
}
