<template>
  <div class="infinite-scroll">
    <vue-scroll
      ref="scroll"
      :ops="scrollOps"
      @handle-scroll="handleScroll"
    >
      <div class="d-flex align-center pb-1">
        <v-sheet
          min-width="30px"
          color="transparent"
          class="overflow-hidden"
        >
          <v-progress-circular
            v-show="showPrevLoadIndicator"
            width="2"
            size="27"
            indeterminate
            color="primary"
            class="load-indicator"
          />
        </v-sheet>
        <slot />
        <v-sheet
          min-width="30px"
          color="transparent"
          class="overflow-hidden"
        >
          <v-progress-circular
            v-show="showNextLoadIndicator"
            width="2"
            size="27"
            indeterminate
            color="primary"
            class="load-indicator"
          />
        </v-sheet>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
import delay from 'delay';
import VueScroll from 'vuescroll';

export default {
  name: 'InfiniteScroll',
  components: {
    VueScroll,
  },
  props: {
    prevLoader: {
      type: Function,
      required: true,
    },
    nextLoader: {
      type: Function,
      required: true,
    },
  },
  data: () => ({
    dateNow: Date.now(),
    isDragging: false,
    loadingPrev: false,
    loadingNext: false,
    scrollProcess: 0,
    lastDraggingStartTime: 0,
    draggingTriggerDelay: 400,
    scrollOps: {
      scrollPanel: {
        scrollingX: true,
        scrollingY: false,
      },
      bar: {
        keepShow: true,
        background: '#b0b0b0',
        size: '4px',
      },
      rail: {
        size: '5px',
        background: 'rgba(99,99,99,0.13)',
        gutterOfEnds: '5px',
      },
      vuescroll: {
        paging: false,
        zooming: false,
        mode: 'slide',
        scroller: {
          bouncing: {
            top: 0,
            bottom: 0,
            left: 50,
            right: 50,
          },
          locking: true,
          preventDefault: true,
          preventDefaultOnMove: true,
        },
      },
    },
  }),
  computed: {
    showPrevLoadIndicator() {
      return +(this.draggingTriggerDelay <= (this.dateNow - this.lastDraggingStartTime) && this.isDragging) || this.loadingPrev;
    },
    showNextLoadIndicator() {
      return +(this.draggingTriggerDelay <= (this.dateNow - this.lastDraggingStartTime) && this.isDragging) || this.loadingNext;
    },
  },
  watch: {
    isDragging() {
      if (this.isDragging) {
        this.lastDraggingStartTime = Date.now();
      } else if (this.draggingTriggerDelay <= Date.now() - this.lastDraggingStartTime) {
        this.loadingPrev = this.scrollProcess <= 0;
        this.loadingNext = this.scrollProcess >= 1;
        this.runLoader();
      }
    },
  },
  created() {
    const intervalId = setInterval(() => { this.dateNow = Date.now(); }, 100);
    this.$once('hook:beforeDestroy', () => { clearInterval(intervalId); });
  },
  mounted() {
    this.$watch(
      (vm) => vm.$refs.scroll.vuescroll.state.isDragging,
      (v) => {
        this.isDragging = v;
      },
    );
  },
  methods: {
    async runLoader() {
      await delay(200);
      if (this.loadingPrev) {
        await this.prevLoader();
        await delay(300);
        this.loadingPrev = false;
      }
      if (this.loadingNext) {
        await this.nextLoader();
        await delay(300);
        this.loadingNext = false;
      }
    },
    handleScroll(vertical, horizontal) {
      this.scrollProcess = horizontal.process;
    },
  },
};
</script>

<style scoped lang="scss">

.infinite-scroll {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
