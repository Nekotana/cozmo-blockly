// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('goog.structs.SetTest');
goog.setTestOnly('goog.structs.SetTest');

goog.require('goog.iter');
goog.require('goog.structs');
goog.require('goog.structs.Set');
goog.require('goog.testing.jsunit');

var Set = goog.structs.Set;

function stringifySet(s) {
  return goog.structs.getValues(s).join('');
}

function testGetCount() {
  var s = new Set;
  var a = new String('a');
  s.add(a);
  var b = new String('b');
  s.add(b);
  var c = new String('c');
  s.add(c);
  assertEquals('count, should be 3', s.getCount(), 3);
  var d = new String('d');
  s.add(d);
  assertEquals('count, should be 4', s.getCount(), 4);
  s.remove(d);
  assertEquals('count, should be 3', s.getCount(), 3);

  s = new Set;
  s.add('a');
  s.add('b');
  s.add('c');
  assertEquals('count, should be 3', s.getCount(), 3);
  s.add('d');
  assertEquals('count, should be 4', s.getCount(), 4);
  s.remove('d');
  assertEquals('count, should be 3', s.getCount(), 3);
}

function testGetValues() {
  var s = new Set;
  var a = new String('a');
  s.add(a);
  var b = new String('b');
  s.add(b);
  var c = new String('c');
  s.add(c);
  var d = new String('d');
  s.add(d);
  assertEquals(s.getValues().join(''), 'abcd');

  var s = new Set;
  s.add('a');
  s.add('b');
  s.add('c');
  s.add('d');
  assertEquals(s.getValues().join(''), 'abcd');
}

function testContains() {
  var s = new Set;
  var a = new String('a');
  s.add(a);
  var b = new String('b');
  s.add(b);
  var c = new String('c');
  s.add(c);
  var d = new String('d');
  s.add(d);
  var e = new String('e');

  assertTrue("contains, Should contain 'a'", s.contains(a));
  assertFalse("contains, Should not contain 'e'", s.contains(e));

  s = new Set;
  s.add('a');
  s.add('b');
  s.add('c');
  s.add('d');

  assertTrue("contains, Should contain 'a'", s.contains('a'));
  assertFalse("contains, Should not contain 'e'", s.contains('e'));
}

function testContainsFunctionValue() {
  var s = new Set;

  var fn1 = function() {};

  assertFalse(s.contains(fn1));
  s.add(fn1);
  assertTrue(s.contains(fn1));

  var fn2 = function() {};

  assertFalse(s.contains(fn2));
  s.add(fn2);
  assertTrue(s.contains(fn2));

  assertEquals(s.getCount(), 2);
}

function testContainsAll() {
  var set = new Set([1, 2, 3]);

  assertTrue('{1, 2, 3} contains []', set.containsAll([]));
  assertTrue('{1, 2, 3} contains [1]', set.containsAll([1]));
  assertTrue('{1, 2, 3} contains [1, 1]', set.containsAll([1, 1]));
  assertTrue('{1, 2, 3} contains [3, 2, 1]', set.containsAll([3, 2, 1]));
  assertFalse("{1, 2, 3} doesn't contain [4]", set.containsAll([4]));
  assertFalse("{1, 2, 3} doesn't contain [1, 4]", set.containsAll([1, 4]));

  assertTrue('{1, 2, 3} contains {a: 1}', set.containsAll({a: 1}));
  assertFalse("{1, 2, 3} doesn't contain {a: 4}", set.containsAll({a: 4}));

  assertTrue('{1, 2, 3} contains {1}', set.containsAll(new Set([1])));
  assertFalse("{1, 2, 3} doesn't contain {4}", set.containsAll(new Set([4])));
}

