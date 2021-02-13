<template>
  <span v-if="stars" class="bucome-stars">
    <span v-if="stars.purple > 0" class="bucome-star-purple">
      {{ multiStars(stars.purple) }}
    </span>
    <span v-if="stars.blue > 0" class="bucome-star-blue">
      {{ multiStars(stars.blue) }}
    </span>
    <span v-if="stars.red > 0" class="bucome-star-red">
      {{ multiStars(stars.red) }}
    </span>
    <span v-if="stars.green > 0" class="bucome-star-green">
      {{ multiStars(stars.green) }}
    </span>
    <span v-if="stars.yellow > 0" class="bucome-star-yellow">
      {{ multiStarsBig(stars.yellow) }}
    </span>
    <span v-if="stars.yellow > 0" class="bucome-star-yellow xx-small-star">
      {{ multiStarsSmall(stars.yellow) }}
    </span>
  </span>
</template>

<script>
export default {
  props: { stars: { type: Object, default: () => {} } },
  methods: {
    multiStars(starCount) {
      return [...Array(starCount)].map(() => '★').join('')
    },
    multiStarsBig(starCount) {
      const bitCount = Math.floor(starCount / 10)
      return [...Array(bitCount)].map(() => '★').join('')
    },
    multiStarsSmall(starCount) {
      const smallCount = starCount % 10
      return [...Array(smallCount)].map(() => '★').join('')
    },
  },
}
</script>

<style>
.bucome-stars {
  font-size: 1.5em;
  font-weight: bold;
  letter-spacing: -0.08em;
}
.bucome-star-purple {
  /* color: #cd34e3; */
  color: hsl(292, 96%, 55%);
}
.bucome-star-blue {
  /* color: #57b1ff; */
  color: hsl(204, 86%, 53%);
}
.bucome-star-red {
  /* color: #ea475c; */
  color: hsl(348, 100%, 61%);
}
.bucome-star-green {
  /* color: #8ed701; */
  color: hsl(141, 71%, 48%);
}
.bucome-star-yellow {
  /* color: #f4b128; */
  color: hsl(48, 100%, 67%);
}
.xx-small-star {
  font-size: 0.75rem;
}
</style>
