var assert = require('assert');
var Vec3 = require("vec3");

const versions=['pe_0.14', 'pe_1.0', '1.8'];
versions.forEach(function(version) {
  var Chunk = require('../index.js')(version);
  var Block = require('prismarine-block')(version);
  describe('chunk '+version, function () {
    it('should default to having all blocks be air', function () {
      var chunk = new Chunk();

      assert.equal(0, chunk.getBlock(new Vec3(0, 0, 0)).type);
      assert.equal(0, chunk.getBlock(new Vec3(15, Chunk.h - 1, 15)).type);
    });
    it('should set a block at the given position', function () {
      var chunk = new Chunk();

      chunk.setBlock(new Vec3(0, 0, 0), new Block(5, 0, 2)); // Birch planks, if you're wondering
      assert.equal(5, chunk.getBlock(new Vec3(0, 0, 0)).type);
      assert.equal(2, chunk.getBlock(new Vec3(0, 0, 0)).metadata);

      chunk.setBlock(new Vec3(0, 1, 0), new Block(42, 0, 0)); // Iron block
      assert.equal(42, chunk.getBlock(new Vec3(0, 1, 0)).type);
      assert.equal(0, chunk.getBlock(new Vec3(0, 1, 0)).metadata);

      chunk.setBlock(new Vec3(1, 0, 0), new Block(35, 0, 1)); // Orange wool
      assert.equal(35, chunk.getBlock(new Vec3(1, 0, 0)).type);
      assert.equal(1, chunk.getBlock(new Vec3(1, 0, 0)).metadata);
    });
    it('should overwrite blocks in place', function () {
      var chunk = new Chunk();

      chunk.setBlock(new Vec3(0, 1, 0), new Block(42, 0, 0)); // Iron block
      chunk.setBlock(new Vec3(0, 1, 0), new Block(41, 0, 0)); // Gold block
      assert.equal(41, chunk.getBlock(new Vec3(0, 1, 0)).type);
      assert.equal(0, chunk.getBlock(new Vec3(0, 1, 0)).metadata);

      chunk.setBlock(new Vec3(5, 5, 5), new Block(35, 0, 1));  // Orange wool
      chunk.setBlock(new Vec3(5, 5, 5), new Block(35, 0, 14)); // Red wool
      assert.equal(35, chunk.getBlock(new Vec3(5, 5, 5)).type);
      assert.equal(14, chunk.getBlock(new Vec3(5, 5, 5)).metadata);
    });
    it('should return the internal buffer when calling #dump()', function () {
      var chunk = new Chunk();

      chunk.setBlock(new Vec3(0, 0, 0), new Block(5, 0, 2)); // Birch planks
      var buffer = chunk.dump();

      if(version != 'pe_1.0') {
      	assert.equal(version == "1.8" ? 0x52 : 0x5, buffer[0]);
      } else {
	//console.log(buffer[0]);
	      assert.equal(0x05, buffer[1]);
      }
      //console.log(buffer.length);
    });
    it('should replace the inner buffer when calling #load()', function () {
      var chunk = new Chunk();

      var buffer = new Buffer(Chunk.BUFFER_SIZE);
      buffer.fill(0);
	    //console.log(Chunk.BUFFER_SIZE); 
      if(version != 'pe_1.0') {
      	buffer[0] = version == "1.8" ? 0x52 : 0x5;
      } else {
	buffer[0] = 16;
	buffer[1] = 0x5;
      }
     console.log(buffer);

      chunk.load(buffer);
      //console.log(chunk.getBlock(new Vec3(0,0,0)));
      assert.equal(5, chunk.getBlockType(new Vec3(0, 0, 0)));
    });
    it('should fail savely when load is given bad input', function () {
      var chunk = new Chunk();

      var tooShort = new Buffer(3);
      var notABuffer = [];

      assert.throws(function () {
        chunk.load(tooShort);
      });

      assert.throws(function () {
        chunk.load(notABuffer);
      });
    });
  });
});
