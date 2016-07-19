# m-parser - scrap any pages easy

## Super simple to use

Request is designed to be the simplest way possible to make page scrapping. It supports PhantomJS, request and just parse HTML tree.

```javascript
var nm_image = require('nm-image');

app.post('/api/upload', function (req, res) {
	var params = req.body

	image_lib.save({
		dir: __dirname, //root directory
		path: '/uploads/1/' + params.dir_name, //path next after root. Need to do url in response
		name: 'test',
		base64: params.base64,
		max_width: 225,
		max_height: 285,
		crop: {
		    x: 1,
		    y: 2
		} // crop: true to crop by center 1:1
	}, res, res)

	//or with callbacks
    image_lib.save({
        dir: __dirname + '/uploads/1/' + params.dir_name,
        name: 'test',
        base64: params.base64,
        max_width: 225,
        max_height: 285,
        crop: {
            x: 1,
            y: 2
        } // crop: true to crop by center 1:1
    }, function(err){
        console.error('err: ', err);
    }, function(data){
        console.log('Info about the image ', data);
    });

});

```