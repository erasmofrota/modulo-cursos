<template>
    <div class="courses-by-category">
        <PageTitle icon="fa fa-folder-o" 
            :main="category.name" sub="Categoria" />
            <ul>
                <li v-for="course in courses" :key="course.id">
                    <CourseItem :course='course'/>
                </li>
            </ul>
            <div class="load-more">
                <button v-if="loadMore" class="btn btn-lg btn-outline-primary" @click="getCourses">Carregar Mais Cursos...</button>
            </div>
    </div>
</template>

<script>
import { baseApiUrl } from '@/global'
import axios from 'axios'
import PageTitle from '@/components/template/PageTitle'
import CourseItem from './CourseItem'

export default {
    name: 'CoursesByCategory',
    components: { PageTitle, CourseItem },
    data: function() {
        return {
            category: {},
            courses: [],
            page: 1,
            loadMore: true
        }
    },
    methods: {
        getCategory() {
            const url = `${baseApiUrl}/categories/${this.category.id}`
            axios(url).then(res => this.category = res.data)
        }, 
        getCourses() {
            const url = `${baseApiUrl}/categories/${this.category.id}/courses?page=${this.page}`
            axios(url).then(res => {
                this.courses = this.courses.concat(res.data)
                this.page++

                if(res.data.length === 0) this.loadMore = false
            })
        }
    },
    watch: {
        $route(to) {
            this.category.id = to.params.id
            this.courses = []
            this.page = 1
            this.loadMore = true

            this.getCategory()
            this.getCourses()
        }
    },
    mounted() {
        this.category.id = this.$route.params.id
        this.getCategory()
        this.getCourses()
    }

}
</script>

<style>
    .courses-by-category ul {
        list-style-type: none;
        padding: 0px;
    }

    .courses-by-category .load-more {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 25px;
    }
</style>
