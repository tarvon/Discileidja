const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

passport.use(new GoogleStrategy({
        clientID: '1020344370651-cpvtmd5bbgvc60uofucd7j3lv65qkdnn.apps.googleusercontent.com',
        clientSecret: 'MDCJlsZgUTJZLtCY29YYFq1x ',
        callbackURL: "/auth/google/redirect"
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
));
