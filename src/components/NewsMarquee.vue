<template>
    <div class="marquee">
      <div class="marquee-content" ref="content">
        <slot></slot>
      </div>
    </div>
</template>
  
<script>
  export default {
    name: 'NewsMarquee',
    mounted() {
      this.startMarquee();
    },
    beforeUnmount() {
      this.stopMarquee();
    },
    methods: {
      startMarquee() {
        this.contentWidth = this.$refs.content.clientWidth;
        this.containerWidth = this.$el.clientWidth;
        if (this.contentWidth > this.containerWidth) {
          this.intervalId = setInterval(() => {
            if (this.$refs.content.style.transform === "") {
              this.$refs.content.style.transform = "translateX(0)";
            }
            const currentPosition = parseInt(
              this.$refs.content.style.transform.slice(11),
              10
            );
            const newPosition = currentPosition - 1;
            if (Math.abs(newPosition) >= this.contentWidth) {
              this.$refs.content.style.transform = "translateX(0)";
            } else {
              this.$refs.content.style.transform = `translateX(${newPosition}px)`;
            }
          }, 50);
        }
      },
      stopMarquee() {
        clearInterval(this.intervalId);
      },
    },
  };
</script>
  
<style scoped>
  .marquee {
    overflow: hidden;
    position: relative;
    width: 100%;
    white-space: nowrap;
    background-color: rgba(50, 51, 53, 0.5);
  }
  
  .marquee-content {
    display: inline-block;
    animation: marquee 150s linear infinite;
    color: white;
    margin-right: 50px;
  }
  
  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
</style>