<template>
    <div class="course-item">
        <router-link :to="{ name: 'courseById', params: { id: course.id } }">
            <div class="course-item-image d-none d-sm-block">
                <img v-if="course.imageUrl" :src="course.imageUrl" height="150" width="150" alt="Course">
                <img v-else src="@/assets/course.png" height="150" width="150" alt="Course">
            </div>
            <div class="course-item-info">
                <h2>{{ course.name}}</h2>
                <p>{{ course.description }}</p>
                <span class="course-item-author">
                    <strong>Autor: </strong>{{ course.author }}
                </span>
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    name: 'CoursesItem',
    props: ['course']

}
</script>

<style>
    .course-item {
        border-radius: 8px;
        margin-bottom: 20px;
        background-color: #FFF;
        padding: 20px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
    }

    .course-item a {
        display: flex;
        align-items: flex-start;
        text-decoration: none;
        color: #000;
    }
    .course-item-info h2 {
        font-size: 1.7rem;
    }
    .course-item-image {
        padding-right: 20px;
        margin-right: 20px;
        border-right: 1px solid #AAA;
    }
    .course-item-image img {
        border-radius: 5px;
    }

    .course-item-info {
        display: flex;
        align-self: stretch;
        flex-direction: column;
    }
    .course-item-info p {
        flex: 1;
        color: #555;
        font-size: 1.1rem;
    }
</style>
