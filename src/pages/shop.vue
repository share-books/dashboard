<template>
  <div>
  <db-breadcrumb></db-breadcrumb>
    <h2>Shopping Cart Example</h2>
    <hr>
    
    <product-list></product-list>
    <hr>
    <cart></cart>
  </div>
</template>

<script>
import ProductList from '../components/ProductList.vue'
import Cart from '../components/Cart.vue'

export default {
  components: { ProductList, Cart }
}
</script>