function testIntersection() {
  var emptySet = new Set;

  assertTrue(
      'intersection of empty set and [] should be empty',
      emptySet.intersection([]).isEmpty());
  assertIntersection(
      'intersection of 2 empty sets should be empty', emptySet, new Set(),
      new Set());

  var abcdSet = new Set();
  abcdSet.add('a');
  abcdSet.add('b');
  abcdSet.add('c');
  abcdSet.add('d');

  assertTrue(
      'intersection of populated set and [] should be empty',
      abcdSet.intersection([]).isEmpty());
  assertIntersection(
      'intersection of populated set and empty set should be empty', abcdSet,
      new Set(), new Set());

  var bcSet = new Set(['b', 'c']);
  assertIntersection(
      'intersection of [a,b,c,d] and [b,c]', abcdSet, bcSet, bcSet);

  var bceSet = new Set(['b', 'c', 'e']);
  assertIntersection(
      'intersection of [a,b,c,d] and [b,c,e]', abcdSet, bceSet, bcSet);
}

function testDifference() {
  var emptySet = new Set;

  assertTrue(
      'difference of empty set and [] should be empty',
      emptySet.difference([]).isEmpty());
  assertTrue(
      'difference of 2 empty sets should be empty',
      emptySet.difference(new Set()).isEmpty());

  var abcdSet = new Set(['a', 'b', 'c', 'd']);

  assertTrue(
      'difference of populated set and [] should be the populated set',
      abcdSet.difference([]).equals(abcdSet));
  assertTrue(
      'difference of populated set and empty set should be the populated set',
      abcdSet.difference(new Set()).equals(abcdSet));
  assertTrue(
      'difference of two identical sets should be the empty set',
      abcdSet.difference(abcdSet).equals(new Set()));

  var bcSet = new Set(['b', 'c']);
  assertTrue(
      'difference of [a,b,c,d] and [b,c] shoule be [a,d]',
      abcdSet.difference(bcSet).equals(new Set(['a', 'd'])));
  assertTrue(
      'difference of [b,c] and [a,b,c,d] should be the empty set',
      bcSet.difference(abcdSet).equals(new Set()));

  var xyzSet = new Set(['x', 'y', 'z']);
  assertTrue(
      'difference of [a,b,c,d] and [x,y,z] should be the [a,b,c,d]',
      abcdSet.difference(xyzSet).equals(abcdSet));
}


/**
 * Helper function to assert intersection is commutative.
 */
function assertIntersection(msg, set1, set2, expectedIntersection) {
  assertTrue(
      msg + ': set1->set2',
      set1.intersection(set2).equals(expectedIntersection));
  assertTrue(
      msg + ': set2->set1',
      set2.intersection(set1).equals(expectedIntersection));
}

function testRemoveAll() {
  assertRemoveAll('removeAll of empty set from empty set', [], [], []);
  assertRemoveAll(
      'removeAll of empty set from populated set', ['a', 'b', 'c', 'd'], [],
      ['a', 'b', 'c', 'd']);
  assertRemoveAll(
      'removeAll of [a,d] from [a,b,c,d]', ['a', 'b', 'c', 'd'], ['a', 'd'],
      ['b', 'c']);
  assertRemoveAll(
      'removeAll of [b,c] from [a,b,c,d]', ['a', 'b', 'c', 'd'], ['b', 'c'],
      ['a', 'd']);
  assertRemoveAll(
      'removeAll of [b,c,e] from [a,b,c,d]', ['a', 'b', 'c', 'd'],
      ['b', 'c', 'e'], ['a', 'd']);
  assertRemoveAll(
      'removeAll of [a,b,c,d] from [a,d]', ['a', 'd'], ['a', 'b', 'c', 'd'],
      []);
  assertRemoveAll(
      'removeAll of [a,b,c,d] from [b,c]', ['b', 'c'], ['a', 'b', 'c', 'd'],
      []);
  assertRemoveAll(
      'removeAll of [a,b,c,d] from [b,c,e]', ['b', 'c', 'e'],
      ['a', 'b', 'c', 'd'], ['e']);
}


/**
 * Helper function to test removeAll.
 */
