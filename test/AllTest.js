var should = require('should')
    , assert = require('assert')
    , request = require('supertest')
    , expect = require('chai').expect
    , mongoose = require('mongoose')
    , async = require('async')
    , config = require('../app/config')
    , app = require('../server')
    , m = require('../app/m')
    , models = require('../app/db')
    , _ = require('underscore');

function status_text(status) {
    return 'Is response status ' + (status || 200)
}

function contains_text(model) {
    return 'Is response data contains ' + model
}

function contains_custom() {
    return "Is password not returning (private policy)"
}


describe('Auth', function () {

    before(function clearDB(done) {
        var collections = ['accesstokens', 'refreshtokens', 'users']
        async.forEach(collections, function (collectionName, done) {
            var collection = mongoose.connection.collections[collectionName]
            collection.remove({}, function (err) {
                if (err && err.message != 'ns not found') done(err)
                done(null)
            })
        }, done)
    })

    describe('Sign-up', function () {

        describe('Should create a valid user', function () {
            var res, err;
            before(function (done) {
                request(app)
                    .post('/sign-up')
                    .send({username: 'unitTest', name: 'name', lastName: 'lastName', email: 'test@test.com', password: 'password'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    });
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()

            });

            it(contains_text('user'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });

            it(contains_custom(), function (done) {
                expect(res.body.data.password).to.equal(undefined);
                done()
            });
        });

        describe('Should not create user with duplicated email', function () {
            var res, err;
            before(function (done) {
                request(app)
                    .post('/sign-up')
                    .send({username: 'unitTest', name: 'name', lastName: 'lastName', email: 'test@test.com', password: 'password'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    });
            });

            it('User with duplicated email not created', function (done) {
                expect(res.status).to.equal(398);
                done()
            });
        });

        describe('Should not create user with invalid email', function () {
            var res, err;
            before(function (done) {
                request(app)
                    .post('/sign-up')
                    .send({username: 'unitTest', name: 'name', lastName: 'lastName', email: 'testtesttest', password: 'password'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    });
            });

            it('User with invalid email not created', function (done) {
                expect(res.status).to.equal(398);
                done()
            });
        });
    });


    describe('Sign-in', function () {
        before(function (done) {
            request(app)
                .post('/sign-up')
                .send({username: 'unitTest', name: 'name', lastName: 'lastName', email: 'test@test.com', password: 'password'})
                .end(function (e, r) {
                    done()
                });
        });

        describe('Sign-in by email', function () {
            var res, err;
            before(function (done) {
                request(app)
                    .get('/sign-in')
                    .send({login: 'test@test.com', password: 'password'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('user'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });

            it(contains_text('access token'), function (done) {
                expect(_.isEmpty(res.body.data.accessToken)).to.equal(false);
                done()
            });

            it(contains_text('refresh token'), function (done) {
                expect(_.isEmpty(res.body.data.refreshToken)).to.equal(false);
                done()
            });

            it('Is password not returning (private policy)', function (done) {
                expect(res.body.data.user.password).to.equal(undefined);
                done()
            });
        });

        describe('Sign-in by username', function () {
            var res, err;
            before(function (done) {
                request(app)
                    .get('/sign-in')
                    .send({login: 'unitTest', password: 'password'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('user'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });

            it(contains_text('access token'), function (done) {
                expect(_.isEmpty(res.body.data.accessToken)).to.equal(false);
                done()
            });

            it(contains_text('refresh token'), function (done) {
                expect(_.isEmpty(res.body.data.refreshToken)).to.equal(false);
                done()
            });

            it(contains_custom(), function (done) {
                expect(res.body.data.user.password).to.equal(undefined);
                done()
            });
        });

        describe('Sign-in by invalid username', function () {
            var res, err;
            before(function (done) {
                request(app)
                    .get('/sign-in')
                    .send({login: 'test', password: 'password'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });
        });

        describe('Sign-in by invalid email', function () {
            var res, err;
            before(function (done) {
                request(app)
                    .get('/sign-in')
                    .send({login: 'test@@teeest.we', password: 'password'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });
        });

        describe('Sign-in by invalid password', function () {
            var res, err;
            before(function (done) {
                request(app)
                    .get('/sign-in')
                    .send({login: 'unitTest', password: 'asdasdasda'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(401), function (done) {
                expect(res.status).to.equal(401);
                done()
            });
        });
    });

    describe('Refresh token', function () {
        var token, id;
        before(function (done) {
            request(app)
                .get('/sign-in')
                .send({login: 'unitTest', password: 'password'})
                .end(function (e, r) {
                    token = r.body.data.refreshToken.value;
                    id = r.body.data.user._id;
                    done()
                })
        });

        describe('refresh token with valid token', function () {
            var res;
            before(function (done) {
                request(app)
                    .get('/refresh-token')
                    .send({refresh_token: token})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('user'), function (done) {
                expect(_.isString(res.body.data.user)).to.equal(false);
                done()
            });

            it(contains_text('identical to the user'), function (done) {
                expect(res.body.data.user == id).to.equal(true);
                done()
            });

            it(contains_text('access token'), function (done) {
                expect(_.isEmpty(res.body.data.value)).to.equal(false);
                done()
            });
        })

        describe('refresh token with invalid token', function () {
            var res;
            before(function (done) {
                request(app)
                    .get('/refresh-token')
                    .send({refresh_token: 'werwerwerwedfgdgdgdfg'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });
        })
    });

    describe('Generate admin', function () {
        var res;
        before(function (done) {
            request(app)
                .get('/generate-admin')
                .end(function (e, r) {
                    res = r;
                    done()
                })
        });

        it(status_text(200), function (done) {
            expect(res.status).to.equal(200);
            done()
        });

        it(contains_text('data not empty'), function (done) {
            expect(_.isEmpty(res.body.data)).to.equal(false);
            done()
        });

        it(contains_text('role="ADMIN"'), function (done) {
            expect(res.body.data.role == 'ADMIN').to.equal(true);
            done()
        });

        it('Is password not returning (private policy)', function (done) {
            expect(res.body.data.password).to.equal(undefined);
            done()
        });
    });

    describe('Token list', function () {
        var res, token;
        before(function (done) {
            request(app)
                .get('/sign-in')
                .send({login: 'admin', password: 'b8KuBSaqx5EuG'})
                .end(function (e, r) {
                    token = r.body.data.accessToken.value;
                    request(app)
                        .get('/tokens')
                        .set({authorization: token})
                        .end(function (e, r) {
                            res = r;
                            done()
                        })
                })
        });

        it(status_text(200), function (done) {
            expect(res.status).to.equal(200);
            done()
        });
    })
});

describe('User', function () {
    var userID;
    before(function (done) {
        request(app)
            .post('/sign-up')
            .send({username: 'unitTest', name: 'name', lastName: 'lastName', email: 'test@test.com', password: 'password'})
            .end(function (e, r) {
                request(app)
                    .post('/sign-in')
                    .send({username: 'unitTest', password: 'password'})
                    .end(function (e, r) {
                        userID = r.user._id;
                        done()
                    });
            });
    });
    describe('Add favorite song', function () {
        var url = '/add-favorite-song'
            , name = 'Add favorite song. '
            , songID;
        before(function (done) {
            m.create(models.Song, {title: unitTest}, null, function (song) {
                songID = song._id;
                done()
            });
        })
        describe(name + 'Send valid data', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({userID: userID, songID: songID})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });

            it(contains_text('Id songs equal'), function (done) {
                expect(res.body.data.song == songID).to.equal(true);
                done()
            });
        });

        describe(name + 'Send without songID', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({login: 'unitTest', songID: ''})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(398), function (done) {
                expect(res.status).to.equal(398);
                done()
            });

            it(contains_text('songID is empty'), function (done) {
                expect(res.body.error == "Empty songID").to.equal(true);
                done()
            });
        });

        describe(name + 'Send without login', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({login: '', songID: songID})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });

            it(contains_text('user not found'), function (done) {
                expect(res.body.error == "User not found!").to.equal(true);
                done()
            });
        });

        describe(name + 'Send incorrect songID', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({login: 'unitTest', songID: '8eqw15r9qw7'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(398), function (done) {
                expect(res.status).to.equal(398);
                done()
            });

            it(contains_text('error not empty'), function (done) {
                expect(_.isEmpty(res.body.error)).to.equal(false);
                done()
            });
        });

        describe(name + 'Send nonexistent songID', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({login: 'unitTest', songID: '52342343'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });

            it(contains_text('Song not found'), function (done) {
                expect(res.body.error == "Song not found").to.equal(true);
                done()
            });
        });
    });
});


describe('Movie', function () {

    describe('All movies', function () {
        var first, url = '/all-movies';

        describe('All movies without params', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .end(function (e, r) {
                        first = _.first(r.body.data)
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });
        });

        describe('All movies with skip', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({skip: 1})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });

            it(contains_text('not have first item'), function (done) {
                expect(res.body.data[0]._id != first._id).to.equal(true);
                done()
            });
        });

        describe('All movies with limit', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({limit: 1})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });

            it(contains_text('not more one item'), function (done) {
                expect(res.body.data.length == 1).to.equal(true);
                done()
            });
        });

        describe('All movies with field ("_id")', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({fields: '_id'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });

            it(contains_text('not more one key'), function (done) {
                expect(_.keys(res.body.data[0]).length == 1).to.equal(true);
                done()
            });

            it(contains_text("it's key '_id'"), function (done) {
                expect(_.keys(res.body.data[0]) == '_id').to.equal(true);
                done()
            });
        });
    });

    describe('Banner', function () {
        var url = '/banner-movie';
        describe('Banner. Send movie with banner', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({movie: 'American Psycho'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('Data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });
        });

        describe('Banner. Send movie without banner', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({movie: 'All About Steve'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });

            it(contains_text('Not found'), function (done) {
                expect(res.body.error == "Banner not found").to.equal(true);
                done()
            });
        });

        describe('Banner. Send incorrect text', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({movie: 'aasdaetbure'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });

            it(contains_text('Not found'), function (done) {
                expect(res.body.error == "Item not found").to.equal(true);
                done()
            });
        });
    });

    describe('List of songs', function () {
        var url = '/list-song-movie';
        describe('List of songs. Send movie with songs', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({movie: 'American Psycho'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('Data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });
        });

        describe('List of songs. Send movie without songs', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({movie: 'All About Steve'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('Not found'), function (done) {
                expect(res.body.data == "Movie haven't any songs").to.equal(true);
                done()
            });
        });

        describe('List of songs. Send incorrect text', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({movie: 'aasdaetbure'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });

            it(contains_text('Not found'), function (done) {
                expect(res.body.error == "Item not found").to.equal(true);
                done()
            });
        });
    });

    describe('List of trailers', function () {
        var url = '/list-trailers';
        describe('List of trailers. Send movie with trailers', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({movie: 'All About Steve'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('Data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });
        });

        describe('List of trailers. Send movie without trailers', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({movie: 'American Psycho'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('Not found'), function (done) {
                expect(res.body.data == "Movie haven't any trailers").to.equal(true);
                done()
            });
        });

        describe('List of trailers. Send incorrect text', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({movie: 'aasdaetbure'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });

            it(contains_text('Not found'), function (done) {
                expect(res.body.error == "Item not found").to.equal(true);
                done()
            });
        });
    });

    describe('Movie info', function () {
        var url = '/movie-info';
        describe('Movie info. Send movie with banner', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({movie: 'Silver Linings Playbook'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('Data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });
        });

        describe('Movie info. Send movie without banner', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({movie: 'Crossroads'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('Movie not empty'), function (done) {
                expect(_.isEmpty(res.body.data.movie)).to.equal(false);
                done()
            });

            it(contains_text('Not found'), function (done) {
                expect(res.body.data.poster == "Poster not found").to.equal(true);
                done()
            });
        });

        describe('Movie info. Send incorrect text', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({movie: 'aasdaetbure'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });

            it(contains_text('Not found'), function (done) {
                expect(res.body.error == "Item not found").to.equal(true);
                done()
            });
        });
    });

    describe('Popular movies', function () {
        var first, url = '/popular-movies';

        describe('Popular movies. Send without params', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .end(function (e, r) {
                        first = _.first(r.body.data)
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });
        });

        describe('Popular movies. Send with skip', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({skip: 1})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });

            it(contains_text('not have first item'), function (done) {
                expect(res.body.data[0]._id != first._id).to.equal(true);
                done()
            });
        });

        describe('Popular movies. Send with limit', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({limit: 1})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });

            it(contains_text('not more one item'), function (done) {
                expect(res.body.data.length == 1).to.equal(true);
                done()
            });
        });

        describe('Popular movies. Send with field ("_id")', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({fields: '_id'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });

            it(contains_text('not more one key'), function (done) {
                expect(_.keys(res.body.data[0]).length == 1).to.equal(true);
                done()
            });

            it(contains_text("it's key '_id'"), function (done) {
                expect(_.keys(res.body.data[0]) == '_id').to.equal(true);
                done()
            });
        });
    });

    describe('Questions', function () {
        var url = '/questions';
        describe('Questions. Send movie with questions', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({movie: 'We Bought a Zoo'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('Data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });
        });

        describe('Questions. Send movie without questions', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({movie: 'American Psycho'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('Not found'), function (done) {
                expect(res.body.data == "Movie haven't any questions").to.equal(true);
                done()
            });
        });

        describe('Questions. Send incorrect text', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({movie: 'aasdaetbure'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });

            it(contains_text('Not found'), function (done) {
                expect(res.body.error == "Item not found").to.equal(true);
                done()
            });
        });
    });

    describe('Song of trailers', function () {
        var url = '/song-of-trailer';
        describe('Song of trailers. Send title trailers with song', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({trailer: 'DEMOLITION: Official HD Trailer'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('Data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });
        });

        describe('Song of trailers. Send title trailers without song', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({trailer: 'Maze Runner: The Scorch Runner (2015) Official Trailer #1'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('Not found'), function (done) {
                expect(res.body.data == "Trailer haven't any songs").to.equal(true);
                done()
            });
        });

        describe('Song of trailers. Send incorrect text', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({trailer: 'aasdaetbure'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });

            it(contains_text('Not found'), function (done) {
                expect(res.body.error == "Item not found").to.equal(true);
                done()
            });
        });
    });

    describe('User contributors', function () {
        var url = '/user-contributors-movie';
        describe('User. Send movie with song', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({movie: 'The Longest Ride'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('Data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });
        });

        describe('User. Send movie without song', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({movie: 'Moonwalkers'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });

            it(contains_text('Not found'), function (done) {
                expect(res.body.error == "Contributors not found").to.equal(true);
                done()
            });
        });

        describe('User. Send incorrect text', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({movie: 'aasdaetbure'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });

            it(contains_text('Not found'), function (done) {
                expect(res.body.error == "Movie not found").to.equal(true);
                done()
            });
        });
    });
});

