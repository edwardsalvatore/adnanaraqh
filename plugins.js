 /*------------------------------------*\
        Plugins - Table of contents
    \*------------------------------------*/
 /*
  - Chocolat
 */



 /* Chocolat-1.0.4 */
 /* jQuery plugin for lightbox */
 ! function() {
     "use strict";
     let e = void 0;

     function t(e, t) {
         return new Promise(s => {
             const i = () => {
                 t.removeEventListener("transitionend", i), s()
             };
             t.addEventListener("transitionend", i);
             const l = t.getAttribute("class"),
                 n = t.getAttribute("style");
             e(), l === t.getAttribute("class") && n === t.getAttribute("style") && i(), 0 === parseFloat(getComputedStyle(t).transitionDuration) && i()
         })
     }

     function s({
         src: e,
         srcset: t,
         sizes: s
     }) {
         const i = new Image;
         return i.src = e, t && (i.srcset = t), s && (i.sizes = s), "decode" in i ? new Promise((e, t) => {
             i.decode().then(() => {
                 e(i)
             }).catch(() => {
                 t(i)
             })
         }) : new Promise((e, t) => {
             i.onload = e(i), i.onerror = t(i)
         })
     }

     function i(e) {
         let t, s;
         const {
             imgHeight: i,
             imgWidth: l,
             containerHeight: n,
             containerWidth: a,
             canvasWidth: o,
             canvasHeight: c,
             imageSize: h
         } = e, r = i / l;
         return "cover" == h ? r < n / a ? s = (t = n) / r : t = (s = a) * r : "native" == h ? (t = i, s = l) : (r > c / o ? s = (t = c) / r : t = (s = o) * r, "scale-down" === h && (s >= l || t >= i) && (s = l, t = i)), {
             height: t,
             width: s
         }
     }

     function l(e) {
         return e.requestFullscreen ? e.requestFullscreen() : e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : e.msRequestFullscreen ? e.msRequestFullscreen() : Promise.reject()
     }

     function n() {
         return document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.msExitFullscreen ? document.msExitFullscreen() : Promise.reject()
     }
     const a = {
         container: document.body,
         className: void 0,
         imageSize: "scale-down",
         fullScreen: !1,
         loop: !1,
         linkImages: !0,
         setIndex: 0,
         firstImageIndex: 0,
         lastImageIndex: !1,
         currentImageIndex: void 0,
         allowZoom: !0,
         closeOnBackgroundClick: !0,
         setTitle: function() {
             return ""
         },
         description: function() {
             return this.images[this.settings.currentImageIndex].title
         },
         pagination: function() {
             const e = this.settings.lastImageIndex + 1;
             return this.settings.currentImageIndex + 1 + "/" + e
         },
         afterInitialize() {},
         afterMarkup() {},
         afterImageLoad() {},
         afterClose() {},
         zoomedPaddingX: function(e, t) {
             return 0
         },
         zoomedPaddingY: function(e, t) {
             return 0
         }
     };
     class o {
         constructor(e, t) {
             this.settings = t, this.elems = {}, this.images = [], this.events = [], this.state = {
                 fullScreenOpen: !1,
                 initialZoomState: null,
                 initialized: !1,
                 timer: !1,
                 visible: !1
             }, this._cssClasses = ["chocolat-open", "chocolat-in-container", "chocolat-cover", "chocolat-zoomable", "chocolat-zoomed", "chocolat-zooming-in", "chocolat-zooming-out"], NodeList.prototype.isPrototypeOf(e) || HTMLCollection.prototype.isPrototypeOf(e) ? e.forEach((e, t) => {
                 this.images.push({
                     title: e.getAttribute("title"),
                     src: e.getAttribute("href"),
                     srcset: e.getAttribute("data-srcset"),
                     sizes: e.getAttribute("data-sizes")
                 }), this.off(e, "click.chocolat"), this.on(e, "click.chocolat", e => {
                     this.init(t), e.preventDefault()
                 })
             }) : this.images = e, this.settings.container instanceof Element || this.settings.container instanceof HTMLElement ? this.elems.container = this.settings.container : this.elems.container = document.body, this.api = {
                 open: e => (e = parseInt(e) || 0, this.init(e)),
                 close: () => this.close(),
                 next: () => this.change(1),
                 prev: () => this.change(-1),
                 goto: e => this.open(e),
                 current: () => this.settings.currentImageIndex,
                 position: () => this.position(this.elems.img),
                 destroy: () => this.destroy(),
                 set: (e, t) => (this.settings[e] = t, t),
                 get: e => this.settings[e],
                 getElem: e => this.elems[e]
             }
         }
         init(e) {
             return this.state.initialized || (this.markup(), this.attachListeners(), this.settings.lastImageIndex = this.images.length - 1, this.state.initialized = !0), this.settings.afterInitialize.call(this), this.load(e)
         }
         load(e) {
             if (this.state.visible || (this.state.visible = !0, setTimeout(() => {
                     this.elems.overlay.classList.add("chocolat-visible"), this.elems.wrapper.classList.add("chocolat-visible")
                 }, 0), this.elems.container.classList.add("chocolat-open")), this.settings.fullScreen && l(this.elems.wrapper), this.settings.currentImageIndex === e) return Promise.resolve();
             let i, n, a = setTimeout(() => {
                     this.elems.loader.classList.add("chocolat-visible")
                 }, 1e3),
                 o = setTimeout(() => {
                     o = void 0, i = t(() => {
                         this.elems.imageCanvas.classList.remove("chocolat-visible")
                     }, this.elems.imageCanvas)
                 }, 80);
             return s(this.images[e]).then(e => (n = e, o ? (clearTimeout(o), Promise.resolve()) : i)).then(() => {
                 const t = e + 1;
                 return null != this.images[t] && s(this.images[t]), this.settings.currentImageIndex = e, this.elems.description.textContent = this.settings.description.call(this), this.elems.pagination.textContent = this.settings.pagination.call(this), this.arrows(), this.position(n).then(() => (this.elems.loader.classList.remove("chocolat-visible"), clearTimeout(a), this.appear(n)))
             }).then(() => {
                 this.elems.container.classList.toggle("chocolat-zoomable", this.zoomable(n, this.elems.wrapper)), this.settings.afterImageLoad.call(this)
             })
         }
         position({
             naturalHeight: e,
             naturalWidth: s
         }) {
             const l = {
                     imgHeight: e,
                     imgWidth: s,
                     containerHeight: this.elems.container.clientHeight,
                     containerWidth: this.elems.container.clientWidth,
                     canvasWidth: this.elems.imageCanvas.clientWidth,
                     canvasHeight: this.elems.imageCanvas.clientHeight,
                     imageSize: this.settings.imageSize
                 },
                 {
                     width: n,
                     height: a
                 } = i(l);
             return t(() => {
                 Object.assign(this.elems.imageWrapper.style, {
                     width: n + "px",
                     height: a + "px"
                 })
             }, this.elems.imageWrapper)
         }
         appear(e) {
             return this.elems.imageWrapper.removeChild(this.elems.img), this.elems.img = e, this.elems.img.setAttribute("class", "chocolat-img"), this.elems.imageWrapper.appendChild(this.elems.img), t(() => {
                 this.elems.imageCanvas.classList.add("chocolat-visible")
             }, this.elems.imageCanvas)
         }
         change(e) {
             if (!this.state.visible) return;
             if (!this.settings.linkImages) return;
             this.zoomOut();
             const t = this.settings.currentImageIndex + parseInt(e);
             if (t > this.settings.lastImageIndex) {
                 if (this.settings.loop) return this.load(this.settings.firstImageIndex)
             } else {
                 if (!(t < this.settings.firstImageIndex)) return this.load(t);
                 if (this.settings.loop) return this.load(this.settings.lastImageIndex)
             }
         }
         arrows() {
             this.settings.loop ? (this.elems.left.classList.add("active"), this.elems.right.classList.add("active")) : this.settings.linkImages ? (this.elems.right.classList.toggle("active", this.settings.currentImageIndex !== this.settings.lastImageIndex), this.elems.left.classList.toggle("active", this.settings.currentImageIndex !== this.settings.firstImageIndex)) : (this.elems.left.classList.remove("active"), this.elems.right.classList.remove("active"))
         }
         close() {
             if (this.state.fullScreenOpen) return void n();
             this.state.visible = !1;
             const e = t(() => {
                     this.elems.overlay.classList.remove("chocolat-visible")
                 }, this.elems.overlay),
                 s = t(() => {
                     this.elems.wrapper.classList.remove("chocolat-visible")
                 }, this.elems.wrapper);
             return Promise.all([e, s]).then(() => {
                 this.elems.container.classList.remove("chocolat-open"), this.settings.afterClose.call(this)
             })
         }
         destroy() {
             for (let e = this.events.length - 1; e >= 0; e--) {
                 const {
                     element: t,
                     eventName: s
                 } = this.events[e];
                 this.off(t, s)
             }
             this.state.initialized && (this.state.fullScreenOpen && n(), this.settings.currentImageIndex = void 0, this.state.visible = !1, this.state.initialized = !1, this.elems.container.classList.remove(...this._cssClasses), this.elems.wrapper.parentNode.removeChild(this.elems.wrapper))
         }
         markup() {
             this.elems.container.classList.add("chocolat-open", this.settings.className), "cover" == this.settings.imageSize && this.elems.container.classList.add("chocolat-cover"), this.elems.container !== document.body && this.elems.container.classList.add("chocolat-in-container"), this.elems.wrapper = document.createElement("div"), this.elems.wrapper.setAttribute("id", "chocolat-content-" + this.settings.setIndex), this.elems.wrapper.setAttribute("class", "chocolat-wrapper"), this.elems.container.appendChild(this.elems.wrapper), this.elems.overlay = document.createElement("div"), this.elems.overlay.setAttribute("class", "chocolat-overlay"), this.elems.wrapper.appendChild(this.elems.overlay), this.elems.loader = document.createElement("div"), this.elems.loader.setAttribute("class", "chocolat-loader"), this.elems.wrapper.appendChild(this.elems.loader), this.elems.layout = document.createElement("div"), this.elems.layout.setAttribute("class", "chocolat-layout"), this.elems.wrapper.appendChild(this.elems.layout), this.elems.top = document.createElement("div"), this.elems.top.setAttribute("class", "chocolat-top"), this.elems.layout.appendChild(this.elems.top), this.elems.center = document.createElement("div"), this.elems.center.setAttribute("class", "chocolat-center"), this.elems.layout.appendChild(this.elems.center), this.elems.left = document.createElement("div"), this.elems.left.setAttribute("class", "chocolat-left"), this.elems.center.appendChild(this.elems.left), this.elems.imageCanvas = document.createElement("div"), this.elems.imageCanvas.setAttribute("class", "chocolat-image-canvas"), this.elems.center.appendChild(this.elems.imageCanvas), this.elems.imageWrapper = document.createElement("div"), this.elems.imageWrapper.setAttribute("class", "chocolat-image-wrapper"), this.elems.imageCanvas.appendChild(this.elems.imageWrapper), this.elems.img = document.createElement("img"), this.elems.img.setAttribute("class", "chocolat-img"), this.elems.imageWrapper.appendChild(this.elems.img), this.elems.right = document.createElement("div"), this.elems.right.setAttribute("class", "chocolat-right"), this.elems.center.appendChild(this.elems.right), this.elems.bottom = document.createElement("div"), this.elems.bottom.setAttribute("class", "chocolat-bottom"), this.elems.layout.appendChild(this.elems.bottom), this.elems.close = document.createElement("span"), this.elems.close.setAttribute("class", "chocolat-close"), this.elems.top.appendChild(this.elems.close), this.elems.description = document.createElement("span"), this.elems.description.setAttribute("class", "chocolat-description"), this.elems.bottom.appendChild(this.elems.description), this.elems.pagination = document.createElement("span"), this.elems.pagination.setAttribute("class", "chocolat-pagination"), this.elems.bottom.appendChild(this.elems.pagination), this.elems.setTitle = document.createElement("span"), this.elems.setTitle.setAttribute("class", "chocolat-set-title"), this.elems.setTitle.textContent = this.settings.setTitle(), this.elems.bottom.appendChild(this.elems.setTitle), this.elems.fullscreen = document.createElement("span"), this.elems.fullscreen.setAttribute("class", "chocolat-fullscreen"), this.elems.bottom.appendChild(this.elems.fullscreen), this.settings.afterMarkup.call(this)
         }
         attachListeners() {
             this.off(document, "keydown.chocolat"), this.on(document, "keydown.chocolat", e => {
                 this.state.initialized && (37 == e.keyCode ? this.change(-1) : 39 == e.keyCode ? this.change(1) : 27 == e.keyCode && this.close())
             });
             const t = this.elems.wrapper.querySelector(".chocolat-right");
             this.off(t, "click.chocolat"), this.on(t, "click.chocolat", () => {
                 this.change(1)
             });
             const s = this.elems.wrapper.querySelector(".chocolat-left");
             this.off(s, "click.chocolat"), this.on(s, "click.chocolat", () => {
                 this.change(-1)
             }), this.off(this.elems.close, "click.chocolat"), this.on(this.elems.close, "click.chocolat", this.close.bind(this)), this.off(this.elems.fullscreen, "click.chocolat"), this.on(this.elems.fullscreen, "click.chocolat", () => {
                 this.state.fullScreenOpen ? n() : l(this.elems.wrapper)
             }), this.off(document, "fullscreenchange.chocolat"), this.on(document, "fullscreenchange.chocolat", () => {
                 document.fullscreenElement || document.webkitCurrentFullScreenElement || document.webkitFullscreenElement ? this.state.fullScreenOpen = !0 : this.state.fullScreenOpen = !1
             }), this.off(document, "webkitfullscreenchange.chocolat"), this.on(document, "webkitfullscreenchange.chocolat", () => {
                 document.fullscreenElement || document.webkitCurrentFullScreenElement || document.webkitFullscreenElement ? this.state.fullScreenOpen = !0 : this.state.fullScreenOpen = !1
             }), this.settings.closeOnBackgroundClick && (this.off(this.elems.overlay, "click.chocolat"), this.on(this.elems.overlay, "click.chocolat", this.close.bind(this))), this.off(this.elems.wrapper, "click.chocolat"), this.on(this.elems.wrapper, "click.chocolat", () => {
                 null !== this.state.initialZoomState && this.state.visible && (this.elems.container.classList.add("chocolat-zooming-out"), this.zoomOut().then(() => {
                     this.elems.container.classList.remove("chocolat-zoomed"), this.elems.container.classList.remove("chocolat-zooming-out")
                 }))
             }), this.off(this.elems.imageWrapper, "click.chocolat"), this.on(this.elems.imageWrapper, "click.chocolat", e => {
                 null === this.state.initialZoomState && this.elems.container.classList.contains("chocolat-zoomable") && (e.stopPropagation(), this.elems.container.classList.add("chocolat-zooming-in"), this.zoomIn(e).then(() => {
                     this.elems.container.classList.add("chocolat-zoomed"), this.elems.container.classList.remove("chocolat-zooming-in")
                 }))
             }), this.on(this.elems.wrapper, "mousemove.chocolat", e => {
                 if (null === this.state.initialZoomState || !this.state.visible) return;
                 const t = this.elems.wrapper.getBoundingClientRect(),
                     s = t.top + window.scrollY,
                     i = t.left + window.scrollX,
                     l = this.elems.wrapper.clientHeight,
                     n = this.elems.wrapper.clientWidth,
                     a = this.elems.img.width,
                     o = this.elems.img.height,
                     c = [e.pageX - n / 2 - i, e.pageY - l / 2 - s];
                 let h = 0;
                 if (a > n) {
                     const e = this.settings.zoomedPaddingX(a, n);
                     h = c[0] / (n / 2), h *= (a - n) / 2 + e
                 }
                 let r = 0;
                 if (o > l) {
                     const e = this.settings.zoomedPaddingY(o, l);
                     r = c[1] / (l / 2), r *= (o - l) / 2 + e
                 }
                 this.elems.img.style.marginLeft = -h + "px", this.elems.img.style.marginTop = -r + "px"
             }), this.on(window, "resize.chocolat", t => {
                 this.state.initialized && this.state.visible && function(t, s) {
                     clearTimeout(e), e = setTimeout(function() {
                         s()
                     }, t)
                 }(50, () => {
                     const e = {
                             imgHeight: this.elems.img.naturalHeight,
                             imgWidth: this.elems.img.naturalWidth,
                             containerHeight: this.elems.wrapper.clientHeight,
                             containerWidth: this.elems.wrapper.clientWidth,
                             canvasWidth: this.elems.imageCanvas.clientWidth,
                             canvasHeight: this.elems.imageCanvas.clientHeight,
                             imageSize: this.settings.imageSize
                         },
                         {
                             width: t,
                             height: s
                         } = i(e);
                     this.position(this.elems.img).then(() => {
                         this.elems.container.classList.toggle("chocolat-zoomable", this.zoomable(this.elems.img, this.elems.wrapper))
                     })
                 })
             })
         }
         zoomable(e, t) {
             const s = t.clientWidth,
                 i = t.clientHeight,
                 l = !(!this.settings.allowZoom || !(e.naturalWidth > s || e.naturalHeight > i)),
                 n = e.clientWidth > e.naturalWidth || e.clientHeight > e.naturalHeight;
             return l && !n
         }
         zoomIn(e) {
             return this.state.initialZoomState = this.settings.imageSize, this.settings.imageSize = "native", this.position(this.elems.img)
         }
         zoomOut(e) {
             return this.settings.imageSize = this.state.initialZoomState || this.settings.imageSize, this.state.initialZoomState = null, this.elems.img.style.margin = 0, this.position(this.elems.img)
         }
         on(e, t, s) {
             const i = this.events.push({
                 element: e,
                 eventName: t,
                 cb: s
             });
             e.addEventListener(t.split(".")[0], this.events[i - 1].cb)
         }
         off(e, t) {
             const s = this.events.findIndex(s => s.element === e && s.eventName === t);
             this.events[s] && (e.removeEventListener(t.split(".")[0], this.events[s].cb), this.events.splice(s, 1))
         }
     }
     const c = [];
     window.Chocolat = function(e, t) {
         const s = Object.assign({}, a, {
                 images: []
             }, t, {
                 setIndex: c.length
             }),
             i = new o(e, s);
         return c.push(i), i
     }
 }();