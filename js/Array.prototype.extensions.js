Array.prototype.filterInPlace = function (condition, thisArg) {
  let jx = 0;
  this.forEach((el, ix) => {
    if (condition.call(thisArg, el, ix, this)) {
      if (ix !== jx) {
        this[jx] = el;
      }
      jx += 1;
    }
  });
  this.length = jx;
  return this;
};
Array.prototype.flat = function () {
  return [].concat.apply([], this);
};
Array.prototype.flatObj = function () {
  // FLATTEN OBJECT: https://stackoverflow.com/questions/31136422/flatten-array-with-objects-into-1-object
  return Object.assign.apply(Object, this);
};
Array.prototype.fillNaN = function (key, value) {
  if (!value) value = 0;
  if (!key) {
    return this.map((v) => (isNaN(v) || v == null ? value : v));
  } else {
    return this.map((v) => {
      if (isNaN(v[key]) || v[key] == null) v[key] = value;
      return v;
    });
  }
};
Array.prototype.sum = function (key) {
  if (this.length === 0) return 0;
  if (!key) {
    return this.reduce((accumulator, value) => accumulator + value);
  } else {
    return this.reduce((accumulator, value) => {
      const obj = {};
      obj[key] = accumulator[key] + value[key];
      return obj;
    })[key];
  }
};
Array.prototype.max = function (key, onkey) {
  const max = this.sort((a, b) => {
    if (key) return b[key] - a[key];
    else return b - a;
  })[0];
  if (onkey) return max[key];
  else return max;
};
Array.prototype.mean = function (key) {
  return this.sum(key) / this.length;
};
Array.prototype.variance = function (key) {
  if (this.length === 0) throw new Error('no values');
  const mean = this.mean(key);
  if (!key) return this.map((d) => Math.pow(d - mean, 2)).sum() / this.length;
  else return this.map((d) => Math.pow(d[key] - mean, 2)).sum() / this.length;
};
Array.prototype.sd = function (key) {
  if (this.length === 0) throw new Error('no values');
  return Math.sqrt(this.variance(key));
};
Array.prototype.nest = function (key, keep) {
  // THIS IS NOT QUITE THE SAME FUNCTION AS IN distances.js, THIS MORE CLOSELY RESEMBLES d3.nest
  const arr = [];
  this.forEach((d) => {
    const groupby = typeof key === 'function' ? key(d) : d[key];
    if (!arr.find((c) => c.key === groupby)) {
      if (keep) {
        const obj = {};
        obj.key = groupby;
        obj.values = [d];
        obj.count = 1;
        if (Array.isArray(keep)) keep.forEach((k) => (obj[k] = d[k]));
        else obj[keep] = d[keep];
        arr.push(obj);
      } else arr.push({ key: groupby, values: [d], count: 1 });
    } else {
      arr.find((c) => c.key === groupby).values.push(d);
      arr.find((c) => c.key === groupby).count++;
    }
  });
  return arr;
};
Array.prototype.dotProduct = function (V2) {
  // USED IN distances.cosine
  return this.map((v1, i) => {
    const v2 = V2[i];
    return v1 * v2;
  }).sum();
};
Array.prototype.matrixMultiplication = function (V) {
  return this.map((row) => {
    return [
      row
        .map((c, j) => {
          return c * V[j];
        })
        .sum(),
    ];
  });
};
Array.prototype.intersection = function (V2) {
  const intersection = [];
  this.sort();
  V2.sort();
  for (let i = 0; i < this.length; i += 1) {
    if (V2.indexOf(this[i]) !== -1) {
      intersection.push(this[i]);
    }
  }
  return intersection;
};
Array.prototype.diff = function (V2) {
  const diff = [];
  this.forEach((d) => {
    if (!V2.includes(d)) diff.push(d);
  });
  V2.forEach((d) => {
    if (!this.includes(d)) diff.push(d);
  });
  return diff;
};
Array.prototype.union = function (V) {
  V.forEach((d) => {
    if (this.indexOf(d) === -1) this.push(d);
  });
  return this;
};
Array.prototype.unique = function (key, onkey) {
  const arr = [];
  this.forEach((d) => {
    if (!key) {
      if (arr.indexOf(d) === -1) arr.push(d);
    } else {
      if (onkey) {
        if (arr.map((c) => c).indexOf(d[key]) === -1) arr.push(d[key]);
      } else {
        if (typeof key === 'function') {
          if (arr.map((c) => key(c)).indexOf(key(d)) === -1) arr.push(d);
        } else {
          if (arr.map((c) => c[key]).indexOf(d[key]) === -1) arr.push(d);
        }
      }
    }
  });
  return arr;
};
Array.prototype.group = function (key, keep) {
  const arr = [];
  this.forEach((d) => {
    if (!key) {
      if (arr.map((c) => c.key).indexOf(d) === -1)
        arr.push({ key: d, count: 1 });
      else arr.find((c) => c.key === d).count += 1;
    } else {
      if (arr.map((c) => c.key).indexOf(d[key]) === -1) {
        const obj = {};
        obj.key = d[key];
        obj.count = 1;
        if (keep) obj[keep] = [d[keep]];
        arr.push(obj);
      } else {
        const obj = arr.find((c) => c.key === d[key]);
        obj.count += 1;
        if (keep) obj[keep].push(d[keep]);
      }
    }
  });
  arr.forEach((d) => (d.p = d.count / this.length));
  return arr;
};
Array.prototype.zip = function (V2) {
  return this.map((d, i) => [d, V2[i]]);
};
Array.prototype.multizip = function (arr) {
  return this.map((d, i) => {
    const zip = [d];
    arr.forEach((c) => zip.push(c[i]));
    return zip;
  });
};
Array.prototype.last = function () {
  return this[this.length - 1];
};
Array.prototype.chunk = function (size) {
  const groups = [];
  for (let i = 0; i < this.length; i += size) {
    groups.push(this.slice(i, i + size));
  }
  return groups;
};
Array.prototype.median = function () {
  this.sort((a, b) => a - b);
  const half = Math.floor(this.length / 2);
  return this[half];
};
Array.prototype.shuffle = function () {
  let currentIndex = this.length;
  let temporaryValue;
  let randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = this[currentIndex];
    this[currentIndex] = this[randomIndex];
    this[randomIndex] = temporaryValue;
  }
  return this;
};
Array.prototype.duplicates = function (key, onkey) {
  const arr = [];
  this.forEach((d, i) => {
    if (!key) {
      if (i === 0) arr.push(d);
      else if (arr.indexOf(d) !== -1) arr.push(d);
    } else {
      if (onkey) {
        if (i === 0) arr.push(d[key]);
        else if (arr.map((c) => c).indexOf(d[key]) !== -1) arr.push(d[key]);
      } else {
        if (i === 0) arr.push(d);
        if (arr.map((c) => c[key]).indexOf(d[key]) !== -1) arr.push(d);
      }
    }
  });
  return arr;
};
