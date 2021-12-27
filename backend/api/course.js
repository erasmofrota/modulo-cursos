const queries = require('./queries')

module.exports = app => {
    const { existsOrError } = app.api.validation

    const save = (req, res) => {
        const course = { ...req.body }
        if(req.params.id) course.id = req.params.id

        try {
            existsOrError(course.name, 'Nome não informado')
            existsOrError(course.description, 'Descrição não informada')
            existsOrError(course.categoryId, 'Categoria não informada')
            existsOrError(course.userId, 'Autor não informado')
            existsOrError(course.content, 'Conteúdo não informado')
        } catch(msg) {
            res.status(400).send(msg)
        }

        if(course.id) {
            app.db('courses')
                .update(course)
                .where({ id: course.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('courses')
                .insert(course)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req,res) => {
        try {
            const rowsDeleted = await app.db('courses')
                .where({ id: req.params.id }).del()

            try {
                existsOrError(rowsDeleted, 'Curso não foi encontrado.')
            } catch(msg) {
                return res.status(400).send(msg)
            }

            res.status(204).send()
        } catch(msg) {
            res.status(500).send(msg)
        }
    }

    const limit = 10 // usado para paginação
    const get = async (req, res) => {
        const page = req.query.page || 1

        const result = await app.db('courses').count('id').first()
        const count = parseInt(result.count)

        app.db('courses')
            .select('id', 'name', 'description')
            .limit(limit).offset(page * limit - limit)
            .then(courses => res.json({ data: courses, count, limit }))
            .catch(err => err.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('courses')
            .where({ id: req.params.id })
            .first()
            .then(course => {
                course.content = course.content.toString()
                return res.json(course)
            })
            .catch(err => res.status(500).send(err))
    }

    const getByCategory = async (req, res) => {
        const categoryId = req.params.id
        const page = req.query.page || 1
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId)
        const ids = categories.rows.map(c => c.id)

        app.db({a: 'courses', u: 'users'})
            .select('a.id', 'a.name', 'a.description', 'a.imageUrl', { author: 'u.name' })
            .limit(limit).offset(page * limit - limit)
            .whereRaw('?? = ??', ['u.id', 'a.userId'])
            .whereIn('categoryId', ids)
            .orderBy('a.id', 'desc') //ordernar buscar apartir do ultimo cursos publicado.
            .then(courses => res.json(courses))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getByCategory }
}