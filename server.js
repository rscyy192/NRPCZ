const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;

const app = express();

// Konfigurace session
app.use(session({
    secret: 'tajny_klic',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Konfigurace Passportu pro Google OAuth
passport.use(new GoogleStrategy({
    clientID: 'TVOJE_GOOGLE_CLIENT_ID',
    clientSecret: 'TVOJE_GOOGLE_SECRET',
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

// Konfigurace Passportu pro Discord OAuth
passport.use(new DiscordStrategy({
    clientID: '1296531524782526464',
    clientSecret: '_tjxj3EM2eaWmcTh_Nym8zLX6ATUrx0w',
    callbackURL: '/auth/discord/callback',
    scope: ['identify', 'email']
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Trasy pro autentizaci
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/');
    }
);

app.get('/auth/discord',
    passport.authenticate('discord')
);

app.get('/auth/discord/callback', 
    passport.authenticate('discord', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/');
    }
);

// Trasa pro domovskou stránku
app.get('/', (req, res) => {
    res.send(`<h1>Vítej, ${req.user ? req.user.displayName : 'host'}</h1>`);
});

// Spuštění serveru
app.listen(3000, () => {
    console.log('Server běží na http://localhost:3000');
});

const express = require('express');
const app = express();
const path = require('path');

// Definování trasy pro hlavní stránku
app.get('/', (req, res) => {
    // Vrať jednoduchou HTML stránku
    res.sendFile(path.join(__dirname, 'index.html')); // Tímto se vrátí soubor index.html
});