<script>
    import cfg from "./firebaseConfig";
    import { initializeApp } from "firebase/app";
    import { collection, getDocs, getFirestore } from "firebase/firestore";
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
            const querySnapshot = await getDocs(collection(db, "records"));
            querySnapshot.forEach(doc => {
                res.push(doc.data());
            });
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
        <div class="container">
            <input type="text" placeholder="SORT BY TAG"  bind:value={inputValue} on:input={() => handleInput(inputValue.toLowerCase())}>
        </div>
        <div class="container">
            <div class="text-xl">{aggregateSum}</div>
        </div>
        <div class="container">
            {#each displayData as dataObject}
                <div>{dataObject.title}</div>
                <div>{dataObject.amount}</div>
                {#each dataObject.tags as tag}
                    <div>{tag}</div>
                {/each}
                <hr>
            {/each}
        </div>
    {/await}
</main>
<style>
    .container {
        @apply flex;
        @apply flex-col;
        @apply gap-4;
    }

    .info {
        @apply flex;
        @apply gap-2;
    }
</style>

