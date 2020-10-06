function resize(event) {
  const el = event.target;
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

function delayResize(event) {
  const timeout = window.setTimeout(() => {
    resize(event);
    clearTimeout(timeout);
  }, 0)
}

export default {
  inserted: function(el, binding, vnode) {
    if (!binding.value) return;
    resize({ target: el });

    el.addEventListener('change', resize, true);
    el.addEventListener('cut', delayResize, true);
    el.addEventListener('paste', delayResize, true);
    el.addEventListener('drop', delayResize, true);
    el.addEventListener('keydown', delayResize, true);
  },

  unbind: function(el, binding, vnode) {
    if (!binding.value) return;
    el.removeEventListener('change', resize, true);
    el.removeEventListener('cut', delayResize, true);
    el.removeEventListener('paste', delayResize, true);
    el.removeEventListener('drop', delayResize, true);
    el.removeEventListener('keydown', delayResize, true);
  }
}