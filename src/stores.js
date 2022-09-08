import { writable } from "svelte/store";

export let tagsData = writable([]);
export let formData = writable(new Array(2));
export let isLoggedIn = writable(false);
export let uid = writable('');