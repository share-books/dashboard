<template>
  <div class="cart">
    <h2>购物车情况</h2>
    <p v-show="!products.length"><i>请先采购吧:-)</i></p>
    <ul>
      <li v-for="p in products">
        {{ p.title }} - {{ p.price | currency }} x {{ p.quantity }}
      </li>
    </ul>
    <p>共计: {{ total | currency }}</p>
    <p><button :disabled="!products.length" @click="checkout(products)">结账</button></p>
    <p v-show="checkoutStatus"> {{ checkoutStatus }}.</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      products: 'cartProducts',
      checkoutStatus: 'checkoutStatus'
    }),
    total () {
      return this.products.reduce((total, p) => {
        return total + p.price * p.quantity
      }, 0)
    }
  },
  methods: {
    checkout (products) {
      this.$store.dispatch('checkout', products)
    }
  }
}
</script>
