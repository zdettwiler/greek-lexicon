<template>
  <div class="home">
    <h1>Mots rares</h1>

    <div class="chapter-container" v-for="(chapter, c) of Object.keys(words)" :key="c">
      <div class="chapter-col">
        <h2>Chapitre {{ chapter }}</h2>
      </div>

      <div class="all-words-col">
        <div class="verse-words-col" v-for="(verse, v) of Object.keys(words[chapter])" :key="v">
          <div class="verse-nb">{{verse}}</div>

          <div class="words-col">
            <ul >
              <li v-for="(word, w) in words[chapter][verse]" :key="w">
                <b>{{ word.greek }}</b>  {{ word.english }} ({{ word.countsBook }}, {{ word.countsNT }})
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import getData from '@/dataProcessing';

export default {
  name: 'Home',
  components: {
  },
  data: () => ({
    words: {},
    loading: true,
  }),
  async created() {
    console.log('loading');
    this.words = await getData();
    console.log('finished loading');
  },
};
</script>

<style>
h1 {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 100px;
  margin-bottom: 50px;
}
h2 {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 20px;
  margin: 0px;
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 10px;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: block;
}
.verse-nb {
  margin-right: 10px;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 15px;
  font-weight: bold;
  width: 30px;
  text-align: right;
}

.chapter-container {
  display: flex;
  width: 500px;
  margin: 10px auto;
}

.chapter-col {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 1em;
  margin-right: 20px;
}

.all-words-col {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.verse-words-col {
  display: flex;
  flex-grow: 1;
  margin-bottom: 5px;
}

.words-col {
  display: flex;
}
</style>
