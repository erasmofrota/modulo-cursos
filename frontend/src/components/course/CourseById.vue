<template>
    <div class="course-by-id">
        <PageTitle icon="fa fa-file-o" :main="course.name" :sub="course.description" />
        <div class="course-content" v-html="course.content">

        </div>
    </div>
</template>

<script>
import 'highlightjs/styles/dracula.css'
import hljs from 'highlightjs/highlight.pack.js'
import { baseApiUrl } from '@/global'
import axios from 'axios'
import PageTitle from '../template/PageTitle'

export default {
    name: 'CourseById',
    components: { PageTitle },
    data: function() {
        return {
            course: {}
        }
    },
    mounted() {
        const url = `${baseApiUrl}/courses/${this.$route.params.id}`
        axios.get(url).then(res => this.course = res.data)
    },
    updated() {
        document.querySelectorAll('.course-content pre').forEach(e => {
            hljs.highlightBlock(e)
        })
    }

}
</script>

<style>
    .course-content {
        background-color: #FFF;
        border-radius: 8px;
        padding: 25px;
    }
    .course-content pre {
        padding: 20px;
        border-radius: 8px;
        font-size: 1.2rem;
        background-color: #1e1e1e;
        color: #FFF;
    }
    .course-content img {
        max-width: 100%;
    }
    .course-content :last-child {
        margin-bottom: 0px;
    }
</style>