describe('Song', function () {
    describe('List of songs. Episode.', function () {
        var url = '/list-song-episode'
            , name = 'List of songs. Episode. ';
        describe(name + 'Send title episodes with song', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({episode: 'Have You Brought Me Little Cakes'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });
        });

        describe(name + 'Send title episodes without song', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({episode: 'Paris Is Burning'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text("episode haven't any songs"), function (done) {
                expect(res.body.data == "Episode haven't any songs").to.equal(true);
                done()
            });
        });

        describe(name + 'Send incorrect text', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({episode: 'Haasfa34%@TWETWTF#%'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });

            it(contains_text('user not found'), function (done) {
                expect(res.body.error == "Episode not found").to.equal(true);
                done()
            });
        });
    });
    describe('List of songs games.', function () {
        before(function () {
            m.findCreate(models.Game, {title: 'unitTest'}, {}, null, function (game) {
                m.findCreate(models.Song, {title: "unitTestSong", is_soundtrack: 0}, {}, null, function (song) {
                    m.findCreate(models.GameSong, {game: game._id, song: song._id, is_soundtrack: song.is_soundtrack}, {})
                })
            });
            m.findCreate(models.Game, {title: 'unitTest2'})
        });
        var url = '/list-song-game'
            , name = 'List of songs games. ';
        describe(name + 'Send game with song', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({game: 'unitTest'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });
        });

        describe(name + 'Send game without song', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({game: 'unitTest2'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text("episode haven't any songs"), function (done) {
                expect(res.body.data == "Game haven't any songs").to.equal(true);
                done()
            });
        });

        describe(name + 'Send incorrect text', function () {
            var res;
            before(function (done) {
                request(app)
                    .get(url)
                    .send({game: 'Haasfa34%@TWETWTF#%'})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });

            it(contains_text('user not found'), function (done) {
                expect(res.body.error == "Item not found").to.equal(true);
                done()
            });
        });
    });
});

