<template>
  <div class="about-overlay" @click.self="closeOverlay">
    <div class="about-content">
      <h2>O spletni aplikaciji</h2>
      <p>Avtor: Jerneja Krajcar</p>
      <p class="fw-bold">Interaktivna aplikacija za prikaz omembe krajev v deželi Kranjski</p>
      <p>Podatki za prikaz krajev so bili pridobljeni iz zapisnikov Kranjskega deželnega zbora med letami
      1861 in 1913. Pri določanju lokacij krajev lahko pride do napak. </p>
      <p>2024 Fakulteta za računalništvo in informatiko</p>
      <hr />
      <button class="btn btn-primary" @click="closeOverlay">Zapri</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeOverlay() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.about-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.about-content {
  background: #181818;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
</style>
