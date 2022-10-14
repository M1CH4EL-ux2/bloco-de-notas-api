import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Nota from 'App/Models/Nota'

export default class NotasController {
  public async index({}: HttpContextContract) {
    return Nota.all()
  }

  public async store({ request }: HttpContextContract) {
    const data = await request.body()
    const { title, text } = data

    Nota.create({ title, text })
      .then(() => {
        return { title, text }
      })
      .catch((err) => {
        console.log(`Erro ao adicionar a nota: ${err}`)
      })
  }

  public async show({ params, response }: HttpContextContract) {
    const id = await params.id
    const data = await Nota.find(id)

    return response.json(data)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const id = params.id
    const note = await Nota.findOrFail(id)
    const { title, text } = await request.body()

    note.title = title
    note.text = text

    await note.save()

    return response.json(note)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const id = await params.id
    const deleted = await Nota.findOrFail(id)

    await deleted.delete()

    return response.json(deleted)
  }
}
