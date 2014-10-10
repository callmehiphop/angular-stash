angular
  .module('stash', [])
  .provider('stashFactory', function () {

    'use strict';

    var defaultExpireTime = 1800000; // 30 minutes
    var stashes = {};

    /**
     * @param {object} target
     * @param {object} things
     * @return {object} target
     */
    function defaults (target, things) {
      target = target || {};

      angular.forEach(things, function (value, key) {
        if (!target.hasOwnProperty(key)) {
          target[key] = value;
        }
      });

      return target;
    }

    /**
     * @class Stash
     */
    function Stash (id, options) {
      this._cache = {};

      this._options = defaults(options, {
        expireTime: defaultExpireTime,
        id: id,
        size: 0
      });
    }

    /**
     * @method get()
     * @param {string} key
     * @return {*}
     */
    Stash.prototype.get = function (key) {
      var thing, lifetime;

      if (!(thing = this._cache[key])) {
        return;
      }

      lifetime = new Date() - thing.created;

      if (lifetime < this.info().expireTime) {
        return thing.value;
      }

      this.remove(key);
    };

    /**
     * @method put()
     * @param {string} key
     * @param {*} value
     */
    Stash.prototype.put = function (key, value) {
      this._cache[key] = {
        created: new Date(),
        value: value
      };

      this.info().size += 1;
    };

    /**
     * @method remove()
     * @param {string} key
     */
    Stash.prototype.remove = function (key) {
      delete this._cache[key];
      this.info().size -= 1;
    };

    /**
     * @method removeAll()
     */
    Stash.prototype.removeAll = function () {
      this._cache = {};
      this.info().size = 0;
    };

    /**
     * @method info()
     * @return {object}
     */
    Stash.prototype.info = function () {
      return this._options;
    };

    /**
     * @method destroy()
     */
    Stash.prototype.destroy = function () {
      delete stashes[this.info().id];
    };

    /**
     * @param {string} id
     * @param {object} options
     * @return {stash}
     */
    function stashFactory (id, options) {
      // jshint boss:true
      return (stashes[id] = new Stash(id, options));
    }

    /**
     * @method get()
     * @param {string} id
     * @return {stash}
     */
    stashFactory.get = function (id) {
      return stashes[id];
    };

    /**
     * Retieves info for all existing stashes
     * @return {array}
     */
    stashFactory.info = function () {
      var info = [];

      angular.forEach(stashes, function (stash) {
        info.push(stash.info());
      });

      return info;
    };

    /**
     * @export StashFactory
     */
    return {

      /**
       * @return {function}
       */
      $get: function () {
        return stashFactory;
      },

      /**
       * @param {number} value
       */
      setDefaultExpireTime: function (value) {
        defaultExpireTime = value;
      }

    };

  });