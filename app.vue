<script setup lang="ts">
import { Authenticator } from '@aws-amplify/ui-vue';
import '@aws-amplify/ui-vue/styles.css';
import { Amplify } from 'aws-amplify';
import config from '@/amplifyconfiguration.json';
import { onMounted, ref } from 'vue';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

// generate your data client using the Schema from your backend
// const client = generateClient<Schema>();
const todos = ref<Schema['Todo'][]>([]);

async function listTodos() {
  try {
    // Fetch all todos
   const { data } = await useNuxtApp().$Amplify.GraphQL.client.models.Todo.list();
   todos.value = data;
   subscribeToTodo();
  } catch (error) {
    console.error('Error fetching todos', error);
  }
}

async function createTodo() {
  try {
    // Create a new Todo
    const title = window.prompt('Enter the title:');
    if (!title) return; // If title is empty or user cancels, do nothing

    const { errors, data: newTodo } = await useNuxtApp().$Amplify.GraphQL.client.models.Todo.create({
      content: title,
      done: false,
      priority: 'medium'
    });

    console.log(errors, newTodo);

    // After creating the todo, refresh the list
    await listTodos();
  } catch (error) {
    console.error('Error creating todo', error);
  }
}

function subscribeToTodo() {
  const sub = useNuxtApp().$Amplify.GraphQL.client.models.Todo.observeQuery().subscribe(({ items }) => {
    todos.value = items;
  });
  return sub;
}

 onMounted(() => {
  listTodos();
});

async function getCurrentUser() {
  const currentUser = await useNuxtApp().$Amplify.Auth.fetchAuthSession()

  console.log(currentUser.userSub)
}

</script>


<template>
  <Authenticator>
    <template v-slot="{ user, signOut }">
      <h1>Hello {{ user.username }}!</h1>
      <button @click="createTodo"> Create</button>
      <ul>
        <li v-for="todo in todos" :key="todo.id">{{ todo.content }}</li>
      </ul>
      <button @click="signOut">Sign Out</button>
    </template>
  </Authenticator>
</template>