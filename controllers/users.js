const User = require("../models/user");

module.exports.renderSignUpForm = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req,res) => {
    try{
        let {username, email, password } = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        await registeredUser.save();
        req.login(registeredUser,(err) => {
            if(err){
                return next(err);
            }
            req.flash("success","logged in");
            res.redirect(req.session.redirectUrl || '/listings');
        });
    }   catch (e) {
        req.flash('error',e.mesaage);
        res.redirect('/listings');
    }
}

module.exports.renderLogInForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req,res) => {
    req.flash("success", "welcome back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};

module.exports.logOut = (req, res)=>{
    req.logOut((err) => {
        if(err){
            next(err);
        }
        req.flash("success","logged out");
        res.redirect('/listings');
    })
};