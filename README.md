jorm
====

Simple orm - just orm.

## Init
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdovg%2Fjorm.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdovg%2Fjorm?ref=badge_shield)


Just init connectionString

```javascript
var connectionString = "postgres://user:password@server.com:5432/base";
```

db config
```javascript
var config = {
	User: {
		table: 'user',
		fields: {
			id					: {},
			created				: {},
			name				: {},
			hpassword			: {},
			email				: {},
			phone				: {}
		}
	}
};
```

and init jorm
```javascript
var jormModule = require('jorm');
jorm = new jormModule(connectionString, config);
```

# CRUD
## Create
```javascript
var newUser = jorm.User.create({name: 'John', email: 'john@connor.com'})
newUser.hpassword = someFuncToHashPass(login, password);
```

## Save
```javascript
newUser.save(function(err, user){
	if(err){ console.error(err); return; }
	console.log(user.getPublic());
});
```

## Update

essence.id == null -> make insert

essence.id != null -> make update

```javascript
user.name = newName;
user.save(function(err, user){
	if(err){ console.error(err); return; }
	console.log(user.getPublic());
});
```

## Delete
Just delete it
```javascript
user.delete(function(err){
	if(err){ console.error(err); return; }
	console.log('deleted');
})
```

## Get it from DB
Simple get
```javascript
jorm.User.get({id: userId}, function(err, users) {
	if(err){ console.error(err); res.send({errCode: 'INTERNAL_ERROR'}); return; }
	if(users.length == 0){ res.send({errCode: 'UNKNOWN_USER_ID'}); return; }

	res.send(users[0].getPublic());
})
```

### Order, Limit and Offset 

```javascript
var params = {
	limit: 10,
	offset: 100,
	'order by desc': 'created'
};

jorm.User.get(params, function(err, users) {
	if(err){ console.error(err); res.send({errCode: 'INTERNAL_ERROR'}); return; }
	if(users.length == 0){ res.send({errCode: 'UNKNOWN_USER_ID'}); return; }

	res.send(jorm.User.getPublicArr(users));
})
```

### Search with 'like', 'in' clause and custom comparsion

```javascript
var params = {
	search: {columns: ['name', 'surname'], 
	value: '%'+req.param('search').toLowerCase()+'%'},
	field_for_in_clause: [1, 2, 3],
	age: {comparsion: '>', value: 18}
}
jorm.User.get(params, function(err, users){
	if(err){ console.log(err); res.send({errCode: 'INTERNAL_ERROR'}); return; }
	res.send( jorm.User.getPublicArr(users) );
});
```

### Join essences

Multiple join with "where" clause for joined table

```javascript
var params = {
	id: parseInt(req.param('id')),
	join: [
		{essence: 'Comment', field: 'id', joinField: 'post_id', where: {is_public: 1}},
		'User'
	]
};

jorm.Post.get(params, function(err, posts){
	if(err){ console.log(err); res.send({errCode: 'INTERNAL_ERROR'}); return; }

	if(posts.length == 0){ res.send({errCode: 'UNKNOWN_POST_ID'}); return; }

	res.send( jorm.Post.getPublicArr(posts) );
});
```

In this example table "post" has field user_id, and table user joined by field id.
Table "comment" joining with custom join configuration.

## Defining and overriding methods in model

In this example model 'user':
- has additional method getHPassword
- override default method 'getPublic'
- override default initialization method 'init'
- override default method to get param for 'where' clause 
- override fields for 'select' clause

```javascript
var userModel = {
	table: 'user',
	fields:{
		id 							: {},
		email						: {},
		hpassword					: {},
		name						: {},
		surname						: {},
		birthdate					: {},
	},
	init: function (params) {
		if(params.password){
			this.hpassword = this.getHPassword(this.email, params.password, 'salt_example');
		}
	},
	getHPassword: function (login, password, salt) {
		var hpassword = crypto.createHash('sha1').update(login + password + salt).digest('hex');
		return hpassword;
	},
	getPublic: function(){
		var publicDto = this.getPublicInternal();
		delete publicDto.hpassword;
		return publicDto;
	},
	whereParam: function(prefix, param, value, index) {
		if(param != 'addCommentsCount'){
			return this.whereParamInternal(prefix, param, value, index);
		}
	},
	selectFields: function(params, prefix) {
		var selectFields = this.selectFieldsInternal(params, prefix);
		if(params.addCommentsCount){
			selectFields += ', (select COUNT(*) from comment where comment.post_id = post.id) as commentsCount';
		}
		return selectFields;
	}
}
```


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdovg%2Fjorm.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdovg%2Fjorm?ref=badge_large)