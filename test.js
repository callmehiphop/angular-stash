describe('stashFactory', function () {

  'use strict';

  var stashFactory;
  var $httpBackend;
  var $http;

  beforeEach(function () {
    module('stash');
    inject(function ($injector) {
      stashFactory = $injector.get('stashFactory');
      $httpBackend = $injector.get('$httpBackend');
      $http = $injector.get('$http');
    });
  });

  it('should create a new stash', function () {
    stashFactory('hello world!').should.exist;
  });

  it('should retrieve a stash by id', function () {
    stashFactory('yhalothar');
    stashFactory.get('yhalothar').should.exist;
  });

  it('should get a map of info for all the stashes', function () {
    stashFactory('test1');
    stashFactory('test2');

    var info = stashFactory.info();

    info.should.have.length(2);
    info[0].id.should.equal('test1');
    info[1].id.should.equal('test2');
  });

  it('should #put() stuff to the cache', function () {
    var stash = stashFactory('yarp');

    stash.put('thing', 'wat');
    stash.get('thing').should.equal('wat');
    stash.info().size.should.equal(1);
  });

  it('should #remove() stuff from the cache', function () {
    var stash = stashFactory('gewdbai');

    stash.put('howdy', 'doody');
    stash.put('car', 'ramrod');

    stash.info().size.should.equal(2);

    stash.remove('car');

    stash.get('howdy').should.equal('doody');
    expect(stash.get('car')).to.be.undefined;
    stash.info().size.should.equal(1);
  });

  it('should #removeAll() the cache', function () {
    var stash = stashFactory('ohnoes');

    stash.put('one', 1);
    stash.put('two', 2);

    stash.info().size.should.equal(2);
    stash.removeAll();

    expect(stash.get('one')).to.be.undefined;
    expect(stash.get('two')).to.be.undefined;
    stash.info().size.should.equal(0);
  });

  it('should #get() data from the cache', function () {
    var stash = stashFactory('eep');

    stash.put('oh', 'yeah!');
    stash.get('oh').should.equal('yeah!');
  });

  it('should return undefined if the data expired', function (done) {
    var stash = stashFactory('ohnoes', {
      expireTime: 100
    });

    stash.put('iam', 'forever');
    stash.get('iam').should.equal('forever');
    stash.info().size.should.equal(1);

    setTimeout(function () {
      expect(stash.get('iam')).to.be.undefined;
      stash.info().size.should.equal(0);
      done();
    }, 110);
  });

  it('should give back #info() about the cache', function () {
    stashFactory('eep').info().should.eql({
      expireTime: 1800000,
      id: 'eep',
      size: 0
    });
  });

  it('should #destroy() the cache', function () {
    stashFactory('nope').destroy();
    expect(stashFactory.get('nope')).to.be.undefined;
  });

  it('should #put() to the cache when $http cache is turned on', function () {
    var stash = stashFactory('http.put');

    $http.defaults.cache = stash;
    $httpBackend.expectGET('/api/sugar/lumps').respond({ ohh: 'yes' });

    $http.get('/api/sugar/lumps', { cache: true });
    $httpBackend.flush();

    stash.get('/api/sugar/lumps')[1].should.eql({ ohh: 'yes' });
  });

});
