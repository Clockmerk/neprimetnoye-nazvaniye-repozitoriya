<script lang="ts">
  import { onMount } from "svelte";

  let curr1 = "USD";
  let curr2 = "EUR";

  let currencies = {
    temp: "",
    temp2: "",
    list: ["USD", "EUR"],
  };

  let conversionRate = 0.95,
    input1 = 1,
    input2 = input1 * conversionRate;

  let fetchStatus = {
    loading: false,
    isError: false,
    error: "",
  };

  const fetchFunc = async (query: string) => {
    fetchStatus.isError = false;
    fetchStatus.loading = true;
    const url = "https://v6.exchangerate-api.com/v6/d2bafbebedb22f16c1b8570c";
    const response = await fetch(`${url}${query}`);
    const res = await response.json();

    return res;
  };

  const getCurrencies = () => {
    fetchFunc("/codes").then((res) => {
      if (res.result === "success") {
        currencies.list = [];
        for (let item of res.supported_codes) {
          currencies.list.push(item[0]);
        }
      } else {
        fetchStatus.isError = true;
        fetchStatus.error = res["error-type"];
      }
      fetchStatus.loading = false;
    });
  };

  const convert = () => {
    if (curr1 !== curr2) {
      fetchFunc(`/pair/${curr1}/${curr2}`).then((res) => {
        if (res.result === "success") {
          conversionRate = res.conversion_rate;
          input2 = +(input1 * conversionRate).toFixed(2);
        } else {
          fetchStatus.isError = true;
          fetchStatus.error = res.error["error-type"];
        }
        fetchStatus.loading = false;
      });
    }
  };

  function swapCurrency() {
    if (curr1 !== curr2) {
      currencies.temp = curr1;
      currencies.temp2 = curr2;
    }

    if (curr1 === curr2) {
      [curr1, curr2] = [currencies.temp2, currencies.temp];
      convert();
    }
    if (curr1 !== currencies.temp || curr2 !== currencies.temp2) {
    }
  }

  onMount(() => {
    getCurrencies();
    convert();
  });
</script>

<main>
  <div>
    <h1>Currency converter</h1>
    <p>Rate: {conversionRate}</p>
    <p>{input1 ? input1 : 0} {curr1} = {input2 ? input2 : 0} {curr2}</p>
    <div>
      <input
        bind:value={input1}
        on:input={() => (input2 = +(input1 * conversionRate).toFixed(2))}
        type="number"
        placeholder="0"
        min="0"
        disabled={fetchStatus.loading}
      />
      <select bind:value={curr1} on:click={swapCurrency} on:change={convert}>
        {#each currencies.list as currency}
          <option>{currency}</option>
        {/each}
      </select>
    </div>
    <div>
      <input
        bind:value={input2}
        on:input={() => (input1 = +(input2 / conversionRate).toFixed(2))}
        type="number"
        placeholder="0"
        min="0"
        disabled={fetchStatus.loading}
      />
      <select bind:value={curr2} on:click={swapCurrency} on:change={convert}>
        {#each currencies.list as currency}
          <option>{currency}</option>
        {/each}
      </select>
    </div>

    {#if fetchStatus.isError}
      <p>Failed to retrieve actual data</p>
      <p>Error : {fetchStatus.error}</p>
      <button on:click={getCurrencies}>Retry</button>
    {/if}
  </div>
</main>

<style>
</style>
