var jorm = require('./src/jorm');

var connectionString = "postgres://node_content:8q5SJTXXfyd@linode.talkan.name/fly_content";

var config = {
	contentItem: {
		name: 'content_item',
		fields: {
			id: {},
			created: {},
			code: {},
			content: {},
			type: {},
			name: {},
			alt_names: {}
		}
	}
};

var client = jorm.create(connectionString, config);

client.contentItem.get({code: 'testCode'}, function (err, contentItems) {
	console.log(err);
	console.log(contentItems);

	// contentItems[0].code = 'testCode2';
	// contentItems[0].save(function (err, savedContentItem) {
	// 	console.log(savedContentItem);
	// })

	contentItems[0].delete();
});

var contentItem = client.contentItem.create({code: 'testCode', content: 'testContent', type: 'testType', name: 'testName', alt_names: 'testAltNames'});
console.log(contentItem);

contentItem.save(function (err, savedContentItem) {
	console.log(savedContentItem);
});