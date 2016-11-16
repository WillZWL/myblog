var config = require('config-lite');
var Mongolass = require('mongolass');
var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

exports.User = mongolass.model('User', {
    name: { type: 'string' },
    password: { type: 'string' },
    avatar: { type: 'string' },
    gender: { type: 'string', enum:['m', 'f', 'x'] },
    bio: { type: 'string' }
});
exports.User.index({ name: 1 }, { unique: true }).exec();

exports.Post = mongolass.model('Post', {
    author: { type: Mongolass.Types.ObjectId },
    title: { type: 'string' },
    content: { type: 'string' },
    pv: { type: 'number' }
});
exports.Post.index({ author: 1, _id: -1}).exec();

mongolass.plugin('addCreateAt', {
    afterFind: function (results) {
        results.forEach(function (item) {
            item.create_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mmm');
        });
        return results;
    },
    afterFindOne: function (result) {
        if (result) {
            result.create_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
        }
        return result;
    }
});