function assertRemoveAll(msg, elements1, elements2, expectedResult) {
  var set1 = new Set(elements1);
  var set2 = new Set(elements2);
  set1.removeAll(set2);

  assertTrue(
      msg + ': set1 count increased after removeAll',
      elements1.length >= set1.getCount());
  assertEquals(
      msg + ': set2 count changed after removeAll', elements2.length,
      set2.getCount());
  assertTrue(msg + ': wrong set1 after removeAll', set1.equals(expectedResult));
  assertIntersection(
      msg + ': non-empty intersection after removeAll', set1, set2, []);
}

function testAdd() {
  var s = new Set;
  var a = new String('a');
  var b = new String('b');
  s.add(a);
  assertTrue(s.contains(a));
  s.add(b);
  assertTrue(s.contains(b));

  s = new Set;
  s.add('a');
  assertTrue(s.contains('a'));
  s.add('b');
  assertTrue(s.contains('b'));
  s.add(null);
  assertTrue('contains null', s.contains(null));
  assertFalse('does not contain "null"', s.contains('null'));
}


function testClear() {
  var s = new Set;
  var a = new String('a');
  s.add(a);
  var b = new String('b');
  s.add(b);
  var c = new String('c');
  s.add(c);
  var d = new String('d');
  s.add(d);
  s.clear();
  assertTrue('cleared so it should be empty', s.isEmpty());
  assertTrue("cleared so it should not contain 'a' key", !s.contains(a));

  s = new Set;
  s.add('a');
  s.add('b');
  s.add('c');
  s.add('d');
  s.clear();
  assertTrue('cleared so it should be empty', s.isEmpty());
  assertTrue("cleared so it should not contain 'a' key", !s.contains('a'));
}


function testAddAll() {
  var s = new Set;
  var a = new String('a');
  var b = new String('b');
  var c = new String('c');
  var d = new String('d');
  s.addAll([a, b, c, d]);
  assertTrue('addAll so it should not be empty', !s.isEmpty());
  assertTrue("addAll so it should contain 'c' key", s.contains(c));

  var s2 = new Set;
  s2.addAll(s);
  assertTrue('addAll so it should not be empty', !s2.isEmpty());
  assertTrue("addAll so it should contain 'c' key", s2.contains(c));


  s = new Set;
  s.addAll(['a', 'b', 'c', 'd']);
  assertTrue('addAll so it should not be empty', !s.isEmpty());
  assertTrue("addAll so it should contain 'c' key", s.contains('c'));

  s2 = new Set;
  s2.addAll(s);
  assertTrue('addAll so it should not be empty', !s2.isEmpty());
  assertTrue("addAll so it should contain 'c' key", s2.contains('c'));
}


function testConstructor() {
  var s = new Set;
  var a = new String('a');
  s.add(a);
  var b = new String('b');
  s.add(b);
  var c = new String('c');
  s.add(c);
  var d = new String('d');
  s.add(d);
  var s2 = new Set(s);
  assertFalse('constr with Set so it should not be empty', s2.isEmpty());
  assertTrue('constr with Set so it should contain c', s2.contains(c));

  s = new Set;
  s.add('a');
  s.add('b');
  s.add('c');
  s.add('d');
  s2 = new Set(s);
  assertFalse('constr with Set so it should not be empty', s2.isEmpty());
  assertTrue('constr with Set so it should contain c', s2.contains('c'));
}


function testClone() {
  var s = new Set;
  var a = new String('a');
  s.add(a);
  var b = new String('b');
  s.add(b);
  var c = new String('c');
  s.add(c);
  var d = new String('d');
  s.add(d);

  var s2 = s.clone();
  assertFalse('clone so it should not be empty', s2.isEmpty());
  assertTrue("clone so it should contain 'c' key", s2.contains(c));

  var s = new Set;
  s.add('a');
  s.add('b');
  s.add('c');
  s.add('d');

  s2 = s.clone();
  assertFalse('clone so it should not be empty', s2.isEmpty());
  assertTrue("clone so it should contain 'c' key", s2.contains('c'));
}