describe('User action', function () {
    var userID;
    before(function (done) {
        request(app)
            .post('/sign-up')
            .send({username: 'unitTest', name: 'name', lastName: 'lastName', email: 'test@test.com', password: 'password'})
            .end(function (e, r) {
                request(app)
                    .get('/sign-in')
                    .send({login: 'unitTest', password: 'password'})
                    .end(function (e, r) {
                        log(r);
                        userID = r.body.data.user._id;
                        done()
                    });
            });
    });
    describe('Add game', function () {
        var name = 'Add game. '
            , url = '/add-game';
        describe(name + 'Send valid data', function () {
            var res;
            before(function (done) {
                request(app)
                    .post(url)
                    .send({title: 'usetTest', year: '2014', time_released: '5234658746823', contributer_user: userID})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });

            it(contains_text('check contributor user'), function (done) {
                expect(_.isEmpty(res.body.data.contributer_user == userID)).to.equal(true);
                done()
            });
        });


        describe(name + 'Send nonexistent contributor user', function () {
            var res;
            before(function (done) {
                request(app)
                    .post(url)
                    .send({title: 'usetTest', year: '2014', time_released: '5234658746823', contributer_user: 542424234234})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });

            it(contains_text('contributor user not found'), function (done) {
                expect(res.body.error == 'Contributor user not found').to.equal(true);
                done()
            });
        });
    });


    describe('Add movie', function () {
        var name = 'Add movie. '
            , url = '/add-movie';
        describe(name + 'Send valid data', function () {
            var res;
            before(function (done) {
                request(app)
                    .post(url)
                    .send({title: 'usetTest', year: '2014', time_released: '5234658746823', contributer_user: userID})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });

            it(contains_text('check contributor user'), function (done) {
                expect(_.isEmpty(res.body.data.contributer_user == userID)).to.equal(true);
                done()
            });
        });


        describe(name + 'Send nonexistent contributor user', function () {
            var res;
            before(function (done) {
                request(app)
                    .post(url)
                    .send({title: 'usetTest', year: '2014', time_released: '5234658746823', contributer_user: 542424234234})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });

            it(contains_text('contributor user not found'), function (done) {
                expect(res.body.error == 'Contributor user not found').to.equal(true);
                done()
            });
        });

    });


    describe('Add song', function () {
        var name = 'Add song. '
            , url = '/add-song';
        describe(name + 'Send valid data', function () {
            var res;
            before(function (done) {
                request(app)
                    .post(url)
                    .send({title: 'usetTest', year: '2014', time_released: '5234658746823', contributer_user: userID})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });

            it(contains_text('check contributor user'), function (done) {
                expect(_.isEmpty(res.body.data.contributer_user == userID)).to.equal(true);
                done()
            });
        });


        describe(name + 'Send nonexistent contributor user', function () {
            var res;
            before(function (done) {
                request(app)
                    .post(url)
                    .send({title: 'usetTest', year: '2014', time_released: '5234658746823', contributer_user: 542424234234})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(397), function (done) {
                expect(res.status).to.equal(397);
                done()
            });

            it(contains_text('contributor user not found'), function (done) {
                expect(res.body.error == 'Contributor user not found').to.equal(true);
                done()
            });
        });
    });


    describe('Edit song', function () {
        var name = 'Edit song. '
            , url = '/edit-song'
            , songID;
        before(function (done) {
            request(app)
                .post('/add-song')
                .send({title: 'unitTest', year: '2014', time_released: '5234658746823', contributer_user: userID})
                .end(function (e, r) {
                    songID = r.body.data._id;
                    done()
                })
        });
        describe(name + 'Send valid data', function () {
            var res;
            before(function (done) {
                request(app)
                    .post(url)
                    .send({title: 'TEST', songID: songID})
                    .end(function (e, r) {
                        res = r;
                        done()
                    })
            });

            it(status_text(200), function (done) {
                expect(res.status).to.equal(200);
                done()
            });

            it(contains_text('data not empty'), function (done) {
                expect(_.isEmpty(res.body.data)).to.equal(false);
                done()
            });

            it(contains_text('check changes'), function (done) {
                expect((res.body.data.title == 'TEST')).to.equal(true);
                done()
            });
        });
    });
});
