<script>
    import cfg from "./firebaseConfig";
    import { initializeApp } from "firebase/app";
    import { collection, orderBy, getDocs, query, getFirestore, onSnapshot } from "firebase/firestore";
    const app = initializeApp(cfg);
    const db = getFirestore(app);



    $: inputValue = "";
    $: aggregateSum = 0;
    // @ts-ignore
    $: data = [];
    $: tag = "";
    // @ts-ignore
    $: displayData = [];

    // @ts-ignore
    const handleInput = (i) => {
        filterDataByTag(i);
    }

    const updateAggregateSum = () => {
        try {
            aggregateSum = displayData.reduce((sum, dataObject) => {
                return sum + dataObject.amount;
            }, 0)
        } catch (err) {
            console.log(err);
        }
    }

    const getData = async () => {
        // @ts-ignore
        let res = [];
        try {
            const col= collection(db, "records")
            const querySnapshot = await getDocs(query(col, orderBy("dateCreated", "desc")));
            querySnapshot.forEach(doc => {
                res.push(doc.data());
            })
           // @ts-ignore
            return Promise.resolve(res);
        } catch (e) {
            return Promise.reject("Cannot access data!");
        }
    }

    // @ts-ignore
    let tmp = getData().then(t => {
        return Promise.resolve(t);
    }).then(t => {
        data = t;
        displayData = data;
        aggregateSum = displayData.reduce((total, dataObject) => {
            return total + dataObject.amount;
        }, 0);
        return;
    });

    // @ts-ignore
    const filterDataByTag = tag => {
        console.log(`Filtering out tags == ${tag}`)
        // @ts-ignore
        displayData = data.filter(dataObject => {
            let tmp = false;
            // @ts-ignore
            dataObject.tags.forEach(t=> {
                tmp = t.match(tag) ? true : false;
            })
            return tmp;
        })
        updateAggregateSum();
    }

</script>

<main>
   {#await tmp}
    <div class="text-3xl">Loading data...</div>
   {:then}
    <div class="grid-container">
        <div class="container col-start-1 col-span-2">
            {#each displayData as dataObject}
            <div class="amount">{dataObject.amount.toLocaleString('en-US')}</div>
                <div class="expenseData">
                    <div class="title">{dataObject.title}</div>
                    {#each dataObject.tags as tag}
                    <div class="tag">{tag}</div>
                    {/each}
                </div>
                <hr>
            {/each}
        </div>
        <div class="container items-end col-start-3 col-span-4 fixed max-w-fit justify-self-end">
            <div class="text-5xl">Total: {aggregateSum.toLocaleString('en-US')}</div>
            <input type="text" placeholder="SORT BY TAG"  bind:value={inputValue} on:input={() => handleInput(inputValue.toLowerCase())}>
        </div>
    </div>
    {/await}
</main>
<style>
    .grid-container {
        @apply grid;
        @apply grid-cols-5;
        @apply max-w-screen-lg;
        min-width: 1024px;
    }
    .container {
        @apply flex;
        @apply flex-col;
        @apply gap-2;
    }

    .expenseData {
        @apply flex;
        @apply gap-2;
    }

    .amount {
        @apply text-4xl;
    }


    .info {
        @apply flex;
        @apply gap-2;
    }
</style>

