const schedule = require('node-schedule')

module.exports = app => {
    schedule.scheduleJob('*/1 * * * *', async function() {
        const usersCount = await app.db('users').count('id').first()
        const categoriesCount = await app.db('categories').count('id').first()
        const coursesCount = await app.db('courses').count('id').first()

        const { Stat } = app.api.stat

        const lastStat = await Stat.findOne({}, {}, 
            { sort: { 'createdAt' : -1 } })

        const  stat = new Stat({
            users: usersCount.count,
            categories: categoriesCount.count,
            courses: coursesCount.count,
            createdAt: new Date()
        })

        const changeUsers = !lastStat || stat.users !== lastStat.users
        const changeCategories = !lastStat || stat.categories !== lastStat.categories
        const changecourses = !lastStat || stat.courses !== lastStat.courses

        if (changeUsers || changeCategories || changecourses) {
            stat.save().then(() => console.log('[Stats] Estatísticas atualizadas!'))
        }

    })
}