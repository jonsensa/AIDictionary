(() => {
  // node_modules/simple-liquid-glass/dist/web-component.esm.js
  function t(t2, e2) {
    (null == e2 || e2 > t2.length) && (e2 = t2.length);
    for (var n2 = 0, a2 = Array(e2); n2 < e2; n2++) a2[n2] = t2[n2];
    return a2;
  }
  function e(t2, e2, n2) {
    return e2 = r(e2), (function(t3, e3) {
      if (e3 && ("object" == typeof e3 || "function" == typeof e3)) return e3;
      if (void 0 !== e3) throw new TypeError("Derived constructors may only return object or undefined");
      return (function(t4) {
        if (void 0 === t4) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t4;
      })(t3);
    })(t2, c() ? Reflect.construct(e2, [], r(t2).constructor) : e2.apply(t2, n2));
  }
  function n(t2, e2) {
    for (var n2 = 0; n2 < e2.length; n2++) {
      var a2 = e2[n2];
      a2.enumerable = a2.enumerable || false, a2.configurable = true, "value" in a2 && (a2.writable = true), Object.defineProperty(t2, s(a2.key), a2);
    }
  }
  function a(t2, e2, n2) {
    return (e2 = s(e2)) in t2 ? Object.defineProperty(t2, e2, { value: n2, enumerable: true, configurable: true, writable: true }) : t2[e2] = n2, t2;
  }
  function r(t2) {
    return r = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t3) {
      return t3.__proto__ || Object.getPrototypeOf(t3);
    }, r(t2);
  }
  function c() {
    try {
      var t2 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t3) {
    }
    return (c = function() {
      return !!t2;
    })();
  }
  function o(t2, e2) {
    return o = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t3, e3) {
      return t3.__proto__ = e3, t3;
    }, o(t2, e2);
  }
  function i(e2, n2) {
    return (function(t2) {
      if (Array.isArray(t2)) return t2;
    })(e2) || (function(t2, e3) {
      var n3 = null == t2 ? null : "undefined" != typeof Symbol && t2[Symbol.iterator] || t2["@@iterator"];
      if (null != n3) {
        var a2, r2, c2, o2, i2 = [], s2 = true, l2 = false;
        try {
          if (c2 = (n3 = n3.call(t2)).next, 0 === e3) ;
          else for (; !(s2 = (a2 = c2.call(n3)).done) && (i2.push(a2.value), i2.length !== e3); s2 = true) ;
        } catch (t3) {
          l2 = true, r2 = t3;
        } finally {
          try {
            if (!s2 && null != n3.return && (o2 = n3.return(), Object(o2) !== o2)) return;
          } finally {
            if (l2) throw r2;
          }
        }
        return i2;
      }
    })(e2, n2) || (function(e3, n3) {
      if (e3) {
        if ("string" == typeof e3) return t(e3, n3);
        var a2 = {}.toString.call(e3).slice(8, -1);
        return "Object" === a2 && e3.constructor && (a2 = e3.constructor.name), "Map" === a2 || "Set" === a2 ? Array.from(e3) : "Arguments" === a2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a2) ? t(e3, n3) : void 0;
      }
    })(e2, n2) || (function() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    })();
  }
  function s(t2) {
    var e2 = (function(t3, e3) {
      if ("object" != typeof t3 || !t3) return t3;
      var n2 = t3[Symbol.toPrimitive];
      if (void 0 !== n2) {
        var a2 = n2.call(t3, e3);
        if ("object" != typeof a2) return a2;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return String(t3);
    })(t2, "string");
    return "symbol" == typeof e2 ? e2 : e2 + "";
  }
  function l(t2) {
    var e2 = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
    return l = function(t3) {
      if (null === t3 || !(function(t4) {
        try {
          return -1 !== Function.toString.call(t4).indexOf("[native code]");
        } catch (e3) {
          return "function" == typeof t4;
        }
      })(t3)) return t3;
      if ("function" != typeof t3) throw new TypeError("Super expression must either be null or a function");
      if (void 0 !== e2) {
        if (e2.has(t3)) return e2.get(t3);
        e2.set(t3, n2);
      }
      function n2() {
        return (function(t4, e3, n3) {
          if (c()) return Reflect.construct.apply(null, arguments);
          var a2 = [null];
          a2.push.apply(a2, e3);
          var r2 = new (t4.bind.apply(t4, a2))();
          return n3 && o(r2, n3.prototype), r2;
        })(t3, arguments, r(this).constructor);
      }
      return n2.prototype = Object.create(t3.prototype, { constructor: { value: n2, enumerable: false, writable: true, configurable: true } }), o(n2, t3);
    }, l(t2);
  }
  function u(t2, e2, n2) {
    if ("number" == typeof n2 && Number.isFinite(n2)) return Math.max(0, Math.min(0.45, n2));
    if (!Number.isFinite(t2) || t2 <= 0 || !Number.isFinite(e2) || e2 <= 0) return 0.06;
    var a2 = 0.75 * t2 / e2;
    return Math.max(0.06, Math.min(0.45, a2));
  }
  function d(t2) {
    var e2 = (("number" == typeof t2 && Number.isFinite(t2) ? t2 : 0) % 360 + 360) % 360;
    return Math.round(1e3 * e2) / 1e3;
  }
  function f(t2) {
    var e2, n2, a2 = t2.width, r2 = t2.height, c2 = t2.divisor, o2 = t2.quantStep, i2 = t2.radius, s2 = t2.border, l2 = t2.lightness, f2 = t2.alpha, h2 = t2.displace, p2 = null !== (e2 = t2.blend) && void 0 !== e2 ? e2 : "difference", b2 = d(t2.angle), g2 = false !== t2.shapeAdapt, m2 = null !== (n2 = t2.lens) && void 0 !== n2 ? n2 : "classic", y2 = "number" == typeof t2.lensStrength && Number.isFinite(t2.lensStrength) ? Math.max(0, t2.lensStrength) : 1, x2 = t2.lensCenter ? t2.lensCenter[0] : 0.5, v = t2.lensCenter ? t2.lensCenter[1] : 0.5, w = (function(t3, e3, n3, a3) {
      return { newwidth: Math.max(8, Math.round(t3 / n3 / a3) * a3), newheight: Math.max(8, Math.round(e3 / n3 / a3) * a3) };
    })(a2, r2, c2, o2), M = w.newwidth, k = w.newheight, q = Math.min(M, k) * (0.5 * s2), F = Math.min(i2, a2 / 2, r2 / 2) / c2;
    if ("classic" !== m2) {
      var O, S = '<rect x="'.concat(q, '" y="').concat(q, '" width="').concat(M - 2 * q, '" height="').concat(k - 2 * q, '" rx="').concat(F, '" fill="hsl(0 0% ').concat(l2, "% / ").concat(f2, ')" style="filter:blur(').concat(h2, 'px)" />');
      O = "convex" === m2 ? (function(t3, e3, n3, a3, r3, c3, o3) {
        var i3 = c3 * t3, s3 = o3 * e3, l3 = Math.max(8, 0.66 * Math.min(t3, e3)), u2 = r3 > 0 ? Math.min(0.5, 0.3 * r3) : 0, d2 = Math.round(255 * (0.5 + u2)), f3 = Math.round(255 * (0.5 - u2)), h3 = 0 !== a3 ? ' gradientTransform="rotate('.concat(a3, " ").concat(i3, " ").concat(s3, ')"') : "", p3 = u2 > 0 ? '<linearGradient id="cvxRed" gradientUnits="userSpaceOnUse" x1="'.concat(i3 - l3, '" y1="').concat(s3, '" x2="').concat(i3 + l3, '" y2="').concat(s3, '"').concat(h3, '><stop offset="0%" stop-color="rgb(').concat(d2, ',0,0)"/><stop offset="100%" stop-color="rgb(').concat(f3, ',0,0)"/></linearGradient>') : '<linearGradient id="cvxRed"><stop offset="0%" stop-color="rgb(128,0,0)"/></linearGradient>', b3 = u2 > 0 ? '<linearGradient id="cvxBlue" gradientUnits="userSpaceOnUse" x1="'.concat(i3, '" y1="').concat(s3 - l3, '" x2="').concat(i3, '" y2="').concat(s3 + l3, '"').concat(h3, '><stop offset="0%" stop-color="rgb(0,0,').concat(d2, ')"/><stop offset="100%" stop-color="rgb(0,0,').concat(f3, ')"/></linearGradient>') : '<linearGradient id="cvxBlue"><stop offset="0%" stop-color="rgb(0,0,128)"/></linearGradient>';
        return { defs: "".concat(p3, "\n          ").concat(b3, '\n          <radialGradient id="cvxEnv" gradientUnits="userSpaceOnUse" cx="').concat(i3, '" cy="').concat(s3, '" r="').concat(l3, '" fx="').concat(i3, '" fy="').concat(s3, '"><stop offset="0%" stop-color="#fff"/><stop offset="40%" stop-color="#fff"/><stop offset="100%" stop-color="#000"/></radialGradient>\n          <mask id="cvxMask" maskUnits="userSpaceOnUse" x="0" y="0" width="').concat(t3, '" height="').concat(e3, '"><rect x="0" y="0" width="').concat(t3, '" height="').concat(e3, '" fill="url(#cvxEnv)"/></mask>'), body: '<rect x="0" y="0" width="'.concat(t3, '" height="').concat(e3, '" fill="black"/>\n        <g>\n          <rect x="0" y="0" width="').concat(t3, '" height="').concat(e3, '" rx="').concat(n3, '" fill="rgb(128,0,0)"/>\n          <rect x="0" y="0" width="').concat(t3, '" height="').concat(e3, '" rx="').concat(n3, '" fill="url(#cvxRed)" mask="url(#cvxMask)"/>\n        </g>\n        <g style="mix-blend-mode: difference">\n          <rect x="0" y="0" width="').concat(t3, '" height="').concat(e3, '" rx="').concat(n3, '" fill="rgb(0,0,128)"/>\n          <rect x="0" y="0" width="').concat(t3, '" height="').concat(e3, '" rx="').concat(n3, '" fill="url(#cvxBlue)" mask="url(#cvxMask)"/>\n        </g>') };
      })(M, k, F, b2, y2, x2, v) : "shift" === m2 ? (function(t3, e3, n3, a3, r3, c3) {
        var o3 = r3 * Math.PI / 180, i3 = Math.max(0, Math.min(0.5, 0.25 * c3)), s3 = Math.round(255 * (0.5 + i3 * Math.cos(o3))), l3 = Math.round(255 * (0.5 + i3 * Math.sin(o3))), u2 = Math.min(t3, e3) / 2 - 0.5, d2 = Math.max(1, Math.min(n3, u2 / 3));
        return { defs: '<mask id="shiftMask" maskUnits="userSpaceOnUse" x="0" y="0" width="'.concat(t3, '" height="').concat(e3, '"><rect x="0" y="0" width="').concat(t3, '" height="').concat(e3, '" fill="black"/><rect x="').concat(d2, '" y="').concat(d2, '" width="').concat(t3 - 2 * d2, '" height="').concat(e3 - 2 * d2, '" rx="').concat(Math.max(0, a3 - d2), '" fill="white" style="filter:blur(').concat(d2, 'px)"/></mask>'), body: '<rect x="0" y="0" width="'.concat(t3, '" height="').concat(e3, '" fill="rgb(128,0,128)"/>\n        <rect x="0" y="0" width="').concat(t3, '" height="').concat(e3, '" rx="').concat(a3, '" fill="rgb(').concat(s3, ",0,").concat(l3, ')" mask="url(#shiftMask)"/>') };
      })(M, k, q, F, b2, y2) : (function(t3, e3, n3, a3, r3, c3, o3, i3) {
        var s3 = o3 * t3, l3 = i3 * e3, u2 = Math.min(1, Math.max(0, c3)), d2 = Math.round(127 * 0.42 * u2), f3 = Math.min(255, 128 + d2), h3 = Math.max(0, 128 - d2), p3 = Math.min(t3, e3) / 2, b3 = Math.max(1.6 * n3, 0.4 * Math.min(t3, e3)), g3 = (100 * Math.max(0, p3 - b3 * u2) / p3).toFixed(2), m3 = 0 !== r3 ? ' gradientTransform="rotate('.concat(r3, " ").concat(s3, " ").concat(l3, ')"') : "";
        return { defs: '<linearGradient id="rimRed" gradientUnits="userSpaceOnUse" x1="0" y1="'.concat(l3, '" x2="').concat(t3, '" y2="').concat(l3, '"').concat(m3, '><stop offset="0%" stop-color="rgb(').concat(h3, ',0,0)"/><stop offset="50%" stop-color="rgb(128,0,0)"/><stop offset="100%" stop-color="rgb(').concat(f3, ',0,0)"/></linearGradient>\n          <linearGradient id="rimBlue" gradientUnits="userSpaceOnUse" x1="').concat(s3, '" y1="0" x2="').concat(s3, '" y2="').concat(e3, '"').concat(m3, '><stop offset="0%" stop-color="rgb(0,0,').concat(h3, ')"/><stop offset="50%" stop-color="rgb(0,0,128)"/><stop offset="100%" stop-color="rgb(0,0,').concat(f3, ')"/></linearGradient>\n          <radialGradient id="rimRadial" gradientUnits="userSpaceOnUse" cx="').concat(s3, '" cy="').concat(l3, '" r="').concat(p3, '"').concat(m3, '><stop offset="0%" stop-color="#000"/><stop offset="').concat(g3, '%" stop-color="#000"/><stop offset="100%" stop-color="#fff"/></radialGradient>\n          <mask id="rimMask" maskUnits="userSpaceOnUse" x="0" y="0" width="').concat(t3, '" height="').concat(e3, '"><rect x="0" y="0" width="').concat(t3, '" height="').concat(e3, '" fill="url(#rimRadial)"/></mask>'), body: '<rect x="0" y="0" width="'.concat(t3, '" height="').concat(e3, '" fill="rgb(128,0,128)"/>\n        <g mask="url(#rimMask)">\n          <rect x="0" y="0" width="').concat(t3, '" height="').concat(e3, '" fill="black"/>\n          <rect x="0" y="0" width="').concat(t3, '" height="').concat(e3, '" rx="').concat(a3, '" fill="url(#rimRed)"/>\n          <rect x="0" y="0" width="').concat(t3, '" height="').concat(e3, '" rx="').concat(a3, '" fill="url(#rimBlue)" style="mix-blend-mode: screen"/>\n        </g>') };
      })(M, k, q, F, b2, y2, x2, v);
      var G = "rim" === m2 ? O.body : "".concat(O.body, "\n        ").concat(S);
      return '\n      <svg viewBox="0 0 '.concat(M, " ").concat(k, '" xmlns="http://www.w3.org/2000/svg">\n        <defs>\n          ').concat(O.defs, "\n        </defs>\n        ").concat(G, "\n      </svg>\n    ");
    }
    var R = '<rect x="'.concat(q, '" y="').concat(q, '" width="').concat(M - 2 * q, '" height="').concat(k - 2 * q, '" rx="').concat(F, '" fill="hsl(0 0% ').concat(l2, "% / ").concat(f2, ')" style="filter:blur(').concat(h2, 'px)" />');
    if (g2) {
      var U = (function(t3, e3, n3) {
        var a3 = t3 / 2, r3 = e3 / 2, c3 = Math.max(t3, e3), o3 = Math.round(255 * t3 / c3), i3 = Math.round(255 * e3 / c3), s3 = 0 !== n3 ? ' gradientTransform="rotate('.concat(n3, " ").concat(a3, " ").concat(r3, ')"') : "";
        return '          <linearGradient id="red" gradientUnits="userSpaceOnUse" x1="'.concat(t3, '" y1="').concat(r3, '" x2="0" y2="').concat(r3, '"').concat(s3, '>\n            <stop offset="0%" stop-color="#0000"/>\n            <stop offset="100%" stop-color="rgb(').concat(o3, ',0,0)"/>\n          </linearGradient>\n          <linearGradient id="blue" gradientUnits="userSpaceOnUse" x1="').concat(a3, '" y1="0" x2="').concat(a3, '" y2="').concat(e3, '"').concat(s3, '>\n            <stop offset="0%" stop-color="#0000"/>\n            <stop offset="100%" stop-color="rgb(0,0,').concat(i3, ')"/>\n          </linearGradient>');
      })(M, k, b2), A = Math.min(a2, r2), N = Number.isFinite(t2.scale) ? t2.scale : 0, j = u(N, A, t2.edgeFeather), C = (function(t3, e3, n3) {
        if (!Number.isFinite(t3) || t3 <= 0 || !Number.isFinite(e3) || e3 <= 0) return 1;
        var a3 = u(t3, e3, n3) * e3;
        return Math.max(0, Math.min(1, a3 / (0.75 * t3)));
      })(N, A, t2.edgeFeather), Y = Math.min(M, k), B = Math.max(0.5, j * Y), E = Math.max(0, F - B), X = Math.max(0.5, 0.5 * B), T = Math.max(0.6, 0.01 * Y), P = C < 0.999 ? ' opacity="'.concat(Math.round(1e3 * C) / 1e3, '"') : "";
      return '\n      <svg viewBox="0 0 '.concat(M, " ").concat(k, '" xmlns="http://www.w3.org/2000/svg">\n        <defs>\n').concat(U, '\n          <mask id="clsEnv" maskUnits="userSpaceOnUse" x="0" y="0" width="').concat(M, '" height="').concat(k, '">\n            <rect x="0" y="0" width="').concat(M, '" height="').concat(k, '" fill="#000"/>\n            <rect x="').concat(B, '" y="').concat(B, '" width="').concat(M - 2 * B, '" height="').concat(k - 2 * B, '" rx="').concat(E, '" fill="white" style="filter:blur(').concat(X, 'px)"/>\n          </mask>\n        </defs>\n        <rect x="0" y="0" width="').concat(M, '" height="').concat(k, '" fill="rgb(128,128,128)"/>\n        <g').concat(P, '>\n          <g mask="url(#clsEnv)" style="filter:blur(').concat(T, 'px)">\n            <rect x="0" y="0" width="').concat(M, '" height="').concat(k, '" rx="').concat(F, '" fill="url(#red)" />\n            <rect x="0" y="0" width="').concat(M, '" height="').concat(k, '" rx="').concat(F, '" fill="url(#blue)" style="mix-blend-mode: ').concat(p2, '" />\n          </g>\n        </g>\n        ').concat(R, "\n      </svg>\n    ");
    }
    var I = (function(t3) {
      var e3 = 0 !== t3 ? ' gradientTransform="rotate('.concat(t3, ' 0.5 0.5)"') : "";
      return '          <linearGradient id="red" x1="100%" y1="0%" x2="0%" y2="0%"'.concat(e3, '>\n            <stop offset="0%" stop-color="#0000"/>\n            <stop offset="100%" stop-color="red"/>\n          </linearGradient>\n          <linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%"').concat(e3, '>\n            <stop offset="0%" stop-color="#0000"/>\n            <stop offset="100%" stop-color="blue"/>\n          </linearGradient>');
    })(b2), _ = Math.max(0.6, 0.01 * Math.min(M, k));
    return '\n      <svg viewBox="0 0 '.concat(M, " ").concat(k, '" xmlns="http://www.w3.org/2000/svg">\n        <defs>\n').concat(I, '\n        </defs>\n        <rect x="0" y="0" width="').concat(M, '" height="').concat(k, '" fill="black"/>\n        <g style="filter:blur(').concat(_, 'px)">\n          <rect x="0" y="0" width="').concat(M, '" height="').concat(k, '" rx="').concat(F, '" fill="url(#red)" />\n          <rect x="0" y="0" width="').concat(M, '" height="').concat(k, '" rx="').concat(F, '" fill="url(#blue)" style="mix-blend-mode: ').concat(p2, '" />\n        </g>\n        ').concat(R, "\n      </svg>\n    ");
  }
  var h = ["ripple", "flow", "wobble"];
  var p = { ripple: { baseFrequencyX: 0.012, baseFrequencyY: 0.012, numOctaves: 2, scale: 15, seed: 3, ampX: 4e-3, ampY: 4e-3, rateX: 1.3, rateY: 1.1 }, flow: { baseFrequencyX: 0.01, baseFrequencyY: 0.016, numOctaves: 2, scale: 18, seed: 7, ampX: 6e-3, ampY: 0, rateX: 0.7, rateY: 0 }, wobble: { baseFrequencyX: 6e-3, baseFrequencyY: 6e-3, numOctaves: 1, scale: 28, seed: 11, ampX: 22e-4, ampY: 22e-4, rateX: 0.55, rateY: 0.5 } };
  var b = function(t2) {
    return Math.round(1e4 * t2) / 1e4;
  };
  var g = 0;
  function m(t2, e2, n2) {
    var a2 = parseFloat(t2.getAttribute(e2) || "");
    return Number.isFinite(a2) ? a2 : n2;
  }
  var y = (function() {
    function t2() {
      var n2;
      return (function(t3, e2) {
        if (!(t3 instanceof e2)) throw new TypeError("Cannot call a class as a function");
      })(this, t2), a(n2 = e(this, t2), "filterId", "lg-wc-".concat(++g)), a(n2, "liquidRaf", 0), n2.root = n2.attachShadow({ mode: "open" }), n2;
    }
    return (function(t3, e2) {
      if ("function" != typeof e2 && null !== e2) throw new TypeError("Super expression must either be null or a function");
      t3.prototype = Object.create(e2 && e2.prototype, { constructor: { value: t3, writable: true, configurable: true } }), Object.defineProperty(t3, "prototype", { writable: false }), e2 && o(t3, e2);
    })(t2, l(HTMLElement)), r2 = t2, c2 = [{ key: "connectedCallback", value: function() {
      var t3 = this;
      this.render(), "undefined" != typeof ResizeObserver && (this.ro = new ResizeObserver(function() {
        return t3.render();
      }), this.ro.observe(this));
    } }, { key: "disconnectedCallback", value: function() {
      var t3;
      null === (t3 = this.ro) || void 0 === t3 || t3.disconnect(), this.liquidRaf && cancelAnimationFrame(this.liquidRaf);
    } }, { key: "attributeChangedCallback", value: function() {
      this.isConnected && this.render();
    } }, { key: "render", value: function() {
      var t3, e2, n2, a2 = this, r3 = m(this, "radius", 50), c3 = m(this, "frost", 0.1), o2 = m(this, "blur", 0), s3 = m(this, "saturation", 140), l2 = m(this, "displace", 5), u2 = m(this, "scale", 160), g2 = m(this, "lightness", 53), y2 = m(this, "alpha", 0.9), x2 = this.getAttribute("border-color") || "rgba(120, 120, 120, 0.7)", v = d(m(this, "angle", 0)), w = "false" !== this.getAttribute("shape-adapt"), M = this.getAttribute("lens"), k = ["classic", "convex", "shift", "rim"].includes(M) ? M : "classic", q = m(this, "lens-strength", 1), F = this.getAttribute("lens-center"), O = (function() {
        if (F) {
          var t4 = F.split(/[ ,]+/).map(parseFloat);
          return 2 === t4.length && t4.every(Number.isFinite) ? [t4[0], t4[1]] : void 0;
        }
      })(), S = this.getAttribute("liquid"), G = "string" == typeof (t3 = S) && h.includes(t3) ? S : null, R = m(this, "liquid-speed", 1), U = null != this.getAttribute("liquid-scale") ? m(this, "liquid-scale", NaN) : void 0, A = "undefined" != typeof window && "function" == typeof window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches, N = !!G && !A, j = this.getBoundingClientRect(), C = j.width || 300, Y = j.height || 180, B = "", E = "";
      if ((function() {
        if ("undefined" == typeof navigator) return false;
        var t4 = navigator.userAgent || "";
        return !/(iphone|ipad|ipod)/i.test(t4) && !/firefox|fxios/i.test(t4) && /(chrome|chromium|edg|opr)\//i.test(t4);
      })()) {
        var X = "data:image/svg+xml,".concat(encodeURIComponent(f({ width: C, height: Y, divisor: 3, quantStep: 24, radius: r3, border: 0.05, lightness: g2, alpha: y2, displace: l2, blend: "difference", angle: v, shapeAdapt: w, lens: k, lensStrength: q, lensCenter: O, scale: u2 })));
        e2 = "saturate(".concat(s3, "%) url(#").concat(this.filterId, ")"), n2 = "hsl(0 0% 100% / ".concat(c3, ")");
        var T = "", P = "";
        if (N && G) {
          var I = (function(t4) {
            var e3, n3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, a3 = null !== (e3 = p[t4]) && void 0 !== e3 ? e3 : p.ripple, r4 = null != n3.scale && Number.isFinite(n3.scale) ? n3.scale : a3.scale;
            return null != n3.maxScale && Number.isFinite(n3.maxScale) && (r4 = Math.min(r4, n3.maxScale)), r4 = Math.max(0, r4), { baseFrequencyX: a3.baseFrequencyX, baseFrequencyY: a3.baseFrequencyY, numOctaves: a3.numOctaves, scale: r4, seed: a3.seed };
          })(G, { speed: R, scale: U });
          T = ' result="lqBase"', P = '<feTurbulence type="fractalNoise" baseFrequency="'.concat(I.baseFrequencyX, " ").concat(I.baseFrequencyY, '" numOctaves="').concat(I.numOctaves, '" seed="').concat(I.seed, '" result="lqNoise" data-lg-turb="1"/><feDisplacementMap in="lqBase" in2="lqNoise" scale="').concat(I.scale, '" xChannelSelector="R" yChannelSelector="G"/>');
        }
        E = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="'.concat(this.filterId, '" color-interpolation-filters="sRGB"><feImage href="').concat(X, '" x="0" y="0" width="100%" height="100%" result="map"/><feDisplacementMap in="SourceGraphic" in2="map" scale="').concat(u2, '" xChannelSelector="R" yChannelSelector="B" result="out"/><feGaussianBlur in="out" stdDeviation="').concat(o2, '"').concat(T, "/>").concat(P, "</filter></svg>");
      } else {
        var _ = Math.max(o2, 9);
        e2 = "blur(".concat(_, "px) saturate(").concat(Math.max(s3, 160), "%) brightness(1.04)"), n2 = "".concat("linear-gradient(135deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.06) 16%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 72%, rgba(255,255,255,0.12) 100%)", ", hsl(0 0% 100% / ").concat(c3, ")"), B = "box-shadow: 0 6px 22px rgba(0, 0, 0, 0.12);";
      }
      if (this.root.innerHTML = "\n      <style>\n        :host { display: block; position: relative; }\n        .lg-glass { position: absolute; inset: 0; z-index: 0; border-radius: ".concat(r3, "px; overflow: hidden;\n          background: ").concat(n2, "; backdrop-filter: ").concat(e2, "; -webkit-backdrop-filter: ").concat(e2, "; ").concat(B, " }\n        .lg-border { position: absolute; inset: 0; z-index: 2; border-radius: ").concat(r3, "px; pointer-events: none;\n          background: linear-gradient(315deg, ").concat(x2, " 0%, rgba(120,120,120,0) 30%, rgba(120,120,120,0) 70%, ").concat(x2, ' 100%) border-box;\n          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor;\n          mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); mask-composite: exclude; border: 1px solid transparent; }\n        .lg-content { position: relative; z-index: 3; width: 100%; height: 100%; }\n      </style>\n      <div class="lg-glass"></div>\n      <div class="lg-border"></div>\n      <div class="lg-content"><slot></slot></div>\n      ').concat(E, "\n    "), this.liquidRaf && (cancelAnimationFrame(this.liquidRaf), this.liquidRaf = 0), N && G) {
        var z = this.root.querySelector("[data-lg-turb]");
        if (z) {
          var D = 0, H = function(t4) {
            D || (D = t4);
            var e3 = (function(t5, e4) {
              var n4, a3 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1, r5 = null !== (n4 = p[t5]) && void 0 !== n4 ? n4 : p.ripple, c5 = (Number.isFinite(e4) ? e4 : 0) * (Number.isFinite(a3) ? a3 : 1), o3 = r5.baseFrequencyX + r5.ampX * Math.sin(c5 * r5.rateX), i2 = r5.ampY ? r5.baseFrequencyY + r5.ampY * Math.cos(c5 * r5.rateY) : r5.baseFrequencyY;
              return [b(Math.max(1e-4, o3)), b(Math.max(1e-4, i2))];
            })(G, (t4 - D) / 1e3, R), n3 = i(e3, 2), r4 = n3[0], c4 = n3[1];
            z.setAttribute("baseFrequency", "".concat(r4, " ").concat(c4)), a2.liquidRaf = requestAnimationFrame(H);
          };
          this.liquidRaf = requestAnimationFrame(H);
        }
      }
    } }], s2 = [{ key: "observedAttributes", get: function() {
      return ["radius", "frost", "blur", "saturation", "displace", "scale", "border-color", "lightness", "alpha", "angle", "shape-adapt", "lens", "lens-strength", "lens-center", "liquid", "liquid-speed", "liquid-scale"];
    } }], c2 && n(r2.prototype, c2), s2 && n(r2, s2), Object.defineProperty(r2, "prototype", { writable: false }), r2;
    var r2, c2, s2;
  })();
  function x() {
    var t2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "liquid-glass";
    "undefined" != typeof window && window.customElements && (customElements.get(t2) || customElements.define(t2, y));
  }
  x();

  // src/liquid-glass-entry.js
  x("context-explainer-liquid-glass");
})();
