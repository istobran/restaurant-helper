import { rgb2lab } from 'rgb-lab';

export default class Color {
  constructor(r, g, b, a = 255) {
    this._r = r;
    this._g = g;
    this._b = b;
    this._a = a;
  }

  get r() {
    return this._r;
  }

  set r(value) {
    this._r = value;
  }

  get g() {
    return this._g;
  }

  set g(value) {
    this._g = value;
  }

  get b() {
    return this._b;
  }

  set b(value) {
    this._b = value;
  }

  get a() {
    return this._a;
  }

  set a(value) {
    this._a = value;
  }

  get hex() {
    return '#' + [this._r, this._g, this._b, this._a]
      .map(color => color.toString(16))
      .join('');
  }

  get lab() {
    return rgb2lab([this._r, this._g, this._b]);
  }
}
