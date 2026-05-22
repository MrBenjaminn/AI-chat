<template>
  <div class="typing-indicator-wrapper">
    <div class="dots-bubble">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </div>
</template>

<style scoped>
.typing-indicator-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  margin-right: auto;
}


.dots-bubble {
  background-color: #f1f1f4;
  padding: 12px 20px;
  border-radius: 12px 12px 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  box-sizing: border-box;
}


.dot {
  width: 8px;
  height: 8px;
  background-color: #939598;
  border-radius: 50%;

  animation: bounce 1.4s infinite ease-in-out both;
}


.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}


@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.3;
  }
  40% {
    transform: scale(1) translateY(-6px);
    opacity: 1;
  }
}
</style>