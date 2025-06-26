<template>
    <div class="line-y">
        <div class="tf_marquee-V01 style_3 infiniteSlide" data-speed="100">
            <template v-for="(method, index) in paymentMethods" :key="index">
                <span :class="['text-hero fw-medium', method.type]">{{ method.name }}</span>
                <i class="icon-rhombus fs-32"></i>
            </template>
        </div>
    </div>
</template>

<script setup>
import { usePaymentStore } from '@/stores/payment'
import { storeToRefs } from 'pinia'

const paymentStore = usePaymentStore()
const { paymentMethods } = storeToRefs(paymentStore)
</script>