/**
 * Helper method for testEquals().
 * @param {Object} a First element to use in the tests.
 * @param {Object} b Second element to use in the tests.
 * @param {Object} c Third element to use in the tests.
 * @param {Object} d Fourth element to use in the tests.
 */
function helperForTestEquals(a, b, c, d) {
  var s = new Set([a, b, c]);

  assertTrue('set == itself', s.equals(s));
  assertTrue('set == same set', s.equals(new Set([a, b, c])));
  assertTrue('set == its clone', s.equals(s.clone()));
  assertTrue('set == array of same elements', s.equals([a, b, c]));
  assertTrue(
      'set == array of same elements in different order', s.equals([c, b, a]));

  assertFalse('set != empty set', s.equals(new Set));
  assertFalse('set != its subset', s.equals(new Set([a, c])));
  assertFalse('set != its superset', s.equals(new Set([a, b, c, d])));
  assertFalse('set != different set', s.equals(new Set([b, c, d])));
  assertFalse('set != its subset as array', s.equals([a, c]));
  assertFalse('set != its superset as array', s.equals([a, b, c, d]));
  assertFalse('set != different set as array', s.equals([b, c, d]));
  assertFalse('set != [a, b, c, c]', s.equals([a, b, c, c]));
  assertFalse('set != [a, b, b]', s.equals([a, b, b]));
  assertFalse('set != [a, a]', s.equals([a, a]));
}


function testEquals() {
  helperForTestEquals(1, 2, 3, 4);
  helperForTestEquals('a', 'b', 'c', 'd');
  helperForTestEquals(
      new String('a'), new String('b'), new String('c'), new String('d'));
}


/**
 * Helper method for testIsSubsetOf().
 * @param {Object} a First element to use in the tests.
 * @param {Object} b Second element to use in the tests.
 * @param {Object} c Third element to use in the tests.
 * @param {Object} d Fourth element to use in the tests.
 */
function helperForTestIsSubsetOf(a, b, c, d) {
  var s = new Set([a, b, c]);

  assertTrue('set <= itself', s.isSubsetOf(s));
  assertTrue('set <= same set', s.isSubsetOf(new Set([a, b, c])));
  assertTrue('set <= its clone', s.isSubsetOf(s.clone()));
  assertTrue('set <= array of same elements', s.isSubsetOf([a, b, c]));
  assertTrue(
      'set <= array of same elements in different order', s.equals([c, b, a]));

  assertTrue('set <= Set([a, b, c, d])', s.isSubsetOf(new Set([a, b, c, d])));
  assertTrue('set <= [a, b, c, d]', s.isSubsetOf([a, b, c, d]));
  assertTrue('set <= [a, b, c, c]', s.isSubsetOf([a, b, c, c]));

  assertFalse('set !<= Set([a, b])', s.isSubsetOf(new Set([a, b])));
  assertFalse('set !<= [a, b]', s.isSubsetOf([a, b]));
  assertFalse('set !<= Set([c, d])', s.isSubsetOf(new Set([c, d])));
  assertFalse('set !<= [c, d]', s.isSubsetOf([c, d]));
  assertFalse('set !<= Set([a, c, d])', s.isSubsetOf(new Set([a, c, d])));
  assertFalse('set !<= [a, c, d]', s.isSubsetOf([a, c, d]));
  assertFalse('set !<= [a, a, b]', s.isSubsetOf([a, a, b]));
  assertFalse('set !<= [a, a, b, b]', s.isSubsetOf([a, a, b, b]));
}


function testIsSubsetOf() {
  helperForTestIsSubsetOf(1, 2, 3, 4);
  helperForTestIsSubsetOf('a', 'b', 'c', 'd');
  helperForTestIsSubsetOf(
      new String('a'), new String('b'), new String('c'), new String('d'));
}


