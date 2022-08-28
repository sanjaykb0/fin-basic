<script>
// @ts-nocheck

  import { tagsData, formData } from "../stores.js";
  import { initializeApp } from "firebase/app";
  import cfg from "./firebaseConfig"
  import { getFirestore } from "firebase/firestore";
  import { collection, getDocs, Timestamp } from "firebase/firestore";
  import { addDoc } from "firebase/firestore";
  import Form from "../components/Form.svelte";
  import Tags from "../components/Tags.svelte";


  const app = initializeApp(cfg);
  const db = getFirestore(app);



  let testTags = [];

  (async () => {
    const querySnapshot = await getDocs(collection(db, "tags"));
    let res = [];
    querySnapshot.forEach(doc => {
      res.push(doc.data());
    })
    return Promise.resolve(res);
  })().then(t => {
    testTags = t.map(obj => {
      return obj.tag;
    })
  });

  // Read Data from FB.

  // const getData = async () => {
  //   const querySnapshot = await getDocs(collection(db, "todos"));
  //   let res = [];
  //   querySnapshot.forEach(doc => {
  //     res.push(doc.data());
  //   })
  //   return res;
  // }

  // Add Data to FB.

  const addData = async (tags, form) => {
    try {
      const docRef = await addDoc(collection(db, "records"), {
        title : form[0],
        amount : Number(form[1]),
        tags : tags,
        dateCreated : Timestamp.now(),
      });
      console.log("Successfully pushed data.")
      return Promise.resolve(1);
    } catch (e) {
      return e;
    }
  }

  //@ts-ignore
  let tags, form;
  let reset = false;

  tagsData.subscribe((t) => (tags = t));
  formData.subscribe((t) => (form = t));

  const handleSubmit = () => {
    //@ts-ignore
    if (!form[0] || !form[1] || tags.length === 0) {
      alert("Error uploading data. Please recheck format!");
      return;
    } else {
      addData(tags, form).then(() => reset = true);
    }
  };
</script>

<!-- <header>
  <div class="container">
    <div class="title"><b>finbasic</b> v1.0</div>
  </div>
  <hr />
</header> -->

<main>
  <Form on:message={() => (reset = false)} {reset} />
  <Tags reset={reset} testTags={testTags}/>
  <button on:click={handleSubmit} class="submit-cta">Submit</button>
</main>

<style>
  .container {
    @apply flex;
    @apply justify-between;
    @apply px-2;
    @apply max-w-screen-xl;
  }

  nav ul {
    @apply flex;
    @apply gap-2;
  }
  .title {
    @apply text-5xl;
  }

  .submit-cta {
    @apply border-red-600;
    @apply border-2;
    @apply rounded-sm;
    @apply px-4;
  }

  main {
    @apply flex;
    @apply flex-col;
    @apply items-center;
    @apply gap-2;
  }
</style>
