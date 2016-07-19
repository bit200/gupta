var fs = require('fs')
	, m = require('nm-m')
	, lwip = require('lwip')
	, async = require('async')
	, mkdirp = require('mkdirp')

var methods = {
	decodeBase64: function decodeBase64Image(dataString) {
		var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
		var response = {};
		
		if (matches.length !== 3) {
			return new Error('Invalid input string');
		}
		
		response.type = matches[1];
		response.data = new Buffer(matches[2], 'base64');
		
		return response;
	},
	get_extention: function (type) {
		var arr = type.split('/')
		return arr[1]
		
	},
	save: function (params, ecb, scb) {
		var buffer = params.buffer || this.decodeBase64(params.base64)
		var name = params.name,
			dir = params.dir + '/',
			path = params.path + '/'
		dir = dir.replace(/\/\//gi, '')
		path = path.replace(/\/\//gi, '')

		var abs_dir = dir + path,
			crop = params.crop,
			ext = this.get_extention(buffer.type),
			file_name = name + '.' + ext,
			abs_file_name = abs_dir + name + '.' + ext
		
		var image

		function get_mw_mh(w, h, params) {
			params = params || {}
			var max_width = params.max_width,
				max_height = params.max_height
			
			var kw = max_width ? w / max_width : 1
			var kh = max_height ? h / max_height : 1
			var k = Math.max(kw, kh, 1)
			var new_w = Math.round(w / k)
			var new_h = Math.round(h / k)
			
			
			return {
				k: k,
				new_w: new_w,
				new_h: new_h,
				kw: kw,
				kh: kh
			}
		}
		
		function _cb_handler(cb) {
			return function (err, _image) {
				if (err) {
					return cb(err)
				}
				image = _image
				cb()
			}
		}
		
		async.series({
				mkdirp: function (cb) {
					mkdirp(abs_dir, cb)

				},
				fs_writefile: function (cb) {
					fs.writeFile(abs_file_name, buffer.data, cb)
				},
				lwip_open: function (cb) {
					lwip.open(abs_file_name, _cb_handler(cb))
				},
				lwip_crop: function (cb) {
					if (crop) {
						var crop_k_w = crop.x || crop.w || 1
							, crop_k_h = crop.y || crop.h || 1
							, _w = image.width() / crop_k_w
							, _h = image.height() / crop_k_h

						var _min_wh = Math.min(_w, _h)
						var _w_new = Math.round(_min_wh * crop_k_w)
						var _h_new = Math.round(_min_wh * crop_k_h)

						image.crop(_w_new, _h_new, _cb_handler(cb))
					} else {
						cb()
					}
				},
				lwip_resize: function(cb) {
					var w = image.width()
						, h = image.height()
						, wh = get_mw_mh(w, h, params);

					if ((w == wh.new_w) && (h == wh.new_h)) {
						cb()
					} else {
						image.resize(wh.new_w, wh.new_h, 'lanczos', _cb_handler(cb))
					}
				},
				write_file: function(cb) {
					image.writeFile(abs_file_name, cb)
				},
				data: function(cb){
					cb(null, {
						image: image,
						w: image.width(),
						h: image.height(),
						url: path + file_name,
						file_name: file_name,
						abs_file_dir: abs_dir,
						abs_file_name: abs_dir + file_name
					})
				}
				
			},
			function (err, r) {
				if (err) {
					m.ecb(300, err, ecb)
				} else {
					var _data = r.data
					r.image = _data.image
					delete _data.image
					
					m.scb(_data, scb)
				}
			});
	}
}

module.exports = methods;