function testForEach() {
  var s = new Set;
  var a = new String('a');
  s.add(a);
  var b = new String('b');
  s.add(b);
  var c = new String('c');
  s.add(c);
  var d = new String('d');
  s.add(d);
  var str = '';
  goog.structs.forEach(s, function(val, key, set) {
    assertUndefined(key);
    assertEquals(s, set);
    str += val;
  });
  assertEquals(str, 'abcd');

  s = new Set;
  s.add('a');
  s.add('b');
  s.add('c');
  s.add('d');
  str = '';
  goog.structs.forEach(s, function(val, key, set) {
    assertUndefined(key);
    assertEquals(s, set);
    str += val;
  });
  assertEquals(str, 'abcd');
}


function testFilter() {
  var s = new Set;
  var a = new Number(0);
  s.add(a);
  var b = new Number(1);
  s.add(b);
  var c = new Number(2);
  s.add(c);
  var d = new Number(3);
  s.add(d);

  var s2 = goog.structs.filter(s, function(val, key, set) {
    assertUndefined(key);
    assertEquals(s, set);
    return val > 1;
  });
  assertEquals(stringifySet(s2), '23');

  s = new Set;
  s.add(0);
  s.add(1);
  s.add(2);
  s.add(3);

  s2 = goog.structs.filter(s, function(val, key, set) {
    assertUndefined(key);
    assertEquals(s, set);
    return val > 1;
  });
  assertEquals(stringifySet(s2), '23');
}


function testSome() {
  var s = new Set;
  var a = new Number(0);
  s.add(a);
  var b = new Number(1);
  s.add(b);
  var c = new Number(2);
  s.add(c);
  var d = new Number(3);
  s.add(d);

  var b = goog.structs.some(s, function(val, key, s2) {
    assertUndefined(key);
    assertEquals(s, s2);
    return val > 1;
  });
  assertTrue(b);
  var b = goog.structs.some(s, function(val, key, s2) {
    assertUndefined(key);
    assertEquals(s, s2);
    return val > 100;
  });
  assertFalse(b);

  s = new Set;
  s.add(0);
  s.add(1);
  s.add(2);
  s.add(3);

  b = goog.structs.some(s, function(val, key, s2) {
    assertUndefined(key);
    assertEquals(s, s2);
    return val > 1;
  });
  assertTrue(b);
  b = goog.structs.some(s, function(val, key, s2) {
    assertUndefined(key);
    assertEquals(s, s2);
    return val > 100;
  });
  assertFalse(b);
}


function testEvery() {
  var s = new Set;
  var a = new Number(0);
  s.add(a);
  var b = new Number(1);
  s.add(b);
  var c = new Number(2);
  s.add(c);
  var d = new Number(3);
  s.add(d);

  var b = goog.structs.every(s, function(val, key, s2) {
    assertUndefined(key);
    assertEquals(s, s2);
    return val >= 0;
  });
  assertTrue(b);
  b = goog.structs.every(s, function(val, key, s2) {
    assertUndefined(key);
    assertEquals(s, s2);
    return val > 1;
  });
  assertFalse(b);

  s = new Set;
  s.add(0);
  s.add(1);
  s.add(2);
  s.add(3);

  b = goog.structs.every(s, function(val, key, s2) {
    assertUndefined(key);
    assertEquals(s, s2);
    return val >= 0;
  });
  assertTrue(b);
  b = goog.structs.every(s, function(val, key, s2) {
    assertUndefined(key);
    assertEquals(s, s2);
    return val > 1;
  });
  assertFalse(b);
}

function testIterator() {
  var s = new Set;
  s.add(0);
  s.add(1);
  s.add(2);
  s.add(3);
  s.add(4);

  assertEquals('01234', goog.iter.join(s, ''));

  s.remove(1);
  s.remove(3);

  assertEquals('024', goog.iter.join(s, ''));
}
