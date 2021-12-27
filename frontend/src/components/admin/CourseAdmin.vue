<template>
    <div class="course-admin">
        <b-form>
            <input id="course-id" type="hidden" v-model="course.id" />
            <b-form-group label="Nome do Curso: " label-for="course-name">
                <b-form-input id="course-name" type="text" v-model="course.name" required :readonly="mode === 'remove'" placeholder="Informe o Nome do Curso..." />
            </b-form-group>
            <b-form-group label="Descrição: " label-for="course-description">
                <b-form-input id="course-description" type="text" v-model="course.description" required :readonly="mode === 'remove'" placeholder="Informe o Nome do Curso..." />
            </b-form-group>
            <b-form-group v-if="mode === 'save'" label="Imagem (URL): " label-for="course-imageUrl">
                <b-form-input id="course-imageUrl" type="text" v-model="course.imageUrl"  placeholder="Informe a URL da imagem do Curso..." />
            </b-form-group>
            <b-form-group v-if="mode === 'save'" label="Categoria: " label-for="course-categoryId">
                <b-form-select id="course-categoryId" :options="categories" v-model="course.categoryId" />
            </b-form-group>
            <b-form-group v-if="mode === 'save'" label="Autor: " label-for="course-userId">
                <b-form-select id="course-userId" :options="users" v-model="course.userId" />
            </b-form-group>
            <b-form-group label="Conteúdo:" label-for="course-content" v-if="mode === 'save'">
                <VueEditor v-model="course.content" placeholder="Informe o Conteúdo do Curso..." />
            </b-form-group>
            <b-button variant="primary" v-if="mode === 'save'"
                @click="save">Salvar</b-button>
            <b-button variant="danger" v-if="mode === 'remove'"
                @click="remove">Excluir</b-button>
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr>
        <b-table hover striped :items="courses" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadCourse(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadCourse(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
        <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
    </div>
</template>

<script>
import { VueEditor } from "vue2-editor"
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name: 'CourseAdmin',
    components: { VueEditor },
    data: function() {
        return {
            mode: 'save',
            course: {},
            courses: [],
            categories: [],
            users: [],
            page: 1,
            limit: 0,
            count: 0,
            fields: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Nome', sortable: true },
                { key: 'description', label: 'Descrição', sortable: true},
                { key: 'actions', label: 'Ações'}
            ]
        }
    },
    methods: {
        loadCourses() {
            const url = `${baseApiUrl}/courses?page=${this.page}`
            axios.get(url).then(res => {
                this.courses = res.data.data
                this.count = res.data.count
                this.limit = res.data.limit
            })
        },
        reset() {
            this.mode = 'save'
            this.course = {}
            this.loadCourses()
        },
        save() {
            const method = this.course.id ? 'put' : 'post'
            const id = this.course.id ? `/${this.course.id}` : ''
            axios[method](`${baseApiUrl}/courses${id}`, this.course)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)

        },
        remove() {
            const id = this.course.id
            axios.delete(`${baseApiUrl}/courses/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        loadCourse(course, mode = 'save') {
            this.mode = mode
            axios.get(`${baseApiUrl}/courses/${course.id}`)
                .then(res => this.course = res.data)
        },
        loadCategories() {
            const url = `${baseApiUrl}/categories`
            axios.get(url).then(res => {
                this.categories = res.data.map(category => {
                    return { value: category.id, text: category.path }
                })
            })
        },
        loadUsers() {
            const url = `${baseApiUrl}/users`
            axios.get(url).then(res => {
                this.users = res.data.map(user => {
                    return { value: user.id, text: `${user.name} - ${user.email}` }
                })
            })
        }
    },
    watch: {
        page() {
            this.loadCourses()
        }
    },

    mounted() {
        this.loadUsers()
        this.loadCategories()
        this.loadCourses()
    }
}
</script>

<style>

</style>